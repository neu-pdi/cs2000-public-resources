---
sidebar_position: 33
class_number: 33
pll_level: advanced
title: Extra - Dictionaries
---

## Skills: None

## Reading (Done Before Class)
We could write every `filter` and `map` task as a `for` loop, but the named
operations make it easier for readers to see what our code does. Are there
other common patterns that would benefit from special handling? As an example,
here is a dataclass for airline flights, and functions to look up the
destination and the number of seats of a flight:

```python
from dataclasses import dataclass

@dataclass
class Flight:
    from_city: str
    to_city: str
    code: str
    seats: int

schedule = [Flight("NYC", "PVD", "CSA-342", 50),
            Flight("NYC", "ORD", "CSA-723", 120),
            Flight("ORD", "DEN", "CSA-145", 175),
            Flight("BOS", "ORD", "CSA-647", 80)]

def destination1(for_code: str, flights: list[Flight]) -> str | None:
    """returns the destination of the flight with the given code"""
    for fl in flights:
        if fl.code == for_code:
            return fl.to_city
    return None

def capacity1(for_code: str, flights: list[Flight]) -> int | None:
    """returns the number of seats on the flight with the given code"""
    for fl in flights:
        if fl.code == for_code:
            return fl.seats
    return None
```

Both functions go through the list looking for the flight with the given code,
then extract a piece of information from it. The loop does nothing but find the
flight, which suggests a helper:

```python
def find_flight(for_code: str, flights: list[Flight]) -> Flight | None:
    """returns the flight with the given code"""
    for fl in flights:
        if fl.code == for_code:
            return fl
    return None

def destination2(for_code: str, flights: list[Flight]) -> str:
    """returns the destination of the flight with the given code"""
    return find_flight(for_code, flights).to_city
```

(and `capacity2` is the same, with `.seats`). Searching a list for the element
with a specific piece of information is so common that languages provide a data
structure just for it: in Python, a _dictionary_ (other languages have similar
_hashmaps_, _hash tables_, or _associative arrays_).

### Creating and Using a Dictionary

A dictionary maps unique _keys_ to a _value_ for each key. Here is our schedule
as a dictionary:

```python
sched_dict = {"CSA-342": Flight("NYC", "PVD", "CSA-342", 50),
              "CSA-723": Flight("NYC", "ORD", "CSA-723", 120),
              "CSA-145": Flight("ORD", "DEN", "CSA-145", 175),
              "CSA-647": Flight("BOS", "ORD", "CSA-647", 80)}
```

In general, a dictionary is written `{key1: value1, key2: value2, ...}`. To get
the `Flight` with key `"CSA-145"`, we write `sched_dict["CSA-145"]`, and for its
number of seats, `sched_dict["CSA-145"].seats`. The lookup finds the `Flight`
for us, without looking at all the other values (or even any of them), so you
can assume it is much faster than searching a list.

A dictionary allows only one value per key. For example, here are the
occupants of some offices, keyed by room number:

```python
office_dict = {410: "Farhan", 411: "Pauline", 412: "Marisol", 413: "Saleh"}
```

If someone new moves into office 412, we change the value for that key, and
`office_dict[412]` then evaluates to `"Zeynep"` instead of `"Marisol"`:

```python
office_dict[412] = "Zeynep"
```

### Searching Through the Values in a Dictionary

To find all the flights with more than 100 seats, we have to check every
key-value pair. A `for` loop over a dictionary looks much like one over a list:

```python
above_100 = []
for flight_code in sched_dict:
    if sched_dict[flight_code].seats > 100:
        above_100.append(sched_dict[flight_code])
```

The loop goes through the keys, using each one to retrieve its `Flight`; if it
has enough seats, `append` adds it to the end of our list.

Try making a dictionary that maps names of classrooms to their numbers of seats.
Then write expressions to look up the seats in one room, to give one room 10
more seats, and to find all rooms that seat at least 50.

### Dictionaries with More Complex Values

A track-and-field tournament needs the players on each team: "Team Red" has
Shaoming and Lijin, "Team Green" has Obi and Chinara, and so on. The team name
is a natural key, but what does this dictionary contain after running this
code? Try it!

```python
players = {}
players["Team Red"] = "Shaoming"
players["Team Red"] = "Lijin"
```

With one value per key, the second player replaced the first. It's the
_collection_ of players we want to associate with the team name, so we store a
list under each key:

```python
rosters = {}
rosters["Team Red"] = ["Shaoming", "Lijin"]
rosters["Team Green"] = ["Obi", "Chinara"]
```

The values in a dictionary can be arbitrarily complex, including lists, tables,
or other dictionaries; there is still only one value per key.

### Dictionaries versus Dataclasses

Here is a dataclass for to-do items, and an example item:

```python
@dataclass
class ToDoItem:
    descr: str
    due: str
    tags: list[str]

milk = ToDoItem("buy milk", "2020-07-27", ["shopping", "home"])
```

Viewing the field names as keys, we could also write the item as a dictionary
(just as each row of a PLL table is a `dict` from column names to values):

```python
milk_dict = {"descr": "buy milk", "due": "2020-07-27", "tags": ["shopping", "home"]}
```

Try writing a to-do list of three items both ways. What are the benefits and
drawbacks of each? Dataclasses have a fixed number of fields, while
dictionaries allow any number of keys. Each dataclass field has its own type,
while a dictionary's type gives one type for its keys and one for its values
(e.g., `dict[str, Flight]`), which is restrictive when the "fields" have
different types. And a dataclass comes with a function for creating new data;
with dictionaries, you'd write your own.

Overall, dataclasses give more support for catching errors: you can't give data
for the wrong number of fields, and each field's type says what belongs in it.
Dictionaries are more flexible: optional fields are easier, and new keys can be
added as a program runs. Try writing a function `todo_item_dict` that takes a
description, due date, and list of tags, and returns a dictionary with a key
for each field.

#### Summary

We have seen two uses of dictionaries: keys that identify individuals in a
group, with the same kind of information about each one (like `sched_dict`);
and keys that name the fields of compound data about one individual (like
`milk_dict`). For the second, dataclasses are usually better when the fields
are fixed (using dictionaries for it is common in Python, but less so in other
languages). The first is common in nearly all languages, since dictionaries
give fast access to the value for a key.

## Recap (15 mins)

- Today we explore **dictionaries** in Python, a data structure that maps unique keys to values.
- Dictionaries are useful for fast lookups and flexible data storage, while dataclasses provide a fixed, type-checked structure.
- Example: Conference session data, where each session has a unique session ID, a title, a speaker, and a list of topics.
  ```python
  # Dictionary mapping session IDs to session details (as dictionaries)
  sessions = {
      "CS101": {"title": "Introduction to AI", "speaker": "Dr. Martinez", "topics": ["AI", "Machine Learning"]},
      "CS102": {"title": "Deep Learning Techniques", "speaker": "Prof. Nguyen", "topics": ["Neural Networks", "Deep Learning"]},
      "CS103": {"title": "Quantum Computing Basics", "speaker": "Dr. Patel", "topics": ["Quantum", "Computing"]},
      "CS104": {"title": "Cybersecurity Trends", "speaker": "Ms. Lee", "topics": ["Security", "Networking"]}
  }
  print(sessions["CS101"]["speaker"])  # Dr. Martinez
  ```
- You can update values, add new keys, or remove keys:
  ```python
  sessions["CS103"]["speaker"] = "Dr. Singh"
  sessions["CS105"] = {"title": "Data Ethics", "speaker": "Dr. Kim", "topics": ["Ethics", "Data"]}
  del sessions["CS104"]
  ```
- If you try to access a key that doesn't exist, you'll get a `KeyError`. You can use `.get()` to avoid this:
  ```python
  print(sessions.get("CS999", "Not found"))  # Not found
  ```
- You can iterate through a dictionary to search or filter:
  ```python
  # Print all session IDs for sessions covering "AI"
  for session_id, details in sessions.items():
      if "AI" in details["topics"]:
          print(session_id)

  # Count how many sessions have a speaker whose name starts with "Dr."
  count = 0
  for details in sessions.values():
      if details["speaker"].startswith("Dr."):
          count += 1
  print(count)
  ```
- You can collect all unique topics (using a list and checking for duplicates):
  ```python
  unique_topics = []
  for details in sessions.values():
      for topic in details["topics"]:
          if topic not in unique_topics:
              unique_topics.append(topic)
  print(unique_topics)
  ```
- Dictionaries vs. dataclasses:
  ```python
  from dataclasses import dataclass

  @dataclass
  class ConferenceSession:
      session_id: str
      title: str
      speaker: str
      topics: list

  session1 = ConferenceSession("CS101", "Introduction to AI", "Dr. Martinez", ["AI", "Machine Learning"])
  ```
- Dictionaries are flexible and dynamic; dataclasses are fixed and type-checked.

## Class Exercises (40 mins)

1. Create a dictionary mapping student IDs to names. Add a new student, update a name, and remove a student.
1. Given a dictionary of conference sessions (as above), print all session IDs for sessions covering "AI".
1. Count how many sessions have a speaker whose name starts with "Dr.".
1. Add a new topic to the list of topics for a given session.
1. What happens if you try to access a session that doesn't exist? How can you avoid a crash?
1. Write a function that takes a dictionary of sessions and returns a list of all unique topics covered.
1. Convert a list of `ConferenceSession` dataclass instances into a dictionary mapping session IDs to dataclass instances.
1. Filter all sessions where the number of topics is greater than 1.
1. Download the CSV file from [here](https://raw.githubusercontent.com/neu-pdi/cs2000-public-resources/refs/heads/main/static/support/movies-data.csv) and read it in Python however you like.
1. Create a dictionary that has people's names as keys and a list of movies for each person as the values.
1. Use a dictionary to track each movie that is listed, and track the number of times a movie appears in the dataset.
1. Use a dictionary to track each movie and the people that like the particular movie.

## Wrap-up (5 mins)

- Dictionaries map unique keys to values and are flexible for dynamic data.
- Dataclasses provide a fixed, type-checked structure.
