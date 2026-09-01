#!/usr/bin/env node
/**
 * claude-init - pick a set of Claude Code skills, install them, then hand you
 * an open Claude session with any per-repo setup already running.
 *
 * To add something:
 *   - local skill  : drop a folder with a SKILL.md into ../skills/ . Nothing else.
 *   - remote skill : add a line to REMOTE_SKILLS below.
 *   - plugin       : add a line to PLUGINS below.
 *
 * An entry with a `setup` field runs that slash command in Claude Code once
 * everything is installed. Whether something has a setup is decided here, not
 * by the picker and not by the user.
 */

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, copyFileSync, statSync } from "node:fs";
import { get } from "node:https";
import { homedir } from "node:os";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { pick } from "./pick.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const NET_TIMEOUT_MS = 15000;

// ── What can be installed ─────────────────────────────────────────────────

// `marketplace` is only needed for a marketplace Claude Code does not already
// know. claude-plugins-official is built in.
const PLUGINS = [
  {
    name: "mattpocock-skills@claude-plugins-official",
    label: "mattpocock-skills",
    about: "35 skills: grilling, tdd, code-review, domain-modeling, research",
    setup: "/setup-matt-pocock-skills",
  },
  {
    name: "ponytail@ponytail",
    marketplace: "DietrichGebert/ponytail",
    label: "ponytail",
    about: "/ponytail [lite|full|ultra], /ponytail-review, /ponytail-audit, /ponytail-debt",
  },
  {
    name: "example-skills@anthropic-agent-skills",
    marketplace: "anthropics/skills",
    label: "skill-creator",
    about: "Anthropic's own. Drafts a skill, then evals it against a no-skill baseline",
  },
  {
    name: "godot-claude-harness@godot-claude-harness",
    marketplace: "DavidMGDev/godot-claude-harness",
    label: "godot-claude-harness",
    about: "Mine. /gd-check, /gd-run, /gd-verify against the real engine",
  },
  {
    name: "godot-claude-skills@godot-claude-skills",
    marketplace: "alexmeckes/godot-claude-skills",
    label: "godot-claude-skills",
    about: "alexmeckes. Live editor control over godot-mcp",
  },
  {
    name: "impeccable@impeccable",
    marketplace: "pbakaus/impeccable",
    label: "impeccable",
    about: "/impeccable polish, /impeccable audit, /impeccable critique",
  },
];

// Ticked in the picker unless named here. Nothing about an opt-in entry is
// worse, it is just not what I want in every repo by default: impeccable only
// earns its keep on frontend work, coursework-notebook only in a course folder,
// skill-creator is for the rare day I write a skill and it pulls in 11 sibling
// skills with it, windows-context-menu is a reference I reach for a few times
// a year.
const DEFAULT_OFF = new Set([
  "impeccable",
  "coursework-notebook",
  "skill-creator",
  "godot-claude-harness",
  "godot-claude-skills",
  "windows-context-menu",
]);

const REMOTE_SKILLS = [
  {
    name: "no-ai-slop",
    url: "https://raw.githubusercontent.com/petergyang/no-ai-slop/main/skills/no-ai-slop/SKILL.md",
    label: "no-ai-slop",
    about: "petergyang, MIT. Strips AI tells from prose, keeps your voice",
  },
];

// Only genuinely machine-local files belong here.
//
// The docs the skills produce - CLAUDE.md, AGENTS.md, CONTEXT.md, docs/adr/,
// docs/agents/ - are shared project knowledge. Ignoring them means every clone
// silently loses the setup, which defeats the point of writing them down.
// Commit those.
//
// Skills you unticked in the second picker are appended to these at write
// time. The block is rewritten in full on every run rather than appended to
// once, which is what lets a skill move back and forth between committed and
// ignored: the answer lives in the block and nowhere else, so a re-run always
// shows the repo as it actually stands.
const GITIGNORE_BASE = [".claude/settings.local.json", ".scratch/"];
const GITIGNORE_START = "# --- claude-init ---";
const GITIGNORE_END = "# --- end claude-init ---";

// ── Output ────────────────────────────────────────────────────────────────

const useColor = process.stdout.isTTY && !process.env.NO_COLOR;
const c = (n, s) => (useColor ? `\x1b[${n}m${s}\x1b[0m` : s);
const ok = (m) => console.log(`  ${c(32, "+")} ${m}`);
const warn = (m) => console.log(`  ${c(33, "!")} ${m}`);
const die = (m) => { console.error(`  ${c(31, "x")} ${m}`); process.exit(1); };
const head = (m) => console.log(`\n${c(1, m)}`);

const HELP = `
  claude-init - pick Claude Code skills, install them, open Claude with any
                per-repo setup already running.

  Usage
    claude-init [options]

  Options
    -g, --git       git init first if this folder is not a repo yet
    -n, --no-open   install only, do not launch Claude
        --global    install into ~/.claude instead, and leave this folder
                    completely untouched
    -h, --help      this
    -v, --version   version

  Picker
    up/down or j/k   move          space   toggle
    a                all / none    enter   install and go
    q or ctrl-c      quit, install nothing

    Most entries start ticked. Ones marked opt-in start unticked.
    Without a TTY (a pipe, CI) the picker is skipped and the defaults install.

  Where things land
    By default skills go to .claude/skills/ in this repo and plugins are
    installed at project scope, so a clone gets both. A second picker then asks
    which of those skills to commit; everything starts ticked, so enter means
    "all of them". Unticked ones get a .gitignore entry instead, and if one was
    already committed it is dropped from the index with git rm --cached - your
    local copy stays. Re-run any time to change your mind either way.

    --global puts skills in ~/.claude/skills/ and plugins at user scope, writes
    no .gitignore and creates no .claude/ here. Use it from any folder.

  Notes
    Docs the skills produce (CLAUDE.md, AGENTS.md, CONTEXT.md, docs/adr/) are
    deliberately NOT ignored: commit them.
`;

// ── Args ──────────────────────────────────────────────────────────────────

const argv = process.argv.slice(2);
const FLAGS = new Set(["-g", "--git", "-n", "--no-open", "--global", "-h", "--help", "-v", "--version"]);
const has = (...f) => f.some((x) => argv.includes(x));

if (has("-h", "--help")) {
  console.log(HELP);
  process.exit(0);
}

if (has("-v", "--version")) {
  console.log(JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")).version);
  process.exit(0);
}

// Silently ignoring a typo'd flag means `claude-init --gti` quietly skips git.
const unknown = argv.filter((a) => !FLAGS.has(a));
if (unknown.length) {
  console.error(`  ${c(31, "x")} unknown option: ${unknown.join(", ")}`);
  console.error(HELP);
  process.exit(2);
}

const wantGit = has("-g", "--git");
const noOpen = has("-n", "--no-open");
// No short flag on purpose: -G next to -g is a footgun, and the two do very
// different things.
let globalMode = has("--global");
const cwd = process.cwd();

// ── Helpers ───────────────────────────────────────────────────────────────

// A native .exe spawns directly. An npm-installed `claude` is a .cmd shim,
// which Node refuses to spawn without a shell. Probe once: shell:true on every
// call is both a Node 24 deprecation warning and an extra process.
let CLAUDE_SHELL = false;
let claudeVersion = "";

function detectClaude() {
  for (const shell of [false, true]) {
    if (shell && process.platform !== "win32") continue;
    const r = spawnSync("claude", ["--version"], { stdio: "pipe", shell, encoding: "utf8" });
    if (!r.error && r.status === 0) {
      CLAUDE_SHELL = shell;
      claudeVersion = (r.stdout || "").trim();
      return true;
    }
  }
  return false;
}

function runClaude(args, { quiet = false } = {}) {
  return spawnSync("claude", args, {
    stdio: quiet ? "pipe" : "inherit",
    shell: CLAUDE_SHELL,
    encoding: "utf8",
  });
}

function git(args) {
  return spawnSync("git", args, { stdio: "pipe", encoding: "utf8" });
}

// node:https, not fetch: undici keeps a pooled socket alive, and process.exit()
// while it is closing trips a libuv assert on Windows (0xC0000409).
function download(url, redirects = 3) {
  return new Promise((resolve, reject) => {
    const req = get(url, (res) => {
      const { statusCode, headers } = res;
      if (statusCode >= 300 && statusCode < 400 && headers.location && redirects > 0) {
        res.resume();
        return resolve(download(headers.location, redirects - 1));
      }
      if (statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${statusCode}`));
      }
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => resolve(body));
    });
    req.on("error", reject);
    // Without this a hung connection blocks the whole install forever.
    req.setTimeout(NET_TIMEOUT_MS, () => {
      req.destroy(new Error(`timed out after ${NET_TIMEOUT_MS / 1000}s`));
    });
  });
}

function copyDir(from, to) {
  mkdirSync(to, { recursive: true });
  for (const entry of readdirSync(from)) {
    const src = join(from, entry);
    const dst = join(to, entry);
    if (statSync(src).isDirectory()) copyDir(src, dst);
    else copyFileSync(src, dst);
  }
}

// The claude-init block, as a list of entry lines. Absent block -> null, so a
// first run can be told apart from a run where you unticked everything.
function readIgnoreBlock(path) {
  if (!existsSync(path)) return null;
  const lines = readFileSync(path, "utf8").split(/\r?\n/);
  const a = lines.indexOf(GITIGNORE_START);
  const b = lines.indexOf(GITIGNORE_END);
  if (a === -1 || b === -1 || b < a) return null;
  return lines.slice(a + 1, b).filter((l) => l.trim() && !l.startsWith("#"));
}

const skillIgnoreLine = (name) => `.claude/skills/${name}/`;

// Replaces the block in place if there is one, appends it otherwise, so the
// entries around it keep their position and the file does not grow every run.
function writeIgnoreBlock(path, entries) {
  const current = existsSync(path) ? readFileSync(path, "utf8") : "";
  const eol = current.includes("\r\n") ? "\r\n" : "\n";
  const block = [GITIGNORE_START, ...entries, GITIGNORE_END];
  const lines = current === "" ? [] : current.split(/\r?\n/);
  const a = lines.indexOf(GITIGNORE_START);
  const b = lines.indexOf(GITIGNORE_END);

  let out;
  if (a !== -1 && b !== -1 && b >= a) {
    out = [...lines.slice(0, a), ...block, ...lines.slice(b + 1)];
  } else {
    const pad = lines.length && lines[lines.length - 1].trim() !== "" ? [""] : [];
    out = [...lines, ...pad, ...block, ""];
  }
  writeFileSync(path, out.join(eol).replace(/(\r?\n)+$/, eol));
}

// ── 1. Preflight ──────────────────────────────────────────────────────────

head("claude-init");

if (!detectClaude()) {
  die("`claude` is not on PATH. Install Claude Code: https://claude.com/claude-code");
}
ok(`Claude Code ${claudeVersion}`);
ok(`target: ${cwd}`);

// ── 2. Repo ───────────────────────────────────────────────────────────────

// existsSync(".git") misses a subdirectory of a repo, a worktree, and a
// submodule (where .git is a file). Ask git instead.
function repoRoot() {
  const inside = git(["rev-parse", "--is-inside-work-tree"]);
  if (inside.status !== 0 || (inside.stdout || "").trim() !== "true") return null;
  const top = git(["rev-parse", "--show-toplevel"]);
  return top.status === 0 ? top.stdout.trim() : null;
}

let root = null;

// --global writes to the home directory and must leave the folder you happen
// to be standing in completely untouched, so none of this runs.
if (!globalMode) {
  head("Repo");
  root = repoRoot();

  if (wantGit && !root) {
    if (git(["init", "-q"]).status === 0) {
      root = repoRoot();
      ok("git init");
    } else {
      warn("git init failed");
    }
  } else if (wantGit && root) {
    ok("already a git repo");
  }

  // claude-init's own repo already ships these skills in claude-init/skills.
  // Installing locally would copy them to .claude/skills and commit a second
  // copy of the source of truth, so this one repo is always a global install.
  if (root && !relative(root, ROOT).toLowerCase().startsWith("..")) {
    globalMode = true;
    warn("this repo is claude-init's own source, installing globally instead");
  }
}

// Skills land beside the code in local mode, so a clone carries them. The repo
// root, not cwd, because that is where .gitignore and .claude/ belong.
const skillsDir = globalMode
  ? join(homedir(), ".claude", "skills")
  : join(root ?? cwd, ".claude", "skills");

if (globalMode) ok(`global install: ${skillsDir}`);
else if (root) ok(`repo: ${root}`);
else ok("not a git repo, so nothing will be gitignored (use -g to create one)");

// ── 3. Catalogue ──────────────────────────────────────────────────────────

const localDir = join(ROOT, "skills");
const localSkills = existsSync(localDir)
  ? readdirSync(localDir)
      .filter((d) => {
        const f = join(localDir, d, "SKILL.md");
        return existsSync(f) && readFileSync(f, "utf8").startsWith("---");
      })
      .map((name) => ({ kind: "local", group: "Bundled skills", name, label: name }))
  : [];

const catalogue = [
  ...PLUGINS.map((p) => ({ ...p, kind: "plugin", group: "Plugins" })),
  ...localSkills,
  ...REMOTE_SKILLS.map((s) => ({ ...s, kind: "remote", group: "Downloaded skills" })),
].map((i) => ({ ...i, optIn: DEFAULT_OFF.has(i.label), checked: !DEFAULT_OFF.has(i.label) }));

if (!catalogue.length) die("nothing to install");

// ── 4. Pick ───────────────────────────────────────────────────────────────

let chosen;
if (process.stdin.isTTY && process.stdout.isTTY) {
  head("What do you want?");
  chosen = await pick(catalogue);
  if (chosen === null) {
    console.log("\n  nothing installed\n");
    process.exit(130);
  }
} else {
  chosen = catalogue.filter((i) => i.checked);
  head("What do you want?");
  ok(`no TTY, so installing the ${chosen.length} defaults`);
  const off = catalogue.filter((i) => !i.checked).map((i) => i.label);
  if (off.length) ok(`opt-in, skipped: ${off.join(", ")}`);
}

// ── 5. Commit which of them? ──────────────────────────────────────────────

const skills = chosen.filter((i) => i.kind !== "plugin");

// name -> { commit, wasIgnored }, empty unless the question was worth asking.
// --global writes to the home directory and outside a repo there is nothing to
// commit to, so in both cases there is nothing to decide.
let installedSkills = [];

if (!globalMode && root && skills.length) {
  const previous = readIgnoreBlock(join(root, ".gitignore"));
  const wasIgnored = new Set(
    (previous ?? [])
      .filter((l) => l.startsWith(".claude/skills/"))
      .map((l) => l.split("/")[2])
      .filter(Boolean),
  );

  // Ticked means committed and everything starts ticked, so enter alone means
  // "share all of these". Last run's answer overrides that default, which is
  // the whole point of re-running: it shows you the repo as it stands now.
  const items = skills.map((x) => ({
    ...x,
    group: "Commit these to the repo?",
    optIn: false,
    about: wasIgnored.has(x.name) ? "currently gitignored" : "",
    checked: !wasIgnored.has(x.name),
  }));

  const footer = (n, all, c) => [[
    `  enter commit ${n} of ${all.length}, gitignore the rest`,
    `  ${c(1, "enter")} commit ${n} of ${all.length}, ${c(33, "gitignore the rest")}`,
  ]];

  if (process.stdin.isTTY && process.stdout.isTTY) {
    head("Share with the repo?");
    if ((await pick(items, { footer })) === null) {
      console.log("\n  nothing installed\n");
      process.exit(130);
    }
  }

  installedSkills = items.map((x) => ({ name: x.name, commit: x.checked, wasIgnored: wasIgnored.has(x.name) }));
}

// ── 6. Install ────────────────────────────────────────────────────────────

const plugins = chosen.filter((i) => i.kind === "plugin");
let pluginInstalled = false;

if (plugins.length) {
  head("Plugins");
  for (const p of plugins) {
    // Adding a marketplace that is already known is a no-op, so no need to
    // check first. Only the install result is worth reporting.
    if (p.marketplace) runClaude(["plugin", "marketplace", "add", p.marketplace], { quiet: true });
    // -y is required whenever stdout is not a TTY, which it is not here.
    // project scope records the plugin in the repo's .claude/settings.json, so
    // a clone gets it. user scope is the machine-wide install --global wants.
    const r = runClaude(["plugin", "install", p.name, "-y", "--scope", globalMode ? "user" : "project"], { quiet: true });
    if (r.status === 0) {
      ok(`${p.label}  ${c(2, p.about)}`);
      pluginInstalled = true;
    } else {
      // Swallowing the real reason here made a failed install look like a shrug.
      const why = ((r.stderr || "") + (r.stdout || "")).trim().split("\n").pop() || "unknown error";
      warn(`${p.name}: ${why}`);
      warn(`  install by hand: claude plugin install ${p.name}`);
    }
  }
}

if (skills.length) {
  head("Skills");
  mkdirSync(skillsDir, { recursive: true });

  for (const s of skills.filter((i) => i.kind === "local")) {
    const existed = existsSync(join(skillsDir, s.name));
    copyDir(join(localDir, s.name), join(skillsDir, s.name));
    ok(`${s.name} (bundled, ${existed ? "updated" : "installed"})`);
  }

  for (const s of skills.filter((i) => i.kind === "remote")) {
    try {
      const body = await download(s.url);
      if (!body.startsWith("---")) throw new Error("not a SKILL.md");
      const existed = existsSync(join(skillsDir, s.name));
      mkdirSync(join(skillsDir, s.name), { recursive: true });
      writeFileSync(join(skillsDir, s.name, "SKILL.md"), body);
      ok(`${s.label} (${existed ? "updated" : "installed"})  ${c(2, s.about)}`);
    } catch (e) {
      warn(`skipped ${s.name}: ${e.message}`);
    }
  }
}

// ── 7. gitignore and untracking ───────────────────────────────────────────

if (!globalMode && root) {
  head("Repo");
  const path = join(root, ".gitignore");
  const ignored = installedSkills.filter((x) => !x.commit);

  writeIgnoreBlock(path, [...GITIGNORE_BASE, ...ignored.map((x) => skillIgnoreLine(x.name))]);
  const where = relative(cwd, path) || ".gitignore";
  ok(`.gitignore ${GITIGNORE_BASE.length + ignored.length} entries (${where})`);

  // Adding the ignore line does nothing on its own: git keeps honouring the
  // index for a file it is already tracking. Dropping it from the index is the
  // step that actually takes it out of the repo.
  for (const x of ignored) {
    const rel = `.claude/skills/${x.name}`;
    const tracked = git(["-C", root, "ls-files", "--", rel]);
    if (tracked.status === 0 && (tracked.stdout || "").trim()) {
      const rm = git(["-C", root, "rm", "-r", "--cached", "-q", "--", rel]);
      if (rm.status === 0) ok(`${x.name} untracked (staged; your local copy is untouched)`);
      else warn(`${x.name}: git rm --cached failed, run it by hand`);
    }
  }

  const restored = installedSkills.filter((x) => x.commit && x.wasIgnored);
  if (restored.length) ok(`${restored.map((x) => x.name).join(", ")} no longer ignored - git add to commit`);

  ok("CLAUDE.md, AGENTS.md, CONTEXT.md and docs/ stay tracked - commit them");
} else if (globalMode) {
  head("Repo");
  ok("--global, so this folder was not touched at all");
}

// ── 6. Hand over ──────────────────────────────────────────────────────────

const setups = chosen.map((i) => i.setup).filter(Boolean);

// One slash command goes in as-is. Several need an instruction around them,
// because Claude Code only takes one prompt.
const prompt =
  setups.length === 1
    ? setups[0]
    : setups.length > 1
      ? `Run these setup skills in order, finishing each before starting the next: ${setups.join(", ")}.`
      : null;

if (pluginInstalled) {
  head("Note");
  console.log("  A Claude Code session already running needs a restart to see the new plugins.");
  console.log("  The one opened below picks them up on its own.");
}

if (noOpen) {
  head("Done");
  console.log(prompt ? `  Run this next:  claude "${prompt}"\n` : "  Nothing to run. Start Claude whenever.\n");
  process.exit(0);
}

head("Opening Claude");
console.log(prompt ? `  Running ${setups.join(" and ")}. Keep chatting from there; Ctrl-C to leave.\n` : "  No setup to run. Ctrl-C to leave.\n");

const r = runClaude(prompt ? [prompt] : []);
// A signal-killed child reports status null, which `?? 0` turned into success.
process.exit(r.status ?? (r.signal ? 1 : 0));
