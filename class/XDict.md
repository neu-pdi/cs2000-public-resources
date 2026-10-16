---
sidebar_position: 33
class_number: 33
pll_level: advanced
title: Extra - Dictionaries
---

## Skills: None

## Notes (review before class)
### Why Dictionaries

Like `filter` and `map`, some patterns are common enough to get their own
support. One is searching a list for the element with a given piece of
information:

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

def find_flight(for_code: str, flights: list[Flight]) -> Flight | None:
    """returns the flight with the given code"""
    for fl in flights:
        if fl.code == for_code:
            return fl
    return None
```

- Looking up a flight's destination, seats, etc. all need this loop, so it is a
  helper: e.g., `find_flight(code, schedule).to_city`.
- For this pattern, Python has the **dictionary** (other languages have
  _hashmaps_, _hash tables_, or _associative arrays_).

### Creating and Using a Dictionary

A dictionary maps unique **keys** to a **value** for each, written
`{key1: value1, key2: value2, ...}`:

```python
sched_dict = {"CSA-342": Flight("NYC", "PVD", "CSA-342", 50),
              "CSA-723": Flight("NYC", "ORD", "CSA-723", 120),
              "CSA-145": Flight("ORD", "DEN", "CSA-145", 175),
              "CSA-647": Flight("BOS", "ORD", "CSA-647", 80)}
```

- `sched_dict["CSA-145"]` is the `Flight` with that key, and
  `sched_dict["CSA-145"].seats` its seats.
- The lookup goes straight to the value, without looking at others: assume it
  is much faster than searching a list.
- One value per key: assigning to a key replaces its value (or adds the key):

```python
office_dict = {410: "Farhan", 411: "Pauline", 412: "Marisol", 413: "Saleh"}
office_dict[412] = "Zeynep"     # office_dict[412] is now "Zeynep"
```

### Looping Over a Dictionary

A `for` loop over a dictionary goes through its keys, e.g. to check every
flight for more than 100 seats:

```python
above_100 = []
for flight_code in sched_dict:
    if sched_dict[flight_code].seats > 100:
        above_100.append(sched_dict[flight_code])
```

- `for v in d.values()` goes through just the values, and
  `for k, v in d.items()` through each key `k` with its value `v`.
- Try: make a dictionary from classroom names to seats; look up a room's seats,
  give one room 10 more, and find all rooms that seat at least 50.

### Dictionaries with More Complex Values

A second player stored under the same key replaces the first:

```python
players = {}
players["Team Red"] = "Shaoming"
players["Team Red"] = "Lijin"      # players is now {"Team Red": "Lijin"}
```

To associate a _collection_ with a key, store a list (values can be anything:
lists, tables, other dictionaries):

```python
rosters = {}
rosters["Team Red"] = ["Shaoming", "Lijin"]
rosters["Team Green"] = ["Obi", "Chinara"]
```

### More Dictionary Operations

```python
rosters.get("Team Blue", [])   # [], since rosters has no "Team Blue" key
del office_dict[413]           # removes key 413, and its value
```

- `rosters["Team Blue"]` is a `KeyError`; `d.get(key, default)` is `d[key]` if
  `d` has `key`, else `default`.
- Also handy when searching: `s.startswith(t)` is whether string `s` begins
  with `t`.

A **`Counter`** maps each value in a list to how many times it appears:

```python
from collections import Counter

counts = Counter(["PVD", "ORD", "DEN", "ORD"])   # the destinations in schedule
counts["ORD"]                                     # 2
counts.most_common(1)                             # [("ORD", 2)]
```

- `most_common(n)`: the `n` most common values, each with its count.

### Dictionaries versus Dataclasses

With field names as keys, a to-do item can be a dataclass or a dictionary (like
a PLL table row):

```python
@dataclass
class ToDoItem:
    descr: str
    due: str
    tags: list[str]

milk = ToDoItem("buy milk", "2020-07-27", ["shopping", "home"])
milk_dict = {"descr": "buy milk", "due": "2020-07-27", "tags": ["shopping", "home"]}
```

- **Dataclass**: a fixed number of fields, each with its own type, and a
  constructor. Catches more errors (the wrong number of fields, a value of the
  wrong type).
- **Dictionary**: any number of keys, added as the program runs, so optional
  fields are easier. But its type has one type for keys and one for values
  (e.g., `dict[str, Flight]`), restrictive when "fields" differ in type; and you
  write your own function to create one. (Try: `todo_item_dict`, from a
  description, due date, and tags.)
- Two uses of dictionaries:
  - keys that identify individuals in a group, with the same information about
    each (`sched_dict`): common in nearly all languages, for fast lookup;
  - keys that name the fields of one individual (`milk_dict`): common in
    Python, less so elsewhere; when the fields are fixed, a dataclass is
    usually better.

## Recap (15 mins)

A conference keeps its sessions in a dictionary, keyed by session ID, where
each session's details are themselves a dictionary. Read through the program:

```python
from dataclasses import dataclass

sessions = {
    "CS101": {"title": "Introduction to AI", "speaker": "Dr. Martinez", "topics": ["AI", "Machine Learning"]},
    "CS102": {"title": "Deep Learning Techniques", "speaker": "Prof. Nguyen", "topics": ["Neural Networks", "Deep Learning"]},
    "CS103": {"title": "Quantum Computing Basics", "speaker": "Dr. Patel", "topics": ["Quantum", "Computing"]},
    "CS104": {"title": "Cybersecurity Trends", "speaker": "Ms. Lee", "topics": ["Security", "Networking"]},
}

def sessions_by_speaker(by_id: dict[str, dict]) -> dict[str, list[str]]:
    """maps each speaker in by_id to the IDs of their sessions"""
    result = {}
    for session_id, details in by_id.items():
        speaker = details["speaker"]
        result[speaker] = result.get(speaker, []) + [session_id]
    return result

def test_sessions_by_speaker():
    two_talks = {"A1": {"title": "Graphs", "speaker": "Dr. Kim", "topics": []},
                 "A2": {"title": "Trees", "speaker": "Dr. Kim", "topics": []}}
    assert sessions_by_speaker(two_talks) == {"Dr. Kim": ["A1", "A2"]}
    assert sessions_by_speaker({}) == {}

# the schedule changes: a new speaker, a new session, and a cancellation
sessions["CS103"]["speaker"] = "Dr. Singh"
sessions["CS105"] = {"title": "Data Ethics", "speaker": "Dr. Kim", "topics": ["Ethics", "Data"]}
del sessions["CS104"]

# one session's information, as a dataclass instead
@dataclass
class ConferenceSession:
    session_id: str
    title: str
    speaker: str
    topics: list[str]

session1 = ConferenceSession("CS101", "Introduction to AI", "Dr. Martinez", ["AI", "Machine Learning"])
```

- What is `sessions["CS102"]["topics"][1]`? After the schedule changes, what is
  `sessions_by_speaker(sessions)["Dr. Kim"]`, and is `"Ms. Lee"` still a key?
- Which test would fail if `sessions_by_speaker` wrote
  `result[speaker] = [session_id]`? What would go wrong with
  `result[speaker] + [session_id]`?
- `session1` holds the same information as `sessions["CS101"]`. If a new session
  were added with its `"speaker"` key misspelled `"speakr"`, which line would
  fail, and when? What type annotation would describe one session's details
  dictionary?

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
