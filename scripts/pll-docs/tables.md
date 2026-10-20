---
sidebar_position: 5
title: Tables and charts
description: Creating, loading, transforming, and charting tables
---

# Tables and charts

PLL adds tables to Python: you do not need to `import` anything to use them. A
table shows up in the interactions panel as a card you can scroll, with a
**Save CSV** button, which saves the whole table. A number is shown as Python
prints it (`2.0`, `12999.99`), and a column of numbers lines up on the right, so a
column of numbers that is still text (from a CSV) stands out by lining up on the
left. Each operation below is shown with its contract (the types of its inputs and
output), followed by some examples and what they produce.

Tables never change: every operation on a table produces a **new** table, and
leaves the original as it was. Operations on tables are _methods_, written after
the table with a dot, like `workouts.filter(is_long)`. For type annotations, the
type of a table is `Table`, and the type of a row is `dict`.

A table is not a list or a dictionary: its rows and columns are taken out with
its methods, [`row`](#row) and [`column`](#column), and a mistake like this one
says which to use:

```python example error
table(["name"], [["Ada"]])["name"]
```

## Creating tables

### table

```
table(columns: list[str], rows: list[list]) -> Table
```

A table with the given column names, and the given rows, each of which is a list
with one value for each column (in the same order as `columns`).

```python example
workouts = table(
    ["date", "activity", "duration"],
    [
        ["2025-04-01", "Running", 30],
        ["2025-04-02", "Yoga", 45],
        ["2025-04-03", "Cycling", 60],
        ["2025-04-04", "Running", 25],
        ["2025-04-05", "Yoga", 50],
    ],
)
workouts
```

A row can also be a `dict`, like the ones [`t.row(n)`](#row) gives you, so you
can make a new table from some of the rows of another:

```python example
table(workouts.columns(), [workouts.row(0), workouts.row(2)])
```

### table_from_columns

```
table_from_columns(columns: dict) -> Table
```

A table made from a dictionary from column names to lists of values (one for each
row), for when you have the data column by column.

```python example
table_from_columns({
    "name": ["Ada", "Grace", "Alan"],
    "born": [1815, 1906, 1912],
})
```

### load_table

```
load_table(source: str) -> Table
```

A table read from a CSV ("comma separated values") file: either a file in the same
folder as your program (when `source` is a file name, like `"voters.csv"`), or
one on the web (when `source` starts with `https://`). The first line of the CSV
gives the names of the columns.

```python example
recipes_raw = load_table("https://raw.githubusercontent.com/neu-pdi/cs2000-public-resources/refs/heads/main/static/support/5-recipes.csv")
recipes_raw.head(3)
```

**Every value loaded from a CSV is a string**, including the ones that look like
numbers, and an empty cell is the empty string `""`:

```python example
recipes_raw.row(0)
```

To convert a column of numbers, use [`transform_column`](#transform_column) with
`int` (for whole numbers) or `float`:

```python example
recipes = recipes_raw.transform_column("servings", int).transform_column("prep time", int)
recipes.row(0)
```

If some values in a column aren't numbers (e.g., `""`, or `"1,234"`), `int` and
`float` cause an error that names the row, so you'll need to write a function that
handles those values, and use that with `transform_column` instead.

A CSV saved by Excel loads either way it can be saved ("CSV UTF-8", or a plain
"CSV"). An address that gives back a web page rather than a CSV, such as a file's
page on GitHub, is said to be one, with the fix (use the address of its **Raw**
button). A file next to your program can be up to 50 MB. In the browser, an address
on the web only works if its site allows other sites to read it: if
`load_table` reports that it could not reach an address, download the CSV, add
it to your repository (next to your program), and load it by its file name
instead.

## Getting information from tables

### columns

```
t.columns() -> list[str]
```

The names of the table's columns, in order.

```python example
workouts.columns()
```

### length

```
t.length() -> int
```

The number of rows in the table. (`len(t)` gives the same thing.)

```python example
workouts.length()
```

### row

```
t.row(n: int) -> dict
```

Row number `n` of the table, as a `dict` from column names to values. The first
row is number `0`, and the last is one less than the number of rows.

```python example
workouts.row(1)
```

```python example error
workouts.row(5)
```

To get one value from a row, write the column's name in square brackets after it:

```python example
workouts.row(1)["activity"]
```

```python example error
workouts.row(1)["time"]
```

### column

```
t.column(name: str) -> list
```

All of the values in a column, as a list, in order.

```python example
workouts.column("duration")
```

### rows

```
t.rows() -> list[dict]
```

All of the rows, as a list of `dict`s.

```python example
workouts.rows()
```

## Making new tables

### filter

```
t.filter(keep: function) -> Table
```

A table with only the rows for which `keep(row)` returns `True`. Note that we give
`filter` the function itself (with no parentheses after its name): `filter`
calls it on each row.

```python example
def is_long(r: dict) -> bool:
    """whether the workout lasted at least 45 minutes"""
    return r["duration"] >= 45

workouts.filter(is_long)
```

```python example
workouts.filter(lambda r: r["activity"] == "Yoga")
```

### transform_column

```
t.transform_column(name: str, change: function) -> Table
```

A table where every value `v` in the column `name` is replaced by `change(v)`.

```python example
workouts.transform_column("duration", lambda minutes: minutes / 60)
```

```python example
workouts.transform_column("activity", lambda a: a.upper())
```

### add_column

```
t.add_column(name: str, compute: function) -> Table
t.add_column(name: str, values: list) -> Table
```

A table with a new column, at the right, called `name`. Its value in each row is
either `compute(row)`, or, if given a list, the values in the list (one for each
row, in order).

```python example
def calories(r: dict) -> float:
    """estimated calories burned in the workout"""
    return r["duration"] * 8

workouts.add_column("calories", calories)
```

```python example
workouts.add_column("rating", [4, 5, 3, 4, 5])
```

### add_row

```
t.add_row(row: list | dict) -> Table
```

A table with one more row, at the end: either a list with one value for each
column, in order, or a `dict` from column names to values.

```python example
workouts.add_row(["2025-04-06", "Swimming", 40])
```

```python example
workouts.add_row({"date": "2025-04-06", "activity": "Swimming", "duration": 40})
```

### select_columns

```
t.select_columns(names: list[str]) -> Table
```

A table with only the columns in `names`, in that order.

```python example
workouts.select_columns(["activity", "date"])
```

### order_by

```
t.order_by(name: str, ascending: bool = True) -> Table
```

A table with the same rows, sorted by the column `name`: smallest first if
`ascending` is `True` (or left out), and largest first if it is `False`. Strings
are sorted in dictionary order (with all uppercase letters before all lowercase
ones).

```python example
workouts.order_by("duration", ascending=True)
```

```python example
workouts.order_by("activity", ascending=False)
```

### head and tail

```
t.head(n: int = 10) -> Table
t.tail(n: int = 10) -> Table
```

A table of just the first (`head`) or last (`tail`) `n` rows: 10, if `n` is left
out.

```python example
workouts.head(2)
```

```python example
workouts.tail(2)
```

## Summarizing columns

### sum, mean, min, and max

```
t.sum(name: str) -> int | float
t.mean(name: str) -> float
t.min(name: str)
t.max(name: str)
```

The total, average, smallest value, and largest value of a column. `sum` and
`mean` need a column of numbers (the `sum` of whole numbers is a whole number);
`min` and `max` also work on strings (dictionary order). At `#level beginner` and
`#level intermediate`, `True` and `False` are not numbers to a table: `sum`,
`mean` and the charts refuse them.

`min`, `max` and [`order_by`](#order_by) refuse a column of numbers that is still
text, when comparing it as text would give a different answer (as text, `"9"`
comes after `"100"`), and say to convert it first:

```python example error
recipes_raw.max("servings")
```

```python example
workouts.sum("duration")
```

```python example
workouts.mean("duration")
```

```python example
workouts.min("duration")
```

```python example
workouts.max("activity")
```

For anything else, like the median or the standard deviation, use a column (a
list) with Python's own [`statistics`](https://docs.python.org/3/library/statistics.html)
library:

```python example
import statistics

statistics.median(workouts.column("duration"))
```

```python example
statistics.stdev(workouts.column("duration"))
```

## Comparing tables

Two tables are `==` when they have the same columns, in the same order, holding
the same values, in the same order:

```python example
workouts.head(2) == table(
    ["date", "activity", "duration"],
    [
        ["2025-04-01", "Running", 30],
        ["2025-04-02", "Yoga", 45],
    ],
)
```

```python example
workouts.head(2) == workouts.tail(2)
```

So you can test a function that produces a table by comparing its result with
the table you expect:

```python example
def long_workouts(t: Table) -> Table:
    """the workouts of at least 45 minutes"""
    return t.filter(is_long)

def test_long_workouts():
    assert long_workouts(workouts.head(3)) == table(
        ["date", "activity", "duration"],
        [
            ["2025-04-02", "Yoga", 45],
            ["2025-04-03", "Cycling", 60],
        ],
    )
```

When a test like this fails, PLL says where the two tables differ: the first row
that does, or the columns, or the number of rows.

## Charts

Charts are made by methods on tables, and produce [images](/pll/images), which
show up in the interactions panel. Since a chart is an image, `beside`, `above`
and the rest work on it, and a function that returns one is annotated `-> Image`.
Every chart can also be given a `title=`, and needs a table with at least one
row. The examples use this table:

```python example
study = table(
    ["name", "year", "hours", "score"],
    [
        ["Avery", "first", 2, 62],
        ["Blake", "second", 4, 71],
        ["Casey", "first", 5, 74],
        ["Devon", "third", 7, 80],
        ["Emery", "second", 8, 85],
        ["Finley", "first", 3, 68],
        ["Gray", "third", 10, 91],
        ["Harper", "second", 6, 79],
    ],
)
study
```

### bar_chart

```
t.bar_chart(labels: str, values: str) -> Image
```

One bar per row, labeled with the row's value in the `labels` column, and as tall
as its value in the `values` column.

```python example
study.bar_chart("name", "score")
```

### freq_bar_chart

```
t.freq_bar_chart(name: str) -> Image
```

One bar for each different value in the column `name`, as tall as the number of
rows that have that value.

```python example
study.freq_bar_chart("year")
```

### pie_chart

```
t.pie_chart(labels: str, values: str) -> Image
```

One slice per row, labeled with the row's value in the `labels` column, and sized
by its share of the total of the `values` column.

```python example
study.pie_chart("name", "hours", title="Hours studied")
```

### histogram

```
t.histogram(name: str, bins: int = 10, bin_width: float = None) -> Image
```

How many rows have values in each range (or _bin_) of the column `name`. Give it
`bins=` to choose how many bins there are, or `bin_width=` to choose how wide
each one is (a histogram can have at most 1,000 bins).

```python example
study.histogram("score", bin_width=5)
```

```python example
study.histogram("score", bins=3)
```

### scatter_plot

```
t.scatter_plot(x: str, y: str) -> Image
```

One point per row, at its values in the `x` and `y` columns.

```python example
study.scatter_plot("hours", "score")
```

### line_chart

```
t.line_chart(x: str, y: str) -> Image
```

The same points as `scatter_plot`, joined by lines, in order of `x`.

```python example
study.line_chart("hours", "score")
```

### dot_plot

```
t.dot_plot(name: str) -> Image
```

One dot per row, along the values of the column `name`, stacked where rows share
a value.

```python example
study.dot_plot("hours")
```

### box_plot

```
t.box_plot(name: str) -> Image
```

A box and whisker plot of the column `name`: its quartiles, range, and any
outliers.

```python example
study.box_plot("score")
```

### lr_plot

```
t.lr_plot(x: str, y: str) -> Image
```

A scatter plot, with the line that best fits the points (a _linear regression_),
and how well it fits (r²) in the title.

```python example
study.lr_plot("hours", "score")
```

### Labeled plots

```
t.labeled_scatter_plot(labels: str, x: str, y: str) -> Image
t.labeled_dot_plot(labels: str, name: str) -> Image
t.labeled_lr_plot(labels: str, x: str, y: str) -> Image
```

Like `scatter_plot`, `dot_plot`, and `lr_plot`, but with each point colored by
its value in the `labels` column, with a key.

```python example
study.labeled_scatter_plot("year", "hours", "score")
```

### linear_regression

```
t.linear_regression(x: str, y: str) -> tuple[float, float, float]
```

The line of best fit (the one `lr_plot` draws) as numbers instead of a picture: a
tuple of its slope, its intercept, and r².

```python example
study.linear_regression("hours", "score")
```

### function_plot

```
function_plot(f: function, x_min: float, x_max: float) -> Image
```

A plot of the function `f`, for `x` from `x_min` to `x_max`. (It isn't a method:
it doesn't need a table.)

```python example
function_plot(lambda x: x * x, -3, 3)
```

## Using pandas

Later in the semester, we'll learn [pandas](https://pandas.pydata.org/), a widely
used Python library for working with tables. `t.to_pandas()` turns a PLL table
into a pandas DataFrame:

```python example
workouts.to_pandas()
```

## Charts with matplotlib

[matplotlib](https://matplotlib.org/), the most widely used Python library for
charts, works too: `plt.show()` shows each figure in the interactions panel, as a
picture.

```python
import matplotlib.pyplot as plt

plt.plot([1, 2, 3, 4], [1, 4, 9, 16])
plt.title("Squares")
plt.show()
```

Any other package that Pyodide (the Python PLL runs on) has can be imported too:
numpy, scipy, requests, and many more. The first time, it is downloaded, which
needs the network.
