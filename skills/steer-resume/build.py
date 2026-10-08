"""Build a resume PDF from one JSON file and check it against the house rules.
Run: python build.py resume.json [--pages 2]   writes <out>.html and <out>.pdf beside the JSON
     python build.py --selftest
Exit code 1 when a check fails. Needs Edge or Chrome for the PDF, and pdftotext for the text checks."""
import html, json, pathlib, re, shutil, subprocess, sys, tempfile, time

# The approved look: single column, serif, roomy. A "css" key in the JSON is appended after this.
CSS = """@page{size:Letter;margin:0.55in 0.6in}
body{font-family:'Times New Roman',Times,serif;color:#000;margin:0;font-size:10.5pt;line-height:1.33}
h1{font-size:18pt;text-align:center;margin:0}
.t{text-align:center;margin:0 0 2px;font-style:italic}
.c{text-align:center;margin:0;font-size:9.8pt}
h2{font-size:10.5pt;text-transform:uppercase;letter-spacing:.8px;border-bottom:1px solid #000;padding-bottom:1px;margin:13px 0 5px;break-after:avoid}
.row{display:flex;justify-content:space-between;gap:12px;break-after:avoid}
.e{break-inside:avoid}.e+.e{margin-top:3px}.s{margin:0}
ul{margin:2px 0 7px;padding-left:16px}li{margin:1px 0}
.sk{list-style:none;padding-left:0}"""

esc = html.escape


def build_html(d):
    out = [f"<h1>{esc(d['name'])}</h1>"]
    if d.get("title"): out.append(f"<p class='t'>{esc(d['title'])}</p>")
    out += [f"<p class='c'>{esc(c)}</p>" for c in d["contact"]]
    out.append(f"<h2>Summary</h2><p class='s'>{esc(d['summary'])}</p>")
    for sec in d["sections"]:
        out.append(f"<h2>{esc(sec['head'])}</h2>")
        for e in sec["entries"]:
            name, _, stack = e["left"].partition(" | ")   # "Name | stack" renders the stack in italics
            out.append("<div class='e'><div class='row'><span><b>" + esc(name) + "</b>" +
                       (f" | <i>{esc(stack)}</i>" if stack else "") + f"</span><span>{esc(e.get('right', ''))}</span></div>")
            if e.get("sub_left") or e.get("sub_right"):
                out.append(f"<div class='row'><i>{esc(e.get('sub_left', ''))}</i><i>{esc(e.get('sub_right', ''))}</i></div>")
            b = e.get("bullets") or []
            out.append(("<ul>" + "".join(f"<li>{esc(x)}</li>" for x in b) + "</ul>" if b else "") + "</div>")
    for row in d.get("rows", []):
        body = "".join(f"<li>{esc(i)}</li>" if isinstance(i, str) else f"<li><b>{esc(i[0])}:</b> {esc(i[1])}</li>"
                       for i in row["items"])
        out.append(f"<h2>{esc(row['head'])}</h2><ul class='sk'>{body}</ul>")
    return (f"<!doctype html><html lang='en'><head><meta charset='utf-8'><title>{esc(d['name'])} - Resume</title>"
            f"<style>{CSS}{d.get('css', '')}</style></head><body>{''.join(out)}</body></html>")


def strings(x):
    if isinstance(x, str): yield x
    elif isinstance(x, list):
        for i in x: yield from strings(i)
    elif isinstance(x, dict):
        for k, v in x.items():
            if k not in ("never", "css", "out"): yield from strings(v)


def lint(d):
    """Checks on the source text. "never" is the private list of phrases that must not appear."""
    bad = []
    for s in strings(d):
        for ch, label in (("\u2014", "em dash"), ("\u2013", "en dash"), (";", "semicolon")):
            if ch in s: bad.append(f"{label}: {s[:70]}")
        for n in d.get("never", []):
            if n.lower() in s.lower(): bad.append(f"never-list '{n}': {s[:70]}")
        if re.search(r"\[[^\]]+\]", s): bad.append(f"unfilled gap: {s[:70]}")
    if re.search(r"\b(I|[Mm]y|me)\b", d.get("summary", "")): bad.append("first person in the summary")
    return bad


def browser():
    for c in ("msedge", "google-chrome", "chromium", "chromium-browser", "chrome"):
        if shutil.which(c): return shutil.which(c)
    for p in (r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
              r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
              r"C:\Program Files\Google\Chrome\Application\chrome.exe",
              "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
              "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"):
        if pathlib.Path(p).exists(): return p
    sys.exit("No Edge or Chrome found to print the PDF.")


def pdftext(pdf, mode):
    return subprocess.run(["pdftotext", mode, "-enc", "UTF-8", str(pdf), "-"], capture_output=True, check=True).stdout.decode("utf-8")


def check_pdf(pdf, d, pages):
    bad = []
    n = int(re.search(rb"/Type\s*/Pages\b.*?/Count\s+(\d+)", pdf.read_bytes(), re.S).group(1))
    if n != pages: bad.append(f"{n} pages, wanted {pages}")
    if not shutil.which("pdftotext"):
        print("pdftotext not found: skipped the reading-order, orphan and fill checks")
        return bad
    # What a parser sees first: the name alone, then the email within the next three lines.
    raw = [l.strip() for l in pdftext(pdf, "-raw").splitlines() if l.strip()]
    if raw[0] != d["name"]: bad.append(f"first line of the PDF text is '{raw[0]}', not the name")
    email = re.search(r"[\w.+-]+@[\w.-]+", " ".join(d["contact"]))
    if email and email.group() not in " ".join(raw[1:4]): bad.append("the email is not directly under the name")
    pg = [p.splitlines() for p in pdftext(pdf, "-layout").split("\f") if p.strip()]
    for i, lines in enumerate(pg, 1):
        for l in lines:
            t = l.strip()   # ponytail: a short last line counts as an orphan, so a real two-word line can trip this. Reword or ignore.
            if t and len(t) < 22 and len(t.split()) <= 2 and not t.isupper() and t != d["name"]:
                bad.append(f"orphan line on page {i}: '{t}'")
    last = lambda lines: max(i for i, l in enumerate(lines) if l.strip())
    if len(pg) > 1:
        fill = last(pg[-1]) / max(last(p) for p in pg[:-1])
        print(f"last page about {fill:.0%} full")
        if len(pg) == 2 and not 0.4 <= fill <= 0.75: bad.append(f"last page {fill:.0%} full, aim for half to two thirds")
    return bad


def selftest():
    d = {"name": "A B", "summary": "Builds things.", "never": ["Foo"], "contact": [],
         "sections": [{"head": "X", "entries": [{"left": "ok", "bullets": ["a; b", "x \u2014 y", "2020\u20132021", "about foo", "[GAP]"]}]}]}
    assert len(lint(d)) == 5, lint(d)
    d["sections"] = []
    assert lint(d) == [], lint(d)
    d["summary"] = "I build things."
    assert lint(d) == ["first person in the summary"]
    assert "<i>TypeScript</i>" in build_html({**d, "sections": [{"head": "P", "entries": [{"left": "App | TypeScript"}]}]})
    print("selftest ok")


if __name__ == "__main__":
    if "--selftest" in sys.argv: selftest(); sys.exit()
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    pages = int(sys.argv[sys.argv.index("--pages") + 1]) if "--pages" in sys.argv else 2
    if "--pages" in sys.argv: args.remove(str(pages))
    src = pathlib.Path(args[0]).resolve()
    d = json.loads(src.read_text(encoding="utf-8"))
    stem = d.get("out") or d["name"].replace(" ", "_") + "_Resume"
    page, pdf = src.parent / f"{stem}.html", src.parent / f"{stem}.pdf"
    page.write_text(build_html(d), encoding="utf-8")
    pdf.unlink(missing_ok=True)
    with tempfile.TemporaryDirectory(ignore_cleanup_errors=True) as prof:
        subprocess.run([browser(), "--headless", "--disable-gpu", "--no-pdf-header-footer",
                        f"--user-data-dir={prof}", f"--print-to-pdf={pdf}", page.as_uri()],
                       check=True, timeout=90, capture_output=True)
        for _ in range(60):   # the launcher can return before the PDF lands, and removing the profile early aborts it
            if pdf.exists() and pdf.stat().st_size: break
            time.sleep(0.5)
    bad = lint(d) + check_pdf(pdf, d, pages)
    print(pdf)
    print("\n".join("FIX " + b for b in bad) or "all checks pass")
    sys.exit(1 if bad else 0)
