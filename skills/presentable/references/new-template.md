# Authoring a presentation or page template

How to add a template to HTMLP-Templates, or change the ones there. `P` is the repo folder found in step 2 of the skill. Work on `main` and push there.

## Where to look

Read these before writing anything. They are short and they are the ground truth.

| Path | What it tells you |
|---|---|
| `TEMPLATE-STANDARD.md` | The five mandatory files, the `template.json` schema (`kind`, `type`, `resolution`), and the rules every template obeys. Read all of it. |
| `README.md` | The catalog. A new template adds one row, and the rows stay contiguous. |
| `git log` | Commit bodies explain each standard change and why. |
| `templates/_skeleton/` | The five files with TODO markers, plus a starter `index.html` for a `single` kind template. |
| `templates/pixel-deck/` | The reference project template: a 1920×1080 arrow-key deck with a check that enforces its design. Copy its engine shape. |

Inside `pixel-deck`:

| File | Role |
|---|---|
| `DESIGN.md` | The asset. Sections: 0 why, 1 the stage, 2 palette, 3 grid, edges and type, 4 icons, 5 motion, 6 layout, 7 delivery, 8 what `pnpm check` enforces, 9 anti-slop checklist. The code can be regenerated from it. |
| `CONTENT.md` | The filler's contract: what may be edited, slide attributes, accents, word limits per slot, and one snippet per archetype. |
| `index.html` | The content. Slides are `<section class="slide ...">` inside `#stage`, followed by a chrome block fillers don't touch. |
| `content/pools.js` | The one data file: word pools the background art paints with. |
| `src/deck.js` | Navigation, stage scaling, progress, notes, grid overview, deep links. |
| `src/bg.js` | Background text art, kept out of content rects. |
| `src/pieces.js` | Animated canvas diagrams ("pieces"). |
| `src/icons.js` | Icon names mapped to the vendored pixel icon library. |
| `src/deck.css` | Palette tokens and every layout archetype. |
| `scripts/check.mjs` | The acceptance gate: per slide, text size floor, no shadows or transitions, one moving thing, art kept out of content. |
| `scripts/shots.mjs` | Screenshots into `shots/` and the contact sheet. |
| `vendor/` | Fonts and icons with `FONTS.md`, `ICONS.md` and licences. |

The sister repo, HTMLR-Templates, has a newer standard (a `theme` field, a contrast audit, a topic grep gate). Port a lesson from it only when it fits a projected, fixed-size stage, and change `TEMPLATE-STANDARD.md` first when you do.

## New template from a brand or style

1. **Pull the look from its source.** A website, a brand guide, the project's own CSS, an existing deck. Collect real values: every hex, the font families and whether their licence allows vendoring (OFL is fine), icon language, edges, radii, and the tone. For a live site, fetch its HTML and CSS or read computed styles in a browser.
2. **Pick the kind.** `single` (one `index.html` that opens directly) for a simple page. `project` (Vite, pnpm, a check) for a deck or anything with an engine. Pick `type` (`presentation`, `page`, `report`, `dashboard`) and `resolution` (a fixed stage such as `1920x1080`, or `responsive` for a page).
3. **Pick the base.** A project deck copies `pixel-deck` and replaces its look. A single page starts from `_skeleton/`.

   ```sh
   cp -r P/templates/pixel-deck P/templates/<slug>
   rm -rf P/templates/<slug>/{node_modules,dist*,shots,.wrangler}
   ```

4. **Write `DESIGN.md` first**, section by section. Section 0 is the single idea the visual language expresses. The palette is a closed list of tokens with semantic roles (warn, alert, ok, info, label, highlight), never topic words. State the stage size and the type floor for the room it will be projected in.
5. **Restyle the engine to match**: tokens and archetypes in the CSS, fonts and icons vendored with their licences. Content stays in `index.html` (and at most one `content/*.js` data file). Engine code holds no sentences.
6. **Update `check.mjs` to the new design**, and restate every enforced rule in DESIGN.md's acceptance section so an agent can satisfy them without running it.
7. **Archetypes, not decks.** Ship one exemplar of each slide archetype plus a short sample flow, about 10 to 14 slides. Placeholders only: Lorem ipsum, `Speaker A/B/C`, `00` or `$00`, `[Source, Year]`.
8. **Topic gate.** Nothing from the project that inspired the look may appear. The brand name in the slug, name and `origin` is fine; its products, clients and subject matter are not.

   ```sh
   grep -rniE '<word>|<word>|<word>' P/templates/<slug> --exclude-dir=node_modules --exclude-dir=vendor --exclude-dir=dist
   ```

   It must print nothing.
9. **The five files.** `template.json` per the schema with today's date in `created`, `README.md` (at most 80 lines, ending in a "For AI agents" block with numbered steps), `DESIGN.md`, `CONTENT.md` (every archetype with a snippet and word limits), `preview.png` (a contact sheet under 1.5 MB). Rewrite each for this template; don't leave the base's wording.
10. **Verify.**

    ```sh
    cd P/templates/<slug>
    pnpm install && pnpm build && pnpm check && pnpm shots
    ```

    All must pass. Look at the shots, and check the densest slide at the stage size and at 1280×720.
11. **Catalog.** Add the row to `P/README.md` in the same table, with no blank line before it.
12. **Commit and push on `main`.** Stage only the template folder and `README.md`. Subject `<slug>: <what it is in a few words>`, and a body saying where the look comes from and what the check enforces. Nothing a build makes gets committed, so check `git status` first.

## Changing the engine or the standard

A fix or feature every template should have lands in all of them at once: `TEMPLATE-STANDARD.md` first if a rule changes, then `_skeleton/`, then each template with its DESIGN.md, CONTENT.md, README and check. Run each template's check, then commit once as `Decks: <change>` or `Standard: <change>` with a body that says what changed and why.
