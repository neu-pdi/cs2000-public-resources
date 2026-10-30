# Examplar bundles for the class notes

Each directory here is the source of one bundle in `static/examplar/`, which a
class page links to with an `#examplar` line:

| Source | Bundle | Used in |
| --- | --- | --- |
| `class5-choose-hat/` | `static/examplar/class5-choose-hat.json` | Class 5 |
| `class10-apply-discounts/` | `static/examplar/class10-apply-discounts.json` | Class 10 |
| `class23-has-blueberry/` | `static/examplar/class23-has-blueberry.json` | Class 23 |

The pages link to the copy on `main` on GitHub, as they do for the support
CSVs, so a bundle only works from the notes once it is pushed there.

These sources are public, since this repository is. That's only fine because
each function's solution is already in the notes. Keep homework bundles in
the staff repository.

## Layout

```
wheats/reference.py           known correct
wheats/alternative.py         also correct, written differently
chaffs/<function>/1.py, ...   known incorrect, one bug each
staff_tests.py                our own tests, for --verify
```

- No `#level` lines. The bundle's code runs in the student's file, so a
  function can use the student's data definitions (`Plate`, in
  `class23-has-blueberry`) and PLL's libraries (`table`, in
  `class10-apply-discounts`).
- `staff_tests.py` runs without a level, so it has to import what a level
  would give it: `from dataclasses import dataclass`.
- A chaff's id is its number, and a student who misses one sees only that
  number, so the comment at the top of each file is the only place that says
  what the bug is.
- A wheat has to give exactly the same floats as the expected values in the
  tests (`50 * 0.8`), since students' tests compare with `==`.

## Rebuilding

From the repository root, with PLL's command line (`npx pll-python`, or
`node <pll>/dist-cli/cli.cjs`):

```bash
npx pll-python examplar build scripts/examplar/class10-apply-discounts -o static/examplar/class10-apply-discounts.json --verify scripts/examplar/class10-apply-discounts/staff_tests.py
```

`--verify` checks that the staff tests pass on every wheat and fail on every
chaff, and writes nothing if they don't. A bundle holds bytecode for one
Python version (the build prints it: `built for Python 3.13.2`), so rebuild
them all if PLL moves to a new one.

The cards shown in the notes were copied from real runs. If you change a
bundle, run the page's example against it again and update the card: serve the
bundle with PLL's `samples/examplar_serve.mjs`, and point the `#examplar` line
at the address it prints.
