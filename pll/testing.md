---
sidebar_position: 3
title: Tests
description: Writing tests with test_ functions and assert
---

# Tests

You put tests in the **same file** as the code they check. A test is a
function whose name starts with `test_`, and that uses `assert` to check that
something is `True`. We write one test function right after each function we
design, with several `assert`s in it:

```python
def add(x: int, y: int) -> int:
    """adds x and y"""
    return x + y

def test_add():
    assert add(2, 3) == 5
    assert add(-1, 1) == 0
```

When you click **PLL: Run Python File**, PLL runs the tests first, and shows a
card in the interactions panel with which tests passed and which failed. If a
test fails, you can click it to jump to that test. Anything the test printed is
shown with it. After the tests, PLL still runs the rest of the file, so you can
use your functions at the prompt.

A test function stops at its first `assert` that fails, so the `assert`s after
that one aren't checked until you fix it.

To check that a function returns `True` or `False`, `assert` its result directly, or use `assert not`:

```python
def test_is_even():
    assert is_even(4)
    assert not is_even(3)
```

You do not need a separate test file, and you do not need to run `pytest` in a
terminal.

## Numbers that are only approximately right

Calculations with decimal (`float`) numbers often have tiny errors, so checking
them with `==` can fail even when your code is right. Import `pytest` and use
`pytest.approx`, which checks that a number is _very close_ to what you expect:

```python
import pytest

def test_cost():
    assert 0.1 + 0.2 == pytest.approx(0.3)
```

You can also say how close it has to be, with `abs=`. This checks that the
answer is between `0.9` and `1.1`:

```python
    assert distance(...) == pytest.approx(1, abs=0.1)
```

## Checking that code causes an error

To test that some code causes an error, put it under `with pytest.raises(...)`,
giving the kind of error you expect:

```python
import pytest

def test_first_letter():
    with pytest.raises(IndexError):
        first_letter("")
    assert first_letter("hello") == "h"
```

## Testing tables

Two tables are `==` when they have the same columns, in the same order, holding
the same values, in the same order. So you can test a function that produces a
table by comparing its result with the table you expect — see
[Tables](/pll/tables#comparing-tables).

## Checking your tests against the course's code

Some assignments give you a line to put at the top of your file, like:

```python
#examplar https://example.edu/hw3.json
```

With that line, every run also runs your tests against implementations written by
the course: some known to be correct, and some known to contain a bug. For
each function the assignment asks for, a card shows:

- **Against correct implementations:** whether your tests pass — i.e., whether
  they are _right_. A test that fails here expects the wrong thing.
- **Against buggy implementations:** how many of the buggy versions your tests
  caught (by failing) — i.e., whether they are _thorough_.

It will not tell you the answer: if a test is wrong, you are told which test,
but not what it should have said, and if you miss a buggy implementation, you
aren't told what its bug was. Working out what you failed to check is the
exercise. None of this is a grade: it shows you where your tests are thin, while
you still have time to do something about it.
