---
sidebar_position: 6
title: Reactors
description: Animations and interactive programs
---

# Reactors

A **reactor** is an interactive program: a starting value (its _state_), a
function that draws the state as an [image](/pll/images), and functions that
produce a new state when something happens — the clock ticks, a key is pressed,
the mouse moves. It shows up as a card, right in the interactions panel.

## Animations

The quickest way in is `animate`, which takes a function from a number to an
image. The number counts clock ticks, starting at 0, so each tick draws the next
frame:

```python
scene = empty_scene(320, 140)

def draw_ball(n: int) -> Image:
    """a ball that moves right as n increases"""
    return place_image(circle(14, "solid", "crimson"), (n*4) % 320, 70, scene)

animate(draw_ball)
```

## Building a reactor

`reactor` is given each part of the reactor by name, and `.interact()` starts it:

<!-- python setup
# (stand-ins for the functions that Lab 5 asks you to write)
def draw_husky(x: float) -> Image:
    return empty_scene(400, 200)

def back_husky(x: float, key: str) -> float:
    return x
-->

```python
def draw_husky(x: float) -> Image:
    """the frame with the husky at x"""
    ...

def next_x(x: float) -> float:
    """generate x coordinate for the next frame"""
    return x + 20

def back_husky(x: float, key: str) -> float:
    """if the key is 'b', move left by 40; otherwise return x as given"""
    ...

husky_reactor = reactor(
    init=0,
    to_draw=draw_husky,
    on_tick=next_x,
    on_key=back_husky,
)

husky_reactor.interact()
```

`init` and `to_draw` are required; the others are optional:

| Part | What to give it | Called when |
| --- | --- | --- |
| `init` | the starting state | — |
| `to_draw` | a function `(state)` that returns an image | every frame |
| `on_tick` | a function `(state)` that returns the new state | on every tick of the clock |
| `on_key` | a function `(state, key)` that returns the new state | a key is pressed. `key` is a string, like `"a"`, `"b"`, `" "`, `"left"`, `"right"`, `"up"`, or `"down"` |
| `on_mouse` | a function `(state, x, y, event)` that returns the new state | the mouse does something at `(x, y)`. `event` is `"button-down"`, `"button-up"`, `"drag"`, `"move"`, `"enter"`, or `"leave"` |
| `stop_when` | a function `(state)` that returns a `bool` | after each change; when it returns `True`, the reactor stops |
| `tick_rate` | the number of seconds between ticks (about 1/28 if you leave it out) | — |
| `title` | a string to show at the top of the card | — |

Each handler returns the **new state**; it doesn't change the old one.

**Click the picture before using the keyboard**, so the keys go to the reactor,
and not to the interactions prompt.

`big_bang(init, to_draw=..., ...)` is another way of writing
`reactor(init=init, to_draw=..., ...).interact()`.

## Playing, pausing, and rewinding

The card has play / pause, a single-step button, and a slider. Every state the
reactor passes through is recorded, so you can drag the slider back to watch
what happened, and then play forward again from there.

## Testing a reactor without watching it

A reactor is a value, so you can run it without any of the animation, which
makes it possible to test:

```python
countdown = reactor(
    init=10,
    to_draw=lambda n: text(str(n), 40, "black"),
    on_tick=lambda n: n - 1,
    stop_when=lambda n: n <= 0,
)

def test_countdown():
    assert countdown.simulate_trace(20).get_trace() == [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
    assert countdown.get_value() == 10  # the original is unchanged
    assert countdown.tick().get_value() == 9
```

| Method | Gives you |
| --- | --- |
| `r.get_value()` | the reactor's current state |
| `r.draw()` | the image for the current state |
| `r.tick()` | a new reactor, one tick later |
| `r.react(event)` | a new reactor, after the event: `{"kind": "tick"}`, `{"kind": "key", "key": "left"}`, `{"kind": "mouse", "x": 1, "y": 2, "event": "button-down"}` |
| `r.simulate_trace(n)` | a new reactor, after up to `n` ticks (stopping early if `stop_when` says so), which has recorded every state it passed through |
| `r.get_trace()` | the list of recorded states, oldest first |
| `r.is_stopped()` | whether `stop_when` says the current state is the last one |

## Talking to a server

A reactor that is given `register="wss://..."` (the address of a server) is a
**world**: it connects to the server, and can send and receive messages. A
handler that returns `package(new_state, message)` changes the state to
`new_state` **and** sends `message` to the server; whatever the server sends
back arrives at the `on_receive` handler, as `(state, message)`. Messages are
values like numbers, strings, lists, and dictionaries. The card shows whether it
is connected. If an assignment uses this, it will tell you the address of the
server to use.
