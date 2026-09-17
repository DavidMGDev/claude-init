---
name: cloudflare-upload
description: Upload/deploy/publish/host an HTML page, static site, or built web project to Cloudflare Pages with the Wrangler CLI. Use whenever the user says "upload to Cloudflare", "put this on Cloudflare", "deploy this", "host this", "publish the HTML", or asks for a shareable link to a page. Prefer this over creating a claude.ai Artifact.
---

# Upload to Cloudflare (Wrangler → Pages)

Everything needed is here. Do not research Cloudflare docs, do not load the
cloudflare/wrangler plugin skills, do not use the Artifact tool. Just run it.

## Known environment

- `wrangler` is installed globally via pnpm.
  If missing: `pnpm add -g wrangler`, or use `pnpm dlx wrangler ...`.
- Already logged in (OAuth). Only if a command fails with an auth error, have
  the user run `! wrangler login`.
- Default target is **Cloudflare Pages** (direct upload, no Git). All existing
  projects are Pages projects on `<name>.pages.dev`.
- Package manager is pnpm (see global CLAUDE.md), including the exFAT
  `nodeLinker: hoisted` quirk.

## Steps

1. **Find what to upload.**
   - Single loose HTML file(s) with no build → the folder containing them.
     If the file isn't named `index.html`, copy it into a scratch folder as
     `index.html` (plus any assets it references) and deploy that folder.
   - Project with a `build` script (Vite etc.) → `pnpm install` if
     `node_modules` is missing, `pnpm build`, deploy the output dir
     (`dist/` for Vite; check the config's `outDir`). Prefer the multi-file
     build over a single-file variant.
   - Never deploy the repo root of a project that has `node_modules`,
     sources, or secrets in it — deploy only the built/static folder.

2. **Check for an exact match** (usually it's a new project, but always check):
   ```sh
   wrangler pages project list
   ```
   Also check for a `wrangler.toml`/`wrangler.jsonc` in the project: if it
   names a project/worker, that's the match. Derive the project name from the
   folder/package name in kebab-case (e.g. `CPSM-Reader` → `cpsm-reader`).
   - Exact name match → redeploy to it (step 4), no create.
   - No match → create (step 3).
   - Near-miss (similar but not identical name) → ask the user once.

3. **Create** (new project only):
   ```sh
   wrangler pages project create <name> --production-branch=main
   ```

4. **Deploy:**
   ```sh
   wrangler pages deploy <dir> --project-name=<name> --branch=main --commit-dirty=true
   ```
   `--branch=main` makes it a production deploy (the clean `<name>.pages.dev`
   URL), not a preview.

5. **Verify:** `curl -s -o /dev/null -w "%{http_code}" https://<name>.pages.dev/`
   → expect 200 (may take a few seconds on a brand-new project).

6. **Report** the production URL `https://<name>.pages.dev` and the
   deployment URL wrangler printed. Nothing else needed.

## Notes

- Vite projects must use `base: './'` or `'/'`; either works at the pages.dev root.
- Workers (static assets) only if the user explicitly asks for Workers or the
  project already has a Worker config: `wrangler deploy` with
  `assets.directory` pointing at the build output.
