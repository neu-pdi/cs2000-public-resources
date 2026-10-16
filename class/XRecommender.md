---
sidebar_position: 33
class_number: 33
pll_level: intermediate
title: Extra - Recommendation Systems
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

A recommendation system suggests movies based on what people like: two movies
**co-occur** when they appear in the same person's list. Here, each person maps
to the movies they like. Read through the program:

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

- What are `fans_by_movie(favorites)["The Matrix"]` and
  `like_counts(favorites).most_common(2)`?
- What would go wrong if `fans_by_movie` used `fans[movie]` instead of
  `fans.get(movie, [])`? For which movie would it first go wrong?
- Which movies co-occur with `"Inception"` in `favorites`, and how many times
  each?

In class, you'll build a system that recommends the movies that most often
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

## Class Exercises (40 mins)
## Part 1: Loading and Converting Data
1. Download the CSV file from [here](https://raw.githubusercontent.com/neu-pdi/cs2000-public-resources/refs/heads/main/static/support/movies-data.csv). Load the CSV file using `pd.read_csv`.
1. Create a list called containing the strings `"Movie 1"`, `"Movie 2"`, ..., `"Movie 10"`, for your column names.
1. Convert the DataFrame to a list of dictionaries using `df.to_dict(orient="records")`. Print the first dictionary to observe the data structure.
1. Write a loop that iterates through `data_lst`. For each `row`, print the `Movie 1`.

## Part 2: Extracting Movies from a Row
5. Write a function `get_movies` that takes a single row dictionary as input and returns a list of all non-NaN movie titles from that row. Use `pd.notna()` to check for NaN values. You can use the list you created in the above exercise here.
6. Test your function with the first few rows. Do all students list the same number of movies?

## Part 3: Building the Co-occurrence Dictionary
7. What does the dict.get() method do? What happens if you call .get(key, []) on a key that doesn't exist?
8. Suppose one student listed these movies: ["Inception", "The Matrix", "Interstellar"]. We want to track that these three movies appeared together. For each movie in this list, we need to store ALL the movies (including itself) in a dictionary. Write a function `update_occurrences` that takes in the movies list and a dictionary. The function should loop through the movie list and updates the dictionary by adding all the movies for each movie in this list.
9. Write a function build_cooccurrence_dict(df) that:
    - Converts the DataFrame to a list of dictionaries
    - Creates an (empty) dictionary for tracking cooccurrences,
    - For each row, uses your function from above to extract the list of movies,
    - Uses your function above to update the cooccurrence dictionary, and
    - Returns the dictionary
10. Test your build_cooccurrence_dict() function. Pick a movie and examine what's stored in the dictionary for that movie. Does it make sense?

## Part 4: Making Recommendations
11. Import `Counter` from `collections`. Given a list with duplicates, use `Counter()` to count occurrences. What type of object does it return?
12. Write a function `recommend_v1(movie_name, cooccurrence_dct)` that:
    - Takes a movie name and the co-occurrence dictionary
    - Uses Counter on the list from the dictionary
    - Returns the top 10 most common items(look up `.most_common()` for counters)

## Part 5: Testing the System
13. Test your system! Connect your functions to the dataframe from step 1 and try a movie ("The Shawshank Redemption") to see the recommendations.

## Wrap-up (5 mins)
- You can add more bells and whistles to your system (remove the movie itself, track student names, etc.)
- Dictionaries are useful for their quick lookup and key-based access.
