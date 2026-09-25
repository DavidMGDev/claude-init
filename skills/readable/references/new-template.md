# Authoring a reader template

How to add a template to HTMLR-Templates, or change the ones there. `R` is the repo folder found in step 2 of the skill. Work on `main` and push there; the user doesn't want feature branches in this repo.

## Where to look

Read these before writing anything. They are short and they are the ground truth.

| Path | What it tells you |
|---|---|
| `TEMPLATE-STANDARD.md` | The five mandatory files, the `template.json` schema, and the 12 rules every template obeys. Read all of it. |
| `README.md` | The catalog. A new template adds one row, and the rows stay contiguous. |
| `git log` | Each commit body explains a standard change and why it was made. Read the last ten. |
| `templates/_skeleton/` | The five files with TODO markers: the outline of what a template must document. |
| `templates/kadabra-reader/` | The most complete engine: system light and dark through surface tokens, every interface string in one `UI` object, a WCAG contrast audit in the check, and both home modes. The best base for a template derived from a brand. |
| `templates/bauhaus-reader/` | The original engine. Light only, with the one-sentence reason in its DESIGN.md: the example of opting out of dark. |
| `templates/pastel-bauhaus-reader/` | How a variant is made: same engine and layout, a new palette, and a DESIGN.md that says what changed. |

Inside any template:

| File | Role |
|---|---|
| `DESIGN.md` | The asset. Sections: 0 why, 1 palette and surfaces, 2 type and grid, 3 glyphs and decoration, 4 motion, 5 layout (both home modes), 6 accessibility, 7 what `pnpm check` enforces, 8 anti-slop checklist. The code can be regenerated from it. |
| `CONTENT.md` | The filler's contract: front-matter, every block with its syntax and limits, the `UI` fields, modes, placeholders. |
| `README.md` | At most 80 lines, ending in a "For AI agents" block whose step 1 is deciding the mode. |
| `src/content.js` | Parses front-matter and turns Markdown into blocks: callouts, quizzes, glyph mapping. No sentences. |
| `src/main.js` | The `UI` object at the top (every interface string), then routing, the two home variants, chapters, TOC, quiz grading. |
| `src/reader.css` | Font faces, then palette and surface tokens at the top. Components only read surface tokens. |
| `index.html` | Shell and the inline SVG sprite for glyphs. |
| `scripts/check.mjs` | The acceptance gate. Holds the allowed palette hexes, fonts and radii, so it changes with the design. |
| `scripts/shots.mjs` | Screenshots into `shots/` and the `preview.png` contact sheet. |
| `vendor/` | Fonts and icon paths with `FONTS.md`, `ICONS.md` and licence files. |

## New template from a brand or style

1. **Pull the look from its source.** A website, a brand guide, the project's own CSS, screenshots. Collect real values, not impressions: every hex, the font families and whether their licence allows vendoring (OFL is fine), the glyph or icon language, radii, borders, and the tone. For a live site, fetch its HTML and CSS or open it in a browser and read computed styles.
2. **Pick the base.** A palette-only variant copies the template it varies, the way `pastel-bauhaus-reader` copied `bauhaus-reader`. A new identity copies `kadabra-reader`. Don't start from empty code.

   ```sh
   cp -r R/templates/kadabra-reader R/templates/<slug>
   rm -rf R/templates/<slug>/{node_modules,dist*,shots,.wrangler}
   ```

3. **Write `DESIGN.md` first**, section by section. Section 0 is the single idea the visual language expresses, in a paragraph plus a one-line pull quote. The palette is a closed list of tokens with semantic roles, never topic words.
4. **Theme.** Default `"theme": "system"`: light and dark through surface tokens, only token values change per scheme, `<meta name="color-scheme" content="light dark">`, no toggle. Declare `light` or `dark` only when the identity can't survive the swap, and say why in one sentence in DESIGN.md.
5. **Restyle the engine to match.** Tokens and fonts in `reader.css`, the glyph sprite in `index.html`, glyph mapping in `content.js`. Vendor the fonts (latin and latin-ext subsets) with their licences. Keep every visible string in `UI`.
6. **Update `check.mjs` to the new design**: palette hexes, font families, radii and any rule DESIGN.md adds. Restate every enforced rule in DESIGN.md section 7, so an agent can satisfy them without running it.
7. **Sample content.** About three lorem chapters holding one exemplar of every block the template styles. `content/index.md` uses `mode: study` and also carries a `summary`, so both modes have something to show. Placeholders only: Lorem ipsum, `00` for numbers, `[Source, Year]` for citations.
8. **Topic gate.** Nothing from the project that inspired the look may appear. The brand name in the slug, name and `origin` is fine; its products, clients and subject matter are not.

   ```sh
   grep -rniE '<word>|<word>|<word>' R/templates/<slug> --exclude-dir=node_modules --exclude-dir=vendor --exclude-dir=dist
   ```

   It must print nothing.
9. **The five files.** `template.json` per the schema (with `theme` and today's date in `created`), `README.md`, `DESIGN.md`, `CONTENT.md`, `preview.png`. Rewrite each for this template; don't leave the base's wording.
10. **Verify.**

    ```sh
    cd R/templates/<slug>
    pnpm install && pnpm build && pnpm check && pnpm check:modes && pnpm shots
    ```

    All must pass. Look at the shots in both modes and both schemes. `preview.png` stays under 1.5 MB.
11. **Catalog.** Add the row to `R/README.md` in the same table, with no blank line before it.
12. **Commit and push on `main`.** Stage only the template folder and `README.md`. Subject `<slug>: <what it is in a few words>`, and a body saying where the look comes from and what the check enforces. Nothing a build makes gets committed (rule 8), so check `git status` first.

## Changing the engine or the standard

A fix or feature that every reader should have lands in all of them at once, the way the guide, the system theme and the two modes did:

1. Change `TEMPLATE-STANDARD.md` first if a rule changes, then `_skeleton/`.
2. Apply the change to every template, including its DESIGN.md, CONTENT.md, README "For AI agents" steps and `check.mjs`.
3. Run `pnpm build && pnpm check:modes` in every template. All pass.
4. Commit once, subject `Readers: <change>` or `Standard: <change>`, with a body that says what changed and why.

If a filled reader in some project hit the bug, offer to port the fix into that copy too.
