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

// Enter with nothing touched takes everything.
{
  const { chosen } = await drive(catalogue(), ["\r"]);
  assert.equal(chosen.length, 3);
}

// Space toggles the item under the cursor, and only that one.
{
  const { chosen } = await drive(catalogue(), [" ", "\r"]);
  assert.deepEqual(chosen.map((i) => i.label), ["ponytail", "arena"]);
}

// Down then space skips the first item instead.
{
  const { chosen } = await drive(catalogue(), ["\x1b[B", " ", "\r"]);
  assert.deepEqual(chosen.map((i) => i.label), ["mattpocock-skills", "arena"]);
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
  assert.deepEqual(chosen.map((i) => i.label), ["mattpocock-skills", "ponytail"]);
}

// q, esc and ctrl-c all mean "install nothing", which is not the same as an
// empty selection: null tells the caller to bail out entirely.
for (const key of ["q", "\x1b", "\x03"]) {
  const { chosen } = await drive(catalogue(), [key]);
  assert.equal(chosen, null, `${JSON.stringify(key)} should abort`);
}

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

// Every redraw must move up by exactly what it last printed, or the list
// walks down the screen leaving copies of itself.
{
  const io = fakeTty();
  const done = pick(catalogue(), io);
  io.stdin.emit("data", Buffer.from("\x1b[B"));
  io.stdin.emit("data", Buffer.from("\r"));
  await done;
  const frames = io.stdout.written.filter((s) => s.includes("\n"));
  const ups = io.stdout.written.join("").match(/\x1b\[(\d+)A/g) || [];
  assert.equal(ups.length, frames.length - 1, "every frame after the first redraws in place");
  for (const [i, up] of ups.entries()) {
    const n = Number(up.match(/\d+/)[0]);
    assert.equal(n, frames[i].split("\n").length - 1, "cursor-up count matches the previous frame");
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
  for (const line of io.stdout.written.join("").split("\n")) {
    assert.ok(line.length < 30, `line too long: ${line.length}`);
  }
}

console.log("pick: all assertions passed");
