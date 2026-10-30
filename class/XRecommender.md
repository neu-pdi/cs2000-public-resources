---
sidebar_position: 33
class_number: 33
pll_level: advanced
title: Extra - Recommendation Systems
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

### Recommendations from Favorites

A recommendation system suggests movies based on what people like: two movies
**co-occur** when they appear in the same person's list. Here, each person maps
to the movies they like:

```python
from collections import Counter

favorites = {
    "Alice": ["Inception", "The Matrix", "Interstellar"],
    "Ben": ["The Matrix", "The Dark Knight"],
    "Chidi": ["Inception", "The Matrix"],
}

def fans_by_movie(favs: dict[str, list[str]]) -> dict[str, list[str]]:
    """maps each movie in favs to the people who like it"""
    fans = {}
    for person in favs:
        for movie in favs[person]:
            fans[movie] = fans.get(movie, []) + [person]
    return fans

def like_counts(favs: dict[str, list[str]]) -> Counter:
    """how many people in favs like each movie"""
    all_likes = []
    for person in favs:
        for movie in favs[person]:
            all_likes.append(movie)
    return Counter(all_likes)

def test_fans_by_movie():
    assert fans_by_movie(favorites)["Inception"] == ["Alice", "Chidi"]
    assert fans_by_movie(favorites)["The Dark Knight"] == ["Ben"]
    assert fans_by_movie({}) == {}

def test_like_counts():
    assert like_counts(favorites)["The Matrix"] == 3
    assert like_counts(favorites).most_common(1) == [("The Matrix", 3)]
```

- `fans_by_movie(favorites)["The Matrix"]` is `["Alice", "Ben", "Chidi"]`.
- With `fans[movie]` in place of `fans.get(movie, [])`, the first movie (here
  `"Inception"`) would be a `KeyError`, since `fans` starts empty.
- Try: which movies co-occur with `"Inception"` in `favorites`, and how many
  times each?

In Practice, you'll build a system that recommends the movies that most often
co-occur with a given one. For each movie in a person's list, it stores all the
movies in that list (including itself); Alice's list alone gives:

```python
cooccurrence = {
    "Inception": ["Inception", "The Matrix", "Interstellar"],
    "The Matrix": ["Inception", "The Matrix", "Interstellar"],
    "Interstellar": ["Inception", "The Matrix", "Interstellar"]
}
```

You'll build it in several steps:
1. Load and convert movie data to dictionaries
2. Extract movies from each student's preferences
3. Build a co-occurrence dictionary tracking which movies appear together
4. Use `Counter` to find the most frequently co-occurring movies
5. Create a recommendation function that suggests movies

## Live

Telephone, in groups of four, as in Classes 5, 14 and 20: a small
recommender, in four parts, each changing what came before. Everyone does part
1 on their own sheet, then passes it on, and does the next part on the sheet
they receive.

## Practice

### Part 1: Loading and Converting Data
1. Download the CSV file from [here](https://raw.githubusercontent.com/neu-pdi/cs2000-public-resources/refs/heads/main/static/support/movies-data.csv). Load the CSV file using `pd.read_csv`.
1. Create a list called containing the strings `"Movie 1"`, `"Movie 2"`, ..., `"Movie 10"`, for your column names.
1. Convert the DataFrame to a list of dictionaries using `df.to_dict(orient="records")`. Print the first dictionary to observe the data structure.
1. Write a loop that iterates through `data_lst`. For each `row`, print the `Movie 1`.

### Part 2: Extracting Movies from a Row
5. Write a function `get_movies` that takes a single row dictionary as input and returns a list of all non-NaN movie titles from that row. Use `pd.notna()` to check for NaN values. You can use the list you created in the above exercise here.
6. Test your function with the first few rows. Do all students list the same number of movies?

### Part 3: Building the Co-occurrence Dictionary
7. What does the dict.get() method do? What happens if you call .get(key, []) on a key that doesn't exist?
8. Suppose one student listed these movies: ["Inception", "The Matrix", "Interstellar"]. We want to track that these three movies appeared together. For each movie in this list, we need to store ALL the movies (including itself) in a dictionary. Write a function `update_occurrences` that takes in the movies list and a dictionary. The function should loop through the movie list and updates the dictionary by adding all the movies for each movie in this list.
9. Write a function build_cooccurrence_dict(df) that:
    - Converts the DataFrame to a list of dictionaries
    - Creates an (empty) dictionary for tracking cooccurrences,
    - For each row, uses your function from above to extract the list of movies,
    - Uses your function above to update the cooccurrence dictionary, and
    - Returns the dictionary
10. Test your build_cooccurrence_dict() function. Pick a movie and examine what's stored in the dictionary for that movie. Does it make sense?

### Part 4: Making Recommendations
11. Import `Counter` from `collections`. Given a list with duplicates, use `Counter()` to count occurrences. What type of object does it return?
12. Write a function `recommend_v1(movie_name, cooccurrence_dct)` that:
    - Takes a movie name and the co-occurrence dictionary
    - Uses Counter on the list from the dictionary
    - Returns the top 10 most common items(look up `.most_common()` for counters)

### Part 5: Testing the System
13. Test your system! Connect your functions to the dataframe from step 1 and try a movie ("The Shawshank Redemption") to see the recommendations.
