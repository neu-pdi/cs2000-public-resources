---
title: Language Levels
id: levels
description: The #level line in PLL, and which level to use when
hide_table_of_contents: false
---

# Language Levels

We write Python with the **Python Language Levels** (PLL) extension. The first
line of your file chooses how much PLL checks for you:

```python
#level intermediate
```

Write it exactly like that, in lower case, as the first line of the file (blank
lines above it are fine). After you run the file, the interactions panel shows
the level next to the file name, like `25.py [intermediate]`.

:::warning[A file with no `#level` line is not checked]

If you leave the line out, your file runs at `raw`, which means **none** of
PLL's checks happen -- it is just ordinary Python. That is rarely what you
want in this course, and it is easy to do by accident in a new file. If PLL
isn't catching mistakes you expected it to catch, look at the first line.

:::

## In this course

| From | Use | Why |
| -- | -- | -- |
| [Day 24](/days/24) | `#level intermediate` | What we want for most Python work: you can build up a value in a loop, and PLL still catches the common mistakes. |
| [Day 27](/days/27) | `#level advanced` | Needed for `global`, for reassigning a name at the top level of a file, and (from [Day 28](/days/28)) for changing a list, dictionary, or dataclass in place. |

Each day's notes say which level to use. When a day needs `advanced`, it is
because the point of that day is something the stricter levels deliberately
refuse.

## The levels

| Level | What it does |
| -- | -- |
| `#level beginner` | Strictest. Reports giving a name a second value, reusing a name that already means something (a built-in like `list`, or one of PLL's own like `circle`), `global` and `nonlocal`, `del` of a name, and changing a list, dictionary, or dataclass in place. Also catches a name used where it has no value, and some code that runs but cannot be what you meant. If it finds a problem, the file **does not run**. Type annotations are checked as the program runs. |
| `#level intermediate` | The same, except you **may** give a name a new value _inside a function_ -- which is what a `for` loop accumulator needs (`run_total = run_total + num`). Reassigning at the top level of the file is still reported. |
| `#level advanced` | Only checks for a name used where it has no value. Reassigning, `global`, `nonlocal`, and changing values in place are all allowed. Type annotations are still checked, but by Python's own rules. |
| `#level raw` | Nothing is checked: plain Python. **This is what you get if you leave the line out.** |

We do not use `beginner` in this course: you arrive at Python already knowing
loops and accumulators from Pyret, which is what `intermediate` allows.

## Things that surprise people

At `beginner` and `intermediate`, every file already has `dataclass`, so you do
**not** import it. Writing `from dataclasses import dataclass` is reported as
reusing a name PLL already provides; just delete the import and use
`@dataclass` directly.

Also at those levels, changing a value in place is refused, and the message
tells you what to write instead:

```python
#level intermediate

d = {"a": 1}
d["b"] = 2
```

> `d["b"] = 2` changes a dictionary in place, which is not allowed at
> `#level intermediate`.
>
> - `d | {"b": 2}` is a new dictionary with it changed.
> - Python allows changing a dictionary in place, and so does `#level advanced`.

Building a new value rather than changing the old one is the habit these levels
are encouraging; `advanced` is there for the days where changing it is the
whole point.
