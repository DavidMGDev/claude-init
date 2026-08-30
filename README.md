# claude-init

One command to set a folder up for Claude Code: pick what you want from a list, it installs, then it opens Claude with any per-repo setup already running.

```bash
claude-init          # pick, install, open Claude
claude-init -g       # ...and git init first
```

No dependencies. Two files do the work: [`bin/claude-init.js`](bin/claude-init.js) and the picker in [`bin/pick.js`](bin/pick.js).

## The picker

```
  Plugins
  > [x] mattpocock-skills  35 skills: grilling, tdd, code-review, domain-modeling, research
    [x] ponytail  /ponytail [lite|full|ultra], /ponytail-review, /ponytail-audit
    [ ] impeccable  opt-in - /impeccable polish, /impeccable audit, /impeccable critique

  Bundled skills
    [x] arena
    [x] blast-radius
    [x] handoff-clip
    [ ] windows-context-menu  opt-in

  Downloaded skills
    [x] no-ai-slop  petergyang, MIT. Strips AI tells from prose, keeps your voice

  space toggle   a all/none   q quit
  enter install 6, then run /setup-matt-pocock-skills in Claude Code
```

`space` toggles one, `a` toggles all, `q` or `ctrl-c` quits without installing anything.

**`enter` is the only key that commits, and you press it once.** It installs what is ticked, then opens Claude Code. Nothing is installed and nothing launches before it.

### On by default, and opt-in

| | |
|---|---|
| **On** | `mattpocock-skills`, `ponytail`, `no-ai-slop`, `arena`, `blast-radius` |
| **Opt-in** | `impeccable`, `windows-context-menu` |

Opt-in entries are marked `opt-in` in the list and start unticked, so you can still tell which ones were off by default after toggling a few. Nothing about them is worse; they are just not wanted in every repo. `impeccable` only earns its keep on frontend work, `windows-context-menu` is a reference for a few times a year.

The split is one line, `DEFAULT_OFF`, near the top of [`bin/claude-init.js`](bin/claude-init.js). Anything not named there is on.

### The last line

It tells you what `enter` will do, and it tracks the selection. Deselect everything that carries a setup and it says so:

```
  enter install 4. No setup will run in Claude Code, it just opens.
```

Without a TTY (a pipe, CI) the picker is skipped and the defaults install; opt-in entries are listed as skipped.

## Setups

Some things ship a per-repo setup command that has to run inside Claude Code once. Which ones is decided in `bin/claude-init.js`, not by the picker and not by you: an entry with a `setup` field runs that slash command after install. Select several and they run in order, in one session.

| Entry | Setup |
|---|---|
| `mattpocock-skills` | `/setup-matt-pocock-skills` |

Everything else installs and is simply available.

## Install

```bash
git clone https://github.com/DavidMGDev/claude-init.git
cd claude-init
npm link
```

`npm link` puts `claude-init` on your PATH globally. Works on Windows, macOS and Linux. Requires Node 18+ and [Claude Code](https://claude.com/claude-code) already installed.

To update later: `git pull` in this folder. The link keeps pointing here, so there is nothing to reinstall.

## What it installs

### Plugins

Marketplace plugins, so they update themselves. A marketplace Claude Code does not already know is added automatically.

| Plugin | Marketplace | Commands | Setup |
|---|---|---|---|
| `mattpocock-skills` | official | 35 skills, see below | `/setup-matt-pocock-skills` |
| [`ponytail`](https://github.com/DietrichGebert/ponytail) | `DietrichGebert/ponytail` | `/ponytail [lite\|full\|ultra]`, `/ponytail-review`, `/ponytail-audit`, `/ponytail-debt`, `/ponytail-gain`, `/ponytail-help` | none |
| [`impeccable`](https://github.com/pbakaus/impeccable) | `pbakaus/impeccable` | `/impeccable polish`, `/impeccable audit`, `/impeccable critique` | none |

`ponytail` forces the laziest solution that actually works. `impeccable` is a design language for frontend work. Neither needs a setup: install and use.

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

Skills with no maintained upstream, so they ship here.

| Skill | What it does |
|---|---|
| [`arena`](skills/arena/SKILL.md) | Spawns N candidates at one task, cross-judges, picks a base, grafts the best of the losers into it |
| [`blast-radius`](skills/blast-radius/SKILL.md) | Finds what a change breaks beyond the diff, and **proves** the one safety fact by running real code instead of writing it up |
| [`handoff-clip`](skills/handoff-clip/SKILL.md) | Compacts the conversation into a handoff document and prints it as one copyable block, writing no files |
| [`windows-context-menu`](skills/windows-context-menu/SKILL.md) | Adds, places and de-duplicates Explorer right-click entries through the registry |

`arena` and `blast-radius` are adapted from pstack (MIT), with its dead `~/.cursor/rules` and "principle skill" references stripped out.

> **This folder is a mirror, do not edit it here.** The source of truth is
> `skills/` in [dmg-windows-rice](https://github.com/DavidMGDev/dmg-windows-rice),
> which mirrors into this folder with `robocopy /MIR`. A skill added here and
> not there is deleted on the next sync.

### Downloaded skill

| Skill | Source |
|---|---|
| `no-ai-slop` | [petergyang/no-ai-slop](https://github.com/petergyang/no-ai-slop) (MIT) — strips AI tells from prose while preserving the writer's voice |

Fetched fresh on every run, so it stays current.

## Options

| Flag | Effect |
|---|---|
| `-g`, `--git` | `git init` first, if the folder is not a repo yet |
| `-n`, `--no-open` | Install only. Don't launch Claude |
| `-h`, `--help` | Usage |
| `-v`, `--version` | Version |

## The .gitignore behaviour

`/setup-matt-pocock-skills` writes scaffolding **into your repo**, so it shows up on GitHub. Only the genuinely machine-local part gets ignored:

```gitignore
# --- claude-init ---
.claude/settings.local.json
.scratch/
# --- end claude-init ---
```

Written at the **repo root** when you are anywhere inside a git repo, or when `-g` just created one. Without git, nothing is written.

**What is deliberately not ignored:** `CLAUDE.md`, `AGENTS.md`, `CONTEXT.md`, `CONTEXT-MAP.md`, `docs/adr/` and `docs/agents/`. Those are shared project knowledge — the vocabulary, the decision records, and the instructions every agent reads. Ignoring them means each clone silently loses the setup, which defeats the point of writing them down. Commit them.

Idempotent: it checks for the marker comment, so re-running never duplicates the block. An existing `.gitignore` is appended to, never overwritten, and its line endings are preserved.

Want a different set? Edit `GITIGNORE_BLOCK` in [`bin/claude-init.js`](bin/claude-init.js). Keep the first and last lines as markers.

## Adding more skills

Everything is a list at the top of [`bin/claude-init.js`](bin/claude-init.js). No other file to touch.

Anything added to a list shows up in the picker on the next run.

**A skill you wrote** — add it to `skills/` in [dmg-windows-rice](https://github.com/DavidMGDev/dmg-windows-rice) and run its `sync-claude-init` skill, which mirrors that folder into this one. Anything with a `SKILL.md` is picked up automatically; there is no list to update.

```
skills/
  my-skill/
    SKILL.md
```

**A skill from GitHub** — add a line to `REMOTE_SKILLS`:

```js
{ name: "some-skill", url: "https://raw.githubusercontent.com/user/repo/main/SKILL.md", label: "some-skill (user, MIT)" },
```

**A marketplace plugin** — add a line to `PLUGINS`. `marketplace` is only needed when Claude Code does not already know it; `setup` is only needed when the plugin ships a per-repo setup command:

```js
{
  name: "some-plugin@some-marketplace",
  marketplace: "user/repo",          // optional
  label: "some-plugin",
  about: "/its, /commands",          // shown in the picker
  setup: "/its-setup-command",       // optional
},
```

## Tests

```bash
npm test
```

Covers the picker against a fake tty, since there is no tty in CI: key decoding, the footer tracking the selection, and the redraw.

Two of those are regression tests for bugs that shipped:

- **A split escape sequence.** A terminal may deliver an arrow key as `` in one read and `[A` in the next. Decoded byte by byte that is ESC, then `[`, then `A` - and ESC used to quit while `A` toggles everything, so a single arrow press destroyed the picker. Keys are now buffered and decoded whole, and ESC is no longer a quit key precisely because it starts every arrow.
- **Erase, then draw.** The redraw blanked the list with `[0J` and then wrote the new one, in two separate `write()` calls. That is two screen states, and the terminal is free to paint the empty one, which is what the flashing was. Each frame is now a single write that draws over the old one, clearing each line's tail with `[K` as it goes.

**A different .gitignore set** — edit `GITIGNORE_BLOCK`. Keep the first and last lines as markers; the entry count in the output is derived, so nothing else needs updating.

## Notes

Skills install to `~/.claude/skills/`, which Claude Code loads globally as `<name>@skills-dir`. That is per-machine.

`/setup-matt-pocock-skills` is per-repo, which is why `claude-init` runs it for you in each new folder. It asks where issues live, which triage labels to use, and where `CONTEXT.md` and ADRs go. It is conversational: it explores, shows you what it found, and lets you edit before writing. Plain markdown only. No keys, no tokens.

Restart Claude Code after the first install so it picks up the new plugin.

## Licence

MIT. Bundled and downloaded skills keep their own licences, noted above.
