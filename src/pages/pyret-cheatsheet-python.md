# Python for Pyreteers

*Daniel Patterson v2026-11-4*

This page shows language features in Pyret, and how they show up in Python, very briefly. It is intended as a handy reference, not an alternative to learning via attending class, doing reading, attending lab, and doing HW.

## Language Levels

This one has no Pyret counterpart. Every Python file in this course begins with a `#level` line, which tells the PLL extension how much to check for you:

**Python:**

```python
#level intermediate

def f(y : int) -> int:
    """ adds 10 """
    return y + 10
```

We use `#level intermediate` from [Day 24](/days/24), then `#level advanced` from [Day 27](/days/27), where we need `global` and start changing values in place. At `intermediate` you may give a name a new value inside a function (what a `for` loop accumulator needs), but not at the top level of a file.

A file with **no** `#level` line runs at `raw`, which means **nothing** is checked -- it is just plain Python. At every level except `raw`, PLL checks your type annotations as the program runs, rather than leaving them as comments. See [Language Levels](/levels) for what each level does.

## Definitions & Whitespace & Annotations

**Pyret:**

```pyret
fun f(y :: Number) -> Number:
  doc: "adds 10"
  x = 10
  x + y
end
# Not whitespace sensitive
# Errors at y :: Number
f("hello")
```

**Python:**

```python
def f(y : int) -> int:
    """ adds 10 """
    x = 10
    return x + y
# Whitespace sensitive -- indentation matters
# Errors at x + y
f("hello")
```

## Testing

**Pyret:**

```pyret
# Annotations are optional but checked
fun f(y :: Number) -> Number:
  doc: "adds 10"
  y + 10
where:
  f(10) is 20
  f(20) is 30
end # or:
check:
  f(10) is 20
end
# Runs when program is run
```

**Python:**

```python
#level intermediate

# Annotations are checked by PLL as the program runs
def f(y : int) -> int:
    """ adds 10 """
    return y + 10

# Tests go in the SAME file, in functions named test_...
def test_f_10() -> None:
    assert f(10) == 20

def test_f_20() -> None:
    assert f(20) == 30
# Run with PLL: Run Python File -- not pytest in a terminal
```

Tests run first, and PLL shows a pass/fail card in the interactions panel; the rest of the file runs afterwards. For decimals use `pytest.approx` (Pyret's `is-roughly`), which needs `import pytest` at the top of the file.

## Operators & Numbers

**Pyret:**

```pyret
10 + ((2 * 3) / 4)
# Mixed ops requires parens
(0.1 + 0.2) == 0.3 # true
# Exact numbers are default
```

**Python:**

```python
10 + 2 * 3 / 4
0.1 + 0.2 == 0.3 # False
```

## Literal Data

**Pyret:**

```pyret
"hello"
true # or false
[list: 1, 2, 3]
[array: 1, 2, 3]
[set: 1, 2, 3]
[string-dict: "a", 1, "b", 2]
```

**Python:**

```python
"hello"
True # or False
[1, 2, 3]
{1, 2, 3}
{"a":1, "b":2}
```

## Conditionals

**Pyret:**

```pyret
if 1 == 2: 10
else if 2 == 3: 20
else: 30
end
```

**Python:**

```python
if 1 == 2: return 10
elif 2 == 3: return 20
else: return 30
```

## For Loops

**Pyret:**

```pyret
var sum = 0
for each(x from range(1,10)):
  sum := sum + x
end
print(sum)
```

**Python:**

```python
sum = 0
for x in range(1,10):
    sum = sum + x
print(sum)
```

## Modules & Import

**Pyret:**

```pyret
include charts
import charts as C
include from charts: * end
include from charts:
  bar-chart, scatter-plot
end
```

**Python:**

```python
import charts
import charts as C
from charts import *
from charts import
  bar-chart, scatter-plot
```

## Function Values

**Pyret:**

```pyret
# Unnamed, normal function
lam(x :: Boolean,
    y :: Number,
    z :: Number):
  if x: y
  else: z
  end
end
```

**Python:**

```python
# can't express via `lambda`; can only have simple expressions inside
lambda x, y: x + y
# Need to def & return
def _tmp(x,y,z):
    if x:
        return y
    else:
        return z
_tmp
```

## Data Definitions

**Pyret:**

```pyret
data BT:
  | leaf(typ :: String)
  | node(
      value :: Number,
      left :: BT,
      right :: BT)
end

t = node(0,
         node(1, leaf("a"),
                 leaf("b")),
         leaf("a"))

cases(BT) t:
  | leaf => 0
  | node(v, l, r) => ...
end
```

**Python:**

```python
from dataclasses import dataclass
from typing import Union

@dataclass
class Leaf:
    typ: str

@dataclass
class Node:
    value: int
    left: Union['Node', Leaf]
    right: Union['Node', Leaf]

t = Node(0,Node(1,Leaf("a"),
                 Leaf("b")),
         Leaf("a"))

if isinstance(t,Leaf):
    return 0
else:
    v = t.value
    l = t.left
    r = t.right
    ...
```

## Mutation

**Pyret:**

```pyret
var z = 10
fun f():
  var x = 10
  y = 10
  # multiple statements
  # require block
  block:
    x := 20
    # can mutate outer scope
    z := 30
    # Would error: y is not mutable
    # y := 20
    # last expression is returned
    x + z
  end
end
f() # returns 50
z # returns 30
```

**Python:**

```python
z = 10
def f():
    x = 10
    y = 10
    x = 20
    # needed to not
    # create new var
    nonlocal z
    z = 30
    y = 20
    return x + z

f() # returns 50
z # returns 30
```
