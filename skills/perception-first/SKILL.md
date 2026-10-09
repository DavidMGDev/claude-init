---
name: perception-first
description: "Run Perception-First Design (the perception-first-design plugin by Stefan Kovalik) on a page, template, deck, email or copy, then turn its findings into edits and into checks the project enforces. Use for /perception-first, 'PFD this', 'run PFD', 'the hero is too long', 'the first screen is ugly or hard to read', 'nobody reads past the top', or when a reader, deck or landing page needs a first screen that grabs attention."
argument-hint: "A URL, a file or folder, a screenshot, or a design question"
---

# Perception-first

Perception-First Design (PFD) is a five-layer diagnostic grounded in cognitive psychology: cognitive load, first impression, processing fluency, perception bias and decision architecture. You fix it bottom-up, because a failing lower layer blocks everything above it. The framework and its corpus ship as the `perception-first-design` plugin. This skill makes sure the plugin is there, calls the right mode, and carries the work past the report: the artifact changes, and every requirement that can be measured becomes a check that fails the build.

Done means the plugin's report is written, the fixes are applied, a check script enforces the measurable requirements (when the project has one), and the user gets a short summary of what changed and why.

## 1. Make sure the plugin is installed

```sh
claude plugin list --json
```

Look for `perception-first-design@perception-first-design` with `"enabled": true`. If it's missing:

```sh
claude plugin marketplace add skovalik/perception-first-design
claude plugin install perception-first-design@perception-first-design
```

A session that was already running when the plugin was installed doesn't see its commands until Claude Code restarts. Don't stop for that. Take `installPath` from the JSON above and read the plugin's files directly from there. Every path below is relative to that folder.

## 2. Pick the mode

| The input is | Mode | Command |
|---|---|---|
| An artifact: a URL, a built page, HTML, a screenshot, a copy block | Evaluate | `/perception-first-design:evaluate <artifact>` |
| A problem: "design the first screen", "modal or inline?", "why do people leave?" | Solve (derive) | `/perception-first-design:solve <problem>` |
| A hypothetical or mechanism: "what happens if we drop the summary?" | Analyze | `/perception-first-design:analyze <question>` |
| A redesign with stakes, where you want every lens | All three | `/perception-first-design:all <input>` |

When the user says "fix" or "redesign" about something that exists, evaluate it first, then solve from what the evaluation found. When the commands aren't loaded, follow the same protocol by hand:

- **Every mode.** Read `skills/pfd/SKILL.md` first.
- **Evaluate.** Load, in order, `corpus/core/tier2-prompt-template.md`, `corpus/core/pfd-layer-rubric.md`, `corpus/core/constitutional-constraints.md`, `corpus/core/anti-patterns.md`, the rule files in `corpus/heuristics/universal/`, and one or two of `corpus/worked-examples/web/` for calibration.
- **Solve.** Follow the Derivation Protocol in the skill. No solution before all five layers have produced a requirement.
- **Analyze.** Follow the Analysis Protocol: five descriptive consequences, then trade-offs and compounds, and no recommendations.

## 3. Look at the real thing

PFD judges what a person sees in the first 50 ms, so judge the rendered artifact, never only its source.

- Build it and screenshot it at 375×812 first, then 768 and 1440 wide. Phones are where first screens fail. Playwright is usually installed in a project that has a `check` script, and headless Chromium needs `--use-angle=swiftshader --enable-unsafe-swiftshader` for WebGL.
- In each shot, count what sits above the fold. PFD rule F-CL-004 allows at most 4 distinct content blocks on a phone (7 on desktop). Rule L1-FI-002 wants the primary action visible without scrolling at 375, 768 and 1440.
- Count the words before the first action. That's the reader's entry cost.

## 4. Derive, then change

Write the requirements as the plugin does, one per layer, each a "must" with its constraint and citation:

- **R1, cognitive load.** What the first screen may hold.
- **R2, first impression.** What the first readable line says, and where the way in sits.
- **R3, fluency.** One shape for repeated items, and one type and color system.
- **R4, perception bias.** Concrete numbers and nouns over abstractions, and copy that the design doesn't contradict.
- **R5, decision architecture.** One primary action, labelled with its outcome, plus a trail with strong scent.

Lower layers win conflicts. Then find the smallest change that satisfies all five, and apply it. Change the engine or the template when the problem is structural, so every artifact built from it gets the fix. Change only the content when the structure is sound and the words are the problem.

## 5. Turn requirements into checks

A requirement nobody enforces drifts back within a few edits. For each one that can be measured, add a gate to the project's acceptance script (`pnpm check` in the user's readable readers and presentable decks), and restate it in the design doc the script belongs to. The first-screen gates from the readable derivation are a good pattern:

| Requirement | Gate |
|---|---|
| The way in is visible at once | The primary action's bottom edge sits above the fold at every checked width |
| The thesis is one line | Subtitle of 20 words or fewer |
| The summary is scannable | 3 to 5 points, each led by a sentence of 12 words or fewer, 40 words per point at most |
| Housekeeping stays small | The about line under the summary is 40 words or fewer. Dates and language links go in front-matter and render as one meta line |

Run the check. It must pass on the template's sample and on at least one real filled copy, because a gate that only passes on lorem ipsum hasn't been tested.

## 6. Report

Tell the user, in this order:

1. The layer verdicts: one line each, worst first.
2. R1 to R5.
3. What changed, and which files.
4. The gates you added.

Keep the plugin's closing italic line when you paste its output. Skip anything the user would never act on.

The plugin's protocol asks you to append to its `references/insights-log.md` and to save rebuilt fixes under `corpus/validation/`. Both live in the plugin cache, which an update wipes. Put that material in the report instead, or in the project when the user asks for it.

## Licence

PFD is CC BY-SA 4.0 with a practice exemption. Applying it in your work doesn't trigger share-alike, and PFD is a trademark of Stefan Kovalik. Cite the framework and its research where a finding rests on it. Don't paste corpus text wholesale into the user's public repos. Summarize it in your own words and link to https://github.com/skovalik/perception-first-design.
