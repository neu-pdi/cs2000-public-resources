---
title: Skills
id: skills
description: Skills
hide_table_of_contents: true
---

import DateView from '@site/src/components/DateView/DateView';
import AssessmentHours from '@site/src/components/AssessmentHours';
import styles from './index.module.css';

# Skills

This course will teach the following skills, assessment of which will
form the primary source of final grades.

Each skill will be assessed as "Doesn't meet expectations", "Approaching
expectations", and "Meets expectations", and students may attempt any skill
assessment up to four times with the best result being used for their grade.

To take a skill, you must go to Assessment Hours. Assessment Hours are available at the following times:
<div className={styles.assessmentHours}>
  <AssessmentHours />
</div>

For more info on Assessment Hours, as well as see what skills available each week, check out the [home page](/#assessment-hours)

0. <a id="0" href="#0">Design Function Types, Docs, Tests</a> - **Available:** <DateView id="0" item="skills" />
   |  |  |
   | -- | -- |
   | **Meets Expectations** | • Correct type annotation<br/>• Docstring that describes behavior, doesn't repeat type annotation.<br/>• A few (2+) correct, meaningfully different tests<br/>• minor typos are okay |
   | **Approaching Expectations** | • Missing docstring, or long, includes redundant type information, etc.<br/>• 1+ correct tests|

<details>
    <summary>Examples</summary>
    <p>Sample question: Design types, docstring, and tests for a function <code>nm_square</code> that, given a number, returns the result of multiplying the number by itself. NOTE: you should not implement the function!</p>
    <p>**Answer meeting expectations:**</p>

```python
def nm_square(n: float) -> float:
    """Multiplies the input by itself"""

def test_nm_square():
    assert nm_square(-1) == 1
    assert nm_square(0) == 0
    assert nm_square(2) == 4
```
<p>**Answer approaching expectations (docstring, insufficient tests):**</p>

```python
def nm_square(n: float) -> float:
    """Takes a number as an argument and returns a number. The result is what you get when multiplying the first number by itself."""

def test_nm_square():
    assert nm_square(1) == 1
```

</details> 
<details>
 <summary>Practice Problem 1</summary>
 <p>Design types, docstring, and tests for a function `check_age` that, given a number that is someone's age, returns `True` when the age is above or equal to 21. NOTE: you should not implement the function!</p>
</details>
<details>
 <summary>Practice Problem 2</summary>
 <p>Design types, docstring, and tests for a function `check_year`, that takes a year as input, and returns "Past", "Current", or "Future" depending on the year. NOTE: you should not implement the function!</p>
</details>

1. <a id="1" href="#1">Implement Basic Functions</a> - **Available:** <DateView id="1" item="skills" />
   |  |  |
   | -- | -- |
   | **Meets Expectations** | • Well-formatted, correct implementation:<br/>    • may include numbers, strings, `if` (NOT images)<br/>    • minor typos errors are okay |
   | **Approaching Expectations** | • Functioning code, but not matching problem.<br/>    • minor typos errors are okay |

<details>
    <summary>Examples</summary>
    <p>Sample question: Implement the function <code>nm_square</code> given the following type annotation, docstring, and tests:</p>
```python
def nm_square(n: float) -> float:
    """Multiplies the input by itself"""

def test_nm_square():
    assert nm_square(-1) == 1
    assert nm_square(0) == 0
    assert nm_square(2) == 4
```

    <p>**Answer meeting expectations:**</p>

```python skip
    return n * n
```
<p>**Answer approaching expectations (wrong problem):**</p>

```python skip
    return n * 2
```

</details> 
<details>
 <summary>Practice Problem 1</summary>
 <p>Implement the function `check_age` given the following type annotation, docstring, and tests:</p>

```python
def check_age(age: int) -> bool:
    """Returns True when the age is above or equal to 21"""

def test_check_age():
    assert not check_age(20)
    assert check_age(21)
    assert check_age(45)
```

</details>
<details>
 <summary>Practice Problem 2</summary>
 <p>Implement the function `check_year` given the following type annotation, docstring, and tests:</p>

```python
def check_year(year: int) -> str:
    """Returns 'Past', 'Current', or 'Future' depending on whether the year is before, equal to, or after 2026"""

def test_check_year():
    assert check_year(2020) == "Past"
    assert check_year(2026) == "Current"
    assert check_year(2030) == "Future"
```

</details>

02. <a id="2" href="#2">Construct / Transform Tables</a> - **Available:** <DateView id="2" item="skills" />
    |  |  |
    | -- | -- |
    | **Meets Expectations** | • Function designed has type annotation, docstring, and at least one test<br/>• Function uses correct table function (skill covers `filter`, `add_column`, and `transform_column`)<br/>• Row helper does what is expected, whether defined with `lambda` or named |
    | **Approaching Expectations** | • Function uses correct table function (`filter`, `add_column`, or `transform_column`)<br/>• Row helper accesses fields from row, but not in a way that solves the problem |
<details>
    <summary>Examples</summary>
    <p>Sample question: Design a function <code>find_scholars</code> that takes a table of students with "name" and "campus" columns and returns a new table containing only the students whose campus is **not** "Boston".</p>
    <p>**Answer meeting expectations:**</p>

```python
def find_scholars(t: Table) -> Table:
    """Find students not in Boston"""

    def is_scholar(r: dict) -> bool:
        return r["campus"] != "Boston"

    return t.filter(is_scholar)

def test_find_scholars():
    students = table(
        ["name", "campus"],
        [
            ["Ajay", "Oakland"],
            ["Jason", "Boston"],
            ["Lauren", "London"],
        ],
    )

    result = table(
        ["name", "campus"],
        [
            ["Ajay", "Oakland"],
            ["Lauren", "London"],
        ],
    )

    assert find_scholars(students) == result
```

<p>**Answer approaching expectations (missing docstring, incorrect row helper, no tests):**</p>

```python
def find_scholars(t: Table) -> Table:
    def is_scholar(r: dict) -> bool:
        return r["campus"] != "Boston"

    return t.filter(is_scholar)
```

</details> 
<details>
 <summary>Practice Problem 1</summary>
<p>Design a function `add_bad_year_column` that, given a table with columns for year, costs, and revenues,
adds a new column called "bad-year" that contains true if the costs exceed revenues for that year,
and false otherwise.</p>
</details>
<details>
 <summary>Practice Problem 2</summary>
<p>Design a function `find_drought_risks` that takes a table with "region", "rainfall-2023" and "rainfall-2024" columns
and returns a new table containing only those regions where rainfall amounts decreased from 2023 to 2024.</p>
</details>
03. <a id="3" href="#3">Iteration: Lists</a> - **Available:** <DateView id="3" item="skills" />
    |  |  |
    | -- | -- |
    | **Meets Expectations** | • Uses a `for` loop properly, drawing elements from the list<br/>• Mutates a single variable within the loop to correctly accumulate the result<br/>• Returns the final result after the loop |
    | **Approaching Expectations** | • Uses a `for` loop, drawing elements from the list<br/>• Either: Mutates within the loop, but in such a way that doesn't produce the correct accumulated answer, or doesn't use the final result properly at the end of the loop |
<details>
    <summary>Examples</summary>
    <p>Design a function <code>list_of_squares</code> that takes a list of numbers, and returns a list where each element is the square of N where N is the element from the list. You must use a <code>for</code> loop, rather than a built in list function or recursion.</p>
    <p>**Answer meeting expectations:**</p>

<!-- python setup
#level intermediate
-->

```python
def list_of_squares(numbers: list[float]) -> list[float]:
    """produce the squares of the numbers in the input"""

    result = []

    for n in numbers:
        result = result + [n * n]

    return result

def test_list_of_squares():
    assert list_of_squares([]) == []
    assert list_of_squares([5, 6]) == [25, 36]
    assert list_of_squares([-1, 0, 1]) == [1, 0, 1]
```

<p>**Answer approaching expectations (doesn't use the final result properly):**</p>

```python error
def list_of_squares(numbers: list[float]) -> list[float]:
    """produce the squares of the numbers in the input"""

    result = []

    for n in numbers:
        result = result + [n * n]

    return numbers

def test_list_of_squares():
    assert list_of_squares([]) == []
    assert list_of_squares([5, 6]) == [25, 36]
    assert list_of_squares([-1, 0, 1]) == [1, 0, 1]
```
</details>
<details>
   <summary>Practice Problem 1</summary>
   <p>Design a function <code>has_positive</code> that takes a list of numbers, and returns <code>True</code> if at least one number in the list is positive, <code>False</code> if none are. You must use a <code>for</code> loop, rather than a built in list function or recursion.</p>
</details> 
<details>
   <summary>Practice Problem 2</summary>
   <p>Design a function <code>all_increasing</code> that takes a list of numbers, and returns <code>True</code> if each number is greater than the preceding number, <code>False</code> otherwise. It should return <code>True</code> for the empty list. You must use a <code>for</code> loop, rather than a built in list function or recursion.</p>
</details> 
04. <a id="4" href="#4">Structured & Conditional Data</a> - **Available:** <DateView id="4" item="skills" />
    |  |  |
    | -- | -- |
    | **Meets Expectations** | • Uses `@dataclass` classes for the variants as needed, fields with appropriate type annotations<br/>• Function uses either field access or `match` as needed<br/>• Function has type annotation, doc string, and tests |
    | **Approaching Expectations** | • Uses `@dataclass` classes for the variants as needed, fields if needed (possibly missing or incorrect annotations)<br/>• Function should use either field access or `match`, but may not do it correctly, or to match the problem |
<details>
    <summary>Examples</summary>
    <p>Sample question: Design a data definition for Beverage that can be either coffee with number of shots of espresso, or tea with name and brew time in minutes. Then, write a function <code>is_strong</code> that returns <code>True</code> if the beverage is a coffee with more than 2 shots, or a tea brewed for more than 5 minutes.</p>
    <p>**Answer meeting expectations:**</p>

```python
from dataclasses import dataclass

@dataclass
class Coffee:
    shots: int

@dataclass
class Tea:
    name: str
    brew_time: float

Beverage = Coffee | Tea

def is_strong(b: Beverage) -> bool:
    """determine if beverage is strong (coffee >2 shots or tea >5 minutes)"""
    match b:
        case Coffee(shots):
            return shots > 2
        case Tea(name, brew_time):
            return brew_time > 5

def test_is_strong():
    regular = Coffee(1)
    strong_coffee = Coffee(3)
    weak_tea = Tea("Green Tea", 3)
    strong_tea = Tea("Black Tea", 7)

    assert not is_strong(regular)
    assert is_strong(strong_coffee)
    assert not is_strong(weak_tea)
    assert is_strong(strong_tea)
```

<p>**Answer approaching expectations (missing docstring, missing or incorrect annotations, only one test):**</p>

```python error
from dataclasses import dataclass

@dataclass
class Coffee:
    shots: str

@dataclass
class Tea:
    name: str
    brew_time: str

Beverage = Coffee | Tea

def is_strong(b):
    match b:
        case Coffee(shots):
            return shots > 2
        case Tea(name, brew_time):
            return brew_time > 5

def test_is_strong():
    regular = Coffee(1)
    assert not is_strong(regular)
```

</details> 
<details>
 <summary>Practice Problem 1</summary>
    <p>Design a data definition for Restaurant that can be either yahoo with name and stars, or health score with name and score. Then, write a function <code>is_reputable</code> that returns <code>True</code> if the resturant is a yahoo with at least 4 stars, or a health score with score at least 85.</p>
</details>
<details>
 <summary>Practice Problem 2</summary>
    <p>Design a data definition for Book that can be either rating with title, stars, and number of reviews, or sales ranking with title and position. Then, write a function <code>is_popular</code> that returns <code>True</code> if the book is a rating with at least 500 reviews, or a sales ranking with position less than 500.</p>
</details>
05. <a id="5" href="#5">Recursion: Lists</a> - **Available:** <DateView id="5" item="skills" />
    |  |  |
    | -- | -- |
    | **Meets Expectations** | • Function has appropriate type annotation, doc string, and tests<br/>• Function uses `match` to handle the empty (`[]`) case and the first-and-rest (`[first, *rest]`) case<br/>• In the first-and-rest case, calls function recursively on rest of list appropriately |
    | **Approaching Expectations** | • Uses `match` to break apart list, and has recursive call to rest of list |
<details>
    <summary>Examples</summary>
    <p>Sample question: Using recursion, design a function <code>make_positive</code> that takes a list of numbers and returns a new list where each number is replaced by its absolute value.</p>
    <p>**Answer meeting expectations:**</p>
   
```python
def make_positive(lon: list[float]) -> list[float]:
    """take the absolute value of each number in the list"""

    match lon:
        case []:
            return []
        case [first, *rest]:
            if first > 0:
                return [first] + make_positive(rest)
            else:
                return [0 - first] + make_positive(rest)

def test_make_positive():
    assert make_positive([]) == []
    assert make_positive([-1, 0, 2]) == [1, 0, 2]
```

<p>**Answer approaching expectations (missing docstring, incorrect behavior, inadequate tests):**</p>

   
```python
def make_positive(lon: list[float]) -> list[float]:
    match lon:
        case []:
            return []
        case [first, *rest]:
            return [-first] + make_positive(rest)

def test_make_positive():
    assert make_positive([]) == []
```

</details>
<details>
 <summary>Practice Problem 1</summary>
    <p>Using recursion, design a function <code>count_warm</code> that takes a list of numbers and returns a count of numbers greater than 70.</p>
</details>
<details>
 <summary>Practice Problem 2</summary>
    <p>Using recursion, design a function <code>build_string</code> that takes a list of strings and returns a single large string containing the original strings concatenated together in order.</p>
</details>

06. <a id="6" href="#6">Recursion: Trees</a> - **Available:** <DateView id="6" item="skills" />
    |  |  |
    | -- | -- |
    | **Meets Expectations** | • Function has appropriate type annotation, doc string, and tests<br/>• Function uses `match` to handle base case and recursive case<br/>• In recursive case, calls function recursively on subtrees appropriately |
    | **Approaching Expectations** | • Uses `match` to break apart tree, and has recursive call on subtrees |
<details>
    <summary>Examples</summary>
    <p>Design a function <code>count_internal_nodes</code> that, given the BinTree data definition below, takes a BinTree and returns the total number of internal nodes (non-leaf nodes) in the tree</p>
 
```python
from dataclasses import dataclass

@dataclass
class Leaf[T]:
    val: T

@dataclass
class Node[T]:
    left: "BinTree[T]"
    right: "BinTree[T]"

type BinTree[T] = Leaf[T] | Node[T]
```
    <p>**Answer meeting expectations:**</p>
    
```python
def count_internal_nodes(tree: BinTree) -> int:
    """counts the number of nodes that are not leafs"""
    match tree:
        case Leaf(val):
            return 0
        case Node(left, right):
            return 1 + count_internal_nodes(left) + count_internal_nodes(right)

def test_count_internal_nodes():
    tree = Node(Node(Leaf(0), Leaf(0)), Node(Node(Leaf(0), Leaf(0)), Leaf(0)))
    assert count_internal_nodes(tree) == 4
    assert count_internal_nodes(Leaf(1)) == 0
```

<p>**Answer approaching expectations (lacking doc string, does not give correct result):**</p>
    
```python error
def count_internal_nodes(tree: BinTree) -> int:
    match tree:
        case Leaf(val):
            return 0
        case Node(left, right):
            return count_internal_nodes(left) + count_internal_nodes(right)

def test_count_internal_nodes():
    tree = Node(Node(Leaf(0), Leaf(0)), Node(Node(Leaf(0), Leaf(0)), Leaf(0)))
    assert count_internal_nodes(tree) == 4
    assert count_internal_nodes(Leaf(1)) == 0
```

</details>

7. <a id="7" href="#7">Variable Scope</a> - **Available:** <DateView id="7" item="skills" />
    |  |  |
    | -- | -- |
    | **Meets Expectations** | • Output of given code, that uses variables, defined locally, in functions, globally, etc, is correct<br/>• Explanation of behavior, including global keyword if needed, is correct |
    | **Approaching Expectations** | • Explanation mentions key idea, but does not use it to correctly characterize behavior |

<details>
    <summary>Examples</summary>
<p>What will be the outcome of the following code? Explain why.</p>
   
<!-- python setup
#level advanced
-->

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
<details>
   <summary>Practice Problem 3</summary>
<p>What will be the outcome of the following code? Explain why.</p>

```python
value = 10

def process(value):
    value = value * 2
    print("Inside function:", value)
    return value

result = process(5)
print("Result:", result)
print("Global value:", value)
```
</details>

8. <a id="8" href="#8">Aliasing & Mutation</a> - **Available:** <DateView id="8" item="skills" />
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
from dataclasses import dataclass
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
from dataclasses import dataclass
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
<details>
   <summary>Practice Problem 3</summary>
    <p>What will be the output of the following code? Please explain why.</p>

```python
from dataclasses import dataclass

@dataclass
class Book:
    title: str
    pages: int

def add_pages(book, extra_pages):
    book.pages += extra_pages
    return book

my_book = Book("Python Guide", 200)
updated_book = add_pages(my_book, 50)

print("my_book:", my_book)
print("updated_book:", updated_book)
print("Same object?", my_book is updated_book)
```

</details>
    
9. <a id="9" href="#9">Identifying Privacy Issues in Problem Formulation</a> - **Available:** <DateView id="9" item="skills" />
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

10. <a id="10" href="#10">Identifying Stakeholders in Problem Formulation</a> - **Available:** <DateView id="10" item="skills" />

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
weeks), via class, practice, labs, and HW. Each of these will be marked with what skill is being introduced or reinforced by the material.

## Skill Assessment

Assessment of skills can be done at many different opportunities.

### Assessment Hours

Every week, there will be several hours held by instructors, course
coordinators, or graduate TAs, for the purpose of taking
assessments. The skills assessable at these hours are those that were introduced
the previous several weeks -- see the [Calendar](/#schedule) to see what skill is
assessable in any given day via this mechanism.

This is intended to allow you several attempts at the skill after the content is
introduced, but require you to keep up with the material -- all assessments
cannot be deferred to the end of the semester, since only the last few skills
can be attempted at the end of the semester.

### Skill Days (in Class)

Several class days will be dedicated to skill assessments. These will function identically to the Assessment Hours, except that they are during classtime, in your normal classroom. Instructors will bring a set of assessments -- students are able to
attempt any of those available (likely, due to time, a couple of them). The assessments available will be the same as what are available during assessment hours on the day that the class occurs.

## End of Semester Re-attempts

While most skill assessments must take place during the schedule below, each student may re-attempt 2 skills; such re-attempts can be scheduled in the last two weeks of classes or on the day of the final exam. (Note: there is no final exam, we will only use this time for the re-attempts.) They must contact the course coordinator (Kayla McLaughlin, k.mclaughlin@northeastern.edu) in order to do schedule these. These late semester retakes can be done regardless of how many attempts of a given skill the student has made previously.
