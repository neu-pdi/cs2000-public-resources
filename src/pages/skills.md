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

1. <a id="(1)" href="#(1)">Design basic functions (Pyret)</a>
   |  |  |
   | -- | -- |
   | **Meets Expectations** | • Correct type annotation<br/>• Docstring that describes behavior, doesn't repeat type annotation.<br/>• A few (2+) correct, meaningfully different tests<br/>• Well-formatted, correct implementation:<br/>    • may include numbers, strings, `if` (NOT images)<br/>    • minor typos are okay |
   | **Approaching Expectations** | • Missing docstring, or long, includes redundant type information, etc.<br/>• 1+ correct tests.<br/>• Correct implementation. |

<details>
    <summary>Examples</summary>
    <p>Sample question: Design a function <code>nm-square</code> that, given a number, returns the result of multiplying the number by itself.</p>
    <p>Answer meeting expectations:</p>

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

```
<p>Answer approaching expectations (docstring, insufficient tests):</p>
```

```pyret
fun nm-square(n :: Number) -> Number:
  doc: "Takes a number as an argument and returns a number. The result is what you get when multiplying the first number by itself."
  n * n
where:
  nm-square(1) is 1
end
```

</details> 
02. <a id="(2)" href="#(2)">Construct / Transform Tables (Pyret)</a>
    |  |  |
    | -- | -- |
    | **Meets Expectations** | • Function designed has signature, docstring, and at least one test<br/>• Function uses correct table function (filter-with, build-column, etc)<br/>• Row helper does what is expected, whether defined with `lam` or named |
    | **Approaching Expectations** | • Function uses correct table function (filter-with, build-column, etc)<br/>• Row helper accesses fields from row, but not in a way that solves the problem |
<details>
    <summary>Examples</summary>
    <p>Sample question: Design a function <code>find-scholars</code> that takes a table of students with "name" and "campus" columns and returns a new table containing only the students whose campus is **not** "Boston".</p>
    <p>Answer meeting expectations:</p>

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

```
<p>Answer approaching expectations (missing docstring, incorrect row helper, no tests):</p>
```

```pyret
fun find-scholars(t :: Table) -> Table:
  fun is-scholar(r :: Row) -> Boolean:
    r["campus"] < "Boston"
  end
  
  filter-with(t, is-scholar)
end
```

</details> 
03. <a id="(3)" href="#(3)">Iteration: Lists (Pyret)</a>
    |  |  |
    | -- | -- |
    | **Meets Expectations** | • Uses `for each` properly, drawing elements from the list<br/>• Mutates a single variable within the loop to correctly accumulate the result<br/>• Returns the final result after the loop |
    | **Approaching Expectations** | • Uses `for each`, drawing elements from the list<br/>• Either: Mutates within the loop, but in such a way that doesn't produce the correct accumulated answer, or doesn't use the final result properly at the end of the loop |
<details>
    <summary>Examples</summary>
    <p>Design a function <code>list-of-squares</code></cond> that takes a list of numbers, and returns a list where each element is the square of N where N is the element from the list. You must use for each, rather than a built in list function or recursion.</p>
    <p>Answer meeting expectations:</p>

```pyret
fun list-of-squares(numbers :: List<Number>) -> List<String> block:
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

<p>Answer approaching expectations (doesn't use the final result properly):</p>

```pyret
fun list-of-squares(numbers :: List<Number>) -> List<String> block:
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
</details> 
04. <a id="(4)" href="#(4)">Structured & Conditional Data (Pyret)</a>
    |  |  |
    | -- | -- |
    | **Meets Expectations** | • Uses `data` with variants as needed, fields with appropriate type annotations<br/>• Function uses either field projection or `cases` as needed<br/>• Function has signature, doc string, and tests |
    | **Approaching Expectations** | • Uses `data` with variants as needed, fields if needed (possibly missing or incorrect annotations)<br/>• Function should use either field projection or cases, but may not do it correctly, or to match the problem |
05. <a id="(5)" href="#(5)">Recursion: Lists (Pyret)</a>
    |  |  |
    | -- | -- |
    | **Meets Expectations** | • Function has appropriate type signature, doc string, and tests<br/>• Function uses `cases` to handle `empty` case and `link` case<br/>• In `link` case, calls function recursively on rest of list appropriately |
    | **Approaching Expectations** | • Uses `cases` to break apart list, and has recursive call to rest of list |
06. <a id="(6)" href="#(6)">Recursion: Trees (Pyret)</a>
    |  |  |
    | -- | -- |
    | **Meets Expectations** | • Function has appropriate type signature, doc string, and tests<br/>• Function uses `cases` to handle base case and recursive case<br/>• In recursive case, calls function recursively on subtrees appropriately |
    | **Approaching Expectations** | • Uses `cases` to break apart tree, and has recursive call on subtrees |
07. <a id="(7)" href="#(7)">Variable Scope (Python)</a>
    |  |  |
    | -- | -- |
    | **Meets Expectations** | • Output of given code, that uses variables, defined locally, in functions, globally, etc, is correct<br/>• Explanation of behavior, including global keyword if needed, is correct |
    | **Approaching Expectations** | • Explanation mentions key idea, but does not use it to correctly characterize behavior |
08. <a id="(8)" href="#(8)">Design basic functions (Python)</a>
    |  |  |
    | -- | -- |
    | **Meets Expectations** | • Correct type annotation<br/>• Docstring that describes behavior, doesn't repeat type annotation<br/>• A few (2+) correct, meaningfully different tests<br/>• Correct implementation |
    | **Approaching Expectations** | • Missing docstring, or long, includes redundant type information, etc.<br/>• 1+ correct tests<br/>• Correct implementation |
09. <a id="(9)" href="#(9)">Iteration: Lists (Python)</a>
    |  |  |
    | -- | -- |
    | **Meets Expectations** | • Uses `for ... in ...` properly, drawing elements from the list<br/>• Mutates a single variable within the loop to correctly accumulate the result<br/>• Returns the final result after the loop |
    | **Approaching Expectations** | • Uses `for ... in ...`, drawing elements from the list<br/>• Either: Mutates within the loop, but in such a way that doesn't produce the correct accumulated answer, or doesn't use the final result properly at the end of the loop |
10. <a id="(10)" href="#(10)">Aliasing & Mutation (Python)</a>
    |  |  |
    | -- | -- |
    | **Meets Expectations** | • Output of given code that uses mutation of values like lists, aliasing, etc, is correct<br/>• Explanation of behavior is correct |
    | **Approaching Expectations** | • Explanation mentions key idea, but does not use it to correctly characterize behavior |
11. <a id="(11)" href="#(11)">Identifying Privacy Issues in Problem Formulation</a>
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

## Skill Schedule

| Week | Topic | Skill Introduced | Assessable@Hours | Skill Day | Skill Bundle |
| -- | -- | -- | -- | -- | -- |
| 1 | Programming with numbers, strings, images: IDE, interactions, operations on standard values |  |  |  |  |
| 2 | Definitions, functions, conditionals: type annotations, test cases | [1](<#(1)>) |  |  |  |
| 3 | Ethics, intro to tables: constructing, importing, extracting | [2](<#(2)>), [11](<#(11)>), [12](<#(12)>) | [1](<#(1)>) |  |  |
| 4 | More on tables: transforming, filtering | [2](<#(2)>), [11](<#(11)>), [12](<#(12)>) | [1](<#(1)>), [11](<#(11)>), [12](<#(12)>) |  |  |
| 5 | From tables to lists: extracting columns, performing operations on them, visualizing data |  | [1](<#(2)>), [2](<#(2)>), [11](<#(11)>), [12](<#(12)>) | [SkillDay1](<#(day1)>) |  |
| 6 | Computing with lists: iteration & mutable local variables | [3](<#(3)>) | [2](<#(2)>), [11](<#(11)>), [12](<#(12)>) |  |  |
| 7 | Structured & conditional data | [4](<#(3)>) | [2](<#(2)>), [3](<#(3)>), [11](<#(11)>), [12](<#(12)>) |  |  |
| 8 | Working with trees: recursive functions | [5](<#(5)>) | [3](<#(3)>), [4](<#(4)>), [11](<#(11)>), [12](<#(12)>) |  | [SkillBundle1](<#(bundle1)>) |
| 9 | More with trees | [6](<#(6)>) | [3](<#(3)>), [4](<#(4)>), [5](<#(5)>), [11](<#(11)>), [12](<#(12)>) | [SkillDay2](<#(day2)>) |  |
| 10 | Transition to Python: IDE, files, definitions, testing | [7](<#(7)>), [8](<#(8)>) | [4](<#(4)>), [5](<#(5)>), [6](<#(6)>) |  |  |
| 11 | Transition to Python: more state & aliasing, loops, mutable data structures | [9](<#(9)>), [10](<#(10)>) | [5](<#(5)>), [6](<#(6)>), [7](<#(7)>), [8](<#(8)>) |  |  |
| 12 | Tables in Python: pandas & matplotlib |  | [6](<#(6)>), [7](<#(7)>), [8](<#(8)>), [9](<#(9)>), [10](<#(10)>) |  | [SkillBundle2](<#(bundle2)>) |
| 13 | File I/O: csv files, via pandas and manually |  | [7](<#(7)>), [8](<#(8)>), [9](<#(9)>), [10](<#(10)>) |  |  |
| 14 | More with Python: catch up, bonus content, etc |  | [9](<#(9)>), [10](<#(10)>) | [SkillDay3](<#(day3)>) |  |
