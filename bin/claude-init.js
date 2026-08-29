#!/usr/bin/env node
/**
 * claude-init - set up a repo for Claude Code with a known set of skills,
 * then hand you an open Claude session ready to run the per-repo setup.
 *
 * To add a skill:
 *   - local  : drop a folder with a SKILL.md into ../skills/ . Nothing else.
 *   - remote : add a line to REMOTE_SKILLS below.
 *   - plugin : add a line to PLUGINS below.
 */

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, copyFileSync, statSync } from "node:fs";
import { get } from "node:https";
import { homedir } from "node:os";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SKILLS_DIR = join(homedir(), ".claude", "skills");
const NET_TIMEOUT_MS = 15000;

// ── What gets installed ───────────────────────────────────────────────────

const PLUGINS = [
  { name: "mattpocock-skills@claude-plugins-official", label: "mattpocock-skills (35 skills)" },
];

const REMOTE_SKILLS = [
  {
    name: "no-ai-slop",
    url: "https://raw.githubusercontent.com/petergyang/no-ai-slop/main/skills/no-ai-slop/SKILL.md",
    label: "no-ai-slop (petergyang, MIT)",
  },
];

// Only genuinely machine-local files belong here.
//
// The docs the skills produce - CLAUDE.md, AGENTS.md, CONTEXT.md, docs/adr/,
// docs/agents/ - are shared project knowledge. Ignoring them means every clone
// silently loses the setup, which defeats the point of writing them down.
// Commit those.
const GITIGNORE_BLOCK = [
  "# --- claude-init ---",
  ".claude/settings.local.json",
  ".scratch/",
  "# --- end claude-init ---",
];
const GITIGNORE_MARKER = GITIGNORE_BLOCK[0];
const GITIGNORE_ENTRIES = GITIGNORE_BLOCK.filter((l) => !l.startsWith("#"));

const SETUP_PROMPT = "/setup-matt-pocock-skills";

// ── Output ────────────────────────────────────────────────────────────────

const useColor = process.stdout.isTTY && !process.env.NO_COLOR;
const c = (n, s) => (useColor ? `\x1b[${n}m${s}\x1b[0m` : s);
const ok = (m) => console.log(`  ${c(32, "+")} ${m}`);
const warn = (m) => console.log(`  ${c(33, "!")} ${m}`);
const die = (m) => { console.error(`  ${c(31, "x")} ${m}`); process.exit(1); };
const head = (m) => console.log(`\n${c(1, m)}`);

const HELP = `
  claude-init - install a known set of Claude Code skills, then open Claude
                ready to run ${SETUP_PROMPT}.

  Usage
    claude-init [options]

  Options
    -g, --git       git init first if this folder is not a repo yet
    -n, --no-open   install only, do not launch Claude
    -h, --help      this
    -v, --version   version

  Notes
    .gitignore gets a small block of machine-local paths when this folder is
    inside a git repo, or when -g created one. It is written at the repo root.
    Docs the skills produce (CLAUDE.md, AGENTS.md, CONTEXT.md, docs/adr/) are
    deliberately NOT ignored: commit them.
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
  console.error(HELP);
  process.exit(2);
}

const wantGit = has("-g", "--git");
const noOpen = has("-n", "--no-open");
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

// ── 1. Preflight ──────────────────────────────────────────────────────────

head("claude-init");

if (!detectClaude()) {
  die("`claude` is not on PATH. Install Claude Code: https://claude.com/claude-code");
}
ok(`Claude Code ${claudeVersion}`);
ok(`target: ${cwd}`);

// ── 2. Plugins ────────────────────────────────────────────────────────────

head("Plugins");
let pluginInstalled = false;
for (const p of PLUGINS) {
  const r = runClaude(["plugin", "install", p.name], { quiet: true });
  if (r.status === 0) {
    ok(p.label);
    pluginInstalled = true;
  } else {
    // Swallowing the real reason here made a failed install look like a shrug.
    const why = ((r.stderr || "") + (r.stdout || "")).trim().split("\n").pop() || "unknown error";
    warn(`${p.name}: ${why}`);
    warn(`  install by hand: claude plugin install ${p.name}`);
  }
}

// ── 3. Skills ─────────────────────────────────────────────────────────────

head("Skills");
mkdirSync(SKILLS_DIR, { recursive: true });

const localDir = join(ROOT, "skills");
const local = existsSync(localDir)
  ? readdirSync(localDir).filter((d) => {
      const f = join(localDir, d, "SKILL.md");
      return existsSync(f) && readFileSync(f, "utf8").startsWith("---");
    })
  : [];
for (const name of local) {
  const existed = existsSync(join(SKILLS_DIR, name));
  copyDir(join(localDir, name), join(SKILLS_DIR, name));
  ok(`${name} (bundled, ${existed ? "updated" : "installed"})`);
}

for (const s of REMOTE_SKILLS) {
  try {
    const body = await download(s.url);
    if (!body.startsWith("---")) throw new Error("not a SKILL.md");
    const existed = existsSync(join(SKILLS_DIR, s.name));
    mkdirSync(join(SKILLS_DIR, s.name), { recursive: true });
    writeFileSync(join(SKILLS_DIR, s.name, "SKILL.md"), body);
    ok(`${s.label}, ${existed ? "updated" : "installed"}`);
  } catch (e) {
    warn(`skipped ${s.name}: ${e.message}`);
  }
}

// ── 4. git ────────────────────────────────────────────────────────────────

head("Repo");

// existsSync(".git") misses a subdirectory of a repo, a worktree, and a
// submodule (where .git is a file). Ask git instead.
function repoRoot() {
  const inside = git(["rev-parse", "--is-inside-work-tree"]);
  if (inside.status !== 0 || (inside.stdout || "").trim() !== "true") return null;
  const top = git(["rev-parse", "--show-toplevel"]);
  return top.status === 0 ? top.stdout.trim() : null;
}

let root = repoRoot();

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

if (root) {
  const path = join(root, ".gitignore");
  const current = existsSync(path) ? readFileSync(path, "utf8") : "";
  if (current.includes(GITIGNORE_MARKER)) {
    ok(".gitignore already set");
  } else {
    // Match the file's own line endings instead of forcing LF into a CRLF file.
    const eol = current.includes("\r\n") ? "\r\n" : "\n";
    const pad = current === "" ? "" : (current.endsWith("\n") ? "" : eol) + eol;
    writeFileSync(path, current + pad + GITIGNORE_BLOCK.join(eol) + eol);
    const where = relative(cwd, path) || ".gitignore";
    ok(`.gitignore +${GITIGNORE_ENTRIES.length} entries (${where})`);
  }
  ok("CLAUDE.md, AGENTS.md, CONTEXT.md and docs/ stay tracked - commit them");
} else {
  ok("not a git repo, so no .gitignore written (use -g to create one)");
}

// ── 5. Hand over ──────────────────────────────────────────────────────────

if (pluginInstalled) {
  head("Note");
  console.log("  Restart Claude Code once so it picks up the new plugin.");
}

if (noOpen) {
  head("Done");
  console.log(`  Run this next:  claude ${SETUP_PROMPT}\n`);
  process.exit(0);
}

head("Opening Claude");
console.log(`  Running ${SETUP_PROMPT}. Keep chatting from there; Ctrl-C to leave.\n`);

const r = runClaude([SETUP_PROMPT]);
// A signal-killed child reports status null, which `?? 0` turned into success.
process.exit(r.status ?? (r.signal ? 1 : 0));
