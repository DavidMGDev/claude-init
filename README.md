# claude-init

One command to set up a folder for Claude Code: installs a fixed set of skills, optionally starts a git repo, and drops you into an open Claude session running `/setup-matt-pocock-skills`.

```bash
claude-init          # install skills, open Claude
claude-init -g       # ...and git init first
```

No dependencies. One file does the work: [`bin/claude-init.js`](bin/claude-init.js).

## Install

```bash
git clone https://github.com/DavidMGDev/claude-init.git
cd claude-init
npm link
```

`npm link` puts `claude-init` on your PATH globally. Works on Windows, macOS and Linux. Requires Node 18+ and [Claude Code](https://claude.com/claude-code) already installed.

To update later: `git pull` in this folder. The link keeps pointing here, so there is nothing to reinstall.

## What it installs

### Plugin: `mattpocock-skills`

Pulled from Claude Code's official marketplace, so it updates itself. 35 skills; the ones that matter most:

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

These have no maintained upstream, so they ship here. Both adapted from pstack (MIT), with its dead `~/.cursor/rules` and "principle skill" references stripped out.

| Skill | What it does |
|---|---|
| [`arena`](skills/arena/SKILL.md) | Spawns N candidates at one task, cross-judges, picks a base, grafts the best of the losers into it |
| [`blast-radius`](skills/blast-radius/SKILL.md) | Finds what a change breaks beyond the diff, and **proves** the one safety fact by running real code instead of writing it up |

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

**A skill you wrote** — drop a folder with a `SKILL.md` into `skills/`. It is picked up automatically; there is no list to update.

```
skills/
  my-skill/
    SKILL.md
```

**A skill from GitHub** — add a line to `REMOTE_SKILLS`:

```js
{ name: "some-skill", url: "https://raw.githubusercontent.com/user/repo/main/SKILL.md", label: "some-skill (user, MIT)" },
```

**A marketplace plugin** — add a line to `PLUGINS`:

```js
{ name: "some-plugin@some-marketplace", label: "some-plugin" },
```

**A different .gitignore set** — edit `GITIGNORE_BLOCK`. Keep the first and last lines as markers; the entry count in the output is derived, so nothing else needs updating.

## Notes

Skills install to `~/.claude/skills/`, which Claude Code loads globally as `<name>@skills-dir`. That is per-machine.

`/setup-matt-pocock-skills` is per-repo, which is why `claude-init` runs it for you in each new folder. It asks where issues live, which triage labels to use, and where `CONTEXT.md` and ADRs go. It is conversational: it explores, shows you what it found, and lets you edit before writing. Plain markdown only. No keys, no tokens.

Restart Claude Code after the first install so it picks up the new plugin.

## Licence

MIT. Bundled and downloaded skills keep their own licences, noted above.
