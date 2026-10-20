---
sidebar_position: 1
slug: /
title: Overview
description: Python Language Levels (PLL) reference
---

# PLL Reference

In this class, we write Python with **Python Language Levels** (PLL), an
extension for the VSCode editor. PLL runs your programs right in the editor, and
shows the results in an **interactions** panel — output, errors, images, tables,
and a prompt where you can try extra Python after a run. It works in
[vscode.dev](https://vscode.dev), in the browser, so you do **not** need to
install Python on your computer.

These pages describe everything PLL adds to Python:

- [Language levels](/pll/levels) — the `#level` line at the top of your file, and type annotations.
- [Tests](/pll/testing) — `test_` functions, `assert`, `pytest.approx`, and checking your tests against the course's code.
- [Images](/pll/images) — shapes, combining images, and loading pictures.
- [Tables and charts](/pll/tables) — tables, loading CSV files, charts, pandas, and matplotlib.
- [Reactors](/pll/reactors) — animations and interactive programs.
- [Input and files](/pll/input-and-files) — `input()`, files next to your program, and reading from the web.

For the Python language itself, see the [Python documentation](https://docs.python.org/3/).

## Installing PLL

1. Open [vscode.dev](https://vscode.dev) (or desktop VSCode).
2. Open the Extensions view (the four squares in the left sidebar).
3. Search for **Python Language Levels**.
4. Click **Install**. If you are asked to trust the publisher, do that.

You do **not** need Microsoft's **Python** extension. If VSCode offers to install
it, don't: PLL is all you need.

## Running a program

1. Create a file whose name ends in `.py`, for example `hello.py`.
2. Type a small program:

   ```python
   #level beginner

   print("hello")
   ```

3. Click **PLL: Run Python File**, at the top right of the editor, on the same bar as the file name.

   If you do not see it, open the Command Palette (`Ctrl+Shift+P` on Windows,
   `Cmd+Shift+P` on a Mac) and run **PLL: Run Python File**.

The first run can take a little while: PLL is starting Python in the browser.
Later runs are faster.

Results appear in the **PLL** panel at the bottom of the window (near Problems
and Terminal). If that panel is hidden, run **PLL: Show Interactions** from the
Command Palette.

When PLL runs a file, it runs the file, and then any [tests](/pll/testing) in
it. If a line in your file is just an expression (like `1 + 1`, or
`circle(20, "solid", "red")`), PLL shows its value, in order with anything you
`print` (except at `#level raw`, which shows nothing it isn't asked to, as plain
Python does).

## Before you have a file

With no Python file open, the interactions panel has a session of its own, called
**No file**: type Python at its prompt and press Enter. It is for the very first
things you try, before you have a repository to make a file in, and it always uses
`#level beginner`. Once you open a Python file, the panel shows that file's
session instead; **PLL: Start REPL** switches back to the session with no file.

## The interactions panel

The interactions panel has a prompt at the bottom. After a file has run, you
can type extra Python there and press Enter. Names you defined in the file are
still available. The panel's header shows the file and the
[level](/pll/levels) the prompt uses (for example `hello.py [beginner]`).
Closing a file ends its session: its output in the panel, and the names its runs
defined, go with it.

- **Enter** runs what you typed.
- **Shift+Enter** adds another line (for a longer snippet).
- If Python is waiting for more input (for example after `if True:`), PLL will
  keep prompting until what you typed is complete.
- **Up** and **Down** move through things you typed earlier.
- **Ctrl+L** (Windows) or **Cmd+L** (Mac) clears the panel. You can also run
  **PLL: Clear Interactions**.

## Stopping a program

If a program runs longer than you expect — a loop that never ends, say — click
**Stop** in the interactions panel. **Ctrl+C** (with nothing selected) and
**PLL: Stop Program** in the Command Palette do the same thing. The program
stops with a `KeyboardInterrupt`, and anything it printed first is kept. Stop
works the same way while your tests run: the test that was running is marked as
stopped, and the rest of the tests are not run.

This works for ordinary Python code. If your program is stuck inside a library (a
very long pandas operation, for example), or it catches `KeyboardInterrupt`
itself, PLL tells you it could not stop it; reload the window in that case.

## Errors

When your program has a mistake, PLL explains what went wrong, and how you
might fix it, in the interactions panel, and marks the line in the editor.
Click the location in the message to jump to that line. Many mistakes are found
before the file runs at all (see [Language levels](/pll/levels)). The marks in
the editor go as soon as you edit the file, since its lines may have moved; the
panel keeps the message, and the next run marks whatever is still wrong.

## Commands

All of these are available from the Command Palette:

| Command | What it does |
| --- | --- |
| **PLL: Run Python File** | Run the file, then its tests (if any). |
| **PLL: Show Interactions** | Open the interactions panel. |
| **PLL: Start REPL** | Show the session with no file, at `#level beginner`, whatever file is open. |
| **PLL: Change Level** | Change the file's `#level` line (or give a file with no line one). |
| **PLL: Stop Program** | Stop the program that is running. |
| **PLL: Clear Interactions** | Clear the panel. |

## Copy and paste

Ctrl/Cmd+C, X, and V work as usual, both in the editor and in the interactions
panel. If they do nothing in the browser and you use a keyboard layout other
than QWERTY (Dvorak, Colemak, …), add this to your **user** settings (Command
Palette → *Preferences: Open User Settings (JSON)*):

```json
{
  "keyboard.dispatch": "keyCode"
}
```
