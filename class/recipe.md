---
sidebar_position: 0
class_number: 0
title: Design Recipe
---

## The Design Recipe

Every function in this course is designed the same way, in the same steps, from
[Class 4](/class/4) to the last class. The steps have names, so that we can talk
about them ("back to Examples"), and the classes add to them as the course goes on:

<DesignRecipe />

Each step makes the next one easier. The types and the docstring say what the
function is for; the examples check that you understand the problem before you
solve it; the template gives the body its shape; and by then, the body is usually
a matter of filling in the template's gaps. Doing the steps in order is faster
than starting with the body, even though the body is the part that feels like
programming.

### Data definition {#data-definition}

What kind of data does the function work on? Until [Class 19](/class/19), we say
it in words: "a number of pens", or "a row with `month` and `riders` columns".
From then on, we define our own kinds of data, in code, and always follow a data
definition with a few named examples:

```python
@dataclass
class BookRecord:
    title: str
    author: str
    pages: int

the_dispossessed = BookRecord("The Dispossessed", "Ursula K. Le Guin", 387)
to_the_lighthouse = BookRecord("To the Lighthouse", "Virginia Woolf", 209)
```

The examples are used again in the Examples step, and the data definition decides
the Template.

### Signature {#signature}

The `def` line: the function's name, the type of each parameter, and the type of
its result. Work out the types first: every later step depends on them. The body
is `...` for now, so that the file runs, and the function can already be called
(it gives back `None`):

```python
def add_shipping(order_amt: float) -> float:
    ...
```

### Docstring {#docstring}

What the function does (not how it does it), for someone who will call it, on the
first line of the body:

```python
def add_shipping(order_amt: float) -> float:
    """add shipping costs to order total: $4 for $10 or less, $8 above"""
    ...
```

### Examples {#examples}

A test function, right after the function, with concrete inputs and the outputs
they should give. Choose inputs that cover each case of the data (each interval,
each variant), and its edges:

```python
def test_add_shipping():
    assert add_shipping(10) == 10 + 4
    assert add_shipping(3.95) == 3.95 + 4
    assert add_shipping(20) == 20 + 8
    assert add_shipping(10.01) == 10.01 + 8
```

- Write the expected outputs by working them out (or writing the computation, as
  `10 + 4`), **never** by running the function: a wrong body would then make the
  tests agree with it.
- Since the body is `...`, the tests already run, and fail. A mistake in an
  example shows up now, before any code depends on it.
- Some assignments, and some classes, give you an `#examplar` line to put at the
  top of the file. With it, every run checks your examples against
  implementations the course wrote: some known to be correct (are your examples
  right?) and some known to have a bug (are they thorough?). See
  [Tests](/pll/testing#checking-your-tests-against-the-courses-code).

### Template {#template}

The outline that the kind of input data gives the body, before solving this
particular problem. It follows one rule: **the body has one part for each part of
the data**. A number has one part; a number split into intervals has one part per
interval; a row has its columns; a dataclass has its fields; a union has its
variants. We write the template as a comment, then fill it in, so the
[templates below](#templates) all look like this:

```python
# def add_shipping(order_amt: float) -> float:
#     if order_amt <= 10:
#         ... order_amt ...
#     else:
#         ... order_amt ...
```

### Body {#body}

Replace the `...` with the body: fill in the template, using the examples to
decide what each gap becomes.

```python
def add_shipping(order_amt: float) -> float:
    """add shipping costs to order total: $4 for $10 or less, $8 above"""
    if order_amt <= 10:
        return order_amt + 4
    else:
        return order_amt + 8
```

### Test and revise {#test-and-revise}

Run the tests. If one fails, decide which is wrong, the example or the body,
before changing either. When anything changes (a new case, a new requirement),
go back through the steps in order: the Signature, the Docstring, the Examples,
and the Template may all need to change before the Body does.

## Templates {#templates}

A template is the outline of _any_ function on one kind of data. Each kind of data
we meet has one, and each is the rule above, applied to that kind.

### Numbers, strings, and images {#template-numbers}

_From [Class 4](/class/4)._ A number (or string, or image) has one part, so the
template is just the parameter: the body combines it with that kind's operations.

```python
# def moon_weight(earth_weight: float) -> float:
#     ... earth_weight ...
```

### Booleans and intervals {#template-intervals}

_From [Class 5](/class/5)._ A boolean is `True` or `False`, so its template is an
`if` with two branches. A number split into intervals (up to \$10, above \$10)
has one branch per interval, with the conditions taken from the intervals' edges.
The Examples step has a test in each interval, and at each edge.

```python
# def bool_fun(b: bool) -> ...:
#     if b:
#         ...
#     else:
#         ...

# def shipping_fun(order_amt: float) -> ...:
#     if order_amt <= 10:
#         ... order_amt ...
#     elif order_amt <= 30:
#         ... order_amt ...
#     else:
#         ... order_amt ...
```

The question that picks it: what are the cases of this input, and where are their
edges?

### Rows {#template-rows}

_From [Class 8](/class/8)._ A row's parts are its columns, so the template lists
the columns the function can use:

```python
# def row_fun(r: dict) -> ...:
#     ... r["month"] ... r["riders"] ...
```

### Tables {#template-tables}

_From [Classes 8 to 10](/class/8)._ A function that makes a new table from a table
does one of three things: keeps some of the rows, adds a column, or changes a
column. Each one needs a helper function, and which one it is decides the helper's
signature:

```python
# def table_fun(t: Table) -> Table:
#     return t.filter(keep)                     # fewer rows: keep(r: dict) -> bool
#     return t.add_column("new", compute)       # a new column: compute(r: dict) -> ...
#     return t.transform_column("col", change)  # a changed column: change(v) -> ...
```

The question that picks it: does the answer have fewer rows, a new column, or a
changed column? A function that answers a question about a table, rather than
making a new one, summarizes a column instead (`t.sum`, `t.mean`, a chart), and
`t.order_by` puts the rows in order. A longer task is a sequence of these (a
[task plan](/class/12)), each step its own template.

### A fixed set of strings {#template-strings}

_From [Class 11](/class/11)._ A string that is one of a few known values (a
discount code, a kind of delivery) has one branch per value, and an `else` for
anything else, which is what cleaning data needs:

```python
# def code_fun(code: str) -> ...:
#     if code == "":
#         ...
#     elif code == "none":
#         ...
#     else:
#         ... code ...
```

### Lists {#template-lists}

_From [Classes 13 and 14](/class/14)._ The same three ways as tables: keep some of
the elements (as `filter` does for rows), change each one (as `transform_column`
does for a column), or combine them into one value:

```python
# def list_fun(lst: list) -> ...:
#     return list(filter(keep, lst))   # fewer elements: keep(x) -> bool
#     return list(map(f, lst))         # each one changed: f(x) -> ...
#     return sum(lst)                  # one value (also len, max, min)
```

### `for` loops {#template-loops}

_From [Class 15](/class/15)._ A loop visits each element of a list, and builds the
answer as it goes:

```python
# def list_fun(lst: list) -> ...:
#     result = ...            # the answer for an empty list
#     for item in lst:
#         result = ... item ... result
#     return result
```

It is filled in in three usual ways: **combining** the elements into one value (a
sum, a product), **building** a new list (the loop version of `map`, or of `filter`
with an `if`), and **checking** something about the elements (whether any is
negative, whether all are short).

### Structured data {#template-fields}

_From [Class 19](/class/19)._ A dataclass's parts are its fields, so the template
lists them:

```python
# def book_fun(b: BookRecord) -> ...:
#     ... b.title ... b.author ... b.pages ...
```

### Conditional data {#template-variants}

_From [Class 20](/class/20)._ A union's parts are its variants, so the template is
a `match` with one `case` per variant, naming each variant's fields. It is the
interval template again, with the cases taken from the data definition:

```python
# def animal_fun(a: Animal) -> ...:
#     match a:
#         case Boa(n, l):
#             ... n ... l ...
#         case Armadillo(n, live):
#             ... n ... live ...
```

### Recursive data {#template-recursive}

_From [Classes 21 to 24](/class/22)._ A `case` per variant, its fields named, and a
recursive call on each field of the same type. For a list (first and rest), a
`NumList`, and a tree, the rule is the same; only the number of recursive fields
changes:

```python
# def list_fun(lst: list) -> ...:
#     match lst:
#         case []:
#             ...
#         case [first, *rest]:
#             ... first ... list_fun(rest) ...

# def tree_fun(t: AncTree) -> ...:
#     match t:
#         case NoInfo():
#             ...
#         case Person(n, y, e, m, f):
#             ... n ... y ... e ... tree_fun(m) ... tree_fun(f) ...
```

### Data that changes {#template-mutation}

_From [Class 25](/class/25)._ A function that changes its input, rather than making
a new value: its result type is `None`, its docstring says what changes, its
examples are Setup, Call, and Check, and its template updates the fields:

```python
# def account_fun(ac: Account) -> None:
#     ac.balance = ... ac.balance ...
```

### Pandas and PLL tables {#pandas}

_From [Classes 26 and 27](/class/26)._ pandas is too large to have one template.
Instead, for each PLL table operation, there is a pandas way to do the same job:

| PLL table | pandas |
| --- | --- |
| `t.filter(keep)` | a mask: `df[df["col"] < 10]` |
| `t.add_column("new", compute)` | `df["new"] = ...` |
| `t.transform_column("col", change)` | `df["col"] = df["col"].apply(change)` |
| `t.order_by("col")` | `df.sort_values("col")` |
| `t.mean("col")` | `df["col"].mean()` |

The recipe itself doesn't change: a function that uses pandas still has a
signature, a docstring, and examples.
