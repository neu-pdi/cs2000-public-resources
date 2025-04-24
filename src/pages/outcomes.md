---
title: Outcomes
id: outcomes
description: Learning Outcomes
hide_table_of_contents: true
---

* 1\. Students can identify input / output data for particular problems, and write them down formally as type annotations.
  *  <a id="(1.1)" href="#(1.1)">1.1\.</a> Simple types: numbers, strings, booleans, images, tables
  * <a id="(1.2)" href="#(1.2)">1.2\.</a> Parametric types: Lists, Trees
  * <a id="(1.3)" href="#(1.3)">1.3\.</a> Limitations of signatures in capturing _effects_.
* 2\. Students can write thorough test suites for functions of varying complexity.
  * <a id="(2.1)" href="#(2.1)">2.1\.</a> What is a test? How do I write one?
  * <a id="(2.2)" href="#(2.2)">2.2\.</a> What makes a set of tests "good" -- edge cases, coverage, concise.
* 3\. Students can clearly articulate, in precise language, documentation strings for functions.
  * <a id="(3.1)" href="#(3.1)">3.1\.</a> What is a docstring for?
  * <a id="(3.2)" href="#(3.2)">3.2\.</a> What should be in, and not be in, a good docstring?

* 4\. Students can solve smaller problem in the service of solving larger problems, without being told the breakdown ahead of time.
   * <a id="(4.1)" href="#(4.1)">4.1\.</a> Separate types of data should have separate functions
   * <a id="(4.2)" href="#(4.2)">4.2\.</a> Data transformations expressed as a sequence of simpler operations
* <a id="(5)" href="#(5)">5\.</a> Students identify types of data that can be represented using tables, and write programs using common table operations.
* 6\. Students can write programs using mutable and immutable variables and mutable and immutable data. 
   * <a id="(6.1)" href="#(6.1)">6.1\.</a> Loops over list with a single mutable variable
   * <a id="(6.2)" href="#(6.2)">6.2\.</a> Difference between variable and value mutation.
* 7\. Students can identify pros and cons of using given data to solve the desired
   problem, and identify and defend privacy issues in problems presented to them
   without being told there is a privacy issue to identify.
    
    * <a id="(7.1)" href="#(7.1)">7.1\.</a> Given the functional requirements of the program to be built and an explicitly identified and concrete second objective (privacy, fairness, accessibility), students can identify ways in which the given data can be used to solve the primary problem while falling short on the secondary objective.

    * <a id="(7.2)" href="#(7.2)">7.2\.</a> Given the functional requirements of the program to be built, students independently identify a way that using the given data to solve the problem would fall short on a second objective (privacy, fairness, accessibility) *when prompted to look for one*. 

    * <a id="(7.3)" href="#(7.3)">7.3\.</a> Given the functional requirements of the program to be built, students independently identify a way that using the given data to solve the problem would fall short on a second objective (privacy, fairness, accessibility) *without a prompt* after practice following a checklist. 

    * <a id="(7.4)" href="#(7.4)">7.4\.</a> Given a definition of privacy and examples of privacy problems using that definition, students can identify new privacy issues of the same kind when cued to look for a privacy problem. 

    * <a id="(7.5)" href="#(7.5)">7.5\.</a> Relying on prior definitions of privacy, students can independently identify new privacy problems of the same kind given the cue to look for a problem but not the explicit cue to look for a privacy problem. 

    * <a id="(7.6)" href="#(7.6)">7.6\.</a> Given experience with specific solutions previously presented to them for privacy problems, students can suggest similar mitigations for new privacy problems.
   
* 8\. Given a technical problem, students can (a) identify the stakeholders, (b) identify values and interests at stake for each stakeholder, (c) discuss conflicts of values, and (d) identify modifications that would mitigate conflicts of values.

    * <a id="(8.1)" href="#(8.1)">8.1\.</a> Given a technical problem, students can (a) identify stakeholders relative to a certain problem (e.g. privacy), including at least one stakeholder not listed in the problem set-up. Notes: Stakeholders are relative to the concern you are addressing, so have to do it with a very specific concern (such as privacy). For privacy in particular, students should recognize that people related to or friends with a named party might also have a stake in the privacy of the named party.  Keep in mind that there are some stakeholders who are directly in contact with the technology and others who might be affected by the technology without being in contact with it. 

    * <a id="(8.2)" href="#(8.2)">8.2\.</a> Given a technical problem, students can (a) identify at least one stakeholder not listed in the problem setup and (b) identify at least one value and/or interest at stake for each stakeholder.
  
    * <a id="(8.3)" href="#(8.3)">8.3\.</a> Given a technical problem, students can (a) identify the stakeholders, including some not listed in the problem setup and (b) identify at least one value and/or interest at stake for each stakeholder and (c) identify conflicts between the values and/or interests of stakeholders.

    * <a id="(8.4)" href="#(8.4)">8.4\.</a> Given a technical problem, students can (a) identify the stakeholders, including some not listed in the problem setup and (b) identify at least one value and/or interest at stake for each stakeholder, (c) identify conflicts between the values and/or interests of stakeholders and (d) recognize resolutions to value conflicts.  

* <a id="(9)" href="#(9)">9\.</a> Students learn to work with others while solving problems.

 ## Assessable Outcomes by Week / Assignment
 
 Week | Topic | Lab Outcome | Homework Outcome
-- | -- | -- | -- 
1 | Programming with numbers, strings, images: IDE, interactions, operations on standard values | - | [1:](/homework/1.md) None
2  | Definitions, functions, conditionals: type annotations, test cases | [1:](/lab/1.md) [7.1](#(7.1)), [9](#(9)) |[2:](/homework/2.md) [1.1](#(1.1)), [2.1](#(2.1)), [3.1](#(3.1)), [7.1](#(7.1))
3  | Introduction to tables: constructing, importing, extracting | [2:](/lab/2.md) ?,9 | [3:](/homework/3.md) [1.1](#(1.1)), [2.1](#(2.1)), [3.1](#(3.1)), [5](#(5)), [7.2](#(7.2))
4  | More on tables: transforming, filtering | [3:](/lab/3.md) ?, [9](#(9))| [4:](/homework/4.md) [1.1](#(1.1)), [2.1](#(2.1)), [3.2](#(3.2)), [4.2](#(4.2)), [5](#(5)), [7.3](#(7.3))
5  | From tables to lists: extracting columns, performing operations on them, visualizing data | [4:](/lab/4.md) ?, [9](#(9)) | [5:](/homework/5.md) [1.1](#(1.1)), [2.1](#(2.1)), [3.2](#(3.2)), [5](#(5)), [7.4](#(7.4))
6  | Computing with lists: iteration & mutable local variables | - | -
7  | Structured data: towards trees | [5:](/lab/5.md) ?, [9](#(9)) | [6:](/homework/6.md) [1.2](#(1.2)), [2.2](#(2.2)), [6.1](#(6.1)), [4.2](#(4.2)), [7.5](#(7.5))
8  | Working with trees: recursive functions | [6:](/lab/6.md) ?, [9](#(9))| [7:](/homework/7.md) [1.2](#(1.2)), [2.2](#(2.2)), [4.1](#(4.1)), [7.6](#(7.6)), [8.1](#(8.1))
9  | More with trees | [7:](/lab/7.md) ?, [9](#(9)) | [8:](/homework/8.md) [1.2](#(1.2)), [2.2](#(2.2)), [4.2](#(4.2)), [8.2](#(8.2))
10 | Transition to Python: IDE, files, definitions, testing | [8:](/lab/8.md) ?, [9](#(9)) | [9:](/homework/9.md) [8.3](#(8.3))
11  | Transition to Python: more state & aliasing, loops, mutable data structures | [10:](/lab/10.md)  [9](#(9)) | [10:](/homework/10.md) [1.3](#(1.3)), [6.2](#(4.2)), [8.4](#(8.4))
12  | Tables in Python: pandas & matplotlib | - | - 
13  | File I/O: csv files, via pandas and manually | [10:](/lab/10.md) ?, [9](#(9)) | - 
14  | More with Python: catch up, bonus content, etc | - | -


## Lecture Backwards Design


Lecture                | Learning Goals
 --                    |  --
[1](/lecture-notes/1)   | - show pyret environment <br/> - arithmetic, expressions, evaluation
[2](/lecture-notes/2)   | - show strings <br/> - shapes, images as values, composition of images <br/> - types & errors when operations don't match <br/> - show documentation for images
[3](/lecture-notes/3)   | - definitons vs interactions <br/> - defining constants <br/> - program directory & shadowing
[4](/lecture-notes/4)   | - functions to abstract repeated code <br/> - type annotations
[5](/lecture-notes/5)   | - boolean values & comparison operators <br/> - `if` expressions <br/> - tests <br/> - `spy`
[6](/lecture-notes/6)   | - introduce tabular data <br/> - how to write literal tables <br/> - how to extract rows & columns
[7](/lecture-notes/7)   | - define functions over tables <br/> - filtering tables <br/> - ordering tables
[8](/lecture-notes/8)   | - adding columns by computation <br/> - transforming columns by computation
[9](/lecture-notes/9) | - testing functions that produce tables
[10](/lecture-notes/10) | - cleaning & normalizing data
[11](/lecture-notes/11) | - task planning with data <br/> - visualizing data
[12](/lecture-notes/12) | - extracting columns (lists) from tables
[13](/lecture-notes/13) | - using standard computations over lists
[14](/lecture-notes/14) | - combining column extraction, standard computations
[15](/lecture-notes/15) | - mutable variables <br/> - `for each`
[16](/lecture-notes/16) | - building custom reusable computations <br/> - `when`
[17](/lecture-notes/17) | - testing with mutable variables
[18](/lecture-notes/18) | - structured data <br/> - `cases`
[19](/lecture-notes/19) | - conditional data
[20](/lecture-notes/20) | - lists as structured data <br/> - computing functions by examples
[21](/lecture-notes/21) | - recursive functions over lists <br/> - template for recursive functions
[22](/lecture-notes/22) | - introduce tree structured data <br/> - challenge of representing trees with tables
[23](/lecture-notes/23) | - trees as recursive data <br/> - multiple self references = multiple recursive calls
[24](/lecture-notes/24) | - recursive functions over trees <br/> - warning: trying to use `for each` on trees
[25](/lecture-notes/25) | - show python IDE, codespaces, terminal <br/> - arithmetic, strings, definitions
[26](/lecture-notes/26) | - testing in python, dataclasses, lists
[27](/lecture-notes/27) | - for loops in python
[28](/lecture-notes/28) | - scoping in python (global, nonlocal), different program directory
[29](/lecture-notes/29) | - mutable data structures, aliasing, contrast with pyret <br/> equality in python
[30](/lecture-notes/30) | - tables in python: loading csvs with pandas, filtering, data cleaning
[31](/lecture-notes/31) | - tables in python: computing new columns, basic stats
[32](/lecture-notes/32) | - visualizing with matplotlib
[33](/lecture-notes/33) | - file I/O, reading & writing CSVs by hand
[34](/lecture-notes/34) | - extra content: dictionaries

