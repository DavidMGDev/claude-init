---
name: make-ci-skill
description: "Create or update one of the user's own skills: write it into the claude-init repo, install it globally, commit and push, in one pass. Use for /make-ci-skill, 'make a skill for X', 'turn this into a skill', 'save this as a skill', or editing a skill that lives in claude-init. Prefer this over skill-creator for any skill the user keeps."
argument-hint: "What the skill should do"
allowed-tools: Bash, PowerShell, Read, Write, Edit, Glob, Grep, WebSearch, WebFetch, Agent
---

# Make a claude-init skill

The user keeps every skill they own in one public repo, claude-init, under `skills/<name>/`. That folder is the only source of truth. `~/.claude/skills/<name>/` is a copy of it, and the `claude-init` installer checks the two are byte-identical. So a skill is done when all four hold:

1. `skills/<name>/SKILL.md` exists in claude-init and reads well.
2. Nothing in the folder is tied to one person or machine.
3. `~/.claude/skills/<name>/` matches it byte for byte.
4. The change is committed and pushed, in claude-init and in the repo that holds it as a submodule, if any.

Invoking this skill is the user's standing authorization for all four, including the push. Run them without asking. The only thing worth a question is what the skill should do, and only when the request and the conversation leave it truly open.

## 1. Find claude-init

It is on PATH through a global link, so resolve the link instead of remembering a path:

```sh
node -e "const {execSync}=require('child_process'),{realpathSync}=require('fs'),{join}=require('path');console.log(realpathSync(join(execSync('npm root -g').toString().trim(),'claude-init')))"
```

Check the result holds `bin/claude-init.js` and `skills/`. Call it `CI` below. If the lookup fails, ask for the path once.

Run `git -C CI status --short` now and keep the output. Anything dirty in it belongs to other work and stays out of your commits.

## 2. Pin down the skill

Take what the skill does from the argument, and from the conversation when the user says to turn something just done into a skill. That conversation is the best source there is: the steps that worked, the corrections the user made, the commands and paths that turned out right. Mine it before asking anything.

Settle these four, asking one round of questions only for what stays unclear:

- **What it does**, as one sentence you could put in the README.
- **When it fires**: the phrases the user would type, and the situations where Claude should reach for it unasked.
- **Model-invoked or user-invoked.** Model-invoked (the default) keeps its description in context so Claude can fire it on its own. Set `disable-model-invocation: true` when it should only ever run by hand: it has side effects, it is a heavy workflow, or firing by accident would cost something (`arena`, `blast-radius`, `handoff-clip` are all like this).
- **Name.** Lowercase letters, digits and single hyphens, 64 characters at most, no `claude` or `anthropic` in it, not `synced` (Claude Code reserves it). The folder name and the frontmatter `name` are the same string, and the folder name is what `/<name>` calls. Look in `CI/skills/`, `~/.claude/skills/` and the skill list in your context. A name already in `CI/skills/` means this is an update: edit that folder in place and keep its voice. A name that clashes with anything else needs a different name.

## 3. Look before writing

Search for an existing skill that already covers the job: `anthropics/skills`, `mattpocock/skills`, and a web search for `"SKILL.md" <topic>`. Then decide:

- **An upstream skill fits as is and is maintained**: do not bundle it. Add it to `REMOTE_SKILLS` in `CI/bin/claude-init.js` so it stays fetched and current, then install it (step 6) and stop there.
- **It fits partly**: take the good parts, credit the source and its licence in the README row, strip what does not apply here (the way `arena` and `efficient-fable` were adapted).
- **Nothing fits**: write it from scratch.

When the skill is about a domain (an API, a tool, a file format), verify the facts it states against primary docs or by running the command. A skill that states a wrong flag teaches the wrong flag every time it loads.

## 4. Write it

Read two or three skills in `CI/skills/` first for the house style. `handoff-clip` and `cloudflare-upload` are the clearest short ones.

Frontmatter, only the fields the skill needs:

```yaml
---
name: <name>
description: "<What it does, one sentence>. Use for /<name>, '<phrase>', '<phrase>', or <situation>."
argument-hint: "<what to pass it>"      # when it takes an argument
disable-model-invocation: true           # only for user-invoked skills
allowed-tools: Bash, Read                # only when the user wants no permission prompts during it
---
```

The description is the only part Claude sees before the skill loads, and it decides whether the skill fires. Lead with what it does, then one trigger per distinct case. Keep it under 1024 characters and free of `<` and `>`. For a user-invoked skill, one plain line for the human is enough.

The body:

- An H1 in sentence case, then two or three lines on what the skill is for and what done looks like.
- Numbered steps when order matters, each ending on something checkable. Reference sections when it is a set of rules.
- Everything a fresh Claude needs to run it cold, and nothing it would do anyway. Write the target behaviour ("use pnpm") rather than a ban on the other thing.
- Commands in fenced blocks, exact and runnable. Say which shell when it matters: this machine runs Windows with both Git Bash and PowerShell.
- Under 500 lines. Past that, move material only some runs need into `references/<topic>.md` or a sibling file, linked from the body with the condition for opening it. One level deep, no file that points at another file.
- Scripts only for work that has to be deterministic. They go in the skill folder and the body calls them as `${CLAUDE_SKILL_DIR}/script.js`, since the skill runs from `~/.claude/skills`, not from the repo. Forward slashes in every path. Mind `CI/.gitattributes`: everything is LF except `.ps1 .cmd .bat .vbs .reg .ahk`, which are CRLF.

Prose, because the repo is public and the user wants it to read as theirs: no em dashes, straight quotes, active voice, sentence-case headings. None of "crucial", "seamless", "robust", "leverage", "delve", "landscape", "testament", "showcase". No bullet that opens with a bold label restating itself. Run `no-ai-slop` over the prose if it is installed.

## 5. Scrub it

The repo is public. Grep the whole skill folder:

```sh
grep -rnIiE '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}|[\\/]users[\\/]|/home/|api[_-]?key|token|secret|passw|account[_ -]?id|bearer|sk-[a-z0-9]' CI/skills/<name>
```

Strip every real hit: emails, account and project IDs, keys and tokens, absolute home paths, usernames, and any log the skill appends to itself. Where the skill needs one of those at run time, have it look it up (`wrangler whoami`, `gh auth status`, `git config user.email`, `~` for home). Do not ask whether to bundle something; strip it.

## 6. Install it globally

Mirror the folder into `~/.claude/skills/<name>/`, removing the old copy first so a deleted file does not linger:

```sh
node -e "const fs=require('fs'),p=require('path'),os=require('os');const [src,n]=process.argv.slice(1);const dst=p.join(os.homedir(),'.claude','skills',n);fs.rmSync(dst,{recursive:true,force:true});fs.cpSync(src,dst,{recursive:true});console.log(dst)" "CI/skills/<name>" "<name>"
```

Then prove it matches: `diff -r CI/skills/<name> ~/.claude/skills/<name>` prints nothing. A remote skill from step 3 installs the same way, from the file `REMOTE_SKILLS` points at.

Claude Code watches `~/.claude/skills/`, so the skill is live in this session. It does not watch the repo, which is why every later edit to the skill repeats this step.

## 7. Register it in claude-init

- Add a row to the "Bundled skills" table in `CI/README.md`, in alphabetical order, in the same voice as its neighbours: what it does, one line, with credit when adapted.
- A skill that only matters for one kind of work (one game engine, one course, one OS feature) goes in `DEFAULT_OFF` in `CI/bin/claude-init.js`, so the picker starts it unticked on other machines. General skills stay out of it. Add it to the "Opt-in" or "On" row of the README table that lists them.

The picker finds skills on its own, so there is no other list to update.

## 8. Commit and push

Stage only what you touched. Other sessions leave work in progress in this repo, and it is not yours to commit.

```sh
git -C CI add skills/<name>
```

For a file that was already dirty in step 1 (often `README.md`), stage only your hunk by building the staged copy from `HEAD`:

```sh
git -C CI show HEAD:README.md > /tmp/readme   # then apply only your edit to /tmp/readme
git -C CI update-index --cacheinfo 100644,$(git -C CI hash-object -w /tmp/readme),README.md
```

Check `git -C CI diff --cached` shows your change and nothing else, then commit and push. Messages are short and imperative: `Add the <name> skill`, `Update <name>: <what changed>`. No Claude trailers or co-author lines.

If claude-init is a submodule (`git -C CI rev-parse --show-superproject-working-tree` prints a path), commit the pointer there too, staging only the submodule path, as `Bump claude-init: <what changed>`, and push.

## 9. Report

Four lines: the skill's path in claude-init, the global path, the commit hashes, and how to call it (`/<name>`, or the phrases that fire it). Then one line on anything worth doing next, such as running `skill-creator`'s eval loop when the skill's output quality is hard to judge by reading. Its workspace defaults to a folder beside the skill, which would put eval transcripts in the public repo, so point it at a temp folder. Its `quick_validate.py` also rejects Claude Code fields like `disable-model-invocation` and `argument-hint`; those are valid here, so ignore that check.
