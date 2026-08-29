/**
 * A checkbox list on raw stdin. No dependency does this in fewer lines than it
 * takes to write, and this tool has none.
 *
 * Split out of claude-init.js only so it can be driven by a fake tty in
 * test/pick.test.js. There is no tty in CI and none in an agent shell.
 */

export function pick(items, { stdin = process.stdin, stdout = process.stdout, color = true } = {}) {
  const c = (n, s) => (color ? `\x1b[${n}m${s}\x1b[0m` : s);

  return new Promise((resolve) => {
    const groups = [...new Set(items.map((i) => i.group))];
    let cursor = 0;
    let drawn = 0;

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
          const body = `${it.label}${it.about ? "  " + it.about : ""}`.slice(0, Math.max(0, width - prefix.length));
          const label = body.slice(0, it.label.length);
          row(prefix + body, (i === cursor ? c(36, prefix) : prefix) + label + c(2, body.slice(it.label.length)));
        });
        row("");
      }

      const setups = items.filter((i) => i.checked && i.setup).map((i) => i.setup);
      const n = items.filter((i) => i.checked).length;
      row("  space toggle   a all/none   q quit", c(2, "  space toggle   a all/none   q quit"));
      if (setups.length) {
        const s = setups.join(" and ");
        row(`  enter install ${n}, then run ${s} in Claude Code`, `  ${c(1, "enter")} install ${n}, then run ${c(36, s)} in Claude Code`);
      } else {
        row(`  enter install ${n}. No setup will run in Claude Code, it just opens.`,
            `  ${c(1, "enter")} install ${n}. ${c(33, "No setup will run in Claude Code")}, it just opens.`);
      }
      return out;
    };

    const render = () => {
      const out = lines();
      // Redraw in place. Anything that changes the printed line count between
      // renders would leave debris here, so the layout is fixed.
      if (drawn) stdout.write(`\x1b[${drawn}A\x1b[0J`);
      stdout.write(out.join("\n") + "\n");
      drawn = out.length;
    };

    const done = (result) => {
      stdin.setRawMode(false);
      stdin.pause();
      stdin.removeListener("data", onKey);
      stdout.write("\x1b[?25h");
      resolve(result);
    };

    const onKey = (buf) => {
      const k = buf.toString();
      if (k === "\x03" || k === "q" || k === "\x1b") return done(null);
      if (k === "\x1b[A" || k === "k") cursor = (cursor - 1 + items.length) % items.length;
      else if (k === "\x1b[B" || k === "j") cursor = (cursor + 1) % items.length;
      else if (k === " ") items[cursor].checked = !items[cursor].checked;
      else if (k === "a" || k === "A") {
        const all = items.every((i) => i.checked);
        items.forEach((i) => (i.checked = !all));
      } else if (k === "\r" || k === "\n") return done(items.filter((i) => i.checked));
      else return;
      render();
    };

    stdout.write("\x1b[?25l");
    render();
    stdin.setRawMode(true);
    stdin.resume();
    stdin.on("data", onKey);
  });
}
