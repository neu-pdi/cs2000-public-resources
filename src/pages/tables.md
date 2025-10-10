---
title: Tables Functions Documentation
id: tables
description: Pyret Tables Functions Reference
hide_table_of_contents: false
---

# Tables Functions Documentation

Pyret has three different notations for manipulating tables. The version we are using, based on functions, is not covered in the Pyret documentation or the textbook.

**Use this, not the Pyret Documentation, for working with tables!**

Always make sure the beginning of your file looks like (in gray):

```pyret
use context dcic2024
```

If it isn't, click the Pyret logo above the top left corner of the Definitions window and click Choose Context and type `dcic2024` into the field.

______________________________________________________________________

## Creating a Table from Scratch

If we want to explicitly define a Table, we can write it using this syntax:

```pyret
table: col0-name :: col0-type, col1-name :: col1-type, ...
  row: r0c0, r0c1, ...
  row: r1c0, r1c1, ...
  row: r2c0, r2c1, ...
  ...
end
```

Example:

```pyret
my-table = table: id :: Number, cell-usage :: String, rides-horses :: Boolean
  row: 111, "sometimes", false
  row: 17, "never", true
  row: 22, "frequently", true 
  row: 18, "never", true
  row: 33, "never", true
end
```

______________________________________________________________________

## Creating Tables from CSVs

First, make sure you have the CSV library included:

```pyret
include csv
```

This allows you to use two functions:

**csv-table-url**(url :: String, options) -> Table\
Load a table from a CSV file at the given URL. Use `default-options` for the options parameter.

**csv-table-file**(filename :: String, options) -> Table\
Load a table from a CSV file in your project. Use `default-options` for the options parameter.

Since CSVs read all data as strings, you probably want to include `sanitize` clauses as we do below to convert numeric columns to numbers. This will fail if any values aren't indeed numbers, in which case you need to do more sophisticated cleaning using `transform-column`.

Be sure to **include data-source** at the top of the file, or else `num-sanitizer` will be unbound.

Example:

```pyret
include csv
include data-source

# From URL
recipes = load-table:
  title :: String,
  servings :: Number,
  prep-time :: Number
  source: csv-table-url("https://pdi.run/f25-2000-recipes.csv", default-options)
  sanitize servings using num-sanitizer
  sanitize prep-time using num-sanitizer
end

# From file that exists inside the github repository, so you see 
# it in the left side
dat = load-table:
  name :: String,
  value :: Number
  source: csv-table-file("mydata.csv", default-options)
  sanitize value using num-sanitizer
end
```

## Sample Table for Examples

The functions described below all use this student table:

```pyret
use context dcic2024

students = table: name :: String, score :: Number, grade :: String, points :: Number
  row: "Alex", 92, "A", 185
  row: "Jordan", 78, "C", 156
  row: "Casey", 85, "B", 170
  row: "Taylor", 95, "A", 190
  row: "Avery", 67, "D", 134
  row: "Riley", 88, "B", 176
end
```

______________________________________________________________________

## Creating and Manipulating Tables

### filter-with

**filter-with**(t :: Table, keep :: (Row -> Boolean)) -> Table\
Given a table and a predicate on rows, returns a table with only the rows for which the predicate returns true.

```pyret
fun is-high-score(r :: Row) -> Boolean:
  r["score"] >= 90
end
high-scorers = filter-with(students, is-high-score)
```

### order-by

**order-by**(t :: Table, colname :: String, sort-up :: Boolean) -> Table\
Given a table and the name of a column in that table, return a table with the same rows but ordered based on the named column. If sort-up is true, the table will be sorted in ascending order, otherwise it will be in descending order.

```pyret
# Sort by score, highest first (descending)
sorted-students = order-by(students, "score", false)

# Sort by name alphabetically (ascending)
alphabetical = order-by(students, "name", true)
```

### build-column

**build-column**(t :: Table, colname :: String, builder :: (Row -> A)) -> Table\
Consumes an existing table, and produces a new table containing an additional column with the given colname, using builder to produce the values for that column, once for each row.\
Here, A is the type of the new column, determined by the type of value the builder function returns.

```pyret
fun calc-total(r :: Row) -> Number:
  r["quantity"] * r["price"]
end
orders-with-total = build-column(orders, "total", calc-total)
```

### add-row

**add-row**(t :: Table, r :: Row) -> Table\
Consumes a table and a row to add, and produces a new table with the rows from the original table followed by the given row. Note that it is easiest to create a single row by using the `.row()` method on a table.

```pyret
new-student = students.row("Sam", 88, "B", 176)
updated-students = add-row(students, new-student)
```

### add-col

**add-col**(t :: Table, colname :: String, c-vals :: List\<Any>) -> Table\
Consumes a column name and a list of values, and produces a new table with the columns of the original followed by a column with the given name and values. Note that the length of _c-vals_ must equal the length of the table.

```pyret
pass-fail-list = [list: "Pass", "Pass", "Pass", "Pass", "Fail", "Pass"]
students-with-pf = add-col(students, "pass-fail", pass-fail-list)
```

### select-columns

**select-columns**(t :: Table, colnames :: List\<String>) -> Table\
Consumes a table and a list of column names, and produces a new table containing only those columns. The order of the columns is as given in the list.

```pyret
# Keep only name and score columns
basic-info = select-columns(students, [list: "name", "score"])
```

### transform-column

**transform-column**(t :: Table, colname :: String, f :: (A -> B)) -> Table\
Consumes a table, a column name and a transformation function, and produces a new table where the given function has been applied to all values in the named column. The values in the original column are of type _A_ (the input to the function) and values in the new column have type _B_ (the output of the function).

```pyret
fun add-bonus(score :: Number) -> Number:
  score + 5
end
bonus-scores = transform-column(students, "score", add-bonus)
```

### create-table-with-col

**create-table-with-col**(colname :: String, colvals :: List) -> Table\
Creates a new table with a single column having the given name and values.

```pyret
names-list = [list: "Alice", "Bob", "Carol"]
names-table = create-table-with-col("student-name", names-list)
```

______________________________________________________________________

## Table Methods: Extracting Data and Other

Table methods are how we extract data from a table. Methods are similar in spirit to functions, but their notation (_table.operation(args)_) is more suggestive of going inside a table to extract data.

### .row-n

**t.row-n**(n :: Number) -> Row\
For a table _t_, returns the \_n_th row, where row numbers start at 0

```pyret
first-student = students.row-n(0)
third-student = students.row-n(2)
```

### .length

**t.length()** -> Number\
For a table _t_, returns the number of rows in the table

```pyret
num-students = students.length()
```

### .get-column

**t.get-column**(colname :: String) -> List\<A>\
Returns a list of the values in the named column in table _t_. _A_ is the type of the data in the named column

```pyret
all-scores = students.get-column("score")
all-names = students.get-column("name")
```

### .drop

**t.drop**(colname :: String) -> Table\
Returns a table that is the same as table _t_, except with the column whose name is _colname_ removed.

```pyret
students-no-points = students.drop("points")
```

### .empty

**t.empty()** -> Table\
Returns a new table with the same columns as table _t_, but with all rows removed.

```pyret
empty-students = students.empty()
# Creates a table with same column structure but no data rows
check:
  t1 = table: city, pop
    row: "Houston", 2400000
    row: "NYC", 8400000
  end
  t1.empty() is table: city, pop end
end
```

### Getting a Value

**Getting a value**: The syntax `my-row[col-name]` accesses a row at a particular column, resulting in a particular value. e.g. `my-row["age"]` → `20`.

```pyret
first-student = students.row-n(0)
alex-score = first-student["score"]
alex-grade = first-student["grade"]
```

______________________________________________________________________

## Function-Based Extraction (Alternative to Methods)

### get-row

**get-row**(t :: Table, index :: Number) -> Row\
Alternative to `t.row-n(index)`. Returns the \_index_th row, where row numbers start at 0.

```pyret
first-student = get-row(students, 0)
# Same as: first-student = students.row-n(0)
```

______________________________________________________________________

## Summarizing Columns

### sum

**sum**(t :: Table, colname :: String) -> Number\
Takes a table and the name of a column in that table. Returns the sum of values in the column. Note that the column must contain numbers.

```pyret
total-points = sum(students, "points")
```

### mean

**mean**(t :: Table, colname :: String) -> Number\
Takes a table and the name of a column in that table. Returns the mean (average value) of values in the column. Note that the column must contain numbers.

```pyret
avg-score = mean(students, "score")
avg-points = mean(students, "points")
```

### median

**median**(t :: Table, colname :: String) -> Number\
Takes a table and the name of a column in that table. Returns the median (middle value) of values in the column. Note that the column must contain numbers.

```pyret
median-score = median(students, "score")
```

### modes

**modes**(t :: Table, colname :: String) -> List\<A>\
Takes a table and the name of a column in that table. Returns the modes (most common values) in the column, where _A_ is the type of data in the column.

```pyret
most-common-grades = modes(students, "grade")
```

### stdev

**stdev**(t :: Table, colname :: String) -> Number\
Takes a table and the name of a column in that table. Returns the standard deviation (a measure of how spread out values are) of the values in the column. Note that the column must contain numbers.

```pyret
score-spread = stdev(students, "score")
```

______________________________________________________________________

## Grouping and Counting

### group

**group**(tab :: Table, col :: String) -> Table\
Groups the table by unique values in the named column, producing a table with columns "value" and "subtable" where each subtable contains rows with that value.

```pyret
grouped-by-grade = group(students, "grade")
```

### count

**count**(tab :: Table, col :: String) -> Table\
Produces a table that summarizes how many rows have each value in the named column. Returns a table with columns "value" and "count".

```pyret
grade-counts = count(students, "grade")
```

### count-many

**count-many**(tab :: Table, cols :: List\<String>) -> Table\
Like count, but works on multiple columns. Returns a table with columns "col" and "subtable" containing count tables for each column.

```pyret
multiple-counts = count-many(students, [list: "grade", "name"])
```

______________________________________________________________________

## Plots and Charts

### histogram

**histogram**(t :: Table, colname :: String, bin-width :: Number) -> Image\
Display a histogram of values in the named column, which must contain numeric data. Bin-width indicates the width of bins in the histogram.

```pyret
score-histogram = histogram(students, "score", 10)
```

### scatter-plot

**scatter-plot**(t :: Table, xs :: String, ys :: String) -> Image\
Display a scatter plot from the given table. _xs_ names the column to use for x values, and _ys_ names the column to use for y values. Both columns must contain numeric data.

```pyret
score-points-plot = scatter-plot(students, "score", "points")
```

### labeled-scatter-plot

**labeled-scatter-plot**(t :: Table, ls :: String, xs :: String, ys :: String) -> Image\
Like scatter-plot, but with labels from the _ls_ column for each point.

```pyret
labeled-plot = labeled-scatter-plot(students, "name", "score", "points")
```

### lr-plot

**lr-plot**(t :: Table, xs :: String, ys :: String) -> Image\
Like a call to scatter-plot with the same inputs. The difference is that a linear regression will be attempted on the elements of the plot, and a regression line will be drawn over the data.

```pyret
regression-plot = lr-plot(students, "score", "points")
```

### labeled-lr-plot

**labeled-lr-plot**(t :: Table, ls :: String, xs :: String, ys :: String) -> Image\
Like lr-plot, but with labels from the _ls_ column for each point.

```pyret
labeled-regression = labeled-lr-plot(students, "name", "score", "points")
```

### box-plot

**box-plot**(t :: Table, vs :: String) -> Image\
Produces a box plot of the values in the column named _vs_ in the table. A box plot shows the minimum, maximum, and median values of a column, as well as the first (lowest) and third quartiles of the dataset; this is helpful for seeing the variation in a dataset.

```pyret
score-distribution = box-plot(students, "score")
```

### freq-bar-chart

**freq-bar-chart**(t :: Table, vs :: String) -> Image\
Display a frequency bar-chart from the given table. There is one bar for each unique value of _vs_ (showing the number of occurrences of that value).

```pyret
grade-chart = freq-bar-chart(students, "grade")
```

### function-plot

**function-plot**(f :: (Number -> Number)) -> Image\
Displays a plot of the given function.

```pyret
fun quadratic(x :: Number) -> Number:
  (x * x) + (2 * x) + 1
end
quad-plot = function-plot(quadratic)
```

______________________________________________________________________

## Examples

Here are some examples that combine multiple functions:

### Filtering and Sorting

```pyret
# Filter for high scores
fun is-high-score(r :: Row) -> Boolean:
  r["score"] >= 90
end
high-scorers = filter-with(students, is-high-score)

# Sort by score (descending - highest first)
sorted-students = order-by(students, "score", false)

# Sort by name (ascending - alphabetical)
alphabetical = order-by(students, "name", true)
```

### Adding and Transforming Columns

```pyret
# Add a letter grade column based on score
fun calc-letter-grade(r :: Row) -> String:
  score = r["score"]
  if score >= 90: "A"
  else if score >= 80: "B"
  else if score >= 70: "C"
  else if score >= 60: "D"
  else: "F"
  end
end
students-with-grades = build-column(students, "letter-grade", calc-letter-grade)

# Add a pass/fail column
fun calc-pass-fail(r :: Row) -> String:
  if r["score"] >= 70: "Pass" else: "Fail" end
end
students-with-pf = build-column(students, "pass-fail", calc-pass-fail)

# Transform scores to be out of 4.0 scale
fun to-gpa-scale(score :: Number) -> Number:
  score / 25
end
students-gpa = transform-column(students, "score", to-gpa-scale)
```

### Statistics and Analysis

```pyret
# add at top
import math as M
# Basic statistics
avg-score = mean(students, "score")
total-points = sum(students, "points")
highest-score = M.max(students.get-column("score"))
lowest-score = M.min(students.get-column("score"))

# Get information about grades
grade-distribution = count(students, "grade")
unique-grades = modes(students, "grade")
```

### Data Extraction

```pyret
# Get specific rows and values
first-student = students.row-n(0)
alex-score = first-student["score"]

# Extract columns as lists
all-scores = students.get-column("score")
all-names = students.get-column("name")

# Get number of students
num-students = students.length()
```

### Working with Restaurant Data

```pyret
orders = table: dish :: String, price :: Number, quantity :: Number, day :: String
  row: "Pizza", 12.50, 2, "Monday"
  row: "Salad", 8.75, 1, "Monday"
  row: "Burger", 10.00, 3, "Tuesday"
  row: "Pizza", 12.50, 1, "Tuesday"
  row: "Pasta", 11.25, 2, "Wednesday"
end

# Calculate total cost per order
fun calc-total(r :: Row) -> Number:
  r["price"] * r["quantity"]
end
orders-with-total = build-column(orders, "total", calc-total)

# Filter for large orders (quantity >= 2)
fun is-large-order(r :: Row) -> Boolean:
  r["quantity"] >= 2
end
large-orders = filter-with(orders, is-large-order)

# Get daily statistics
total-revenue = sum(orders-with-total, "total")
avg-order-size = mean(orders, "quantity")
orders-per-day = count(orders, "day")
```
