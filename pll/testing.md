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

When you click **PLL: Run Python File**, PLL runs your file, and then its tests,
and shows a card in the interactions panel, after what the program printed, with
which tests passed and which failed. The tests can use everything the file
defined. If a test fails, you can click it to jump to that test. Anything the
test printed is shown with it. If the program stops with an error, or ends itself
with `sys.exit()`, the tests are not run, and PLL says so.

A test function stops at its first `assert` that fails, so the `assert`s after
that one aren't checked until you fix it.

A test takes no parameters: PLL calls it with nothing. One written with
parameters, like `def test_add(x):`, is not run; PLL says what is wrong with it,
above the card. Clicking **Stop** while the tests run stops them: the test that
was running is marked as stopped, and the rest are not run.

To check that a function returns `True` or `False`, `assert` its result directly, or use `assert not`:

<!-- python setup
# (a function to test)
def is_even(n: int) -> bool:
    return n % 2 == 0
-->

```python
def test_is_even():
    assert is_even(4)
    assert not is_even(3)
```

You do not need a separate test file, and you do not need to run `pytest` in a
terminal.

At `#level beginner` and `#level intermediate`, PLL also catches three mistakes
that would otherwise make a test pass without checking anything (see
[Language levels](/pll/levels#mistakes-found-before-the-file-runs)):

- a comparison written without `assert`, which is worked out and thrown away;
- `assert(x, 1)`, with brackets and a comma, which is always true;
- a function with `assert` in it whose name does not start with `test_`, which
  nothing ever runs.

## Numbers that are only approximately right

Calculations with decimal (`float`) numbers often have tiny errors, so checking
them with `==` can fail even when your code is right. Import `pytest` and use
`pytest.approx`, which checks that a number is _very close_ to what you expect:

```python
import pytest

def test_cost():
    assert 0.1 + 0.2 == pytest.approx(0.3)
```

When a test fails because two decimals differ only in their last digits (as in
`0.9299999999999999 == 0.93`), PLL suggests `pytest.approx`.

You can also say how close it has to be, with `abs=`. This checks that the
answer is between `0.9` and `1.1`:

```python skip
    assert distance(...) == pytest.approx(1, abs=0.1)
```

## Checking that code causes an error

To test that some code causes an error, put it under `with pytest.raises(...)`,
giving the kind of error you expect:

<!-- python setup
# (a function to test)
def first_letter(s: str) -> str:
    return s[0]
-->

```python
import pytest

def test_first_letter():
    with pytest.raises(IndexError):
        first_letter("")
    assert first_letter("hello") == "h"
```

## Skipping a test

To leave a test out for now, put `@pytest.mark.skip` above it, with the reason;
`@pytest.mark.skipif(condition, reason=...)` skips it only when the condition is
true. `@pytest.mark.xfail` marks a test that is expected to fail. Each is shown on
the card as skipped, with its reason, rather than as a failure:

```python
import pytest

@pytest.mark.skip(reason="not written yet")
def test_later():
    assert False
```

## Testing images

Two images are `==` when they draw the same shapes in the same places, in the
same colors, so you can test a function that draws something by comparing what it
draws with the image it should draw — see [Images](/pll/images#comparing-images).

## Testing tables

Two tables are `==` when they have the same columns, in the same order, holding
the same values, in the same order. So you can test a function that produces a
table by comparing its result with the table you expect — see
[Tables](/pll/tables#comparing-tables). When such a test fails, PLL says where the
two tables differ.

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
exercise.

How thorough your tests are is only shown once every test of that function
passes, since a wrong test would fail on the buggy implementations too, and look
as though it had caught them. Your program itself does not run during the check
(only its definitions are loaded), files next to your program are not available
during it, and a test that takes more than 2 seconds is stopped.

None of this is a grade: it shows you where your tests are thin, while you still
have time to do something about it.
