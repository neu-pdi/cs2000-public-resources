---
sidebar_position: 33
day_number: 33
title: Extra - Recommendation Systems
---

## Skills: None

## Pre-reading: [9.2](%7B%7BDCIC_DOMAIN%7D%7D/dictionaries.html)

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
```python
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
