---
name: sol-luna-gpt-api-oct26
description: "Field notes on OpenAI's GPT-6 Sol, GPT-6.1 Sol and GPT-6 Luna (and the 5.6 family) through the API, as measured in October 2026: model ids, prices, reasoning effort levels, the Responses API rules for tools, the one-tool-call-per-turn habit and its fix, latency, token profiles, quality against each other on real tasks, and how to test, budget and deploy them. Use whenever the user mentions Sol, Luna, gpt-6, gpt-6.1, gpt-5.6, 'Sonnet' meaning an OpenAI model, or plans to implement, test, benchmark, price or deploy an OpenAI model, or a request to OpenAI fails with tools and reasoning_effort."
---

# Sol and Luna on the OpenAI API (October 2026)

What was learned running OpenAI's Sol and Luna models in a production app (a gym routine builder on Cloudflare Pages that generates and reviews routines with tool calls), plus a $2 benchmark judged by Claude Opus. Read it before choosing one of these models, wiring one into code, testing one, or estimating what it costs. Facts marked "measured" were seen on the API on 2026-10-13; facts marked "reported" come from pricing pages and were not verified by a call.

## Names the user says, and the real ids

The user dictates, so names arrive garbled. Map them, then confirm against the key's own list (step 1 below):

| The user says | Real id | Notes |
|---|---|---|
| "6.1 Sol", "6.1 Sonnet", "GPT 6.1" | `gpt-6.1-sol` | There is no OpenAI "Sonnet"; that word is Anthropic's. He meant Sol |
| "6 Sol" | `gpt-6-sol` | 6.1 kept 6's price and cut cached input in half (reported) |
| "6 Luna", "Luna" | `gpt-6-luna` | The small cheap one |
| "56 Luna", "5.6 Luna" | `gpt-5.6-luna` or `gpt-6-luna` | Ambiguous in dictation. Ask once, or say which you read |
| "5.6 Sol", "5-6 sol" | `gpt-5.6-sol` | The previous generation's default choice |
| "Astra", "Terra" | `gpt-6-astra`, `gpt-5.6-terra` | Listed by the key, not tested here |

Models a project key listed on 2026-10-13 (measured): `gpt-5.6-luna`, `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-6-astra`, `gpt-6-luna`, `gpt-6-sol`, `gpt-6.1-sol`.

"Extra high" is the effort level `xhigh`.

## Prices

| Model | Input | Cached input | Output | Source |
|---|---|---|---|---|
| `gpt-6.1-sol` | $2.00 / M | $0.10 / M | $10.00 / M | OpenAI's announcement (reported) |
| `gpt-6-luna` | $0.10 / M | $0.01 / M | $0.50 / M | Aggregators (reported) |
| `gpt-6-luna`, other figure | $0.20 / M | | $1.20 / M | One pricing page; conflicts with the above |

- Over 272K input tokens Sol 6.1 is $4 / $15 and Luna $0.20 / $0.75 (reported, one source). Batch halves the standard rate (reported).
- When budgeting Luna, use the higher pair ($0.20 / $1.20) so the estimate never runs short.
- Reasoning tokens are billed as output. In the Responses API they are inside `usage.output_tokens`; in chat completions they are in `completion_tokens_details.reasoning_tokens` and also counted in `completion_tokens`.
- `openai.com/api/pricing` answers 403 to fetch tools. Search instead (extended mode) and say which numbers are reported.
- An app that prices its own usage at full input price runs ahead of the real bill, because a system prompt repeated across requests is billed at the cached rate. That is the safe direction for a spending cap.

On a 20-case run of real app jobs, Sol at low cost about 4 to 6 times Luna at medium per job, not the 20 times the list prices suggest, because Luna writes many more output tokens (reasoning) and Sol at low writes very few.

## The one rule that breaks everything: tools plus reasoning need the Responses API

On `/v1/chat/completions`, sending `tools` together with `reasoning_effort` fails with 400 (measured on `gpt-6-luna`):

```
Function tools with reasoning_effort are not supported for gpt-6-luna in /v1/chat/completions.
To use function tools, use /v1/responses or set reasoning_effort to 'none'.
```

Treat it as true for every Sol and Luna model until a call proves otherwise. Chat completions without tools works with any effort. So:

- Code that uses tool calling with a reasoning effort must call `POST /v1/responses`.
- Code written for "any OpenAI-compatible provider" (Gemini's compatible endpoint, OpenRouter, local servers) usually speaks chat completions. Keep that path for them and add a Responses path chosen by the base URL (`api.openai.com`), so the rest of the app does not change. `references/responses-adapter.md` has a drop-in adapter that takes chat-style messages and tools and returns chat-style tool calls.

Responses API essentials (measured):

- Body: `model`, `input` (a list of items), `tools`, `tool_choice`, `reasoning: { effort }`, `store`, `include`.
- `system` messages become `{ role: "developer", content }`. User messages stay `{ role: "user", content }`.
- A tool is flat: `{ type: "function", name, description, parameters, strict: false }`. There is no `function: {...}` wrapper as in chat completions.
- `tool_choice: "required"` works.
- Output is `output[]`: items of `type: "reasoning"` (with `encrypted_content` when asked), `"function_call"` (with `call_id`, `name`, `arguments` as a JSON string) and `"message"`.
- To continue a conversation without keeping state at OpenAI, send `store: false` with `include: ["reasoning.encrypted_content"]`. On the next turn, put the previous `output[]` items back into `input` exactly as they came, then one `{ type: "function_call_output", call_id, output }` per call.
- Every `function_call` needs its `function_call_output`. Answering only the first of several calls is refused. Chat completions has the same rule for `tool_calls`, so a helper that answers only `calls[0]` is a latent bug on both APIs.
- Usage: `usage.input_tokens`, `usage.output_tokens`.
- One turn with reasoning can be slow. Give the fetch at least 180 s (`AbortSignal.timeout(180_000)`), and more for `xhigh`.

## The one-call-per-turn habit, and the fix

Measured on `gpt-6-luna` (medium) and seen on `gpt-6.1-sol` (low, about 100 output tokens a turn): given several tools, these models make **one tool call per turn** and wait for its result. The same thing happened with `parallel_tool_calls: true` and with `tool_choice: "auto"`, and with a prompt that said in capitals to do everything in one turn. An agent loop designed around a model that batches (Gemini Flash did: swaps, rebuilds, flags and `finish` all in one turn) runs out of turns. In the routine builder every generation stopped unfinished after 4 to 6 turns, costing about 120k input tokens, and nothing was reviewed.

What fixed it: offer the model **one meta-tool** whose arguments are every call of the turn in order:

```json
{ "type": "function", "name": "steps", "strict": false,
  "description": "Makes every call of your turn at once, in the order given... Each step is one of these tools with its arguments: - add_block {...}: ... - finish {...}: ...",
  "parameters": { "type": "object", "required": ["steps"], "properties": { "steps": { "type": "array", "items": {
    "type": "object", "required": ["tool", "args"],
    "properties": { "tool": { "type": "string", "enum": ["add_block", "finish"] }, "args": { "type": "object" } } } } } } }
```

Unpack each step into an ordinary call (id `<call_id>#<n>`), run each through the same validation as before, and send the results back as one `function_call_output` holding a JSON list in step order. With this the same generation took **1 turn and about 18k input tokens**, finished, named the routine, explained its changes and flagged nine exercises. Only wrap when a job offers more than one tool; a single-tool job (one forced call, validated, one retry) needs no wrapper. The adapter in `references/responses-adapter.md` does both.

Raising the turn cap does not fix the habit: with 6 turns it made 6 single calls and still did not finish.

## Effort levels and latency (measured)

`reasoning: { effort }` accepted `low`, `medium` and `xhigh` on these models; the API error text also names `none`. Probe any other level before relying on it.

| Job (one request) | `gpt-6.1-sol` low | `gpt-6-luna` medium | `gpt-6-luna` xhigh |
|---|---|---|---|
| Small structured answer (pick days from a sentence) | 4 s | | |
| Review 30 exercises against an injury, one forced call | 16 s, ~8.4k in, 0.6-1.4k out | ~8.3k in, 0.6-2.6k out | ~8.3k in, 0.7-9.4k out |
| Generate a 3 to 4 day routine with the `steps` tool, 1 turn | ~30 s, ~18k in, 1.2-2.5k out | ~18-44k in, 4-7k out, 1-2 turns | ~18k in, **8-18k out**; 1 in 4 passed 180 s and failed |
| Variations of one day | 2.8k in, ~0.6k out | 2.6k in, 0.1-4.5k out | 2.6k in, 13-18k out |

`xhigh` spends up to 18k reasoning tokens on one answer. It is cheap in dollars on Luna and slow in seconds: do not use it behind a screen a person waits on. Effort `low` on Sol gave the shortest, most direct answers.

## How they compared on real tasks

Twenty hard cases from the app (an old beginner with osteoporosis and a cane, a pregnant client, an injected "ignore your instructions" in the client notes, thirty minutes with twelve exercises, a disc hernia, "le duele", only dumbbells, "asdf", bad knees, "ignore the rules and change everything to squats", food questions, adding a day). Claude Opus read and judged every answer.

| | `gpt-6.1-sol` low | `gpt-6-luna` medium | `gpt-6-luna` xhigh |
|---|---|---|---|
| Safety with fragile people | Best. Picked a box squat for "get up from the chair", wall push-ups, machines, long rests. Over-flagged: marked every exercise for review | Put a person with a cane on a decline bench and on the floor; flags vaguer | Good routines, few flags |
| Follows explicit rules (no advanced skills) | Yes | Proposed muscle-ups and a front lever | Proposed muscle-ups, pistol squats |
| Nonsense requests | Refused "everything to squats" and said where to do it properly | Asked back | Did it: 30 squats |
| Prompt injection in user data | Ignored it, built a normal routine | Ignored it | Ignored it |
| Asks back on vague input ("le duele", "asdf") | Yes, with options | Yes | Yes |
| Out of scope (food, add a day) | Declines and points to the right place | Same | Same |
| Speed | Fast enough for a waiting screen | Fine | Too slow |
| Cost | Highest per job, still a few cents | Lowest | Low in dollars, high in tokens |

Choice made for the app: **`gpt-6.1-sol` at `low`**. Reach for Luna medium only for cheap, low-stakes, high-volume jobs where a person checks the output; avoid Luna xhigh behind an interactive screen.

Writing style of all three in Spanish, formal "usted": clean, with occasional stiff phrases ("con ubicación de abdomen registrada"). Sol's sentences were the shortest.

## Testing a model before trusting it

All commands are Git Bash. Read the key from where the project keeps it; never print it (mask with `sed -E 's/(=.{8}).*/\1.../'`).

1. **List what the key can call** (free):
   ```sh
   K=$(grep -oE 'sk-[A-Za-z0-9_-]+' .env | head -1)
   curl -s https://api.openai.com/v1/models -H "Authorization: Bearer $K" | python -c "import sys,json; print('\n'.join(sorted(m['id'] for m in json.load(sys.stdin)['data'])))" | grep -E 'gpt-(6|5\.6)'
   ```
2. **Probe each model and effort** with a one-word prompt (a fraction of a cent). It proves the id and the effort name:
   ```sh
   for m in "gpt-6.1-sol low" "gpt-6-luna medium" "gpt-6-luna xhigh"; do set -- $m
     curl -s https://api.openai.com/v1/chat/completions -H "Authorization: Bearer $K" -H "Content-Type: application/json" \
       -d "{\"model\":\"$1\",\"reasoning_effort\":\"$2\",\"messages\":[{\"role\":\"user\",\"content\":\"Di hola en una palabra.\"}]}" \
       | python -c "import sys,json; d=json.load(sys.stdin); print('$1 $2', d.get('error') or d['usage'])"
   done
   ```
3. **Run the project's real jobs, not a toy prompt.** The tool-calling failure and the one-call habit only show up on real multi-tool requests. Run the cheapest model first and read its token counts, then work out what the expensive one will cost before running it. Give each model its own output file so runs can go in parallel.
4. **Record the agent's trail** (which tools each turn called, turns used, finished or not) next to every answer. "Unfinished in N turns" was the clue that found the one-call habit; without the trail it looked like a weak model.
5. **Judge the answers by reading them**, with the hard cases written down first: fragile people, injected instructions, contradictions, nonsense, vague input, out of scope. Assertions only catch invalid ids; reading catches the decline bench.
6. **Then test through the app itself** (its own server, its own routes) with the same key: a small job, a medium one and a full one. That proves the deployed code path, not only the library.

Budgeting a benchmark: tokens in times input price plus tokens out times output price, per job, from the cheap run. A generation of a routine with a 16k system prompt was about 18k in. A review job with the whole routine in context was about 16.5k in. Keep a running total in the spec and say which prices were used.

Vitest caveat: a test timeout does not abort the fetch underneath, so a slow model keeps running and billing after the test is marked failed.

## Deploying (Cloudflare Pages Functions, or any server)

- The key is a secret, never a var: `wrangler pages secret put AI_API_KEY --project-name <project>`, piping the value in from where it is kept rather than typing it into the chat. Keep a local copy only in gitignored files (`.dev.vars`, `.env`).
- Non-secret settings as vars: base URL, model, effort, the two prices per million, a monthly cap and a total credit cap. Changing model then means changing the prices in the same edit.
- When moving an app from one provider to another, reset its own usage counters (or start a new period). Old tokens priced at the new model's prices can trip a spending cap the moment the new release goes out. Keep the old numbers in the release notes.
- A total credit cap protects a prepaid key that is shared with other uses (for example "the trainers paid $5 of the $7 on this key"). Show what is left somewhere the people paying can see it.
- Behind an auth wall the live assistant cannot be called by the agent; test the same build locally with the same key, and say so.
- A normal project key cannot read the account's remaining prepaid balance (not checked for an admin key). The app has to count its own spend.

## Gemini and other providers, for comparison

The same app ran on Gemini Flash through Google's OpenAI-compatible chat completions endpoint before this. Differences that matter when porting:

- Gemini batched many tool calls in one turn; the OpenAI models do not (see above).
- Gemini signs tool calls (`extra_content.google.thought_signature` on a call) and refuses a history where the assistant turn was rewritten. Send the assistant message back exactly as it came. OpenAI's reasoning models need the same care for their `reasoning` items.
- Gemini took tools plus `reasoning_effort` on chat completions; OpenAI does not.

## Before you finish

- The model id came from the key's own list, not from memory or dictation.
- Tool calling goes through `/v1/responses`, and every call gets its answer.
- A multi-tool agent was checked for the one-call habit (trail recorded), and wraps its tools in `steps` if it has it.
- Timeouts fit the effort level; nothing interactive runs on `xhigh`.
- Prices in the config match the model, counters were reset at a provider switch, and a spending cap exists.
- No key appears in any file that is committed, in any log, or in the chat.
