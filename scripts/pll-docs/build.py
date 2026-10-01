"""Build the PLL reference pages (pll/*.md) from their sources in this folder.

Each source page is ordinary Markdown, except that a code block whose info
string is `python example` is run through PLL, and what it produces is inserted
right after it: an image (written to static/img/pll/<page>/), a table, or the
value as text. A block whose info string is `python example error` is expected
to fail, and its error message is shown instead. The examples on a page run in
order, in one shared environment, so later examples can use what earlier ones
defined.

Run from the repository root, with the PLL command line on your path:

    PLL="npx pll-python" python3 scripts/pll-docs/build.py

(PLL defaults to `npx pll-python`.) Don't edit the generated pll/*.md pages
directly: edit the sources here, and rebuild.
"""

import html
import json
import os
import re
import shlex
import shutil
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
PAGES = ["images", "tables"]
PLL = shlex.split(os.environ.get("PLL", "npx pll-python"))

FENCE = re.compile(r"^```python example( error)?\n(.*?)^```\n", re.S | re.M)


def run_examples(examples):
    work = tempfile.mkdtemp(prefix="pll-docs-")
    try:
        # PLL loads packages (like pandas) by looking for imports in the file it
        # runs, which can't see inside the examples, so copy their imports in.
        imports = sorted({m.group(0).strip() for _, code in examples
                          for m in re.finditer(r"^\s*(import \w+|from \w+ import)", code, re.M)
                          if m.group(0).strip().startswith("import ")})
        with open(os.path.join(HERE, "harness.py")) as f:
            harness = f.read()
        level, rest = harness.split("\n", 1)
        with open(os.path.join(work, "harness.py"), "w") as f:
            f.write(level + "\n" + "".join(i + "  # for the examples\n" for i in imports) + rest)
        with open(os.path.join(work, "examples.json"), "w") as f:
            json.dump([{"code": code} for _, code in examples], f)
        subprocess.run(PLL + ["--no-tests", os.path.join(work, "harness.py")],
                       check=True, cwd=work, stdout=subprocess.DEVNULL)
        with open(os.path.join(work, "results.json")) as f:
            return json.load(f)
    finally:
        shutil.rmtree(work)


def markdown_table(columns, rows):
    def cell(text):
        return html.escape(text).replace("|", "\\|") if text != "" else "&nbsp;"
    lines = ["| " + " | ".join(cell(c) for c in columns) + " |",
             "| " + " | ".join("---" for _ in columns) + " |"]
    for row in rows:
        lines.append("| " + " | ".join(cell(v) for v in row) + " |")
    return "\n".join(lines)


def output_block(page, n, code, result, expect_error):
    parts = []
    if result["printed"]:
        parts.append("```text\n" + result["printed"].rstrip("\n") + "\n```")
    if expect_error:
        if not result["error"]:
            sys.exit("%s: example %d was expected to fail, but didn't:\n%s" % (page, n, code))
        parts.append("```text\n" + result["error"] + "\n```")
    elif result["error"]:
        sys.exit("%s: example %d failed (%s):\n%s" % (page, n, result["error"], code))
    value = result["value"]
    if value is not None:
        if value["kind"] == "image":
            name = "%d.svg" % n
            out_dir = os.path.join(ROOT, "static", "img", "pll", page)
            with open(os.path.join(out_dir, name), "w") as f:
                f.write(value["svg"])
            lines = [l.strip() for l in code.strip().split("\n")]
            shown = " ".join(lines) if len(lines) <= 4 and "def " not in code else lines[-1]
            alt = "Result of " + shown.replace("[", "(").replace("]", ")").replace('"', "'")
            parts.append("![%s](/img/pll/%s/%s)" % (alt, page, name))
        elif value["kind"] == "table":
            parts.append(markdown_table(value["columns"], value["rows"]))
        else:
            parts.append("```text\n" + value["text"] + "\n```")
    if not parts:
        return ""
    return '<div className="pll-output">\n\n' + "\n\n".join(parts) + "\n\n</div>\n"


def build(page):
    with open(os.path.join(HERE, page + ".md")) as f:
        source = f.read()
    matches = list(FENCE.finditer(source))
    examples = [(bool(m.group(1)), m.group(2)) for m in matches]
    results = run_examples(examples)
    out_dir = os.path.join(ROOT, "static", "img", "pll", page)
    shutil.rmtree(out_dir, ignore_errors=True)
    os.makedirs(out_dir)
    pieces = []
    last = 0
    for n, (m, (expect_error, code), result) in enumerate(zip(matches, examples, results)):
        pieces.append(source[last:m.start()])
        pieces.append("```python\n" + code + "```\n")
        out = output_block(page, n, code, result, expect_error)
        if out:
            pieces.append("\n" + out)
        last = m.end()
    pieces.append(source[last:])
    note = ("\n<!-- Generated by scripts/pll-docs/build.py from scripts/pll-docs/%s.md:"
            " edit that, not this. -->\n" % page)
    text = "".join(pieces)
    # put the note after the front matter
    end = text.index("\n---\n", 4) + len("\n---\n")
    text = text[:end] + note + text[end:]
    with open(os.path.join(ROOT, "pll", page + ".md"), "w") as f:
        f.write(text)
    print("built pll/%s.md (%d examples)" % (page, len(examples)))


if __name__ == "__main__":
    for page in sys.argv[1:] or PAGES:
        build(page)
