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
 * An entry with a `setup` field is per-repo: it installs into the current repo
 * and runs that slash command in Claude Code once everything is installed.
 * Everything else installs globally, into ~/.claude, and drops out of the
 * picker once the global copy matches. Whether something has a setup is
 * decided here, not by the picker and not by the user.
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
    // Writes PRODUCT.md and DESIGN.md into the repo, so it is per-repo.
    setup: "/impeccable init",
  },
];

// Ticked in the picker unless named here. Nothing about an opt-in entry is
// worse, it is just not what I want everywhere by default: impeccable only
// earns its keep on frontend work, deslop-jupyter only for coursework,
// skill-creator is for the rare day I write a skill and it pulls in 11 sibling
// skills with it, windows-context-menu is a reference I reach for a few times
// a year, indie-game-doctor only for game work.
const DEFAULT_OFF = new Set([
  "impeccable",
  "deslop-jupyter",
  "indie-game-doctor",
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

// Only genuinely machine-local files belong here. Written only when a per-repo
// entry is installed into a git repo.
//
// The docs the setups produce - CLAUDE.md, AGENTS.md, CONTEXT.md, PRODUCT.md,
// docs/adr/, docs/agents/ - are shared project knowledge. Ignoring them means
// every clone silently loses the setup, which defeats the point of writing
// them down. Commit those.
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
    -h, --help      this
    -v, --version   version

  Picker
    up/down or j/k   move          space   toggle
    a                all / none    enter   install and go
    q or ctrl-c      quit, install nothing

    Most entries start ticked. Ones marked opt-in start unticked.
    Without a TTY (a pipe, CI) the picker is skipped and the defaults install.

  Where things land
    Entries with a per-repo setup (mattpocock-skills, impeccable) install at
    project scope in this repo, then their setup runs in Claude Code.

    Everything else installs globally: skills to ~/.claude/skills/, plugins at
    user scope. Once the global copy matches, it no longer shows in the picker.

    Pick nothing per-repo and this folder is not touched at all.

  Notes
    Docs the setups produce (CLAUDE.md, AGENTS.md, CONTEXT.md, PRODUCT.md,
    docs/adr/) are deliberately NOT ignored: commit them.
`;

// ── Args ──────────────────────────────────────────────────────────────────

const argv = process.argv.slice(2);
const FLAGS = new Set(["-g", "--git", "-n", "--no-open", "-h", "--help", "-v", "--version"]);
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
  if (unknown.includes("--global")) console.error("  --global is gone: anything without a per-repo setup installs globally on its own now.");
  console.error(HELP);
  process.exit(2);
}

const wantGit = has("-g", "--git");
const noOpen = has("-n", "--no-open");
const cwd = process.cwd();
const globalSkillsDir = join(homedir(), ".claude", "skills");

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

// True when every file under `from` exists under `to` with the same bytes.
// Extra files in `to` are ignored: copyDir never deletes, so counting them
// would make an up-to-date install look stale forever.
function sameDir(from, to) {
  if (!existsSync(to) || !statSync(to).isDirectory()) return false;
  return readdirSync(from).every((entry) => {
    const src = join(from, entry);
    const dst = join(to, entry);
    if (statSync(src).isDirectory()) return sameDir(src, dst);
    return existsSync(dst) && statSync(dst).isFile() && readFileSync(src).equals(readFileSync(dst));
  });
}

// Replaces the block in place if there is one, appends it otherwise, so the
// entries around it keep their position and the file does not grow every run.
// Returns how many entries the block holds.
function writeIgnoreBlock(path, entries) {
  const current = existsSync(path) ? readFileSync(path, "utf8") : "";
  const eol = current.includes("\r\n") ? "\r\n" : "\n";
  const lines = current === "" ? [] : current.split(/\r?\n/);
  const a = lines.indexOf(GITIGNORE_START);
  const b = lines.indexOf(GITIGNORE_END);
  const found = a !== -1 && b !== -1 && b >= a;

  // Older versions installed skills into the repo and could ignore them here.
  // Keep those lines, or a re-run would un-ignore a local copy.
  const previous = found ? lines.slice(a + 1, b).filter((l) => l.trim() && !l.startsWith("#")) : [];
  const kept = [...new Set([...entries, ...previous])];
  const block = [GITIGNORE_START, ...kept, GITIGNORE_END];

  let out;
  if (found) {
    out = [...lines.slice(0, a), ...block, ...lines.slice(b + 1)];
  } else {
    const pad = lines.length && lines[lines.length - 1].trim() !== "" ? [""] : [];
    out = [...lines, ...pad, ...block, ""];
  }
  writeFileSync(path, out.join(eol).replace(/(\r?\n)+$/, eol));
  return kept.length;
}

// ── 1. Preflight ──────────────────────────────────────────────────────────

head("claude-init");

if (!detectClaude()) {
  die("`claude` is not on PATH. Install Claude Code: https://claude.com/claude-code");
}
ok(`Claude Code ${claudeVersion}`);
ok(`target: ${cwd}`);

// ── 2. Catalogue ──────────────────────────────────────────────────────────

const localDir = join(ROOT, "skills");
const bundled = existsSync(localDir)
  ? readdirSync(localDir)
      .filter((d) => {
        const f = join(localDir, d, "SKILL.md");
        return existsSync(f) && readFileSync(f, "utf8").startsWith("---");
      })
      .map((name) => ({ kind: "local", group: "Bundled skills", name, label: name }))
  : [];

// Plugins already installed at user scope. If the list cannot be read, treat
// nothing as installed: showing one too many beats hiding a missing one.
const userPlugins = new Set();
try {
  const r = runClaude(["plugin", "list", "--json"], { quiet: true });
  for (const p of JSON.parse(r.stdout)) if (p.scope === "user") userPlugins.add(p.id);
} catch {
  warn("could not read the installed plugins, so all of them are listed");
}

// Fetched up front: "already installed" means the global copy matches
// upstream, and that takes the upstream body. The install step reuses it.
const remote = await Promise.all(
  REMOTE_SKILLS.map(async (s) => {
    try {
      const body = await download(s.url);
      if (!body.startsWith("---")) throw new Error("not a SKILL.md");
      return { ...s, body };
    } catch (e) {
      return { ...s, error: e.message };
    }
  }),
);

function isInstalled(i) {
  if (i.setup) return false; // per-repo: every repo needs its own
  if (i.kind === "plugin") return userPlugins.has(i.name);
  const dir = join(globalSkillsDir, i.name);
  if (i.kind === "local") return sameDir(join(localDir, i.name), dir);
  // Offline: a copy that is there beats nagging about one that cannot be checked.
  const f = join(dir, "SKILL.md");
  return existsSync(f) && (i.error !== undefined || readFileSync(f, "utf8") === i.body);
}

const everything = [
  ...PLUGINS.map((p) => ({ ...p, kind: "plugin", group: p.setup ? "This repo (runs a setup)" : "Plugins" })),
  ...bundled,
  ...remote.map((s) => ({ ...s, kind: "remote", group: "Downloaded skills" })),
];

const installed = everything.filter(isInstalled);
const catalogue = everything
  .filter((i) => !installed.includes(i))
  .map((i) => ({
    ...i,
    // A global copy that exists but differs is an update, and says so.
    about: i.kind !== "plugin" && existsSync(join(globalSkillsDir, i.name)) ? ["update", i.about].filter(Boolean).join(" - ") : i.about,
    optIn: DEFAULT_OFF.has(i.label),
    checked: !DEFAULT_OFF.has(i.label),
  }))
  // The entries that touch this folder go first.
  .sort((a, b) => Boolean(b.setup) - Boolean(a.setup));

if (installed.length) ok(`already installed globally: ${installed.map((i) => i.label).join(", ")}`);

// ── 3. Pick ───────────────────────────────────────────────────────────────

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

const perRepo = chosen.filter((i) => i.setup);

// ── 4. Repo ───────────────────────────────────────────────────────────────

// existsSync(".git") misses a subdirectory of a repo, a worktree, and a
// submodule (where .git is a file). Ask git instead.
function repoRoot() {
  const inside = git(["rev-parse", "--is-inside-work-tree"]);
  if (inside.status !== 0 || (inside.stdout || "").trim() !== "true") return null;
  const top = git(["rev-parse", "--show-toplevel"]);
  return top.status === 0 ? top.stdout.trim() : null;
}

// Only a per-repo entry has any business in this folder. Without one it is
// left completely untouched, -g included.
let root = null;

if (perRepo.length) {
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

  if (root) ok(`repo: ${root}`);
  else ok("not a git repo, so nothing will be gitignored (use -g to create one)");
} else if (wantGit) {
  warn("-g ignored: nothing per-repo was picked, so this folder is left alone");
}

// ── 5. Install ────────────────────────────────────────────────────────────

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
    // a clone gets it along with what the setup wrote.
    const scope = p.setup ? "project" : "user";
    const r = runClaude(["plugin", "install", p.name, "-y", "--scope", scope], { quiet: true });
    if (r.status === 0) {
      ok(`${p.label} (${scope === "user" ? "global" : "this repo"})  ${c(2, p.about)}`);
      pluginInstalled = true;
    } else {
      // Swallowing the real reason here made a failed install look like a shrug.
      const why = ((r.stderr || "") + (r.stdout || "")).trim().split("\n").pop() || "unknown error";
      warn(`${p.name}: ${why}`);
      warn(`  install by hand: claude plugin install ${p.name} --scope ${scope}`);
    }
  }
}

const skills = chosen.filter((i) => i.kind !== "plugin");

if (skills.length) {
  head(`Skills (global: ${globalSkillsDir})`);
  mkdirSync(globalSkillsDir, { recursive: true });

  for (const s of skills) {
    const dir = join(globalSkillsDir, s.name);
    const existed = existsSync(dir);
    if (s.kind === "local") {
      copyDir(join(localDir, s.name), dir);
    } else if (s.body) {
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, "SKILL.md"), s.body);
    } else {
      warn(`skipped ${s.name}: ${s.error}`);
      continue;
    }
    ok(`${s.label} (${existed ? "updated" : "installed"})`);
  }
}

// ── 6. gitignore ──────────────────────────────────────────────────────────

if (perRepo.length && root) {
  const path = join(root, ".gitignore");
  const n = writeIgnoreBlock(path, GITIGNORE_BASE);
  ok(`.gitignore ${n} entries (${relative(cwd, path) || ".gitignore"})`);
  ok("CLAUDE.md, AGENTS.md, CONTEXT.md, PRODUCT.md and docs/ stay tracked - commit them");
}

// ── 7. Hand over ──────────────────────────────────────────────────────────

const setups = perRepo.map((i) => i.setup);

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
