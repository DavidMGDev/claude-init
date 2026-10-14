# A Responses API adapter for code written around chat completions

Open this when an app already speaks chat completions (messages with roles, `tool_calls`, `role: "tool"` answers) and has to call Sol or Luna with tools and a reasoning effort. It takes the same inputs and returns the same shape, so only the request function changes. It ran in production in October 2026 (TypeScript, Cloudflare Workers runtime, plain `fetch`).

Choose it by address, and keep chat completions for everything else:

```ts
if (/\bapi\.openai\.com\b/.test(p.base)) return responses(p, messages, offered);
// ...the existing chat completions request...
```

## The adapter

```ts
type ToolCall = { id: string; function: { name: string; arguments: string } };
type Message = { tool_calls?: ToolCall[]; items?: unknown[] };
type Chat = { role: string; content?: string; tool_call_id?: string; items?: unknown[] };
type Offered = { function: { name: string; description?: string; parameters: { properties?: unknown } } };
type Provider = { key: string; base: string; model: string; effort?: string };

/* Several tools are offered as one, "steps", because these models make one call per turn and wait. Its steps come back
   as the usual calls with ids "<call_id>#<n>", and their answers go back together as one answer. */
const STEPS = (offered: Offered[]) => ({
  type: "function", name: "steps", strict: false,
  description: "Makes every call of your turn at once, in the order given, and answers with what each one did. Put your whole turn in ONE steps call, finish last. Each step is one of these tools with its arguments:\n"
    + offered.map((t) => `- ${t.function.name} ${JSON.stringify(t.function.parameters.properties ?? {})}: ${t.function.description ?? ""}`).join("\n"),
  parameters: { type: "object", required: ["steps"], properties: { steps: { type: "array", items: { type: "object", required: ["tool", "args"],
    properties: { tool: { type: "string", enum: offered.map((t) => t.function.name) }, args: { type: "object" } } } } } },
});

export async function responses(p: Provider, messages: unknown[], offered: unknown[]): Promise<{ msg?: Message; calls: ToolCall[]; tokensIn: number; tokensOut: number }> {
  // History: the model's own earlier output goes back as it came; tool answers become function_call_output items.
  const input: unknown[] = [], joined = new Map<string, { output: unknown[] }>();
  for (const m of messages as Chat[]) {
    if (m.items) { input.push(...m.items); continue; }
    if (m.role !== "tool") { input.push({ role: m.role === "system" ? "developer" : m.role, content: m.content ?? "" }); continue; }
    const [id, step] = (m.tool_call_id ?? "").split("#");
    if (step === undefined) { input.push({ type: "function_call_output", call_id: id, output: m.content ?? "" }); continue; }
    let got = joined.get(id!);
    if (!got) { got = { output: [] }; joined.set(id!, got); input.push({ type: "function_call_output", call_id: id, get output() { return JSON.stringify(got!.output); } }); }
    got.output.push(JSON.parse(m.content || "null"));
  }
  const list = offered as Offered[], many = list.length > 1;
  const tools = many ? [STEPS(list)] : list.map((t) => ({ type: "function", name: t.function.name, description: t.function.description, parameters: t.function.parameters, strict: false }));
  const res = await fetch(p.base.replace(/\/+$/, "") + "/responses", {
    method: "POST", signal: AbortSignal.timeout(180_000),
    headers: { Authorization: `Bearer ${p.key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: p.model, input, tools, tool_choice: "required", store: false, include: ["reasoning.encrypted_content"], ...(p.effort ? { reasoning: { effort: p.effort } } : {}) }),
  }).catch((err: unknown) => err as Error);
  if (res instanceof Error || !res.ok) throw new Error("the provider answered " + (res instanceof Error ? res.message : `${res.status}: ${(await res.text()).slice(0, 300)}`));
  const data = await res.json() as { output?: { type: string; call_id?: string; name?: string; arguments?: string }[]; usage?: { input_tokens?: number; output_tokens?: number } };
  const out = data.output ?? [], calls: ToolCall[] = [];
  for (const o of out.filter((x) => x.type === "function_call")) {
    if (!many || o.name !== "steps") { calls.push({ id: o.call_id!, function: { name: o.name!, arguments: o.arguments ?? "{}" } }); continue; }
    let steps: { tool?: unknown; args?: unknown }[] = [];
    try { const a = JSON.parse(o.arguments || "{}") as { steps?: unknown }; if (Array.isArray(a.steps)) steps = a.steps as typeof steps; } catch { /* answered as none */ }
    steps.forEach((s, i) => calls.push({ id: `${o.call_id}#${i}`, function: { name: String(s.tool ?? ""), arguments: JSON.stringify(s.args ?? {}) } }));
    if (!steps.length) calls.push({ id: `${o.call_id}#0`, function: { name: "steps", arguments: "{}" } });   // the caller answers "no such tool"
  }
  // Reasoning is billed as output and is inside output_tokens.
  return { msg: { tool_calls: calls, items: out }, calls, tokensIn: data.usage?.input_tokens ?? 0, tokensOut: data.usage?.output_tokens ?? 0 };
}
```

## How the caller uses it

The agent loop stays the same as for chat completions:

```ts
const got = await turn(p, messages, tools);           // turn() picks responses() for api.openai.com
messages.push(got.msg);                                // the model's turn, untouched (it carries `items`)
for (const c of got.calls) messages.push({ role: "tool", tool_call_id: c.id, content: JSON.stringify(run(c)) });
```

Answer every call in `got.calls`, never only the first. A one-tool job that retries once should answer the extra calls with something like `{ ok: false, again: "only your first call counts" }`.

## Tests worth keeping

- A fake `fetch` that answers in the Responses shape when the URL ends in `/responses` (`output` with `function_call` items, `usage.input_tokens`), and in the chat shape otherwise, so both paths stay covered.
- A helper that reads a request body as chat messages whichever API it went to (`input` back to `messages`, `developer` back to `system`, `function_call_output` back to `role: "tool"`), so old assertions about prompts keep working.
- One test that a `steps` call is unpacked and the turn finishes in one request, and one that the next request carries a single `function_call_output` for that call, holding a list as long as its steps, plus the model's own `function_call` item.
- The default model when only a key is set, asserted against the request body, not against a constant.
