---
sidebar_position: 2
title: Language levels
description: The #level line, and type annotation checking
---

# Language levels

The first line of your file (that is not blank) chooses how strict PLL is:

```python
#level beginner
```

Write it exactly like that, in lower case. After you run the file, the level is
shown in the interactions panel (for example `hello.py [beginner]`). The prompt
at the bottom of the interactions panel uses the same level as the last run.

| Line in your file | What it does |
| --- | --- |
| `#level beginner` | Strictest. PLL reports reassigning a variable (giving a name that already has a value a new one), reusing a name that hides another name (a built-in like `list` or `sum`, one of PLL's own like `circle`, or one of your own), and the `global` / `nonlocal` keywords. If it finds a problem, it **does not run** the file. Type annotations are checked as the program runs. |
| `#level intermediate` | The same, except that you **may** change the value of a variable _inside a function_ — which is what you need for `for` loops. Reassigning a variable at the top level of the file is still reported. Type annotations are checked. |
| `#level advanced` | No extra checks before the file runs, so `global`, `nonlocal`, and reassigning anything are allowed. Type annotations are still checked as the program runs, but by Python's own rules (so `True` counts as `1`). |
| `#level raw` | Nothing is checked: your program runs exactly as plain Python would. **This is what you get if you leave the line out.** |

In this class, we use `#level beginner` at first, then `#level intermediate`
once we start writing `for` loops, and `#level advanced` when we need `global`
or want to experiment with how Python's variables work. Each day's notes say
which level to use.

## Type annotations are checked as your program runs

If you write type annotations, PLL checks them while the program runs, and stops
with an explanation the moment a value does not match:

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
`1`, but a value that is really a yes/no answer should be annotated `bool`).
