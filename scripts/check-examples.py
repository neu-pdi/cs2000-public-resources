"""Check that the Python examples in the notes work, by running them with PLL.

Run from the repository root, with the PLL command line available:

    PLL="npx pll-python" python3 scripts/check-examples.py [options] [PAGE ...]

(PLL defaults to `npx pll-python`.) With no PAGEs, every page is checked:
the ones in days/, lab/, homework/, practice/, pll/, and src/pages/. Each problem is reported at its line in the page, e.g.

    days/5.md:212: Reassignment: `pens` is already assigned ...

and the exit status is 1 if there were any.

How a page becomes programs
---------------------------

A page's ```python blocks are put together, in order, into one program, the
way a student following along would build up a file:

- A block that defines a name (with `def`, `class`, `import`, `type`, or
  `name = ...`) that an earlier block already defined *replaces* the earlier
  definition: the block goes where that definition was, as if the student had
  edited it (with any functions it uses from further down moved up). The program as it was before the edit is checked first, so every
  version is run with what came before it. (Repeating an earlier definition
  exactly, like `from dataclasses import dataclass` at the top of a later
  block, adds nothing.)
- Anything else in a block (a call, a `print`, a `for` loop, `x = x + 1`) is
  added to the end; so is `name = ...` at `#level advanced`, where assigning
  to a name again is allowed.
- A function that doesn't do anything yet (its body has nothing but a
  docstring, `...`, and `pass`, or it's just the `def` line) is a stub: a
  step on the way to writing it, or (in an assignment) the function to write.
  Its tests are expected to fail until a later block writes it, and it
  doesn't replace a function that is already written.

A program passes if PLL runs it, including its `test_` functions, without an
error. A block can be marked, after `python` on its first line:

    ```python error    the block should fail (a level check, an exception,
                       or a failing test), to show what goes wrong; it is
                       checked that it does, here, and is then left out
    ```python skip     the block is not code to run (an outline with `...`
                       in it, a fragment of a larger function, a trace)

Code that the page needs but doesn't show (an exercise's answer, or data that
is only described) can go in a comment, which is run but not shown:

    <!-- python setup
    width = 40
    -->

(This repository is public, so for a function that an assignment asks for,
write a stand-in that lets the code after it run, not the answer.) A setup
that is just a `#level` line changes the level there without showing it.

In the page's front matter:

    pll_level: intermediate          the level its programs start at (the
                                     default is beginner); a block whose
                                     first line is a `#level` line changes it
                                     from there on
    pll_continues: days/13.md        start from what that page built (for
                                     "we continue with ... from Day 13")
    pll_files: voters.csv=static/support/10-voters.csv, ...
                                     files its programs load by name, rather
                                     than by URL, and the file to use for each

Options: -v also shows each `error` block's error, and PLL's whole output for
each problem; -j N runs N programs at once; --keep DIR leaves the programs in
DIR, to run them yourself.
"""

import argparse
import ast
import concurrent.futures
import glob
import itertools
import os
import re
import shlex
import shutil
import subprocess
import sys
import tempfile
import textwrap

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SECTIONS = ["days", "lab", "homework", "practice", "pll", os.path.join("src", "pages")]
PLL = shlex.split(os.environ.get("PLL", "npx pll-python"))
TIMEOUT = 180

BLOCK = re.compile(
    r"^[ \t]*```python(?P<info>[^\n]*)\n(?P<code>.*?)^[ \t]*```[ \t]*$"
    r"|^[ \t]*<!-- python setup\n(?P<setup>.*?)^[ \t]*-->",
    re.S | re.M)
LEVEL_LINE = re.compile(r"\A\s*#level (\w+)[ \t]*\n?")


class Unit:
    """One top-level statement of a block, with the comments just before it."""

    def __init__(self, lines, page_lines, block, stmt):
        self.lines = lines  # the source lines
        self.page_lines = page_lines  # the page line number of each one
        self.block = block
        self.dump = ast.dump(stmt)
        self.names = defined_names(stmt)
        self.assignment = isinstance(stmt, (ast.Assign, ast.AnnAssign))
        self.stub = is_stub(stmt)
        self.uses = {n.id for n in ast.walk(stmt) if isinstance(n, ast.Name)}
        # (whether it can be moved up the program without changing what it does)
        self.movable = isinstance(stmt, (ast.FunctionDef, ast.ClassDef, ast.Import, ast.ImportFrom))


def is_stub(stmt):
    """whether stmt is a function that doesn't do anything yet: its body has
    nothing but docstrings, `...`, and `pass` (possibly in the cases of a
    `match` or the branches of an `if`, for an outline of the function)"""
    def empty(body):
        return all(isinstance(s, ast.Pass)
                   or isinstance(s, ast.Expr) and isinstance(s.value, ast.Constant)
                   and (s.value.value is Ellipsis or isinstance(s.value.value, str))
                   or isinstance(s, ast.Match) and all(empty(c.body) for c in s.cases)
                   or isinstance(s, ast.If) and empty(s.body) and empty(s.orelse)
                   for s in body)
    return isinstance(stmt, ast.FunctionDef) and empty(stmt.body)


def defined_names(stmt):
    """the names stmt defines, if it's a definition that a later block could
    replace (and not an update, like `x = x + 1`)"""
    if isinstance(stmt, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
        return {stmt.name}
    if isinstance(stmt, (ast.Import, ast.ImportFrom)):
        return {(a.asname or a.name).split(".")[0] for a in stmt.names}
    if isinstance(stmt, ast.TypeAlias):
        return {stmt.name.id}
    if isinstance(stmt, ast.Assign):
        targets = stmt.targets
    elif isinstance(stmt, ast.AnnAssign) and stmt.value is not None:
        targets = [stmt.target]
    else:
        return set()
    names = set()
    for target in targets:
        if not all(isinstance(n, (ast.Name, ast.Tuple, ast.List, ast.Load, ast.Store))
                   for n in ast.walk(target)):
            return set()  # assigning to part of something, like d["k"] = v
        names |= {n.id for n in ast.walk(target) if isinstance(n, ast.Name)}
    used = {n.id for n in ast.walk(stmt.value) if isinstance(n, ast.Name)}
    return set() if names & used else names


class Block:
    def __init__(self, page, line, info, code):
        """line: the page line of the code's first line"""
        self.page = page
        words = info.split()
        self.error = "error" in words
        self.skip = "skip" in words
        self.level = None
        m = LEVEL_LINE.match(code)
        if m:
            self.level = m.group(1)
            line += code[:m.end()].count("\n")
            code = code[m.end():]
        self.code = code
        self.first_line = line

    def units(self):
        """the block's top-level statements (raises SyntaxError)"""
        try:
            tree = ast.parse(self.code)
        except SyntaxError as e:
            # a function's header on its own, to show what to write, is a stub
            if not e.msg.startswith("expected an indented block after function definition"):
                raise
            self.code = self.code.rstrip() + " ...\n"
            tree = ast.parse(self.code)
        lines = self.code.splitlines()
        units = []
        start = 0
        for n, stmt in enumerate(tree.body):
            end = stmt.end_lineno
            if n == len(tree.body) - 1:
                end = len(lines)
            units.append(Unit(lines[start:end],
                              [self.first_line + i for i in range(start, end)],
                              self, stmt))
            start = end
        return units


def read_page(page):
    with open(os.path.join(ROOT, page)) as f:
        text = f.read()
    front = {}
    m = re.match(r"---\n(.*?)\n---\n", text, re.S)
    if m:
        for line in m.group(1).splitlines():
            key, _, value = line.partition(":")
            front[key.strip()] = value.strip()
    blocks = []
    for m in BLOCK.finditer(text):
        line = text.count("\n", 0, m.start()) + 2
        if m.group("setup") is not None:
            blocks.append(Block(page, line, "setup", textwrap.dedent(m.group("setup"))))
        else:
            blocks.append(Block(page, line, m.group("info"), textwrap.dedent(m.group("code"))))
    return front, blocks


class Program:
    """A program being built up from a page's blocks."""

    def __init__(self, level, units=(), files=None):
        self.level = level
        self.units = list(units)
        self.files = dict(files or {})  # file name -> file in this repository

    def copy(self):
        return Program(self.level, self.units, self.files)

    def add(self, block):
        """adds block's statements; returns whether that replaced anything"""
        new, replaced = [], []
        for unit in block.units():
            if unit.assignment and self.level == "advanced":
                # (assigning to a name again is allowed, so it's just more code)
                new.append(unit)
                continue
            if unit.names and any(u.dump == unit.dump for u in self.units):
                continue
            old = [u for u in self.units if u.names & unit.names] if unit.names else []
            if unit.stub and any(not u.stub for u in old):
                continue  # (showing what a function written above looks like)
            replaced += [u for u in old if u is old[0] or u.names <= unit.names]
            new.append(unit)
        if not replaced:
            self.units += new
            return False
        # the whole block goes where the first thing it replaces was, so that
        # what came after that can use what the block defines; functions that
        # the block uses from further down move up with it
        at = min(self.units.index(u) for u in replaced)
        before = [u for u in self.units[:at] if u not in replaced]
        after = [u for u in self.units[at:] if u not in replaced]
        uses = set().union(*(u.uses for u in new))
        needed = [u for u in after if u.names & uses]
        if all(u.movable for u in needed):
            self.units = before + needed + new + [u for u in after if u not in needed]
        else:
            # (it can't go there, so it's assigning to a name again, which the
            # level may not allow)
            self.units += new
        return True

    def source(self):
        """the program's text, and the page line of each of its lines"""
        lines, where = ["#level " + self.level], [None]
        previous = None
        for unit in self.units:
            if previous is not None and unit.block is not previous:
                lines.append("")
                where.append(None)
            lines += unit.lines
            where += [(unit.block.page, n) for n in unit.page_lines]
            previous = unit.block
        return "\n".join(lines) + "\n", where


class Run:
    """One program to run, and what to expect."""

    def __init__(self, page, program, error_block=None):
        self.page = page
        self.text, self.where = program.source()
        self.files = program.files
        self.error_block = error_block
        self.before = None  # for an `error` block, the run of the code before it
        # the tests that use a stub (which are expected to fail)
        stubs = {name for u in program.units if u.stub for name in u.names}
        self.stub_tests = {name for u in program.units if u.uses & stubs
                           for name in u.names if name.startswith("test_")}
        self.name = None
        self.status = None
        self.output = ""
        self.printed = ""


def plan(page, programs_of):
    """the runs that check page, and the program it ends with"""
    front, blocks = read_page(page)
    runs, problems = [], []
    if "pll_continues" in front:
        before = front["pll_continues"]
        if before not in programs_of:
            programs_of[before] = plan(before, programs_of)[2]
        program = programs_of[before].copy()
        program.level = front.get("pll_level", program.level)
    else:
        program = Program(front.get("pll_level", "beginner"))
    for item in front.get("pll_files", "").split(","):
        if item.strip():
            name, _, source = item.partition("=")
            program.files[name.strip()] = source.strip()
    checked = True  # whether everything in program has been run
    last = None  # the run of program, once it has been run

    def checkpoint():
        nonlocal checked, last
        if not checked:
            last = Run(page, program)
            runs.append(last)
            checked = True

    for block in blocks:
        if block.skip:
            continue
        if block.level and block.level != program.level:
            checkpoint()
            program.level = block.level
        try:
            if block.error:
                checkpoint()
                attempt = program.copy()
                attempt.add(block)
                runs.append(Run(page, attempt, error_block=block))
                runs[-1].before = last if checked else None
                continue
            attempt = program.copy()
            if attempt.add(block):
                checkpoint()
            program = attempt
            checked, last = False, None
        except SyntaxError as e:
            if not block.error:
                problems.append("%s:%d: SyntaxError: %s" % (
                    page, block.first_line + (e.lineno or 1) - 1, e.msg))
            # (an `error` block with a syntax error has failed, as it should)
    checkpoint()
    return runs, problems, program


def run(r, work):
    # (each page's programs get a folder, for the files they use)
    work = os.path.join(work, re.sub(r"[^\w]+", "-", os.path.splitext(r.page)[0]).strip("-"))
    os.makedirs(work, exist_ok=True)
    for name, source in r.files.items():
        shutil.copyfile(os.path.join(ROOT, source), os.path.join(work, name))
    with open(os.path.join(work, r.name), "w") as f:
        f.write(r.text)
    try:
        p = subprocess.run(PLL + ["--no-color", r.name], cwd=work, stdin=subprocess.DEVNULL,
                           capture_output=True, text=True, timeout=TIMEOUT)
        # (PLL's own output, including errors, is on stderr; stdout is just
        # what the program printed)
        r.status, r.output, r.printed = p.returncode, p.stderr, p.stdout
    except subprocess.TimeoutExpired:
        r.status, r.output = "timeout", "(still running after %d seconds)" % TIMEOUT
    return r


def failed_tests(r):
    """the names of the tests that failed in run r"""
    return set(re.findall(r"^  (?:FAILED|ERROR) (test_\w+)", r.output, re.M))


def passed(r):
    """whether run r passed (apart from the tests of stubs, which can't yet)"""
    return r.status == 0 or r.status == 3 and failed_tests(r) <= r.stub_tests


def page_lines(r):
    """the page lines (page, line) that PLL's output mentions"""
    stem = re.escape(r.name)
    found = []
    for pattern in (stem + r":(\d+)", r'File "' + stem + r'", line (\d+)', r"\(line (\d+)\)"):
        for m in re.finditer(pattern, r.output):
            n = int(m.group(1))
            if 0 < n <= len(r.where) and r.where[n - 1]:
                found.append(r.where[n - 1])
    return found


ERROR_START = re.compile(r"Traceback \(most recent call last\):|[A-Z]\w+: |Static analysis found")


def summary(output, expected=()):
    """the parts of PLL's output that say what went wrong (and not, for
    example, the values the program showed, or the tests in expected)"""
    lines = [line for line in output.splitlines()
             if not re.match(r"(Loading|Loaded) |\S+\.py \[\w+\]$|  File \"<exec>\"", line)]
    keep = []
    # failing tests: from the "tests:" line, while lines are indented
    for n, line in enumerate(lines):
        if re.match(r"tests: .*(failed|errored)", line):
            keep.append(line)
            showing = False
            for l in itertools.takewhile(lambda l: l.startswith(" "), lines[n + 1:]):
                m = re.match(r"  (ok|FAILED|ERROR) +(\w+)", l)
                if m:
                    showing = m.group(1) != "ok" and m.group(2) not in expected
                if showing and not l.lstrip().startswith("- "):  # (not the advice)
                    keep.append(l)
    # an error or level check: the last one, without its "How to fix" advice
    starts = [n for n, line in enumerate(lines) if ERROR_START.match(line)]
    if starts:
        first = starts[-1]
        if lines[first].startswith("Static analysis found"):
            first = next((n for n in starts if not lines[n].startswith("Static")), first)
        advice = False
        for line in lines[first:]:
            if line.startswith("How to fix:"):
                advice = True
            elif advice and not line.startswith(" ") and line:
                advice = False
            if not advice and not line.startswith("Static analysis found"):
                keep.append(line)
    text = "\n".join(keep).strip()
    return re.sub(r"\n\n+", "\n", text)


def report(r, verbose):
    """what to say about run r (or ""), and whether it's a problem"""
    where = page_lines(r)
    if r.error_block is not None:
        block = r.error_block
        if r.before is not None and not passed(r.before):
            # (the code before the block fails, so its failure means nothing;
            # that problem is reported for the code before it)
            return "", False
        if r.status == "timeout":
            return "%s:%d: expected this block to fail, but it was %s" % (
                block.page, block.first_line, r.output), True
        if passed(r):
            return "%s:%d: expected this block to fail, but it ran without an error" % (
                block.page, block.first_line), True
        mine = [w for w in where if w[0] == block.page
                and block.first_line <= w[1] < block.first_line + block.code.count("\n") + 1]
        if r.status in (1, 2) and not mine:
            return "%s:%d: expected this block to fail, but the error was elsewhere:\n%s" % (
                block.page, block.first_line, indent(summary(r.output, r.stub_tests))), True
        if verbose:
            return "%s:%d: (fails, as expected)\n%s" % (
                block.page, block.first_line, indent(summary(r.output, r.stub_tests))), False
        return "", False
    if passed(r):
        return "", False
    page, line = where[0] if where else (r.page, 0)
    text = r.printed + r.output if verbose else summary(r.output, r.stub_tests)
    return "%s:%d: %s" % (page, line, text.strip() or "PLL exited with status %s" % r.status), True


def page_refs(r, text):
    """text, with the lines of r's program that it mentions changed to the
    lines of the pages they came from"""
    def at(n):
        n = int(n)
        if 0 < n <= len(r.where) and r.where[n - 1]:
            return "%s:%d" % r.where[n - 1]
        return "line %d of the program" % n
    stem = re.escape(r.name)
    text = re.sub(stem + r":(\d+)(:\d+)?", lambda m: at(m.group(1)), text)
    text = re.sub(r'File "' + stem + r'", line (\d+)', lambda m: at(m.group(1)), text)
    return re.sub(r"(on line|\(line) (\d+)", lambda m: m.group(1)[:-4] + at(m.group(2)), text)


def indent(text):
    return textwrap.indent(text, "    ")


def page_order(page):
    """for sorting pages, with days/9.md before days/10.md"""
    stem = os.path.splitext(os.path.basename(page))[0]
    section = os.path.dirname(page)
    return (SECTIONS.index(section) if section in SECTIONS else len(SECTIONS), section,
            not stem.isdigit(), int(stem) if stem.isdigit() else 0, stem)


def main():
    parser = argparse.ArgumentParser(description="Run the notes' Python examples with PLL.")
    parser.add_argument("pages", nargs="*", help="pages to check (default: all of them)")
    parser.add_argument("-v", "--verbose", action="store_true")
    parser.add_argument("-j", "--jobs", type=int, default=min(8, os.cpu_count() or 1))
    parser.add_argument("--keep", metavar="DIR", help="leave the programs in DIR")
    args = parser.parse_args()
    pages = [os.path.relpath(os.path.abspath(p), ROOT) for p in args.pages] or sorted(
        (os.path.relpath(p, ROOT) for section in SECTIONS
         for p in glob.glob(os.path.join(ROOT, section, "*.md"))),
        key=page_order)

    programs_of, runs, problems = {}, [], []
    for page in pages:
        page_runs, page_problems, programs_of[page] = plan(page, programs_of)
        stem = os.path.splitext(os.path.basename(page))[0]
        for n, r in enumerate(page_runs):
            r.name = "%s-%d.py" % (stem, n + 1)
        runs += page_runs
        problems += page_problems

    work = args.keep or tempfile.mkdtemp(prefix="check-examples-")
    os.makedirs(work, exist_ok=True)
    try:
        with concurrent.futures.ThreadPoolExecutor(args.jobs) as pool:
            done = list(pool.map(lambda r: run(r, work), runs))
    finally:
        if not args.keep:
            shutil.rmtree(work)

    notes = []
    for r in done:
        text, problem = report(r, args.verbose)
        text = page_refs(r, text)
        # (a problem in one program is often in later ones of the page too)
        if text and text not in problems + notes:
            (problems if problem else notes).append(text)
    for text in notes + problems:
        print(text + "\n")
    print("%d pages, %d programs: %s" % (
        len(pages), len(runs),
        "%d problem%s" % (len(problems), "" if len(problems) == 1 else "s") if problems
        else "all OK"))
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
