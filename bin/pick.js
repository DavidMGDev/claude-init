/**
 * A checkbox list on raw stdin. No dependency does this in fewer lines than it
 * takes to write, and this tool has none.
 *
 * Split out of claude-init.js only so it can be driven by a fake tty in
 * test/pick.test.js. There is no tty in CI and none in an agent shell.
 */

// One keypress: a CSI sequence (arrows, home, F-keys), an SS3 sequence (arrows
// again, in application cursor mode), or a single character.
const KEY = /^(?:\x1b\[[0-9;]*[A-Za-z~]|\x1bO[A-Za-z]|[\s\S])/;

// The same sequences while still arriving, with the final byte missing.
const PARTIAL = /^\x1b(?:\[[0-9;]*|O)?$/;

// The default footer, kept out of pick() so a second pass can ask a different
// question over the same list without inheriting "install N".
function installFooter(n, items, c) {
  const setups = items.filter((i) => i.checked && i.setup).map((i) => i.setup);
  if (setups.length) {
    const s = setups.join(" and ");
    return [[`  enter install ${n}, then run ${s} in Claude Code`, `  ${c(1, "enter")} install ${n}, then run ${c(36, s)} in Claude Code`]];
  }
  return [[
    `  enter install ${n}. No setup will run in Claude Code, it just opens.`,
    `  ${c(1, "enter")} install ${n}. ${c(33, "No setup will run in Claude Code")}, it just opens.`,
  ]];
}

export function pick(items, { stdin = process.stdin, stdout = process.stdout, color = true, footer } = {}) {
  const c = (n, s) => (color ? `\x1b[${n}m${s}\x1b[0m` : s);

  return new Promise((resolve) => {
    const groups = [...new Set(items.map((i) => i.group))];
    let cursor = 0;
    let drawn = 0;
    let pending = "";

    const lines = () => {
      const out = [];
      const width = (stdout.columns || 80) - 1;

      // Every line goes through here. One line wider than the terminal wraps
      // into two rows, and the redraw below would then be off by one for the
      // rest of the session, so nothing is allowed to exceed the width. The
      // length has to be measured on the plain text: escape codes take no
      // columns. Colour is dropped rather than sliced through, since cutting
      // mid-escape prints garbage.
      const row = (plain, colored = plain) => out.push(plain.length <= width ? colored : plain.slice(0, width));

      row("");
      for (const g of groups) {
        row(`  ${g}`, c(2, `  ${g}`));
        items.forEach((it, i) => {
          if (it.group !== g) return;
          const prefix = `  ${i === cursor ? ">" : " "} ${it.checked ? "[x]" : "[ ]"} `;
          // Say which entries are off by default. The checkbox alone stops
          // telling you that the moment you toggle one.
          const note = it.optIn ? ["opt-in", it.about].filter(Boolean).join(" - ") : it.about;
          const body = `${it.label}${note ? "  " + note : ""}`.slice(0, Math.max(0, width - prefix.length));
          const label = body.slice(0, it.label.length);
          row(prefix + body, (i === cursor ? c(36, prefix) : prefix) + label + c(2, body.slice(it.label.length)));
        });
        row("");
      }

      const n = items.filter((i) => i.checked).length;
      row("  space toggle   a all/none   q quit", c(2, "  space toggle   a all/none   q quit"));
      for (const [plain, colored] of footer ? footer(n, items, c) : installFooter(n, items, c)) row(plain, colored);
      return out;
    };

    const render = () => {
      const out = lines();
      // Draw over the old frame instead of erasing it first. Blanking the
      // region and then filling it is two states on screen, and at 60Hz that
      // reads as a flash on every keypress. \x1b[K wipes each line's tail as
      // that line is rewritten, so there is never a blank moment, and the
      // trailing \x1b[0J only clears rows a shorter frame left behind.
      //
      // It all goes out in one write() for the same reason: two writes is two
      // frames, and the terminal is free to paint between them.
      const frame = out.map((l) => l + "\x1b[K").join("\n") + "\n\x1b[0J";
      stdout.write((drawn ? `\x1b[${drawn}A` : "") + frame);
      drawn = out.length;
    };

    const done = (result) => {
      stdin.setRawMode(false);
      stdin.pause();
      stdin.removeListener("data", onKey);
      stdout.write("\x1b[?25h");
      resolve(result);
    };

    const onKey = (chunk) => {
      pending += chunk.toString();
      let dirty = false;

      // A chunk can carry several keypresses (hold an arrow down), and a
      // terminal is free to split one escape sequence across two chunks.
      // Reading byte by byte turned a split arrow into ESC, then "[", then
      // "A" - which quit the picker and toggled everything on the way out.
      while (pending) {
        if (PARTIAL.test(pending)) break;
        const key = pending.match(KEY)[0];
        pending = pending.slice(key.length);

        // ESC is deliberately not a quit key: it is the first byte of every
        // arrow, so a slow terminal would quit instead of moving the cursor.
        if (key === "\x03" || key === "q" || key === "Q") return done(null);
        if (key === "\r" || key === "\n") return done(items.filter((i) => i.checked));

        if (key === "\x1b[A" || key === "\x1bOA" || key === "k") cursor = (cursor - 1 + items.length) % items.length;
        else if (key === "\x1b[B" || key === "\x1bOB" || key === "j") cursor = (cursor + 1) % items.length;
        else if (key === " ") items[cursor].checked = !items[cursor].checked;
        else if (key === "a" || key === "A") {
          const all = items.every((i) => i.checked);
          items.forEach((i) => (i.checked = !all));
        } else continue;
        dirty = true;
      }

      if (dirty) render();
    };

    stdout.write("\x1b[?25l");
    render();
    stdin.setRawMode(true);
    stdin.resume();
    stdin.on("data", onKey);
  });
}
