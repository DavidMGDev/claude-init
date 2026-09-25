---
name: presentable
description: "Turn the material in the current project into a slide deck or presentation page built from one of the user's HTMLP templates, or add a new presentation or page template to the HTMLP-Templates repo from a brand or style. Use for /presentable, 'make this presentable', 'make slides for this', 'turn this into a deck', 'a presentation for the meeting', 'new deck template', 'make a slide template from this brand or site', or when material has to be presented to an audience rather than read on one's own."
argument-hint: "[template slug | 'template' to build a new one | speakers, length or language | what to present]"
---

# Presentable

The user keeps presentation and page templates in a private GitHub repo, `HTMLP-Templates`. Each is a fixed-stage HTML deck or page with its own design rules and an acceptance check. This skill does one of two jobs with it:

- **Fill:** copy a template into the current project and turn the project's material into slides.
- **Author:** add a new template to the repo, or improve the ones there.

Fill is done when `pnpm check` exits 0 on the filled deck and the user knows how to present it. Author is done when the new template passes its check and is committed and pushed on `main`.

## 1. Pick the job

Author when the user asks for a template itself: "new template", "a deck template from this brand, site or style", "contribute to HTMLP", "add a slide style". Also Author when they want a look captured for reuse, or an engine fix every deck should get. Otherwise Fill.

If the request names a style and material together ("slides for this in our brand"), Fill with the matching template when one exists. When none does, Author it first, then Fill with it.

## 2. Find the repo

Look for a local clone first (Git Bash, about two seconds):

```sh
find ~ -maxdepth 5 -type f -name TEMPLATE-STANDARD.md -path '*HTMLP-Templates*' -not -path '*/node_modules/*' -not -path '*/AppData/*' 2>/dev/null
```

- **One hit:** its folder is `P`. Run `git -C P pull --ff-only`.
- **Several:** `git fetch` each, use the clean one that is current with `origin/main`, and tell the user about the extra clones.
- **None:** clone it. For Fill a temp folder is fine. For Author, ask once where the clone should live.

```sh
gh repo clone "$(gh api user --jq .login)/HTMLP-Templates" <dir>
```

Read `P/README.md` (the catalog) and `P/TEMPLATE-STANDARD.md` on every run. They change, and where they disagree with this skill, they win.

## 3. Fill

### Choose the template

If the user named one, use it. If the catalog has only one template of the type they need, use it and say so. Otherwise read each `P/templates/*/template.json` (skip `_skeleton`) and ask one AskUserQuestion: one option per template, labelled with its slug, described by its catalog line, `type` and `resolution`. Mention that each folder has a `preview.png`.

### Settle the talk

Before writing slides, know three things. Take them from the request and the material, and ask one round only for what stays open:

- **Who presents.** Speaker names, and which part each one takes. Templates with speaker chrome hand over on dividers.
- **How long.** About one content slide per minute. Most templates aim for 10 to 16 slides.
- **The one thing the audience should leave with.** It shapes the closing slide and the order of everything before it.

### Set up the folder

Copy the template into the project as `deck/` (a `page` or `report` type goes in `page/`). A second language gets its own folder, `deck-<lang>/`.

```sh
cp -r "P/templates/<slug>" deck
rm -rf deck/node_modules deck/dist* deck/shots deck/.wrangler
```

Set `name` in `deck/package.json` to the project's name.

### Write the slides

The template's `README.md` "For AI agents" block and its `CONTENT.md` are the contract: where content lives, every archetype with a copy-pasteable snippet, its attributes, and the word limit per slot. Follow them exactly. Engine stays untouched: `src/`, `scripts/`, `vendor/`, the Vite configs and any chrome block CONTENT.md marks as off limits.

On top of the contract:

1. Read all the source material first. Outline the talk as sections, then one point per slide, before touching HTML.
2. Pick each slide's archetype by the shape of its point (comparison, parallel items, claim with evidence, one assertion, headline numbers), as CONTENT.md maps them. Delete the exemplars you didn't use.
3. Replace every placeholder: lorem copy, `Speaker A/B/C`, `00` numbers, `[Source, Year]` citations. Replace any word pools or data files with the topic's own vocabulary.
4. Cut words to fit a slot's limit rather than shrinking type. A slide that needs more room is two slides.
5. Put what the speaker says, beyond what the slide shows, in the notes slot if the template has one.
6. Write in the user's voice. Run `no-ai-slop` over the copy if it is installed, and `spanish-unslop` for Spanish.

### Verify

```sh
cd deck && pnpm install && pnpm build && pnpm check
```

Fix each violation in the content: fewer words, a different archetype, or removing a second moving thing from a slide. Never edit the check to make it pass. For a `single` kind template with no commands, open `index.html` and check it against DESIGN.md's acceptance section by hand.

Then look at it. `pnpm shots` writes screenshots to `shots/`. Read a few, including the densest slide, at the template's `resolution`.

### Present and share

Tell the user how to run it: `pnpm dev`, or `pnpm build:single` for one `dist-single/index.html` that opens offline from a USB stick. Give the keyboard keys the template's README lists. If they want it online, use `cloudflare-upload` to deploy `deck/dist`.

### When the template gets in the way

If the talk needs something the engine can't do (a missing archetype, a bug), don't patch only the copy. Tell the user and offer to fix it in the template under Author, so every deck gets it.

## 4. Author

Open [references/new-template.md](references/new-template.md) and follow it. It has the map of the repo, how to derive a template from a brand, and the gates it has to pass.
