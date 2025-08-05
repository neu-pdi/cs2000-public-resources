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

---

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

---

## Creating and Manipulating Tables

**filter-with**(t :: Table, keep :: (Row -> Boolean)) -> Table  
Given a table and a predicate on rows, returns a table with only the rows for which the predicate returns true.

**order-by**(t :: Table, colname :: String, sort-up :: Boolean) -> Table  
Given a table and the name of a column in that table, return a table with the same rows but ordered based on the named column. If sort-up is true, the table will be sorted in ascending order, otherwise it will be in descending order.

**build-column**(t :: Table, colname :: String, builder :: (Row -> A)) -> Table  
Consumes an existing table, and produces a new table containing an additional column with the given colname, using builder to produce the values for that column, once for each row.  
Here, A is the type of the new column, determined by the type of value the builder function returns.

**add-row**(t :: Table, r :: Row) -> Table  
Consumes a table and a row to add, and produces a new table with the rows from the original table followed by the given row.

**add-col**(t :: Table, colname :: String, c-vals :: List&lt;Any&gt;) -> Table  
Consumes a column name and a list of values, and produces a new table with the columns of the original followed by a column with the given name and values. Note that the length of _c-vals_ must equal the length of the table.

**select-columns**(t :: Table, colnames :: List&lt;String&gt;) -> Table  
Consumes a table and a list of column names, and produces a new table containing only those columns. The order of the columns is as given in the list.

**transform-column**(t :: Table, colname :: String, f :: (A -> B)) -> Table  
Consumes a table, a column name and a transformation function, and produces a new table where the given function has been applied to all values in the named column. The values in the original column are of type _A_ (the input to the function) and values in the new column have type _B_ (the output of the function).

**create-table-with-col**(colname :: String, colvals :: List) -> Table  
Creates a new table with a single column having the given name and values.

---

## Extracting Data Through Table Methods

Table methods are how we extract data from a table. Methods are similar in spirit to functions, but their notation (_table.operation(args)_) is more suggestive of going inside a table to extract data.

**t.row-n**(n :: Number) -> Row  
For a table _t_, returns the _n_th row, where row numbers start at 0

**t.length()** -> Number  
For a table _t_, returns the number of rows in the table

**t.get-column**(colname :: String) -> List&lt;A&gt;  
Returns a list of the values in the named column in table _t_. _A_ is the type of the data in the named column

**t.drop**(colname :: String) -> Table  
Returns a table that is the same as table _t_, except with the column whose name is _colname_ removed.

**Getting a value**: The syntax `my-row[col-name]` accesses a row at a particular column, resulting in a particular value. e.g. `my-row["age"]` → `20`.

---

## Function-Based Extraction (Alternative to Methods)

**get-row**(t :: Table, index :: Number) -> Row  
Alternative to `t.row-n(index)`. Returns the _index_th row, where row numbers start at 0.

---

## Summarizing Columns

**sum**(t :: Table, colname :: String) -> Number  
Takes a table and the name of a column in that table. Returns the sum of values in the column. Note that the column must contain numbers.

**mean**(t :: Table, colname :: String) -> Number  
Takes a table and the name of a column in that table. Returns the mean (average value) of values in the column. Note that the column must contain numbers.

**median**(t :: Table, colname :: String) -> Number  
Takes a table and the name of a column in that table. Returns the median (middle value) of values in the column. Note that the column must contain numbers.

**modes**(t :: Table, colname :: String) -> List&lt;A&gt;  
Takes a table and the name of a column in that table. Returns the modes (most common values) in the column, where _A_ is the type of data in the column.

**stdev**(t :: Table, colname :: String) -> Number  
Takes a table and the name of a column in that table. Returns the standard deviation (a measure of how spread out values are) of the values in the column. Note that the column must contain numbers.

---

## Grouping and Counting

**group**(tab :: Table, col :: String) -> Table  
Groups the table by unique values in the named column, producing a table with columns "value" and "subtable" where each subtable contains rows with that value.

**count**(tab :: Table, col :: String) -> Table  
Produces a table that summarizes how many rows have each value in the named column. Returns a table with columns "value" and "count".

**count-many**(tab :: Table, cols :: List&lt;String&gt;) -> Table  
Like count, but works on multiple columns. Returns a table with columns "col" and "subtable" containing count tables for each column.

---

## Plots and Charts

**histogram**(t :: Table, colname :: String, bin-width :: Number) -> Image  
Display a histogram of values in the named column, which must contain numeric data. Bin-width indicates the width of bins in the histogram.

**scatter-plot**(t :: Table, xs :: String, ys :: String) -> Image  
Display a scatter plot from the given table. _xs_ names the column to use for x values, and _ys_ names the column to use for y values. Both columns must contain numeric data.

**labeled-scatter-plot**(t :: Table, ls :: String, xs :: String, ys :: String) -> Image  
Like scatter-plot, but with labels from the _ls_ column for each point.

**lr-plot**(t :: Table, xs :: String, ys :: String) -> Image  
Like a call to scatter-plot with the same inputs. The difference is that a linear regression will be attempted on the elements of the plot, and a regression line will be drawn over the data.

**labeled-lr-plot**(t :: Table, ls :: String, xs :: String, ys :: String) -> Image  
Like lr-plot, but with labels from the _ls_ column for each point.

**box-plot**(t :: Table, vs :: String) -> Image  
Produces a box plot of the values in the column named _vs_ in the table. A box plot shows the minimum, maximum, and median values of a column, as well as the first (lowest) and third quartiles of the dataset; this is helpful for seeing the variation in a dataset.

**freq-bar-chart**(t :: Table, vs :: String) -> Image  
Display a frequency bar-chart from the given table. There is one bar for each unique value of _vs_ (showing the number of occurrences of that value).

**function-plot**(f :: (Number -> Number)) -> Image  
Displays a plot of the given function.

---

##  Examples

Here are some examples:

### Example Table Definition
```pyret
use context dcic2024

# Define a sample student table
students = table: name :: String, score :: Number, grade :: String, points :: Number
  row: "Alex", 92, "A", 185
  row: "Jordan", 78, "C", 156
  row: "Casey", 85, "B", 170
  row: "Taylor", 95, "A", 190
  row: "Avery", 67, "D", 134
  row: "Riley", 88, "B", 176
end
```

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
# Basic statistics
avg-score = mean(students, "score")
total-points = sum(students, "points")
highest-score = students.get-column("score").max()
lowest-score = students.get-column("score").min()

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