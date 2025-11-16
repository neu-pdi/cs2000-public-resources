---
title: Skills
id: skills
description: Skills
hide_table_of_contents: true
---

# Skills

This course will teach the following skills, repeated assessment of which will
form the primary source of final grades.

Each skill will be assessed as "Doesn't meet expectations", "Approaching
expectations", and "Meets expectations", and students may attempt any skill
assessment up to five times (four independently, and once via the bulk
assessments, see below), with the best result being used for their grade.

1. <a id="(1)" href="#(1)">Design Basic Functions (Pyret)</a>
   |  |  |
   | -- | -- |
   | **Meets Expectations** | • Correct type annotation<br/>• Docstring that describes behavior, doesn't repeat type annotation.<br/>• A few (2+) correct, meaningfully different tests<br/>• Well-formatted, correct implementation:<br/>    • may include numbers, strings, `if` (NOT images)<br/>    • minor typos are okay |
   | **Approaching Expectations** | • Missing docstring, or long, includes redundant type information, etc.<br/>• 1+ correct tests.<br/>• Correct implementation. |

<details>
    <summary>Examples</summary>
    <p>Sample question: Design a function <code>nm-square</code> that, given a number, returns the result of multiplying the number by itself.</p>
    <p>**Answer meeting expectations:**</p>

```pyret
fun nm-square(n :: Number) -> Number:
  doc: "Multiplies the input by itself"
  n * n
where:
  nm-square(-1) is 1
  nm-square(0) is 0
  nm-square(2) is 4
end
```
<p>**Answer approaching expectations (docstring, insufficient tests):**</p>

```pyret
fun nm-square(n :: Number) -> Number:
  doc: "Takes a number as an argument and returns a number. The result is what you get when multiplying the first number by itself."
  n * n
where:
  nm-square(1) is 1
end
```

</details> 
<details>
 <summary>Practice Problem 1</summary>
 <p>Design a function `check-age` that, given a number that is someone's age, returns true when the age is above or equal to 21.</p>
</details>
<details>
 <summary>Practice Problem 2</summary>
 <p>Design a function `check-year`, that takes a year as input, and returns "Past", "Current", or "Future" depending on the year.</p>
</details>

02. <a id="(2)" href="#(2)">Construct / Transform Tables (Pyret)</a>
    |  |  |
    | -- | -- |
    | **Meets Expectations** | • Function designed has signature, docstring, and at least one test<br/>• Function uses correct table function (filter-with, build-column, etc)<br/>• Row helper does what is expected, whether defined with `lam` or named |
    | **Approaching Expectations** | • Function uses correct table function (filter-with, build-column, etc)<br/>• Row helper accesses fields from row, but not in a way that solves the problem |
<details>
    <summary>Examples</summary>
    <p>Sample question: Design a function <code>find-scholars</code> that takes a table of students with "name" and "campus" columns and returns a new table containing only the students whose campus is **not** "Boston".</p>
    <p>**Answer meeting expectations:**</p>

```pyret
fun find-scholars(t :: Table) -> Table:
  doc: "Find students not in Boston"

  fun is-scholar(r :: Row) -> Boolean:
    r["campus"] <> "Boston"
  end

  filter-with(t, is-scholar)
where:
  students = table: name, campus
    row: "Ajay", "Oakland"
    row: "Jason", "Boston"
    row: "Lauren", "London"
  end

  result = table: name, campus
    row: "Ajay", "Oakland"
    row: "Lauren", "London"
  end

  find-scholars(students) is result
end
```

<p>**Answer approaching expectations (missing docstring, incorrect row helper, no tests):**</p>

```pyret
fun find-scholars(t :: Table) -> Table:
  fun is-scholar(r :: Row) -> Boolean:
    r["campus"] <> "Boston"
  end
  
  filter-with(t, is-scholar)
end
```

</details> 
<details>
 <summary>Practice Problem 1</summary>
<p>Design a function `add-bad-year-column` that, given a table with columns for year, costs, and revenues,
adds a new column called "bad-year" that contains true if the costs exceed revenues for that year,
and false otherwise.</p>
</details>
<details>
 <summary>Practice Problem 2</summary>
<p>Design a function `find-drought-risks` that takes a table with "region", "rainfall-2023" and "rainfall-2024" columns
and returns a new table containing only those regions where rainfall amounts decreased from 2023 to 2024.</p>
</details>
03. <a id="(3)" href="#(3)">Iteration: Lists (Pyret)</a>
    |  |  |
    | -- | -- |
    | **Meets Expectations** | • Uses `for each` properly, drawing elements from the list<br/>• Mutates a single variable within the loop to correctly accumulate the result<br/>• Returns the final result after the loop |
    | **Approaching Expectations** | • Uses `for each`, drawing elements from the list<br/>• Either: Mutates within the loop, but in such a way that doesn't produce the correct accumulated answer, or doesn't use the final result properly at the end of the loop |
<details>
    <summary>Examples</summary>
    <p>Design a function <code>list-of-squares</code> that takes a list of numbers, and returns a list where each element is the square of N where N is the element from the list. You must use <code>for each</code>, rather than a built in list function or recursion.</p>
    <p>**Answer meeting expectations:**</p>

```pyret
fun list-of-squares(numbers :: List<Number>) -> List<Number> block:
  doc: "produce the squares of the numbers in the input"

  var result = [list: ]
  
  for each(n from numbers):
    result := result + [list: n * n]
  end
  
  result
where:
  list-of-squares([list: ]) is [list: ]
  list-of-squares([list: 5, 6]) is [list: 25, 36]
  list-of-squares([list: -1, 0, 1]) is [list: 1, 0, 1]
end
```

<p>**Answer approaching expectations (doesn't use the final result properly):**</p>

```pyret
fun list-of-squares(numbers :: List<Number>) -> List<Number> block:
  doc: "produce the squares of the numbers in the input"

  var result = [list: ]
  
  for each(n from numbers):
    result := result + [list: n * n]
  end
  
  numbers
where:
  list-of-squares([list: ]) is [list: ]
  list-of-squares([list: 5, 6]) is [list: 25, 36]
  list-of-squares([list: -1, 0, 1]) is [list: 1, 0, 1]
end
```
</details>
<details>
   <summary>Practice Problem 1</summary>
   <p>Design a function <code>has-positive</code> that takes a list of numbers, and returns <code>true</code> if at least one number in the list is positive, <code>false</code> if none are. You must use <code>for each</code>, rather than a built in list function or recursion.</p>
</details> 
<details>
   <summary>Practice Problem 2</summary>
   <p>Design a function <code>all-increasing</code> that takes a list of numbers, and returns <code>true</code> if each number is greater than the preceding number, <code>false</code> otherwise. It should return <code>true</code> for the empty list. You must use <code>for each</code>, rather than a built in list function or recursion.</p>
</details> 
04. <a id="(4)" href="#(4)">Structured & Conditional Data (Pyret)</a>
    |  |  |
    | -- | -- |
    | **Meets Expectations** | • Uses `data` with variants as needed, fields with appropriate type annotations<br/>• Function uses either field projection or `cases` as needed<br/>• Function has signature, doc string, and tests |
    | **Approaching Expectations** | • Uses `data` with variants as needed, fields if needed (possibly missing or incorrect annotations)<br/>• Function should use either field projection or cases, but may not do it correctly, or to match the problem |
<details>
    <summary>Examples</summary>
    <p>Sample question: Design a data definition for Beverage that can be either coffee with number of shots of espresso, or tea with name and brew-time in minutes. Then, write a function <code>is-strong</code> that returns <code>true</code> if the beverage is a coffee with more than 2 shots, or a tea brewed for more than 5 minutes.</p>
    <p>**Answer meeting expectations:**</p>

```pyret
data Beverage:
  | coffee(shots :: Number)
  | tea(name :: String, brew-time :: Number)
end

fun is-strong(b :: Beverage) -> Boolean:
  doc: "determine if beverage is strong (coffee >2 shots or tea >5 minutes)"
  cases (Beverage) b:
    | coffee(shots) => shots > 2
    | tea(name, brew-time) => brew-time > 5
  end
where:
  regular = coffee(1)
  strong-coffee = coffee(3)
  weak-tea = tea("Green Tea", 3)
  strong-tea = tea("Black Tea", 7)
  
  is-strong(regular) is false
  is-strong(strong-coffee) is true
  is-strong(weak-tea) is false
  is-strong(strong-tea) is true
end
```

<p>**Answer approaching expectations (missing docstring, missing annotations, only one test):**</p>

```pyret
data Beverage:
  | coffee(shots)
  | tea(name, brew-time)
end

fun is-strong(b):
  cases (Beverage) b:
    | coffee(shots) => shots > 2
    | tea(name, brew-time) => brew-time > 5
  end
where:
  regular = coffee(1)
  is-strong(regular) is false
end
```

</details> 
<details>
 <summary>Practice Problem 1</summary>
    <p>Design a data definition for Restaurant that can be either yahoo with name and stars, or health-score with name and score. Then, write a function <code>is-reputable</code> that returns <code>true</code> if the resturant is a yahoo with at least 4 stars, or a health-score with score at least 85.</p>
</details>
<details>
 <summary>Practice Problem 2</summary>
    <p>Design a data definition for Book that can be either rating with title, stars, and num-reviews, or sales-ranking with title and position. Then, write a function <code>is-popular</code> that returns <code>true</code> if the book is a rating with num-reviews of at least 500, or a sales-ranking with position less than 500.</p>
</details>
05. <a id="(5)" href="#(5)">Recursion: Lists (Pyret)</a>
    |  |  |
    | -- | -- |
    | **Meets Expectations** | • Function has appropriate type signature, doc string, and tests<br/>• Function uses `cases` to handle `empty` case and `link` case<br/>• In `link` case, calls function recursively on rest of list appropriately |
    | **Approaching Expectations** | • Uses `cases` to break apart list, and has recursive call to rest of list |
<details>
    <summary>Examples</summary>
    <p>Sample question: Using recursion, design a function <code>make-positive</code> that takes a list of numbers and returns a new list where each number is replaced by its absolute value.</p>
    <p>**Answer meeting expectations:**</p>
   
```pyret
fun make-positive(lon :: List<Number>) -> List<Number>:
  doc: "take the absolute value of each number in the list"
  
  cases (List) lon:
    | empty => empty
    | link(first, rest) => link(
        if first > 0:
          first
        else:
          0 - first
        end,
        make-positive(rest))
  end
where:
  make-positive([list: ]) is [list: ]
  make-positive([list: -1, 0, 2]) is [list: 1, 0, 2]
end
```

<p>**Answer approaching expectations (missing docstring, incorrect behavior, inadequate tests):**</p>

   
```pyret
fun make-positive(lon :: List<Number>) -> List<Number>:
  cases (List) lon:
    | empty => empty
    | link(first, rest) => link(-first, make-positive(rest))
  end
where:
  make-positive([list: ]) is [list: ]
end
```

</details>
<details>
 <summary>Practice Problem 1</summary>
    <p>Using recursion, design a function <code>count-warm</code> that takes a list of numbers and returns a count of numbers greater than 70.</p>
</details>
<details>
 <summary>Practice Problem 2</summary>
    <p>Using recursion, design a function <code>build-string</code> that takes a list of strings and returns a single large string containing the original strings concatenated together in order.</p>
</details>

06. <a id="(6)" href="#(6)">Recursion: Trees (Pyret)</a>
    |  |  |
    | -- | -- |
    | **Meets Expectations** | • Function has appropriate type signature, doc string, and tests<br/>• Function uses `cases` to handle base case and recursive case<br/>• In recursive case, calls function recursively on subtrees appropriately |
    | **Approaching Expectations** | • Uses `cases` to break apart tree, and has recursive call on subtrees |
<details>
    <summary>Examples</summary>
    <p>Design a function <code>count-internal-nodes</code> that, given the BinTree data definition below, takes a BinTree and returns the total number of internal nodes (non-leaf nodes) in the tree</p>
 
```pyret
data BinTree<a>:
  | leaf(val :: a)
  | node(left :: BinTree<a>, right :: BinTree<a>)
end
```
    <p>**Answer meeting expectations:**</p>
    
```pyret
fun count-internal-nodes(tree :: BinTree) -> Number:
  doc: "counts the number of nodes that are not leafs"
  cases (BinTree) tree:
    | leaf(val) => 0
    | node(left, right) => 1 + count-internal-nodes(left) + count-internal-nodes(right)
  end
where:
  tree = node(node(leaf(0), leaf(0)), node(node(leaf(0), leaf(0)), leaf(0)))
  count-internal-nodes(tree) is 4
  count-internal-nodes(leaf(1)) is 0
end
```

<p>**Answer approaching expectations (lacking doc string, does not give correct result):**</p>
    
```pyret
fun count-internal-nodes(tree :: BinTree) -> Number:
  cases (BinTree) tree:
    | leaf(val) => 0
    | node(left, right) => count-internal-nodes(left) + count-internal-nodes(right)
  end
where:
  tree = node(node(leaf(0), leaf(0)), node(node(leaf(0), leaf(0)), leaf(0)))
  count-internal-nodes(tree) is 4
  count-internal-nodes(leaf(1)) is 0
end
```

</details>

7. <a id="(7)" href="#(7)">Variable Scope (Python)</a>
    |  |  |
    | -- | -- |
    | **Meets Expectations** | • Output of given code, that uses variables, defined locally, in functions, globally, etc, is correct<br/>• Explanation of behavior, including global keyword if needed, is correct |
    | **Approaching Expectations** | • Explanation mentions key idea, but does not use it to correctly characterize behavior |

<details>
    <summary>Examples</summary>
<p>What will be the outcome of the following code? Explain why.</p>
   
```python
temperature = 72

def adjust_temp():
    temperature = 68
    print("Room temp:", temperature)

adjust_temp()
print("House temp:", temperature)
```

<p>**Answer meeting expectations:**</p>

```
Room temp: 68
House temp: 72

The first temperature is a local variable within adjust_temp().
The second temperature is the global variable, which is not
affected by the function call. It is shadowed by the local variable.
```

<p>**Answer approaching expectations (right idea, wrong result)**:</p>

```
Room temp: 68
House temp: 68

The first temperature is a local variable within adjust_temp().
The second temperature is the global variable, which is not
affected by the function call. It is shadowed by the local variable.
```
</details>

<details>
   <summary>Practice Problem 1</summary>
<p>What will be the outcome of the following code? Explain why.</p>

```python
clicks = 0

def track_click():
    global clicks
    clicks = clicks + 1
    return clicks

print(track_click())
print(track_click())
```

</details>

<details>
   <summary>Practice Problem 2</summary>
<p>What will be the outcome of the following code? Explain why.</p>

```python
x = 5
y = 10

def f1():
    global x, y
    temp = x
    x = y
    y = temp
    print("In f1: x = ", x, ", y = ", y)

print("Before f1: x = ", x, ", y = ", y)
f1()
print("After f1: x = ", x, ", y = ", y)
```

</details>

8. <a id="(8)" href="#(8)">Design basic functions (Python)</a>
    |  |  |
    | -- | -- |
    | **Meets Expectations** | • Correct type annotation<br/>• Docstring that describes behavior, doesn't repeat type annotation<br/>• A few (2+) correct, meaningfully different tests<br/>• Correct implementation |
    | **Approaching Expectations** | • Missing docstring, or long, includes redundant type information, etc.<br/>• 1+ correct tests<br/>• Correct implementation |

<details>
    <summary>Examples</summary>
<p>Design a Python function `calculate_year` that takes a number of credits completed and returns the academic status
based on these boundaries:</p>
   * credits < 32: freshman
   * 32 ≤ credits < 64: sophomore
   * 64 ≤ credits < 96: junior
   * credits >= 96: senior
<p>Note: test `assert`s may be written without wrapping test functions.</p>
<p>**Answer meeting expectations:**</p>

```python
def calculate_year(credits: int) -> str:
    "determines NU year based on credits completed"
    if credits < 32:
        return "freshman"
    elif credits < 64:
        return "sophomore"
    elif credits < 96:
        return "junior"
    else:
        return "senior"

assert(calculate_year(20)) == "freshman"
assert(calculate_year(32)) == "sophomore"
assert(calculate_year(64)) == "junior"
assert(calculate_year(100)) == "senior"
```

<p>**Answer approaching expectations (missing type annotation, missing docstring, only one test):**</p>

```python
def calculate_year(credits):
    if credits < 32:
        return "freshman"
    elif credits < 64:
        return "sophomore"
    elif credits < 96:
        return "junior"
    else:
        return "senior"

assert(calculate_year(20)) == "freshman"
```

</details>

<details>
    <summary>Practice Problem</summary>
<p>Design a function `convert_to_usd` that takes an amount of money and a currency (`"EUD"`, `"CAD"`, or `"INR"`)
   and returns the equivalent amount of US dollars (USD). Assume:</p>
   * 1 EUR is 1.15 USD
   * 1 CAD is 0.70 USD
   * 1 INR is 0.01 USD
<p>Note: test `assert`s may be written without wrapping test functions.</p>
</details>

9. <a id="(9)" href="#(9)">Iteration: Lists (Python)</a>
    |  |  |
    | -- | -- |
    | **Meets Expectations** | • Uses `for ... in ...` properly, drawing elements from the list<br/>• Mutates a single variable within the loop to correctly accumulate the result<br/>• Returns the final result after the loop |
    | **Approaching Expectations** | • Uses `for ... in ...`, drawing elements from the list<br/>• Either: Mutates within the loop, but in such a way that doesn't produce the correct accumulated answer, or doesn't use the final result properly at the end of the loop |
<details>
    <summary>Examples</summary>
    <p>Design a Python function <code>list_of_squares</code> that takes a list of number and returns a list of the squares of the numbers. You must use <code>for ... in ...</code> loop.</p>
   <p>Note: test <code>assert</code>s may be written without wrapping test functions, for space.</p>
   <p>**Answer meeting expectations:**</p>

```python
def list_of_squares(numbers: list[float]) -> list[float]:
    """returns the squares of the numbers"""
    result = []
    for number in numbers:
        result = result + [number * number]
    return result

assert list_of_squares([]) == []
assert list_of_squares([1, 2]) == [1, 4]
```

<p>**Answer approaching expectations (incorrect result):**</p>

```python
def list_of_squares(numbers: list[float]) -> list[float]:
    """returns the squares of the numbers"""
    result = []
    for number in numbers:
        result = result + number
    return result

assert list_of_squares([]) == []
assert list_of_squares([1, 2]) == [1, 4]
```

</details>

<details>
   <summary>Practice Problem 1</summary>
   <p>Design a Python function <code>list_of_squares</code> that takes a list of number and returns<code>true</code> if at least one number in the list is positive, <code>false</code> if none are. You must use <code>for ... in ...</code> loop.</p>
   <p>Note: test <code>assert</code>s may be written without wrapping test functions, for space.</p>
</details> 
<details>
   <summary>Practice Problem 2</summary>
   <p>Design a Python function <code>all_increasing</code> that takes a list of number and returns<code>True</code> if each number is greater than the preceding number, <code>False</code> otherwise. It should return <code>True</code> for the empty list.. You must use <code>for ... in ...</code> loop.</p>
   <p>Note: test <code>assert</code>s may be written without wrapping test functions, for space.</p>
</details> 

10. <a id="(10)" href="#(10)">Aliasing & Mutation (Python)</a>
    |  |  |
    | -- | -- |
    | **Meets Expectations** | • Output of given code that uses mutation of values like lists, aliasing, etc, is correct<br/>• Explanation of behavior is correct |
    | **Approaching Expectations** | • Explanation mentions key idea, but does not use it to correctly characterize behavior |
<details>
    <summary>Examples</summary>
    <p>What will be the output of the following code? Please explain why.</p>
```python
from dataclasses import dataclass
@dataclass
class Account:
    name: str
    value: float

account1 = Account("Daniel", 100)
account2 = Account("Daniel", 100)

print("Same objects?", account1 is account2)
print("Equal objects?", account1 == account2)
account1.value = 200
print("Same objects?", account1 is account2)
print("Equal objects?", account1 == account2)  
```
   <p>**Answer meeting expectations:**</p>
```
Same objects? False
Equal objects? True
Same objects? False
Equal objects? False

The two accounts have different heap locations, so they are never the same object.
They are initially equal objects because they have the same data. After account1.value
is changed, they are no longer equal.
```

   <p>**Answer approaching expectations (key idea, but not correct):**</p>
```
Same objects? True
Equal objects? True
Same objects? False
Equal objects? False

Objects with different heap locations can be equal but are not the same object.
```
</details>
<details>
   <summary>Practice Problem 1</summary>
    <p>What will be the output of the following code? Please explain why.</p>

```python
@dataclass
class Sensor:
    name: str
    temperature: float

def reset_temperature(sensor):
    sensor.temperature = 0.0
    return sensor

outdoor_sensor = Sensor("Outside", 25.5)
result = reset_temperature(outdoor_sensor)

print("outdoor_sensor:", outdoor_sensor)
print("result:", result)
print("Are they the same?", outdoor_sensor is result)
```

</details>
<details>
   <summary>Practice Problem 2</summary>
    <p>What will be the output of the following code? Please explain why.</p>

```python
@dataclass
class Player:
    name: str
    score: int

def double_score(player):
    player.score *= 2
    return player

player1 = Player("Alex", 100)
player2 = double_score(player1)

print("player1:", player1)
print("player2:", player2)
print("Same player object?", player1 is player2)
```
</details> 
    
12. <a id="(11)" href="#(11)">Identifying Privacy Issues in Problem Formulation</a>
    |  |  |
    | -- | -- |
    | **Meets Expectations** | • Privacy analysis chart is complete and each entry is correct<br/> • Identify named privacy issue in a new context<br/> • Proposed mitigation strategy is appropriate given context |
    | **Approaching Expectations** | • Chart is complete but at least one entry is not correct<br/> • Attempts to identify named privacy issue but mis-identifies, or explanation is unclear<br/> • Proposed mitigation of known privacy issue would not address the privacy threat |
<details>
    <summary>Examples</summary>
    <p>**Sample question**: You are designing a system for a campus food service. Students can specify their dietary restrictions through a website that requires their student id, which is used to create a record containing other personal information. The resulting record can be accessed by any food service employee (full-time staff and student workers) and is searchable by all fields.</p>
   <p>Here is an analysis of the flow of information in the context:</p>

|  |  |
| -- | -- |
| What type of information is shared? | Personal information, including legal name, photo, phone number, address, and dietary restrictions |
| Who is/are the subject(s) of the information? | The student |
| Who is the sender of the information? | The student and the university |
| Who are the potential recipients of the information? | Food service workers<br/>intended: meal planners/preparers and managers<br/>unintended: ??? |
| What principles govern the collection and transmission of this information? | Students provide their dietary restrictions freely while logged in with their student id, although they do not have a choice about what linked information is accessed |

<p>The principle of data minimization suggests that we limit the collection, storage, and transmission of personal data to only the data absolutely necessary to perform the task.</p>

<p>Using our privacy analysis, identify **one unintended recipient**, and also **how access to data might be designed to minimize transmission**.</p>

**Answer meeting expectations:** One unintended recipient would be student workers, who should not be allowed to retrieve other students' photos, addresses, or phone numbers. Access to data could be minimized by making contact information available only to the manager, in case a student needs to be notified that food was mislabeled.

**Answer approaching expectations:** One unintended recipient would be students who don't work for the food service [incorrect] who could get private information [too vague]. Access to data could be minimized by keeping the data encrypted [does not address the privacy threat].

</details>
<details>
<summary> Practice Problem</summary>
<p>A city is considering hiring a company to run an automated license plate scanning service to cut down
on parking violations (parking too long in a spot, no-parking zones, etc.). The company is planning to
have vehicles constantly patrol the streets, transmitting video footage as well as location and time
information back to their central server, where optical recognition systems will scan for license plate
numbers, and record where and when cars were parked. The system would also automatically issue parking
violation tickets when appropriate.
The company plans to archive all of the data, including the raw video footage,
in case people try to contest the ticket. All recorded data is also available to the Department of Motor Vehicles.</p>

|  |  |
|----------|---------|
| What type of information is shared? |  Vehicle license plate numbers, location and timestamp, video footage |
| Who is/are the subject of the information? | Vehicles on public roadways, and their owners |
| Who is the sender of the information? | The vehicle scanning services company |
| Who are the potential recipients of the information? | <p> Intended: motor vehicle department, law enforcement. Unintended: **???** </p>|
| What principles govern the collection and transmission of this information? | Drivers implicitly consent by using public roadways, but may not be aware that their vehicle is being scanned. |

<p>Please **list TWO unintended recipients**, and also **how access to the collected and processed data might be designed to minimize transmission to unexpected recipients?**</p>
</details>

12. <a id="(12)" href="#(12)">Identifying Stakeholders in Problem Formulation</a>

|  |  |
| -- | -- |
| **Meets Expectations** | • Complete stakeholder matrix that lists all relevant stakeholders and at least one relevant interest at stake for each stakeholder<br/> • Answer identifies the specified number of conflicts between stakeholder interests/values (e.g., if the task is to identify 2 values conflicts, the answer identifies 2 values conflicts) |
| **Approaching Expectations** | • If prompted to provide a complete chart, chart fails to identify relevant stakeholders OR fails to identify their relevant interests/values<br/> • Chart does not identify relevant interests<br/> • Identifies some, but fewer than specified number of conflicts between stakeholder interests/values (e.g., if the task is to identify 2 values conflicts, the answer identifies 1 values conflict) |

<details>
    <summary>Examples</summary>
    <p>**Sample question**: A university has a cafeteria and collects information about students' dietary restrictions, which may be due to students' health requirements or strongly-held beliefs. Below is a stakeholder matrix:</p>

| Stakeholder | Interest/Value |
| -- | -- |
| University budget managers |  |
| Vegetarians |  |
|  |  |

<p>FIRST: Complete the stakeholder matrix for cafeteria system design by identifying, and filling in, interests/values that correspond to the listed stakeholders, and, in the third case, by supplying both the stakeholder and the listed interest/value. SECOND: Explain in one or two sentences which (if any) stakeholder interests/values can come into conflict.</p>

<p>**Answer meeting expectations**</p>

| Stakeholder | Interest/Value |
| -- | -- |
| University budget managers | minimizing food waste |
| Vegetarians | having healthy and tasty food options |
| Meat eaters | having non-vegetarian food options |

<p>The interests of vegetarians and meat eaters could come into conflict because each group wants multiple options of their preferred food type, but the cafeteria can only offer a limited number of options.</p>

<p>**Answer approaching expectations** (incomplete chart, incorrect conflict)</p>

| Stakeholder | Interest/Value |
| -- | -- |
| University budget managers | minimizing food waste |
| Vegetarians | having soda |
|  |  |

<p>The interests of budget managers and vegetarians could come into conflict if they like the tastes of different types of soda.</p>

</details>
<details>
 <summary>Practice Problems</summary>
 <p>A rideshare company, Ryde, is developing an AI-powered rider usage prediction system. The system will analyze existing rideshare patterns and proactively adjust fares, increasing charges for customers based on predicted demand. Below is a stakeholder-value matrix.</p>

| Stakeholder | Interest/Value |
|-------------|---------------|
| Customers on Ryde | |
| Drivers on Ryde | |
| Stakeholder 3 | Revenue Generation |

<p>FIRST: Complete the stakeholder matrix for AI content moderation design by identifying, and filling in, unique values/interests for the stakeholders listed, and, in the third case, by supplying the stakeholder for the value/interest.</p>

<p>SECOND: Explain in one or two sentences which (if any) stakeholder interests/values can **come into conflict**.</p>

</details>

## Skill Introduction

Skills will be introduced in certain weeks (and may be re-inforced in later
weeks), via class, recitation, labs, and HW. Each of these will be marked with what skill is being introduced or reinforced by the material.

## Skill Assessment

Assessment of skills can be done at many different opportunities.

### Assessable@Hours

Every week, there will be several special hours held by instructors, course
coordinators, or graduate TAs, that exist solely for the purpose of taking
assessments. The skills assessable at these hours are those that were introduced
the previous several weeks -- see the table below to see what skill is
assessable in any given week via this mechanism.

This is intended to allow you several attempts at the skill after the content is
introduced, but require you to keep up with the material -- all assessments
cannot be deferred to the end of the semester, since only the last few skills
can be attempted at the end of the semester.

### Skill Days

Several class days exist as gaps in our schedule, and some of the class may be
used to catch up on material, but 30+ mins of class will be used for skill
assessments. Instructors will bring a set of assessments -- students are able to
attempt any of those available (likely, due to time, 1-2 of them). See the
schedule below to see what weeks these occur in, and what skills are assessable
during each one.

- <a id="(day1)" href="#(day1)">Skill Day 1</a>: [1](</skills/#(1)>), [2](</skills/#(2)>), [11](</skills/#(11)>), [12](</skills/#(12)>)
- <a id="(day2)" href="#(day2)">Skill Day 2</a>: [3](</skills/#(3)>), [4](</skills/#(4)>), [5](</skills/#(5)>), [11](</skills/#(11)>), [12](</skills/#(12)>)
- <a id="(day3)" href="#(day3)">Skill Day 3</a>: [6](</skills/#(6)>), [7](</skills/#(7)>), [8](</skills/#(8)>), [9](</skills/#(9)>), [10](</skills/#(10)>)

### Skill Bundles

Finally, there are two bulk assessment slots, which take place during normal lab
time, during the semester. These collectively cover all of the skills for the
semester, and students are welcome to attempt all of the assessments available
-- every student will be given a packet with a set of assessments when they come
to the lab session. If they have already completed a given skill, they can skip
that one, and if they have already completed all the skills, they are welcome to
skip the bulk assessment entirely. The two bundles are:

- <a id="(bundle1)" href="#(bundle1)">Skill Bundle 1</a>: [1](<#(1)>), [2](<#(2)>), [3](<#(3)>), [4](<#(4)>), [11](<#(11)>), [12](<#(12)>)
- <a id="(bundle2)" href="#(bundle2)">Skill Bundle 2</a>: [5](<#(5)>), [6](<#(6)>), [7](<#(7)>), [8](<#(8)>), [9](<#(9)>), [10](<#(10)>)

## End of Semester Re-attempts

While most skill assessments must take place during the schedule below, each student may make _two_ re-attempts during the last three weeks (Nov 17 to Dec 5) of the semester. They must contact the course coordinator (Kayla McLaughlin, k.mclaughlin@northeastern.edu) in order to do schedule these. These late semester retakes can be done regardless of how many attempts of a given skill the student has made previously.

## Skill Schedule

| Week | Topic | Skill Introduced | Assessable@Hours | Skill Day | Skill Bundle |
| -- | -- | -- | -- | -- | -- |
| 1 | Programming with numbers, strings, images: IDE, interactions, operations on standard values |  |  |  |  |
| 2 | Definitions, functions, conditionals: type annotations, test cases | [1](<#(1)>) |  |  |  |
| 3 | Ethics, intro to tables: constructing, importing, extracting | [2](<#(2)>), [11](<#(11)>), [12](<#(12)>) | [1](<#(1)>) |  |  |
| 4 | More on tables: transforming, filtering | [2](<#(2)>), [11](<#(11)>), [12](<#(12)>) | [1](<#(1)>), [11](<#(11)>), [12](<#(12)>) |  |  |
| 5 | From tables to lists: extracting columns, performing operations on them, visualizing data |  | [1](<#(2)>), [2](<#(2)>), [11](<#(11)>), [12](<#(12)>) | [SkillDay1](<#(day1)>) |  |
| 6 | Computing with lists: iteration & mutable local variables | [3](<#(3)>) | [2](<#(2)>), [11](<#(11)>), [12](<#(12)>) |  |  |
| 7 | Structured data | [4](<#(3)>) | [2](<#(2)>), [3](<#(3)>), [11](<#(11)>), [12](<#(12)>) |  |  |
| 8 | Conditional & recursive data | [5](<#(5)>) | [3](<#(3)>), [4](<#(4)>), [11](<#(11)>), [12](<#(12)>) |  | [SkillBundle1](<#(bundle1)>) |
| 9 | Trees | [6](<#(6)>) | [3](<#(3)>), [4](<#(4)>), [5](<#(5)>), [11](<#(11)>), [12](<#(12)>) | [SkillDay2](<#(day2)>) |  |
| 10 | Transition to Python: IDE, files, definitions, testing | [7](<#(7)>), [8](<#(8)>) | [4](<#(4)>), [5](<#(5)>), [6](<#(6)>) |  |  |
| 11 | Transition to Python: more state & aliasing, loops, mutable data structures | [9](<#(9)>), [10](<#(10)>) | [4](<#(4)>), [5](<#(5)>), [6](<#(6)>), [7](<#(7)>), [8](<#(8)>) |  |  |
| 12 | Tables in Python: pandas & matplotlib |  | [6](<#(6)>), [7](<#(7)>), [8](<#(8)>), [9](<#(9)>), [10](<#(10)>) |  | [SkillBundle2](<#(bundle2)>) |
| 13 | File I/O: csv files, via pandas and manually |  | [7](<#(7)>), [8](<#(8)>), [9](<#(9)>), [10](<#(10)>) | [SkillDay3](<#(day3)>) |  |
| 14 | More with Python: catch up, bonus content, etc |  | [9](<#(9)>), [10](<#(10)>) |  |  |
