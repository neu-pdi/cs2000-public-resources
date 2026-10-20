---
sidebar_position: 7
title: Input and files
description: input(), files next to your program, and reading from the web
---

# Input and files

## Asking the user for input

`input()` asks for a line of text in the interactions panel. The prompt string
you give it is shown first, then you type a reply and press Enter, and `input`
returns what you typed, as a string:

```python skip
name = input("What is your name? ")
print("Hello,", name)
```

To stop the program while it waits, click **Stop** (or press **Ctrl+C** with
nothing selected): it stops with a `KeyboardInterrupt`, as it would in a
terminal.

## Files next to your program

Your program can read files that are in the **same folder** as the `.py` file
you ran, or in a folder inside it — for example, with
[`load_table`](/pll/tables#load_table), [`load_image`](/pll/images#load_image),
`open("data.csv")`, `open("data/2024.csv")`, or pandas' `pd.read_csv("data.csv")`.
This works in vscode.dev, as well as in desktop VSCode. Files are read exactly as
they are on disk, so a CSV saved in another encoding, or a picture, arrives
intact.

After the program finishes, files it wrote or changed — for example, with
`open("out.csv", "w")`, `open("results/out.csv", "w")`, or pandas'
`to_csv("out.csv")` — show up in that folder, where you can open them in the
editor, and a file it deleted is deleted. Some are never saved, and the panel
names each one, and says why ("Not saved: ..."):

- your `.py` files, which PLL never overwrites or deletes;
- a file the program was not given (because it was too big, say), since saving
  what it wrote would replace a file it never saw;
- a file that changed while the program ran, or that is open in the editor with
  changes you have not saved.

There are limits: at most 100 files are loaded, each at most 50 MB, and 100 MB in
all, those nearest the program first. Hidden folders (like `.git`) and tools'
folders (like `venv` or `__pycache__`) are left out. A file left out by a limit is
named in the panel ("Not loaded: ..."), so that a program that cannot open it is
not left failing for no reason you can see.

Files that haven't been saved to a folder yet (untitled editors) have no other
files next to them, so they can't load or save any.

## Importing your own files

A `.py` file next to your program, or in a folder inside it, can be imported: if
there is a file `support.py` next to your program, `import support` makes its
functions available as `support.function_name`, and `import helpers.shapes`
imports `helpers/shapes.py`. A file you import keeps its own `#level`: it is
checked at the level its own first line names (see
[Language levels](/pll/levels#files-that-import-other-files)).

## Reading from the web

[`load_table`](/pll/tables#load_table) and [`load_image`](/pll/images#load_image)
take an address (starting `https://`) as well as a file name. Python's own ways of
reading from the web work too: pandas' `pd.read_csv("https://...")`, and the
`urllib` and `requests` libraries. An address that answers with an error (a 404)
raises `HTTPError`, as in Python; one that does not answer at all gives up after
60 seconds (or the `timeout` a program gives), and **Stop** ends the wait.

In the browser (including vscode.dev), an address only works if its site allows
other sites to read it. If one doesn't, download the file, add it to your
repository (next to your program), and load it by its file name instead.

## Before you have a file

With no Python file open, the interactions panel has a session of its own,
called **No file**, at `#level beginner` (see the [Overview](/pll/#before-you-have-a-file)).
It has no folder, so it cannot read files (a table or picture from an address
still works), and a file it writes is not saved.
