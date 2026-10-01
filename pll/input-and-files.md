---
sidebar_position: 7
title: Input and files
description: input(), and files next to your program
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

**Ctrl+C** (with nothing selected) cancels, and the program gets an `EOFError`.

## Files next to your program

Your program can read files that are in the **same folder** as the `.py` file
you ran — for example, with [`load_table`](/pll/tables#load_table),
[`load_image`](/pll/images#load_image), `open("data.csv")`, or pandas'
`pd.read_csv("data.csv")`. This works in vscode.dev, as well as in desktop VSCode.

After the program finishes, files it wrote or changed — for example, with
`open("out.csv", "w")`, or pandas' `to_csv("out.csv")` — show up in that folder,
where you can open them in the editor. PLL does not overwrite your `.py` files.

A `.py` file in the same folder can also be imported: if there is a file
`support.py` next to your program, `import support` makes its functions
available as `support.function_name`.

Files that haven't been saved to a folder yet (untitled editors) have no other
files next to them, so they can't load or save any.
