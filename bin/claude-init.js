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
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SKILLS_DIR = join(homedir(), ".claude", "skills");

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

// Files the Matt Pocock skills write into a repo. Ignored by default so the
// scaffolding does not land in someone else's diff. Delete what you want tracked.
const GITIGNORE_BLOCK = [
  "# --- claude-init: Matt Pocock skill scaffolding ---",
  "docs/agents/",
  "docs/adr/",
  "CONTEXT.md",
  "CONTEXT-MAP.md",
  "CLAUDE.md",
  "AGENTS.md",
  ".scratch/",
  ".claude/",
  "# --- end claude-init ---",
];
const GITIGNORE_MARKER = GITIGNORE_BLOCK[0];

const SETUP_PROMPT = "/setup-matt-pocock-skills";

// ── Output ────────────────────────────────────────────────────────────────

const useColor = process.stdout.isTTY && !process.env.NO_COLOR;
const c = (n, s) => (useColor ? `\x1b[${n}m${s}\x1b[0m` : s);
const ok = (m) => console.log(`  ${c(32, "+")} ${m}`);
const warn = (m) => console.log(`  ${c(33, "!")} ${m}`);
const die = (m) => { console.error(`  ${c(31, "x")} ${m}`); process.exit(1); };
const head = (m) => console.log(`\n${c(1, m)}`);

// ── Args ──────────────────────────────────────────────────────────────────

const argv = process.argv.slice(2);
const has = (...f) => f.some((x) => argv.includes(x));

if (has("-h", "--help")) {
  console.log(`
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
    .gitignore gets the Matt Pocock scaffolding entries when this folder is a
    git repo, or when -g created one. Without git, nothing is written.
`);
  process.exit(0);
}

if (has("-v", "--version")) {
  console.log(JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")).version);
  process.exit(0);
}

const wantGit = has("-g", "--git");
const noOpen = has("-n", "--no-open");
const cwd = process.cwd();

// ── Helpers ───────────────────────────────────────────────────────────────

// A native .exe spawns directly. An npm-installed `claude` is a .cmd shim,
// which Node refuses to spawn without a shell. Probe once rather than always
// paying for shell:true, which Node 24 warns about.
let SHELL = false;
function probeShell() {
  if (process.platform !== "win32") return false;
  const direct = spawnSync("claude", ["--version"], { stdio: "pipe", encoding: "utf8" });
  return direct.error !== undefined || direct.status !== 0;
}

function run(cmd, args, { quiet = false } = {}) {
  const r = spawnSync(cmd, args, {
    stdio: quiet ? "pipe" : "inherit",
    shell: SHELL,
    encoding: "utf8",
  });
  return r.status === 0;
}

// node:https, not fetch: undici keeps a pooled socket alive, and process.exit()
// while it is closing trips a libuv assert on Windows (0xC0000409).
function download(url, redirects = 3) {
  return new Promise((resolve, reject) => {
    get(url, (res) => {
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
    }).on("error", reject);
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

SHELL = probeShell();
const probe = spawnSync("claude", ["--version"], { stdio: "pipe", shell: SHELL, encoding: "utf8" });
if (probe.status !== 0) {
  die("`claude` is not on PATH. Install Claude Code: https://claude.com/claude-code");
}
ok(`Claude Code ${(probe.stdout || "").trim()}`);
ok(`target: ${cwd}`);

// ── 2. Plugins ────────────────────────────────────────────────────────────

head("Plugins");
for (const p of PLUGINS) {
  run("claude", ["plugin", "install", p.name], { quiet: true })
    ? ok(p.label)
    : warn(`could not install ${p.name} - run it by hand: claude plugin install ${p.name}`);
}

// ── 3. Skills ─────────────────────────────────────────────────────────────

head("Skills");
mkdirSync(SKILLS_DIR, { recursive: true });

const localDir = join(ROOT, "skills");
const local = existsSync(localDir)
  ? readdirSync(localDir).filter((d) => existsSync(join(localDir, d, "SKILL.md")))
  : [];
for (const name of local) {
  copyDir(join(localDir, name), join(SKILLS_DIR, name));
  ok(`${name} (bundled)`);
}

for (const s of REMOTE_SKILLS) {
  try {
    const body = await download(s.url);
    if (!body.startsWith("---")) throw new Error("not a SKILL.md");
    mkdirSync(join(SKILLS_DIR, s.name), { recursive: true });
    writeFileSync(join(SKILLS_DIR, s.name, "SKILL.md"), body);
    ok(s.label);
  } catch (e) {
    warn(`skipped ${s.name}: ${e.message}`);
  }
}

// ── 4. git ────────────────────────────────────────────────────────────────

head("Repo");
let isRepo = existsSync(join(cwd, ".git"));

if (wantGit && !isRepo) {
  if (run("git", ["init", "-q"], { quiet: true })) {
    isRepo = true;
    ok("git init");
  } else {
    warn("git init failed");
  }
} else if (wantGit && isRepo) {
  ok("already a git repo");
}

if (isRepo) {
  const path = join(cwd, ".gitignore");
  const current = existsSync(path) ? readFileSync(path, "utf8") : "";
  if (current.includes(GITIGNORE_MARKER)) {
    ok(".gitignore already set");
  } else {
    const sep = current === "" || current.endsWith("\n") ? "" : "\n";
    writeFileSync(path, current + sep + (current ? "\n" : "") + GITIGNORE_BLOCK.join("\n") + "\n");
    ok(`.gitignore +${GITIGNORE_BLOCK.length - 2} entries`);
  }
} else {
  ok("not a git repo, so no .gitignore written (use -g to create one)");
}

// ── 5. Hand over ──────────────────────────────────────────────────────────

if (noOpen) {
  head("Done");
  console.log(`  Run this next:  claude "${SETUP_PROMPT}"\n`);
  process.exit(0);
}

head("Opening Claude");
console.log(`  Running ${SETUP_PROMPT}. Keep chatting from there; Ctrl-C to leave.\n`);

const r = spawnSync("claude", [SETUP_PROMPT], { stdio: "inherit", shell: SHELL });
process.exit(r.status ?? 0);
