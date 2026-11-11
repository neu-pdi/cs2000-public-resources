---
sidebar_position: 0
class_number: 0
hide_table_of_contents: true
title: Style Guide
---

<Unreviewed />

## Style Guide

Programs are easier to read and to understand when they are written in a familiar style and follow standard coding conventions. Most organizations that develop software therefore require programmers to write programs that follow the organization’s preferred style and coding conventions.

Programs are generally written once, read many times, and edited over and over again. Style conventions help both you and any other programmer using your code to more easily understand what you were thinking when you wrote the code.

## Python Programs

The class notes follow these rules, and your programs should too.

### Names

- Functions, variables and parameters are lowercase words joined by
  underscores: `price_with_tax`, `total_minutes`.
- Dataclasses, and other types, are capitalized words run together:
  `LibraryBook`, `PhoneTree`.
- **Constants** are uppercase words joined by underscores: `TAX_RATE`, `WIDTH`,
  `BACKGROUND`. A constant is a name defined outside any function, for a value
  the program never changes, that its functions use: a rate, a size, a picture.
  Changing it is then a change to one line.

```python
TAX_RATE = 0.0625

def price_with_tax(price: float) -> float:
    """price, with sales tax added"""
    return price * (1 + TAX_RATE)
```

- An example of data, made to test functions with or to try at the prompt, is
  not a constant: `kindred = LibraryBook(205, "Kindred", 3)`.

### Spacing

- One space on each side of `=`, and of every operator, the same for all of
  them: `celsius * 9 / 5 + 32`, `x ** 2 + y ** 2`. Brackets, not spaces, show
  what is worked out first: `(f - 32) * 5 / 9`.
- One space after a comma, and after the colon of an annotation
  (`price: float`), and none before them.
- No space inside brackets, or between a function's name and its `(`:
  `rectangle(10, 20, "solid", "blue")`, `prices["boots"]`.
- No spaces around the `=` of a keyword argument:
  `order_by("hours", ascending=True)`.

### Layout

- Indent by four spaces (see [Whitespace Matters](/class/4#whitespace-matters)).
- One blank line between definitions: functions, dataclasses, and tests.
- Strings go in double quotes: `"solid"`.

### Functions, Tests, and Comments

- Every function has a Signature, with types, and a Docstring, as in the
  [design recipe](/class/recipe).
- A test is a function whose name starts with `test_`.
- A comment starts with `# `. What a function does goes in its Docstring; a
  comment says what the code can't, such as why.

Significant violations of this guide may count against you in the [Assignment Crit](/syllabus#assignment-crits) for that assignment.
