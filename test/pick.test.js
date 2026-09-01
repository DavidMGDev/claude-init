// node test/pick.test.js
//
// The picker only runs on a tty, and there is no tty in CI or in an agent
// shell, so drive it through a fake one.

import assert from "node:assert/strict";
import { EventEmitter } from "node:events";

import { pick } from "../bin/pick.js";

function fakeTty() {
  const stdin = new EventEmitter();
  stdin.setRawMode = () => {};
  stdin.resume = () => {};
  stdin.pause = () => {};
  const stdout = { columns: 80, written: [], write(s) { this.written.push(s); } };
  return { stdin, stdout, color: false };
}

const catalogue = () => [
  { group: "Plugins", label: "mattpocock-skills", about: "35 skills", checked: true, setup: "/setup-matt-pocock-skills" },
  { group: "Plugins", label: "ponytail", about: "/ponytail", checked: true },
  { group: "Bundled skills", label: "arena", checked: true },
];

// Keys arrive one chunk at a time, exactly as a terminal sends them.
async function drive(items, keys) {
  const io = fakeTty();
  const done = pick(items, io);
  for (const k of keys) io.stdin.emit("data", Buffer.from(k));
  return { chosen: await done, out: io.stdout.written.join("") };
}

const labels = (chosen) => chosen.map((i) => i.label);

// Frames are the writes that carry content; the cursor show/hide writes do not.
const frames = (io) => io.stdout.written.filter((s) => s.includes("\n"));

// ── selection ─────────────────────────────────────────────────────────────

// Enter with nothing touched takes whatever came in checked.
{
  const { chosen } = await drive(catalogue(), ["\r"]);
  assert.equal(chosen.length, 3);
}

// An item handed in unchecked stays unchecked. This is how opt-in entries
// reach the picker: claude-init decides, the picker just renders it.
{
  const items = catalogue();
  items[1].checked = false;
  const { chosen } = await drive(items, ["\r"]);
  assert.deepEqual(labels(chosen), ["mattpocock-skills", "arena"]);
}

// Space toggles the item under the cursor, and only that one.
{
  const { chosen } = await drive(catalogue(), [" ", "\r"]);
  assert.deepEqual(labels(chosen), ["ponytail", "arena"]);
}

// Down then space skips the first item instead.
{
  const { chosen } = await drive(catalogue(), ["\x1b[B", " ", "\r"]);
  assert.deepEqual(labels(chosen), ["mattpocock-skills", "arena"]);
}

// `a` clears everything when all are checked, and checks everything when not.
{
  const { chosen } = await drive(catalogue(), ["a", "\r"]);
  assert.equal(chosen.length, 0);
}
{
  const { chosen } = await drive(catalogue(), ["a", "a", "\r"]);
  assert.equal(chosen.length, 3);
}

// Up from the top wraps to the bottom rather than sticking or going negative.
{
  const { chosen } = await drive(catalogue(), ["\x1b[A", " ", "\r"]);
  assert.deepEqual(labels(chosen), ["mattpocock-skills", "ponytail"]);
}

// q and ctrl-c mean "install nothing", which is not the same as an empty
// selection: null tells the caller to bail out entirely.
for (const key of ["q", "Q", "\x03"]) {
  const { chosen } = await drive(catalogue(), [key]);
  assert.equal(chosen, null, `${JSON.stringify(key)} should abort`);
}

// ── key decoding ──────────────────────────────────────────────────────────

// A terminal is free to split an escape sequence across two reads. Decoded
// byte by byte that was ESC, then "[", then "A" - and since ESC used to quit
// and "A" toggles everything, one arrow press destroyed the picker.
{
  const { chosen } = await drive(catalogue(), ["\x1b", "[B", " ", "\r"]);
  assert.deepEqual(labels(chosen), ["mattpocock-skills", "arena"]);
}
{
  const { chosen } = await drive(catalogue(), ["\x1b[", "B", "\x1b", "[", "B", " ", "\r"]);
  assert.deepEqual(labels(chosen), ["mattpocock-skills", "ponytail"]);
}

// Holding an arrow down delivers several keypresses in one chunk.
{
  const { chosen } = await drive(catalogue(), ["\x1b[B\x1b[B", " ", "\r"]);
  assert.deepEqual(labels(chosen), ["mattpocock-skills", "ponytail"]);
}

// Application cursor mode sends SS3 arrows instead of CSI.
{
  const { chosen } = await drive(catalogue(), ["\x1bOB", " ", "\r"]);
  assert.deepEqual(labels(chosen), ["mattpocock-skills", "arena"]);
}

// Unhandled input - End, a bare ESC, a stray letter - must do nothing at all
// rather than move, toggle or quit.
{
  const { chosen } = await drive(catalogue(), ["\x1b[F", "\x1b", "z", " ", "\r"]);
  assert.deepEqual(labels(chosen), ["ponytail", "arena"]);
}

// ── redraw ────────────────────────────────────────────────────────────────

// An ignored key must not redraw either. An extra frame per keypress is half
// of what the flashing was.
{
  const io = fakeTty();
  const done = pick(catalogue(), io);
  const before = io.stdout.written.length;
  io.stdin.emit("data", Buffer.from("\x1b[F"));
  io.stdin.emit("data", Buffer.from("z"));
  assert.equal(io.stdout.written.length, before, "ignored keys must not redraw");
  io.stdin.emit("data", Buffer.from("\r"));
  await done;
}

// The other half was erase-then-draw: \x1b[0J blanked the list before the new
// one was written, so the terminal had a chance to paint an empty region in
// between. A frame must not open with a region erase, must clear each line as
// it rewrites it, and must go out in a single write.
{
  const io = fakeTty();
  const done = pick(catalogue(), io);
  io.stdin.emit("data", Buffer.from("\x1b[B"));
  io.stdin.emit("data", Buffer.from(" "));
  io.stdin.emit("data", Buffer.from("\r"));
  await done;

  for (const f of frames(io)) {
    assert.doesNotMatch(f, /^\x1b\[\d+A\x1b\[0J/, "frame must not erase before drawing");
    assert.match(f, /\x1b\[K/, "each line clears its own tail instead");
  }
  assert.equal(io.stdout.written.filter((s) => /^\x1b\[\d+A$/.test(s)).length, 0,
    "the cursor move must ride in the same write as the frame");
  assert.equal(frames(io).length, 3, "one frame on open, one per state change");
}

// Every redraw must move up by exactly what it last printed, or the list walks
// down the screen leaving copies of itself.
{
  const io = fakeTty();
  const done = pick(catalogue(), io);
  io.stdin.emit("data", Buffer.from("\x1b[B"));
  io.stdin.emit("data", Buffer.from(" "));
  io.stdin.emit("data", Buffer.from("\r"));
  await done;

  const f = frames(io);
  const ups = io.stdout.written.join("").match(/\x1b\[(\d+)A/g) || [];
  assert.equal(ups.length, f.length - 1, "every frame after the first redraws in place");
  for (const [i, up] of ups.entries()) {
    assert.equal(Number(up.match(/\d+/)[0]), (f[i].match(/\n/g) || []).length,
      "cursor-up count matches the rows the previous frame printed");
  }
}

// A label longer than the terminal cannot be allowed to wrap: a wrapped line
// is two rows, and the redraw above would then be off by one forever.
{
  const io = fakeTty();
  io.stdout.columns = 30;
  const done = pick([{ group: "G", label: "x".repeat(60), about: "y".repeat(60), checked: true }], io);
  io.stdin.emit("data", Buffer.from("\r"));
  await done;
  for (const line of io.stdout.written.join("").replace(/\x1b\[[0-9]*[KJ]/g, "").split("\n")) {
    assert.ok(line.length < 30, `line too long: ${line.length}`);
  }
}

// ── footer ────────────────────────────────────────────────────────────────

// The footer is the only place the user is told whether a setup will run, so
// it has to track the selection.
{
  const { out } = await drive(catalogue(), ["\r"]);
  assert.match(out, /then run \/setup-matt-pocock-skills in Claude Code/);
}
{
  // Deselect mattpocock, the only entry carrying a setup.
  const { out } = await drive(catalogue(), [" ", "\r"]);
  assert.match(out, /No setup will run in Claude Code/);
}

// Opt-in entries say so, so you can still tell which ones were off by default
// after toggling a few.
{
  const items = catalogue();
  items[1].optIn = true;
  items[1].checked = false;
  const { out } = await drive(items, ["\r"]);
  assert.match(out, /\[ \] ponytail {2}opt-in - \/ponytail/);
}

// A caller-supplied footer replaces the install one entirely, which is what
// lets the second pass ask "commit these?" over the same list instead of
// inheriting a count of things to install.
{
  const io = fakeTty();
  const items = catalogue();
  const footer = (n, all, c) => [[`  enter commit ${n} of ${all.length}, gitignore the rest`]];
  const done = pick(items, { ...io, footer });
  io.stdin.emit("data", Buffer.from(" "));
  io.stdin.emit("data", Buffer.from("\r"));
  await done;
  const out = io.stdout.written.join("");
  assert.match(out, /enter commit 2 of 3, gitignore the rest/);
  assert.doesNotMatch(out, /install/);
}

console.log("pick: all assertions passed");
