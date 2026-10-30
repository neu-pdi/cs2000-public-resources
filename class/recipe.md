---
sidebar_position: 0
class_number: 0
pll_level: intermediate
title: Design Recipe
---

## The Design Recipe

Every function in this course is designed the same way, in the same steps, from
[Class 4](/class/4) to the last class. The steps have names, so that we can talk
about them ("back to Examples"), and the classes add to them as the course goes on:

<DesignRecipe />

Each step makes the next one easier. The data definition says what the data is,
and its template gives every function on that data its shape, so both are
written once, before any one function. Then, for each function, the types and
the docstring say what it is for; the examples check that you understand the
problem before you solve it; and by then, the body is usually a matter of
filling in the template's gaps. Doing the steps in order is faster than starting
with the body, even though the body is the part that feels like programming.

### Data definition {#data-definition}

What kind of data does the function work on? Until [Class 19](/class/19), we say
it in words: "a temperature in degrees Fahrenheit", or "a row with `time` and
`amount` columns".
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

### Template {#template}

The outline that a kind of data gives the body of any function on it, before
solving any particular problem. It follows one rule: **the body has one part for
each part of the data**. A number has one part; a number split into intervals has one part per
interval; a row has its columns; a dataclass has its fields; a union has its
variants. A template is a function named for its kind of data, starting with
`_`, which marks it as an outline, not a function to call. Each part of the data
is on a line of its own, with `...` before and after it, since the body's code
can go around each part, and `return ...` at the end. So the
[templates below](#templates) all look like this one, for the weather (a
temperature below 80 degrees Fahrenheit, or 80 and above):

```python
def _weather_temp(temp_in_f: float) -> ...:
    if temp_in_f < 80:
        ...
        temp_in_f
        ...
        return ...
    else:
        ...
        temp_in_f
        ...
        return ...
```

The template is written once for each kind of data, next to its data definition,
and then used for every function on that kind of data.

### Signature {#signature}

Now for one function on the data: here, `choose_hat`, on the weather. Its
`def` line: the function's name, the type of each parameter, and the type of its
result. Work out the types first: the rest of the function depends on them. The
body is `...` for now, so that the file runs, and the function can already be
called (PLL says it isn't written yet):

```python
def choose_hat(temp_in_f: float) -> str:
    ...
```

### Docstring {#docstring}

What the function does (not how it does it), for someone who will call it, on the
first line of the body:

```python
def choose_hat(temp_in_f: float) -> str:
    """the hat to wear at temp_in_f degrees Fahrenheit: a sun hat at 80 or
    above, otherwise none"""
    ...
```

### Examples {#examples}

A test function, right after the function, with concrete inputs and the outputs
they should give. Choose inputs that cover each case of the data (each interval,
each variant), and its edges:

```python
def test_choose_hat():
    assert choose_hat(80) == "sun hat"
    assert choose_hat(79.5) == "no hat"
    assert choose_hat(50) == "no hat"
    assert choose_hat(95) == "sun hat"
```

- Write the expected outputs by working them out (or writing the computation, as
  `0 * 9/5 + 32`), **never** by running the function: a wrong body would then
  make the tests agree with it.
- Since the body is `...`, the tests already run, and fail. A mistake in an
  example shows up now, before any code depends on it.
- Some assignments, and some classes, give you an `#examplar` line to put at the
  top of the file. With it, every run checks your examples against
  implementations the course wrote: some known to be correct (are your examples
  right?) and some known to have a bug (are they thorough?). See
  [Tests](/pll/testing#checking-your-tests-against-the-courses-code).

### Body {#body}

Copy the template's body into the function, in place of its `...`, and fill
in each `...`, using the examples to decide what it becomes. A line that only
names a part is a reminder: use the part, or delete the line. Any `...` left in
the function stops it with "not written yet" when it runs.

```python
def choose_hat(temp_in_f: float) -> str:
    """the hat to wear at temp_in_f degrees Fahrenheit: a sun hat at 80 or
    above, otherwise none"""
    if temp_in_f < 80:
        return "no hat"
    else:
        return "sun hat"
```

### Test and revise {#test-and-revise}

Run the tests. If one fails, decide which is wrong, the example or the body,
before changing either. When anything changes (a new case, a new requirement),
go back through the steps in order: the Data definition and its Template, the
Signature, the Docstring, and the Examples may all need to change before the Body
does.

## Templates {#templates}

A template is the outline of _any_ function on one kind of data. Each kind of data
we meet has one, and each is the rule above, applied to that kind. Its name is the
kind of data's, with `_` in front and `_temp` at the end: `_book_record_temp` is
the template for a `BookRecord`.

### Numbers, strings, and images {#template-numbers}

_From [Class 4](/class/4)._ A number (or string, or image) has one part, so the
template is just the parameter: the body combines it with that kind's operations.

```python
def _celsius_temp(celsius: float) -> ...:
    ...
    celsius
    ...
    return ...
```

### Booleans and intervals {#template-intervals}

_From [Class 5](/class/5)._ A boolean is `True` or `False`, so its template is an
`if` with two branches. A number split into intervals has one branch per
interval, with the conditions taken from the intervals' edges: with the winter
hat from Class 5 (below 50, below 80, and 80 or above), the weather has three. The Examples step has a test in each interval, and at each edge.

```python
def _bool_temp(b: bool) -> ...:
    if b:
        return ...
    else:
        return ...

def _weather_temp(temp_in_f: float) -> ...:
    if temp_in_f < 50:
        ...
        temp_in_f
        ...
        return ...
    elif temp_in_f < 80:
        ...
        temp_in_f
        ...
        return ...
    else:
        ...
        temp_in_f
        ...
        return ...
```

The question that picks it: what are the cases of this input, and where are their
edges?

### Rows {#template-rows}

_From [Class 8](/class/8)._ A row's parts are its columns, so the template has a
line for each column the function can use. For a coffee cart's orders, with a
`time` and an `amount`:

```python
def _order_row_temp(r: dict) -> ...:
    ...
    r["time"]
    ...
    r["amount"]
    ...
    return ...
```

### Tables {#template-tables}

_From [Classes 8 to 10](/class/8)._ A function that makes a new table from a table
does one of three things: keeps some of the rows, adds a column, or changes a
column. So there are three templates, one for each. Each needs a helper, whose
input the template already knows, so it's written in the template, as a local
function (a `def` inside the `def`):

```python
def _keep_rows_temp(t: Table) -> Table:
    def keep(r: dict) -> bool:
        ...
        r
        ...
        return ...
    return t.filter(keep)

def _add_column_temp(t: Table) -> Table:
    def compute(r: dict) -> ...:
        ...
        r
        ...
        return ...
    return t.add_column(..., compute)

def _change_column_temp(t: Table) -> Table:
    def change(v: ...) -> ...:
        ...
        v
        ...
        return ...
    return t.transform_column(..., change)
```

- `keep` takes a row (a `dict`) and gives a `bool`: whether to keep it.
- `compute` takes a row and gives the new column's value; the `...` before it is
  the new column's name.
- `change` takes one of the column's values (of that column's type) and gives
  the new value; the `...` before it is the column's name.
- Each helper's body is the template for its input: for a row, a line for each
  of the table's columns, as in the [row template](#template-rows), in place of
  `r`.
- Fill in the helper where it is, or, when it deserves tests of its own, move it
  out to the top level as a function of its own (designed with the recipe), and
  pass that instead.

The question that picks one: does the answer have fewer rows, a new column, or a
changed column? A function that answers a question about a table, rather than
making a new one, summarizes a column instead (`t.sum`, `t.mean`, a chart), and
`t.order_by` puts the rows in order. A longer task is a sequence of these (a
[task plan](/class/12)), each step its own template.

### A fixed set of strings {#template-strings}

_From [Class 11](/class/11)._ A string that is one of a few known values (a
promo code, a kind of delivery) has one branch per value, and an `else` for
anything else, which is what cleaning data needs:

```python
def _promo_code_temp(s: str) -> ...:
    if s == "":
        return ...
    elif s == "none":
        return ...
    else:
        ...
        s
        ...
        return ...
```

### Lists {#template-lists}

_From [Classes 13 and 14](/class/14)._ The same three ways as tables: keep some of
the elements (as `filter` does for rows), change each one (as `transform_column`
does for a column), or combine them into one value (with `sum`, `len`, `max` or
`min`, as a table's column is summarized). The first two have templates, each
with its helper written as a local function, as for tables:

```python
def _keep_elements_temp(lst: list) -> list:
    def keep(x: ...) -> bool:
        ...
        x
        ...
        return ...
    return list(filter(keep, lst))

def _change_elements_temp(lst: list) -> list:
    def change(x: ...) -> ...:
        ...
        x
        ...
        return ...
    return list(map(change, lst))
```

`keep` takes an element (of the list's element type) and gives a `bool`; `change`
takes an element and gives its new value.

### `for` loops {#template-loops}

_From [Class 15](/class/15)._ A loop visits each element of a list, and builds the
answer as it goes, starting from the answer for an empty list:

```python
def _list_loop_temp(lst: list) -> ...:
    result = ...
    for item in lst:
        ...
        item
        ...
        result
        ...
        result = ...
    return result
```

It is filled in in three usual ways: **combining** the elements into one value (a
sum, a product), **building** a new list (the loop version of `map`, or of `filter`
with an `if`), and **checking** something about the elements (whether any is
negative, whether all are short).

### Structured data {#template-fields}

_From [Class 19](/class/19)._ A dataclass's parts are its fields, so the template
has a line for each:

```python
def _book_record_temp(b: BookRecord) -> ...:
    ...
    b.title
    ...
    b.author
    ...
    b.pages
    ...
    return ...
```

### Conditional data {#template-variants}

_From [Class 20](/class/20)._ A union's parts are its variants, so the template is
a `match` with one `case` per variant, naming each variant's fields. It is the
interval template again, with the cases taken from the data definition:

<!-- python setup
@dataclass
class Cash:
    pass

@dataclass
class Credit:
    card_number: str
    expiry: str

@dataclass
class Checking:
    bank_account: str
    routing: str
    check_number: int

PaymentMethod = Cash | Credit | Checking

@dataclass
class Spring:
    pass

@dataclass
class River:
    name: str
    length: float
    left: "RiverTree"
    right: "RiverTree"

RiverTree = Spring | River

@dataclass
class LibraryBook:
    id: int
    title: str
    copies: int
-->

```python
def _payment_method_temp(p: PaymentMethod) -> ...:
    match p:
        case Cash():
            return ...
        case Credit(cn, exp):
            ...
            cn
            ...
            exp
            ...
            return ...
        case Checking(acc, rout, num):
            ...
            acc
            ...
            rout
            ...
            num
            ...
            return ...
```

### Recursive data {#template-recursive}

_From [Classes 21 to 24](/class/22)._ A `case` per variant, its fields named, and a
recursive call on each field of the same type. For a list (first and rest), a
stack of pancakes, and a tree, the rule is the same; only the number of
recursive fields changes:

```python
def _list_temp(lst: list) -> ...:
    match lst:
        case []:
            return ...
        case [first, *rest]:
            ...
            first
            ...
            _list_temp(rest)
            ...
            return ...

def _river_tree_temp(t: RiverTree) -> ...:
    match t:
        case Spring():
            return ...
        case River(n, l, left, right):
            ...
            n
            ...
            l
            ...
            _river_tree_temp(left)
            ...
            _river_tree_temp(right)
            ...
            return ...
```

When you copy one into a function, rename the recursive calls too.

### Data that changes {#template-mutation}

_From [Class 25](/class/25)._ A function that changes its input, rather than making
a new value: its result type is `None`, its docstring says what changes, its
examples are Setup, Call, and Check, and its template ends by setting the fields
it changes, rather than with `return ...`:

```python
def _library_book_temp(b: LibraryBook) -> None:
    ...
    b.id
    ...
    b.title
    ...
    b.copies
    ...
    b.copies = ...
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
