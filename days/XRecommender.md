---
sidebar_position: 33
day_number: 33
pll_level: intermediate
title: Extra - Recommendation Systems
---

## Skills: None

## Reading

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

## Intro (15 mins)

- **Dictionaries are useful for fast lookups and tracking relationships**, which we will leverage to build a movie recommendation system.
- Today we explore how to use **dictionaries** to analyze movie preferences and make recommendations based on what other people liked.
- Our goal: Given a movie someone likes, recommend other movies they might enjoy based on what movies tend to appear together in people's lists.

### Understanding Co-occurrence with Dictionaries
When we say movies "co-occur," we mean they appear together in the same person's list. For example:
```python
# If Alice likes these movies:
alice_movies = ["Inception", "The Matrix", "Interstellar"]

# We can track which movies appear together using a dictionary
cooccurrence = {
    "Inception": ["Inception", "The Matrix", "Interstellar"],
    "The Matrix": ["Inception", "The Matrix", "Interstellar"],
    "Interstellar": ["Inception", "The Matrix", "Interstellar"]
}
```

### The `.get()` Method: Safely Adding to Dictionary Values
When building up our dictionary, we need to handle keys that might not exist yet:

<!-- python setup
movies_dict = {}
-->

```python error
# Without .get() - causes KeyError if key doesn't exist
movies_dict["Inception"] = movies_dict["Inception"] + ["The Matrix"]  # Error if "Inception" not in dict!

# With .get() - safely handles missing keys
movies_dict["Inception"] = movies_dict.get("Inception", []) + ["The Matrix"]  # Returns [] if key missing
```

### Counting with Counter
Once we have all co-occurrences, we can count which movies appear most frequently:
```python
from collections import Counter

# If "Inception" appeared with these movies across all students:
inception_cooccurrences = ["The Matrix", "Interstellar", "The Matrix", "The Dark Knight", "The Matrix"]

# Count occurrences
counts = Counter(inception_cooccurrences)
print(counts.most_common(2))  # [('The Matrix', 3), ('Interstellar', 1)]
```
You'll build a recommendation system in several steps:
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
