---
name: readable
description: "Turn the material in the current project (plans, visions, research, notes, docs, coursework) into a reading site built from one of the user's HTMLR reader templates, or add a new reader template to the HTMLR-Templates repo from a brand or style. Use for /readable, 'make this readable', 'turn this into a reader', 'make a reader for this', 'a readable version in Spanish', 'new reader template', 'make a reader template from this brand or site', or when long-form material should become a site to read rather than a slide deck."
argument-hint: "[template slug | 'template' to build a new one | language | what to turn into a reader]"
---

# Readable

The user keeps reader templates in a private GitHub repo, `HTMLR-Templates`: Markdown goes in and a site built for reading comes out. This skill does one of two jobs with it:

- **Fill:** copy a template into the current project and write the project's material into it, as one page or as a book of chapters.
- **Author:** add a new template to the repo, or improve the ones there.

Fill is done when `pnpm check` exits 0 on the filled reader and the user has the local command or URL. Author is done when the new template passes `pnpm check:modes` and is committed and pushed on `main`.

## 1. Pick the job

Author when the user asks for a template itself: "new template", "a template from this brand, site or style", "contribute to HTMLR", "add a reader style". Also Author when they want the look of something captured for reuse, or an engine fix or feature that every reader should get. Otherwise Fill.

If the request names a style and material together ("make this readable in our brand"), Fill with the matching template when one exists. When none does, Author it first, then Fill with it.

## 2. Find the repo

Look for a local clone first (Git Bash, about two seconds):

```sh
find ~ -maxdepth 5 -type f -name TEMPLATE-STANDARD.md -path '*HTMLR-Templates*' -not -path '*/node_modules/*' -not -path '*/AppData/*' 2>/dev/null
```

- **One hit:** its folder is `R`. Run `git -C R pull --ff-only`.
- **Several:** `git fetch` each, use the clean one that is current with `origin/main`, and tell the user about the extra clones.
- **None:** clone it. For Fill a temp folder is fine. For Author, ask once where the clone should live.

```sh
gh repo clone "$(gh api user --jq .login)/HTMLR-Templates" <dir>
```

Read `R/README.md` (the catalog) and `R/TEMPLATE-STANDARD.md` on every run. They change, and where they disagree with this skill, they win.

## 3. Fill

### Choose the template

If the user named one, use it. Otherwise read each `R/templates/*/template.json` (skip `_skeleton`) and ask one AskUserQuestion: one option per template, labelled with its slug, described by its catalog line and `theme`. Recommend the one whose brand matches the project, else a `system` theme one. Mention that each folder has a `preview.png` if they want to look first.

### Decide the layout, then the mode

Every template has two layouts (TEMPLATE-STANDARD rule 14). Set `layout` in `content/index.md` before writing anything.

- **`page`** is the whole topic on one page, in the template's style, with no hero and no hook. It has a compact header, an optional "In short" block, the section map beside the text, then sources and the signal key. Use it for anything short: one argument, one decision, one explainer, one brief. Roughly: under 1,500 words and 6 sections, read in one sitting.
- **`book`** (the default) is a hero, a contents list and a page per chapter. Use it when the material needs several sittings, the reader will come back to it, or it's coursework.

When a topic could go either way, it's a page. A handful of thin chapters is the failure to avoid.

Then set `mode`, and tell the user both choices in one line.

- **`understand`** (the default) is for plans, visions, research, proposals and manuals. The hero shows a `summary` of 3 to 5 points that together say what the book concludes. Each chapter `subtitle` is that step's one-line takeaway, and `label: Step` often fits. No practice questions.
- **`study`** is only for coursework the reader will be evaluated on: an exam, a course, a certification. It gets the full guide, practice questions and a score tracker.

Quizzes and a long how-to guide on a plan read as noise. When unsure, it's `understand`. A page in `understand` mode takes `summary` as its optional "In short" block (none, or 3 to 5 points).

### Set up the folder

Copy the template into the project as `reader/`. A second language goes in its own folder, `reader-<lang>/` (for example `reader-es/`), filled the same way.

```sh
cp -r "R/templates/<slug>" reader
rm -rf reader/node_modules reader/dist* reader/shots reader/.wrangler reader/content/samples
```

Set `name` in `reader/package.json` to the project's name. Keep `pnpm-workspace.yaml` as it is.

### Write a page

For `layout: page`, write only `content/index.md` and delete the chapter files.

- **Front-matter:** the book keys plus `layout: page`. `subtitle` is a one-sentence summary of the whole topic, 30 words at most. `summary` is optional. `sources` is a list that closes the page.
- **Body:** `# Title`, an optional `>` lead, then 2 to 12 `##` sections.

There is no hero, guide or about line, so the first-screen rules below don't apply. The header summary sentence does that job.

### Write the book

The template's `README.md` "For AI agents" block and its `CONTENT.md` are the contract: front-matter keys, which Markdown block fits which kind of point, word limits, and what counts as engine. Follow them exactly. Engine stays untouched: `src/` apart from the `UI` object in `src/main.js`, `index.html` apart from `<title>`, `scripts/` and `vendor/`.

On top of the contract:

1. Read all the source material before outlining: the main document, research notes, anything the book draws on. Plan chapters in the order a reader needs the ideas. Use as few as the material allows (see "Keep it short").
2. Delete the lorem chapters, and `content/media/figure.svg` unless you use it.
3. Rename the callout signals to fit the book, in `UI.guide.callouts` and `UI.calloutNames` where the template has them. A plan might use Context, In practice, Key idea, Watch out and Deal-breaker. Keep each type's meaning the same across the whole book.
4. Put real sources in each chapter's `sources`: the public references the chapter rests on, as a title with its publisher and date, or a URL. Use file paths only when the readers can open those files. Most readers can't, so the book never points them at `VISION.md` or a research folder either.
5. Write in the user's voice. Run `no-ai-slop` over the prose if it is installed, and `spanish-unslop` for Spanish.
6. For a non-English book, set `lang`, translate every string in `UI` (the guide steps too), and change `<title>` in `index.html`.

When the source changes later, update every language folder with it, so no version drifts.

### Keep it short

A reader is for taking in the point fast, section by section and item by item. It is not the source document retold. Aim for the least text that still carries every point. The first draft always comes out too long: one book came out at 8 pages and about 3,000 words, and the version the user liked said the same in 4 pages and about 700 words.

Chapters and sections are tools, not quotas. Add one when it makes a point easier to find, and never to fill out a structure. A complex topic can take longer chapters or more of them. A simple one might need one section, or no split at all.

What the short version did right:

- The home page was the title, a subtitle, 3 or 4 summary points and one line of body.
- Each chapter opened with one lead line, then went straight to its points.
- Each point was one or two plain sentences, a short list whose items open with a bold lead, or a callout. Tables appeared only for real comparisons (TEMPLATE-STANDARD rule 15: at most one per `##` section, under 35% of the text).
- Each item was one row or bullet per thing that changed, had to be done or went wrong. It gave the one number that mattered, not every number the source had.

Cut these, even when they are true:

- how the work was done, step by step, when the reader only needs the result
- background the reader already knows
- a point already made in another chapter
- a chapter nobody asked for, such as "next steps" or a future stage
- a table where two sentences would do, and empty space around small points
- hedges, transitions and recaps

`study` mode needs coverage, so it runs longer. The same rule holds: the least text that covers the material.

### The first screen (book layout)

On a phone the home hero is the first thing anyone sees, and it decides whether they read on. Every template follows TEMPLATE-STANDARD rule 13, which was derived with Perception-First Design, and `pnpm check` enforces it:

- **`subtitle` is the thesis.** Use one line that sells the book's point in 16 words or fewer, not a description of the document.
- **Each `summary` point leads with a headline.** Its first sentence renders bold and has to carry the point alone in 12 words or fewer. The detail after it is optional, and the whole point stays under 40 words.
- **Housekeeping goes in front-matter.** Dates go in `updated`, and the other-language link goes in `translation` and `translationLabel`. They render as one quiet meta line above the title.
- **The index body is one about line** of 40 words at most, saying who made the book and what it is. It's never a paragraph of housekeeping.

Look at the phone screenshot before calling it done. If the first screen doesn't make someone want to read on, run `/perception-first` on it.

### Verify

```sh
cd reader && pnpm install && pnpm build && pnpm check
```

`pnpm check` audits every view at three widths, in light and dark when the theme is `system`, and applies the page rules when `layout: page` is set. Fix each violation in the content: shorten, split a chapter, or pick another block. Never edit the check to make it pass.

Then count the words with `wc -w reader/content/*.md`. Reread each chapter and ask of every sentence, section and chapter whether the reader would miss it. If not, cut it, and merge what is left.

Then look at it. `pnpm shots` writes screenshots to `shots/`. Read the home and one chapter at phone and desktop width, and check the hero summary says what the book concludes. For a page, the shots walk down the one view instead.

### Share

If the user wants it online, use `cloudflare-upload` to deploy `reader/dist`, one Pages project per language. Report every URL.

### When the template gets in the way

If the book needs something the engine can't do (a missing block, a bug, a label that isn't in `UI`), don't patch only the copy. Tell the user and offer to fix it in the template under Author, so every reader gets it.

## 4. Author

Open [references/new-template.md](references/new-template.md) and follow it. It has the map of the repo, how to derive a template from a brand, and the gates it has to pass.
