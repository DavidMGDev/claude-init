---
name: handoff-clip
description: "Compact this conversation into a handoff document and print it as one copyable block, writing no files. Use for /handoff-clip, 'give me a handoff', 'hand this off', or before /clear when the next session needs what this one is about to lose."
argument-hint: "What the next session is for"
disable-model-invocation: true
---

# Handoff clip

Compact this conversation into a document a fresh agent can start from. Print it. Do not save it.

The audience is a Claude with an empty context window, not you and not your team. Write for the agent that has to pick this up cold.

## Write nothing to disk

No temp file, no repo doc, no scratchpad, no `docs/HANDOFF.md`. The output is the deliverable. If you catch yourself reaching for Write, stop: a file is the thing this skill exists to avoid.

The point is that it lands in the clipboard, not in a directory to be excavated later by filepath.

## One block, fenced so it survives copying

Everything goes inside a single fenced block so one click takes all of it.

Handoffs contain code, and code contains ``` fences. A three-backtick wrapper will be closed early by the first fence inside it and the copy will be truncated. So wrap the document in **four tildes** (`~~~~`) and leave any inner fences alone.

Nothing outside the block except one short line naming what it is. No preamble, no summary of the summary, no "let me know if you want me to adjust it."

## What goes in

The state that lives nowhere but this conversation:

- **Where the work stands.** What is done, what is half-done, what is next.
- **Decisions and their reasons.** Especially rejected approaches. The next agent will otherwise re-propose them and burn the same turns finding out.
- **Dead ends.** What you tried that failed, and how it failed.
- **Landmines.** The stale doc, the flaky check, the config that lies, the thing that looks wrong but is deliberate.
- **Open questions**, and who has to answer them.

## What stays out

Anything already recorded somewhere durable. Commits, PRs, issues, specs, ADRs, plans, diffs, the code itself — reference them by path, SHA, or URL and move on. Restating a commit message in a handoff makes the document longer and no more useful, and it goes stale the moment someone amends the real thing.

If a fact is in the repo, the next agent can read the repo. Spend the words on what it cannot.

## Suggested skills

Close with a section naming the skills the next agent should invoke through the Skill tool, and what each one is for here. It starts cold and does not know which ones this work has been leaning on.

## Redact

Strip API keys, tokens, passwords, connection strings, and personal data. This is going to the clipboard and then somewhere you are not watching.

## Arguments

Anything passed to the skill describes what the next session is for. Weight the document toward it: keep what that work needs in detail, compress the rest to a line.

If no argument is given, do not stop to ask. Write the handoff for the work that is obviously in flight.
