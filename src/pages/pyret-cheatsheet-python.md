# Python for Pyreteers

*Daniel Patterson v2025-6-4*

This page shows language features in Pyret, and how they show up in Python, very briefly. It is intended as a handy reference, not an alternative to learning via attending class, doing reading, attending lab, and doing HW.

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
# Annotations optional, can be checked by mypy
def f(y : int) -> int:
    """ adds 10 """
    return y + 10

# in a separate file, `test_foo.py`:
def test_f_10():
    assert f(10) == 20

def test_f_20()
    assert f(20) == 30
# Run via pytest
```

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
