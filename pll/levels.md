---
sidebar_position: 2
title: Language levels
description: The #level line, the checks it turns on, and type annotation checking
---

# Language levels

The first line of your file (that is not blank) chooses how strict PLL is:

```python
#level beginner
```

Write it exactly like that, in lower case. A `#level` line that does not name a
level (`#level begginer`, `#level Beginner`, or `#level` on its own), or one that
is not the first line, is reported, and the file does not run. A file with **no**
`#level` line runs as ordinary Python.

The interactions panel's header shows the level (for example
`hello.py [beginner]`). The prompt at the bottom of the panel uses the same level
as the last run, or, before the file has run, the level its `#level` line names.

| Line in your file | What it does |
| --- | --- |
| `#level beginner` | Strictest. PLL reports reassigning a variable (giving a name that already has a value a new one), reusing a name that hides another name (a built-in like `list` or `sum`, one of PLL's own like `circle`, or one of your own), the `global` / `nonlocal` keywords, removing a name with `del` (as in `del x`; taking an item out of a list or dictionary, as in `del items[0]` or `del d[key]`, is fine), and the [mistakes listed below](#mistakes-found-before-the-file-runs). If it finds a problem, it **does not run** the file. Type annotations are checked as the program runs. |
| `#level intermediate` | The same, except that you **may** change the value of a variable _inside a function_ — which is what you need for `for` loops. Reassigning a variable at the top level of the file is still reported. Type annotations are checked. |
| `#level advanced` | Reassigning, hiding names, `global`, `nonlocal` and `del` are all allowed. PLL still looks, before the file runs, for a [name used where it has no value](#names-without-a-value). Type annotations are still checked as the program runs, but by Python's own rules (so `True` counts as `1`). |
| `#level raw` | Nothing is checked, and a value on a line of its own is not shown: your program runs exactly as plain Python would, with PLL's images and tables still available. **This is what you get if you leave the line out.** |

In this class, we use `#level beginner` at first, then `#level intermediate`
once we start writing `for` loops, and `#level advanced` when we need `global`
or want to experiment with how Python's variables work. Each class's notes say
which level to use.

## The `#level` line in the editor

PLL keeps a file's `#level` line where it is, so that it isn't lost by accident.
The line is tinted, and above it **🔒 Level: beginner · change** opens a list of
the levels, where you can also remove the line. The status bar shows the level
too (**PLL: beginner**, or **PLL: raw** for a file with no line), and clicking it
opens the same list; so does **PLL: Change Level** in the Command Palette, which
also gives a file with no line one.

Editing the line itself does nothing to it. Typing on it puts what you typed on
the line below, and deleting it puts it back. **Select All** selects everything
below it, so Select All and Delete empties the file but keeps the line. Pasting
in a whole program that has its own `#level` line gives the file that program's
level.

In this class's repositories, a new `.py` file starts with `#level beginner`
already written in.

## Names without a value

At every level except `raw`, PLL looks, before the file runs, for a name used
where it has no value: a misspelling, a function called above its `def`, a
variable used before it is set, or a call that runs a function before a name the
function uses is set. Python would stop there with a `NameError`; PLL says so, in
the same way, without running the file.

```python error
#level beginner

print(greeting)
greeting = "hello"
```

> `greeting` is defined on line 4, after this line.

## Mistakes found before the file runs

At `#level beginner` and `#level intermediate`, PLL also finds these mistakes,
and does not run the file:

- a value worked out and then thrown away, like a line `x + 1` on its own inside
  a function (did you mean `return x + 1`?), or a comparison in a test written
  without `assert`;
- `assert(x, 1)`, which checks a pair, and a pair is always true;
- a function annotated to return something, with no `return` in it;
- `is` used to compare with a number or a string (`x is 60.5`), where `==` is
  meant;
- an annotation that is not a type: `t: table` (`table` is the function that
  makes tables; the type is `Table`), or `name: string` (write `str`);
- a dataclass field with no type, or written `year = int` rather than
  `year: int`, and a class with fields but no `@dataclass` above it;
- comparing a value with a class, as in `a == Boa`, which is always `False` (use
  `match` to tell the kinds of data apart);
- a `case` naming a class the program does not have.

```python error
#level beginner

def area(r: float) -> float:
    """area of a circle of radius r"""
    result = 3.14 * r * r
```

> `area` should return a number (`float`), but it has no `return`, so it always
> gives back `None`.

These are warnings: PLL points them out, and still runs the file:

- a method named but not called, like `movies["rating"].mean` (rather than
  `.mean()`);
- a function with an `assert` in it that nothing ever runs, such as a test whose
  name does not start with `test_`;
- a `case` for a class that the value's annotation never allows, so that it can
  never match.

## Files that import other files

A file keeps its own level when another file imports it. If `main.py` does
`from helper import half`, and `helper.py` starts with `#level beginner`, then
`helper.py` is checked as a beginner file, whatever level `main.py` has: if the
checks find a problem in it, the import stops with a `ChecksFailed` error that
lists each problem, and its annotations are checked as it runs.

## Type annotations are checked as your program runs

If you write type annotations, PLL checks them while the program runs (at every
level except `raw`), and stops with an explanation the moment a value does not
match:

```python error
#level beginner

def book_cost(num_books: int, hardcover: bool) -> float:
    """each paperback costs $12, while hardcover costs $25"""
    if hardcover:
        return num_books * 25
    else:
        return num_books * 12

book_cost("three", True)
```

> `book_cost` expects `num_books` to be a whole number (`int`), but got a
> string (`str`).

What is checked:

- the arguments you pass to a function, when you call it
- the value a function returns, including a function that ends without
  returning anything when it says it returns something
- variables you annotate, like `total: int = 0`
- every item in an annotated `list`, `dict`, `set`, or `tuple`

Functions without annotations are left alone. A whole number (`int`) is
accepted wherever a `float` is expected, as in normal Python.

At `#level beginner` and `#level intermediate`, `True` and `False` are **not**
accepted where `int` or `float` is annotated (Python itself counts `True` as
`1`, but a value that is really a yes/no answer should be annotated `bool`), and
they are not numbers to a [table](/pll/tables) either.
