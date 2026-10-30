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
information. A conference keeps its program as a list of sessions:

```python
@dataclass
class Session:
    session_id: str
    title: str
    speaker: str
    seats: int

program = [Session("CS101", "Introduction to AI", "Dr. Martinez", 120),
           Session("CS102", "Deep Learning Techniques", "Prof. Nguyen", 80),
           Session("CS103", "Quantum Computing Basics", "Dr. Patel", 40),
           Session("CS104", "Cybersecurity Trends", "Ms. Lee", 60)]

def find_session(for_id: str, sessions: list[Session]) -> Session | None:
    """returns the session with the given ID, or None if there is none"""
    for s in sessions:
        if s.session_id == for_id:
            return s
    return None
```

- Looking up a session's title, speaker, seats, etc. all need this loop, so it
  is a helper: e.g., `find_session(sid, program).speaker`.
- For this pattern, Python has the **dictionary** (other languages have
  _hashmaps_, _hash tables_, or _associative arrays_).

### Creating and Using a Dictionary

A dictionary maps unique **keys** to a **value** for each, written
`{key1: value1, key2: value2, ...}`:

```python
by_id = {"CS101": Session("CS101", "Introduction to AI", "Dr. Martinez", 120),
         "CS102": Session("CS102", "Deep Learning Techniques", "Prof. Nguyen", 80),
         "CS103": Session("CS103", "Quantum Computing Basics", "Dr. Patel", 40),
         "CS104": Session("CS104", "Cybersecurity Trends", "Ms. Lee", 60)}
```

- `by_id["CS103"]` is the `Session` with that key, and `by_id["CS103"].seats`
  its seats.
- The lookup goes straight to the value, without looking at others: assume it
  is much faster than searching a list.
- One value per key: assigning to a key replaces its value (or adds the key):

```python
rooms = {"CS101": "Hall A", "CS102": "Room 210", "CS103": "Room 114", "CS104": "Hall B"}
rooms["CS103"] = "Room 305"     # rooms["CS103"] is now "Room 305"
```

### Looping Over a Dictionary

A `for` loop over a dictionary goes through its keys, e.g. to find every
session with more than 50 seats:

```python
over_50 = []
for sid in by_id:
    if by_id[sid].seats > 50:
        over_50.append(by_id[sid])
```

- `for v in d.values()` goes through just the values, and
  `for k, v in d.items()` through each key `k` with its value `v`.
- Try: make a dictionary from classroom names to seats; look up a room's seats,
  give one room 10 more, and find all rooms that seat at least 50.

### Dictionaries with More Complex Values

A second chair stored under the same key replaces the first:

```python
chairs = {}
chairs["AI track"] = "Dr. Martinez"
chairs["AI track"] = "Prof. Nguyen"    # chairs is now {"AI track": "Prof. Nguyen"}
```

To associate a _collection_ with a key, store a list (values can be anything:
lists, tables, other dictionaries):

```python
tracks = {}
tracks["AI track"] = ["CS101", "CS102"]
tracks["Systems track"] = ["CS103", "CS104"]
```

### More Dictionary Operations

```python
tracks.get("Ethics track", [])   # [], since tracks has no "Ethics track" key
del rooms["CS104"]               # removes key "CS104", and its value
```

- `tracks["Ethics track"]` is a `KeyError`; `d.get(key, default)` is `d[key]`
  if `d` has `key`, else `default`.
- Also handy when searching: `s.startswith(t)` is whether string `s` begins
  with `t`.

A **`Counter`** maps each value in a list to how many times it appears:

```python
from collections import Counter

counts = Counter(["Dr. Martinez", "Prof. Nguyen", "Dr. Martinez", "Ms. Lee"])
counts["Dr. Martinez"]   # 2
counts.most_common(1)    # [("Dr. Martinez", 2)]
```

- `most_common(n)`: the `n` most common values, each with its count.

### A Function That Builds a Dictionary

Which sessions does each speaker give? Building the answer key by key, with
`get` for the speakers not seen yet:

```python
def sessions_by_speaker(sessions: dict[str, Session]) -> dict[str, list[str]]:
    """maps each speaker in sessions to the IDs of their sessions"""
    result = {}
    for sid, s in sessions.items():
        result[s.speaker] = result.get(s.speaker, []) + [sid]
    return result

def test_sessions_by_speaker():
    two_talks = {"A1": Session("A1", "Graphs", "Dr. Kim", 30),
                 "A2": Session("A2", "Trees", "Dr. Kim", 30)}
    assert sessions_by_speaker(two_talks) == {"Dr. Kim": ["A1", "A2"]}
    assert sessions_by_speaker({}) == {}
```

- Which test would fail if the loop's body were `result[s.speaker] = [sid]`?
  What would go wrong with `result[s.speaker] + [sid]`?

### Dictionaries versus Dataclasses

With field names as keys, a session can be a dataclass or a dictionary (like a
PLL table row):

```python
intro = Session("CS101", "Introduction to AI", "Dr. Martinez", 120)
intro_dict = {"session_id": "CS101", "title": "Introduction to AI",
              "speaker": "Dr. Martinez", "seats": 120}
```

- **Dataclass**: a fixed number of fields, each with its own type, and a
  constructor. Catches more errors: a misspelled field, or the wrong number of
  fields, is reported where the value is made.
- **Dictionary**: any number of keys, added as the program runs, so optional
  fields are easier. But its type has one type for keys and one for values
  (e.g., `dict[str, Session]`), restrictive when "fields" differ in type; and a
  misspelled key (`"speakr"`) isn't noticed until something looks for
  `"speaker"`. (Try: write `session_dict`, which makes such a dictionary from an
  ID, a title, a speaker, and a number of seats.)
- Two uses of dictionaries:
  - keys that identify individuals in a group, with the same information about
    each (`by_id`): common in nearly all languages, for fast lookup;
  - keys that name the fields of one individual (`intro_dict`): common in
    Python, less so elsewhere; when the fields are fixed, a dataclass is
    usually better.

## Live

Predict and vote, on programs with dictionaries: what does each look up,
replace, or add? Several look like they should do one thing and do another.
Then, in pairs, you write the Examples for a function that builds a
dictionary, and compare them with your neighbors'.

## Practice

1. Create a dictionary mapping student IDs to names. Add a new student, update a name, and remove a student.
1. Give each session in `by_id` a list of topics (in a new dictionary, from session IDs to lists of topics), then print the IDs of the sessions covering "AI".
1. Count how many sessions have a speaker whose name starts with "Dr.".
1. Add a new topic to the list of topics for a given session, in your dictionary from exercise 2.
1. What happens if you try to access a session that doesn't exist? How can you avoid a crash?
1. Write a function that takes a dictionary of sessions and returns a list of all unique topics covered.
1. Write a function that converts a list of `Session`s, like `program`, into a dictionary from session IDs to sessions, like `by_id`.
1. Filter all sessions where the number of topics is greater than 1.
1. Download the CSV file from [here](https://raw.githubusercontent.com/neu-pdi/cs2000-public-resources/refs/heads/main/static/support/movies-data.csv) and read it in Python however you like.
1. Create a dictionary that has people's names as keys and a list of movies for each person as the values.
1. Use a dictionary to track each movie that is listed, and track the number of times a movie appears in the dataset.
1. Use a dictionary to track each movie and the people that like the particular movie.
