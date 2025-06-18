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

A brief summary of what is expected for "Meets expections" is given below each
numbered skill.

1. <a id="(1)" href="#(1)">Design basic functions (Pyret)</a>
   - Type annotations (for basic types -- strings, numbers, images, booleans)
   - Doc strings (concise, not redundant with type annotation, not including unnecessary implementation details)
   - Test cases in `where` blocks (covering common cases, "edge" cases -- zero and negative numbers, empty strings, etc)
   - Well-formatted implementations -- clear naming for function arguments, no unnecessary `if` expressions, etc. 
2. <a id="(2)" href="#(2)">Construct / Transform Tables (Pyret)</a>
   - Create literal tables in code, and import them from CSVs (stored at URLs and files)
   - Extracting rows and single values from tables
   - Using common table utilities like `build-column`, `filter-with`, `transform-column` to transform tables
   - Use `lam` for more concise transformations
3. <a id="(3)" href="#(3)">Iteration: Lists (Pyret)</a>
   - Use local mutable variables defined with `var`, along with `for each` loops
     to construct values incrementally, element by element from a list.
4. <a id="(4)" href="#(4)">Structured & Conditional Data (Pyret)</a>
   - Create and use data that has multiple fields, using field projection ("dot" notation) to access fields
   - Correct type annotations for data type, vs. constructor name.
   - Create and use data that has multiple variants, using `cases` to write code
     that can do different things depending on the variant.
5. <a id="(5)" href="#(5)">Recursion: Lists (Pyret)</a>
   - Design functions over lists using `cases`, which recur on the tail in the
     `link` case.
6. <a id="(6)" href="#(6)">Recursion: Trees (Pyret)</a>
   - Design trees using `data`, which have more than one field that refer to the data definition.
   - Design functions over trees using `cases`, which recur on the self-referential fields. 
7. <a id="(7)" href="#(7)">Variable Scope (Pyret & Python)</a>
   - Understand the behavior of variables defined within functions and outside.
   - Understand Python's variable definition and variable update behavior.
   - Understand Python's `global` syntax, and why and when it is necessary.
8. <a id="(8)" href="#(8)">Design basic functions (Python)</a>
   - Type annotations (for types like strings, numbers, booleans, lists)
   - Doc strings (concise, not redundant with type annotations, not including unnecessary implementation details)
   - Test cases in separate test functions using `assert`, following `pytest` conventions (covering common cases, "edge" cases, etc)
   - Well-formatted implementations -- clear naming for function arguments, no unnecessary if statements, etc.
9. <a id="(9)" href="#(9)">Iteration: Lists (Python)</a>
   - Use local variables and `for ... in` loops to construct values incrementally, element by element from a list.
10. <a id="(10)" href="#(10)">Aliasing & Mutation (Python)</a>
    - Understand the difference between modifying variables and modifying fields of dataclasses or elements of lists.
    - Understand the consequences of having multiple variables pointing to the same data. 
11. <a id="(11)" href="#(11)">Identifying Privacy Issues in Problem Formulation</a>
12. <a id="(12)" href="#(12)">Identifying Stakeholders in Problem Formulation</a> 

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

- <a id="(day1)" href="#(day1)">Skill Day 1</a>:  [1](/skills/#(1)), [2](/skills/#(2)), [11](/skills/#(11)), [12](/skills/#(12))
- <a id="(day2)" href="#(day2)">Skill Day 2</a>: [3](/skills/#(3)), [4](/skills/#(4)), [5](/skills/#(5)), [11](/skills/#(11)), [12](/skills/#(12))
- <a id="(day3)" href="#(day3)">Skill Day 3</a>: [6](/skills/#(6)), [7](/skills/#(7)), [8](/skills/#(8)), [9](/skills/#(9)), [10](/skills/#(10))

### Skill Bundles

Finally, there are two bulk assessment slots, which take place during normal lab
time, during the semester. These collectively cover all of the skills for the
semester, and students are welcome to attempt all of the assessments available
-- every student will be given a packet with a set of assessments when they come
to the lab session. If they have already completed a given skill, they can skip
that one, and if they have already completed all the skills, they are welcome to
skip the bulk assessment entirely. The two bundles are:

- <a id="(bundle1)" href="#(bundle1)">Skill Bundle 1</a>: [1](#(1)), [2](#(2)), [3](#(3)), [4](#(4)), [5](#(5)), [11](#(11)), [12](#(12))
- <a id="(bundle2)" href="#(bundle2)">Skill Bundle 2</a>:  [6](#(6)), [7](#(7)), [8](#(8)), [9](#(9)), [10](#(10)), [11](#(11)), [12](#(12))

## Skill Schedule

 Week | Topic | Skill Introduced | Assessable@Hours | Skill Day | Skill Bundle
-- | -- | -- | --  | -- | --
1 | Programming with numbers, strings, images: IDE, interactions, operations on standard values | [11](#(11)), [12](#(12)) | | |
2  | Definitions, functions, conditionals: type annotations, test cases | [1](#(1))| | |
3  | Introduction to tables: constructing, importing, extracting | [2](#(2)) | [1](#(1)), [11](#(11)), [12](#(12)) | |
4  | More on tables: transforming, filtering | [2](#(2)) | [1](#(1)), [11](#(11)), [12](#(12)) | |
5  | From tables to lists: extracting columns, performing operations on them, visualizing data | | [1](#(2)), [2](#(2)), [11](#(11)), [12](#(12)) | [SkillDay1](#(day1)) |
6  | Computing with lists: iteration & mutable local variables | [3](#(3)) | [2](#(2)), [11](#(11)), [12](#(12)) | |
7  | Structured & conditional data | [4](#(3)) | [2](#(2)), [3](#(3)), [11](#(11)), [12](#(12)) | | 
8  | Working with trees: recursive functions |  [5](#(5)) | [3](#(3)), [4](#(4)), [11](#(11)), [12](#(12)) | | [SkillBundle1](#(bundle1))
9  | More with trees | [6](#(6)) | [3](#(3)), [4](#(4)), [5](#(5)), [11](#(11)), [12](#(12)) | [SkillDay2](#(day2)) |
10 | Transition to Python: IDE, files, definitions, testing | [7](#(7)), [8](#(8)) | [4](#(4)), [5](#(5)), [6](#(6)) | |
11  | Transition to Python: more state & aliasing, loops, mutable data structures | [9](#(9)), [10](#(10)) | [5](#(5)), [6](#(6)), [7](#(7)), [8](#(8)) | |
12  | Tables in Python: pandas & matplotlib |  | [6](#(6)), [7](#(7)), [8](#(8)), [9](#(9)), [10](#(10)) | | [SkillBundle2](#(bundle2)) 
13  | File I/O: csv files, via pandas and manually | | [7](#(7)), [8](#(8)), [9](#(9)), [10](#(10)) | |
14  | More with Python: catch up, bonus content, etc | | [9](#(9)), [10](#(10)) | [SkillDay3](#(day3)) |

