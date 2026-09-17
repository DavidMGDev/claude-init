# claude-init

One command to install my Claude Code skills and plugins. Anything that works the same in every repo goes into `~/.claude` once. Anything with a per-repo setup goes into the repo you run it from, and its setup runs in Claude Code.

```bash
claude-init          # pick, install, open Claude
claude-init -g       # ...and git init first
```

No dependencies. Two files do the work: [`bin/claude-init.js`](bin/claude-init.js) and the picker in [`bin/pick.js`](bin/pick.js).

## The picker

```
  This repo (runs a setup)
  > [x] mattpocock-skills  35 skills: grilling, tdd, code-review, domain-modeling, research
    [ ] impeccable  opt-in - /impeccable polish, /impeccable audit, /impeccable critique

  Plugins
    [ ] godot-claude-skills  opt-in - alexmeckes. Live editor control over godot-mcp

  Bundled skills
    [ ] deslop-jupyter  opt-in
    [x] handoff-clip  update
    [ ] windows-context-menu  opt-in

  space toggle   a all/none   q quit
  enter install 2, then run /setup-matt-pocock-skills in Claude Code
```

`space` toggles one, `a` toggles all, `q` or `ctrl-c` quits without installing anything.

**`enter` is the only key that commits, and you press it once.** It installs what is ticked, then opens Claude Code. Nothing is installed and nothing launches before it.

### What the picker leaves out

Anything already installed globally that matches what claude-init would install. Nothing is recorded anywhere; every run checks again:

| Kind | Counts as installed when |
|---|---|
| Plugin | `claude plugin list --json` shows it at `user` scope |
| Bundled skill | every file in `skills/<name>/` is in `~/.claude/skills/<name>/` with the same bytes |
| Downloaded skill | `~/.claude/skills/<name>/SKILL.md` equals what upstream serves right now |

They are listed on one line before the picker opens (`already installed globally: ponytail, arena, ...`). Edit a bundled skill and it comes back, marked `update`. Offline, a downloaded skill that is present counts as installed.

Per-repo entries are never left out, since each repo needs its own install and setup.

### On by default, and opt-in

| | |
|---|---|
| **On** | `mattpocock-skills`, `ponytail`, `no-ai-slop`, `arena`, `blast-radius`, `handoff-clip`, `cloudflare-upload` |
| **Opt-in** | `impeccable`, `deslop-jupyter`, `indie-game-doctor`, `skill-creator`, `godot-claude-harness`, `godot-claude-skills`, `windows-context-menu` |

Opt-in entries are marked `opt-in` and start unticked, so you can still tell which ones were off by default after toggling a few. Nothing about them is worse; they just aren't wanted everywhere. `impeccable` only earns its keep on frontend work, `deslop-jupyter` only for coursework, `skill-creator` is for the rare day you write a skill and it pulls in 11 sibling skills with it, `windows-context-menu` is a reference for a few times a year, and `indie-game-doctor` is only for game work.

The split is one line, `DEFAULT_OFF`, near the top of [`bin/claude-init.js`](bin/claude-init.js). Anything not named there is on.

### The last line

It tells you what `enter` will do, and it tracks the selection. Deselect everything that carries a setup and it says so:

```
  enter install 4. No setup will run in Claude Code, it just opens.
```

Without a TTY (a pipe, CI) the picker is skipped and the defaults install; opt-in entries are listed as skipped.

## Global or per-repo

One field decides it: an entry with `setup` in `bin/claude-init.js` is per-repo. Nothing else is.

| Entry | Setup | Why it is per-repo |
|---|---|---|
| `mattpocock-skills` | `/setup-matt-pocock-skills` | Asks where issues live and where `CONTEXT.md` and ADRs go, then writes that into the repo |
| `impeccable` | `/impeccable init` | Writes `PRODUCT.md` and `DESIGN.md` into the repo |

A per-repo plugin installs at Claude Code's `project` scope, which records it in the repo's tracked `.claude/settings.json`, so a clone gets it. Pick several and their setups run in order, in one session.

Everything else is global: skills to `~/.claude/skills/<name>/`, plugins at `user` scope. The Godot plugins are global too. Neither ships a setup command; `godot-claude-harness` keeps its per-project state in `.godot-ai/` on its own.

**Pick nothing per-repo and the folder you ran it from is not touched at all.** No `.gitignore`, no `.claude/`, and `-g` is ignored.

## Install

```bash
git clone https://github.com/DavidMGDev/claude-init.git
cd claude-init
npm link
```

`npm link` puts `claude-init` on your PATH globally. Works on Windows, macOS and Linux. Requires Node 18+ and [Claude Code](https://claude.com/claude-code) already installed.

To update later: `git pull` in this folder, then run `claude-init` anywhere. Skills that changed show up as `update`.

## What it installs

### Plugins

Marketplace plugins, so they update themselves. A marketplace Claude Code does not already know is added automatically.

| Plugin | Marketplace | Commands | Setup |
|---|---|---|---|
| `mattpocock-skills` | official | 35 skills, see below | `/setup-matt-pocock-skills` |
| [`impeccable`](https://github.com/pbakaus/impeccable) | `pbakaus/impeccable` | `/impeccable polish`, `/impeccable audit`, `/impeccable critique` | `/impeccable init` |
| [`ponytail`](https://github.com/DietrichGebert/ponytail) | `DietrichGebert/ponytail` | `/ponytail [lite\|full\|ultra]`, `/ponytail-review`, `/ponytail-audit`, `/ponytail-debt`, `/ponytail-gain`, `/ponytail-help` | none |
| [`skill-creator`](https://github.com/anthropics/skills/tree/main/skills/skill-creator) | `anthropics/skills` | none, it triggers on "write me a skill" | none |
| [`godot-claude-harness`](https://github.com/DavidMGDev/godot-claude-harness) | `DavidMGDev/godot-claude-harness` | `/gd-check`, `/gd-run`, `/gd-verify`, `/gd-api`, `/gd-scene` | none |
| [`godot-claude-skills`](https://github.com/alexmeckes/godot-claude-skills) | `alexmeckes/godot-claude-skills` | live editor control over `godot-mcp` | none |

`ponytail` forces the laziest solution that actually works. `impeccable` is a design language for frontend work.

`skill-creator` is Anthropic's meta-skill for writing skills. It drafts the `SKILL.md`, then runs your test prompts twice, once with the skill and once without, so you can see whether the skill actually changed the answer. It ships inside the `example-skills` plugin, so installing it also brings `mcp-builder`, `frontend-design`, `webapp-testing` and 8 more; there is no way to take just the one.

`mattpocock-skills` is 35 skills; the ones that matter most:

| Skill | What it does |
|---|---|
| `grilling` | A relentless interview that stress-tests a plan before you write code |
| `domain-modeling` | Builds shared vocabulary, writes it into `CONTEXT.md` |
| `grill-with-docs` | Both of the above at once, plus ADRs written as you talk |
| `tdd` | Red-green-refactor loop |
| `code-review` | Reviews on two axes: repo standards, and spec compliance |
| `to-spec` / `to-tickets` | Turns a conversation into specs or issues |
| `diagnosing-bugs` | Root-cause first, not symptom patching |
| `wizard` | Generates a bash wizard for steps only a human can do |

Full list: [mattpocock/skills](https://github.com/mattpocock/skills).

### Bundled skills (in [`skills/`](skills/))

My own skills, and ones with no maintained upstream. **This folder is the source of truth**; edit them here.

| Skill | What it does |
|---|---|
| [`arena`](skills/arena/SKILL.md) | Spawns N candidates at one task, cross-judges, picks a base, grafts the best of the losers into it |
| [`blast-radius`](skills/blast-radius/SKILL.md) | Finds what a change breaks beyond the diff, and **proves** the one safety fact by running real code instead of writing it up |
| [`cloudflare-upload`](skills/cloudflare-upload/SKILL.md) | Deploys an HTML page or built web project to Cloudflare Pages with Wrangler: finds the build output, reuses a matching project or creates one, verifies the URL |
| [`deslop-jupyter`](skills/deslop-jupyter/SKILL.md) | Writes the prose in a data-analysis notebook in your own voice, and asks first which classes you have had so nothing lands above what the course taught |
| [`handoff-clip`](skills/handoff-clip/SKILL.md) | Compacts the conversation into a handoff document and prints it as one copyable block, writing no files |
| [`indie-game-doctor`](skills/indie-game-doctor/SKILL.md) | Diagnoses an indie game across concept, prototype, production and launch, gating the whole consultation on whether a stranger has played it, and citing the video behind every conclusion |
| [`windows-context-menu`](skills/windows-context-menu/SKILL.md) | Adds, places and de-duplicates Explorer right-click entries through the registry |

`arena` and `blast-radius` are adapted from pstack (MIT), with its dead `~/.cursor/rules` and "principle skill" references stripped out.

### Downloaded skill

| Skill | Source |
|---|---|
| `no-ai-slop` | [petergyang/no-ai-slop](https://github.com/petergyang/no-ai-slop) (MIT) — strips AI tells from prose while preserving the writer's voice |

Fetched on every run to check it against the global copy, so an upstream change shows up as `update`.

## Options

| Flag | Effect |
|---|---|
| `-g`, `--git` | `git init` first, if the folder is not a repo yet. Only when something per-repo is picked |
| `-n`, `--no-open` | Install only. Don't launch Claude |
| `-h`, `--help` | Usage |
| `-v`, `--version` | Version |

`--global` is gone. Global is what happens to everything without a setup, so the flag had nothing left to do; passing it errors and says so.

## The .gitignore behaviour

Only when a per-repo entry is installed into a git repo. The setups write scaffolding **into your repo**, so it shows up on GitHub. Only the genuinely machine-local part gets ignored:

```gitignore
# --- claude-init ---
.claude/settings.local.json
.scratch/
# --- end claude-init ---
```

Written at the **repo root** when you are anywhere inside a git repo, or when `-g` just created one. Without git, nothing is written.

**What is deliberately not ignored:** `CLAUDE.md`, `AGENTS.md`, `CONTEXT.md`, `CONTEXT-MAP.md`, `PRODUCT.md`, `DESIGN.md`, `docs/adr/` and `docs/agents/`. Those are shared project knowledge — the vocabulary, the decision records, and the instructions every agent reads. Ignoring them means each clone silently loses the setup, which defeats the point of writing them down. Commit them.

Idempotent: the block is found by its marker comments and **rewritten in place**, so re-running never duplicates it and never grows the file. Entries above and below keep their position, an existing `.gitignore` is never overwritten wholesale, and its line endings are preserved. Lines already in the block are kept, including the `.claude/skills/<name>/` lines older versions wrote when they installed skills into the repo.

Want a different set? Edit `GITIGNORE_BASE` in [`bin/claude-init.js`](bin/claude-init.js).

## Adding more skills

Anything added shows up in the picker on the next run.

**A skill you wrote** — drop a folder with a `SKILL.md` into [`skills/`](skills/). Anything whose `SKILL.md` starts with `---` is picked up; there is no list to update.

This repo is public. Before committing a skill, check every file in its folder for anything tied to one person or machine: emails, account or project IDs, tokens and keys, absolute home paths, and logs the skill appends to itself. Strip them. The skill should look those up at run time (`wrangler whoami`, `gh auth status`) instead of remembering them.

```
skills/
  my-skill/
    SKILL.md
```

**A skill from GitHub** — add a line to `REMOTE_SKILLS`:

```js
{ name: "some-skill", url: "https://raw.githubusercontent.com/user/repo/main/SKILL.md", label: "some-skill", about: "user, MIT" },
```

**A marketplace plugin** — add a line to `PLUGINS`. `marketplace` is only needed when Claude Code does not already know it. `setup` makes it per-repo, so only set it when the plugin ships a setup command that writes into the repo:

```js
{
  name: "some-plugin@some-marketplace",
  marketplace: "user/repo",          // optional
  label: "some-plugin",
  about: "/its, /commands",          // shown in the picker
  setup: "/its-setup-command",       // optional, makes it per-repo
},
```

## Tests

```bash
npm test
```

Covers the picker against a fake tty, since there is no tty in CI: key decoding, the footer tracking the selection, and the redraw.

Two of those are regression tests for bugs that shipped:

- **A split escape sequence.** A terminal may deliver an arrow key as `` in one read and `[A` in the next. Decoded byte by byte that is ESC, then `[`, then `A` - and ESC used to quit while `A` toggles everything, so a single arrow press destroyed the picker. Keys are now buffered and decoded whole, and ESC is no longer a quit key precisely because it starts every arrow.
- **Erase, then draw.** The redraw blanked the list with `[0J` and then wrote the new one, in two separate `write()` calls. That is two screen states, and the terminal is free to paint the empty one, which is what the flashing was. Each frame is now a single write that draws over the old one, clearing each line's tail with `[K` as it goes.

## Notes

Global skills land in `~/.claude/skills/`, which Claude Code loads everywhere as `<name>@skills-dir`. That copy is per-machine and is never committed anywhere.

`/setup-matt-pocock-skills` is conversational: it explores, shows you what it found, and lets you edit before writing. Plain markdown only. No keys, no tokens.

Restart Claude Code after the first install so it picks up the new plugin.

## Licence

MIT. Bundled and downloaded skills keep their own licences, noted above.
