---
sidebar_position: 4
title: Images
description: Making, combining, and loading images
---

# Images

PLL adds images to Python: you do not need to `import` anything to use them. If
a line in your file is an expression that produces an image, PLL shows it in the
interactions panel (and each picture there has a **Save SVG** button, if you want
to keep it). Each function below is shown with its contract (the types of its
inputs and output), followed by some examples and what they produce.

The type of an image, for type annotations, is `Image`:

```python example
def bullseye(size: float) -> Image:
    """a red circle on top of a larger white one, on top of an even larger red one"""
    return overlay(circle(size, "solid", "red"),
                   circle(size * 2, "solid", "white"),
                   circle(size * 3, "solid", "red"))

bullseye(15)
```

In all of the functions below, a `mode` is either `"solid"` or `"outline"`, and a
`color` is a string naming a color, like `"red"` (see [Colors](#colors) for the
other ways to write colors). Sizes are in pixels, and can be `int`s or `float`s.

## Basic shapes

### circle

```
circle(radius: float, mode: str, color: str) -> Image
```

A circle with the given radius.

```python example
circle(30, "outline", "red")
```

```python example
circle(20, "solid", "blue")
```

### square

```
square(side: float, mode: str, color: str) -> Image
```

A square whose sides are `side` long.

```python example
square(40, "solid", "slateblue")
```

```python example
square(50, "outline", "darkmagenta")
```

### rectangle

```
rectangle(width: float, height: float, mode: str, color: str) -> Image
```

A rectangle that is `width` wide and `height` tall.

```python example
rectangle(40, 20, "outline", "black")
```

```python example
rectangle(20, 40, "solid", "blue")
```

### ellipse

```
ellipse(width: float, height: float, mode: str, color: str) -> Image
```

An ellipse (an oval) that is `width` wide and `height` tall. If they are the same, it's a circle.

```python example
ellipse(60, 30, "outline", "black")
```

```python example
ellipse(30, 60, "solid", "blue")
```

### triangle

```
triangle(side: float, mode: str, color: str) -> Image
```

A triangle with three sides that are each `side` long, pointing up.

```python example
triangle(40, "solid", "tan")
```

### right_triangle

```
right_triangle(width: float, height: float, mode: str, color: str) -> Image
```

A triangle with a right angle at the bottom right, whose bottom side is `width`
long, and whose right side is `height` tall.

```python example
right_triangle(36, 48, "solid", "black")
```

### regular_polygon

```
regular_polygon(side: float, sides: int, mode: str, color: str) -> Image
```

A shape with `sides` sides, each `side` long, all at the same angles.

```python example
regular_polygon(50, 3, "outline", "red")
```

```python example
regular_polygon(40, 4, "outline", "blue")
```

```python example
regular_polygon(20, 8, "solid", "red")
```

### star

```
star(side: float, mode: str, color: str) -> Image
```

A five-pointed star, made by connecting every other corner of a five-sided
`regular_polygon` whose sides are `side` long.

```python example
star(40, "solid", "firebrick")
```

### star_polygon

```
star_polygon(side: float, points: int, step: int, mode: str, color: str) -> Image
```

A star with `points` points: it is made by drawing a line from each corner of a
`points`-sided `regular_polygon` (with sides `side` long) to the corner `step`
corners further around.

```python example
star_polygon(40, 5, 2, "solid", "seagreen")
```

```python example
star_polygon(40, 7, 3, "outline", "darkred")
```

### line

```
line(dx: float, dy: float, color: str) -> Image
```

A line that goes `dx` pixels to the right (or to the left, if `dx` is negative),
and `dy` pixels down (or up, if `dy` is negative).

```python example
line(30, 30, "black")
```

```python example
line(-30, 20, "red")
```

### text

```
text(string: str, size: float, color: str) -> Image
```

The string, written in letters `size` pixels tall.

```python example
text("Hello", 24, "olive")
```

```python example
text("Goodbye", 36, "indigo")
```

### empty_image

```
empty_image: Image
```

An image with nothing in it, 0 pixels wide and 0 pixels tall. Note that it is
not a function: write `empty_image`, not `empty_image()`. It's useful as a
starting point when you build up an image a piece at a time.

```python example
image_width(empty_image)
```

## Combining images

### beside

```
beside(image1: Image, image2: Image, ...) -> Image
```

The images next to each other, left to right, lined up along their centers. It
can be given any number of images.

```python example
beside(ellipse(20, 70, "solid", "gray"),
       ellipse(20, 50, "solid", "darkgray"),
       ellipse(20, 30, "solid", "dimgray"),
       ellipse(20, 10, "solid", "black"))
```

### above

```
above(image1: Image, image2: Image, ...) -> Image
```

The images stacked, with `image1` on top, lined up along their centers. It can
be given any number of images.

```python example
above(ellipse(70, 20, "solid", "gray"),
      ellipse(50, 20, "solid", "darkgray"),
      ellipse(30, 20, "solid", "dimgray"),
      ellipse(10, 20, "solid", "black"))
```

### overlay

```
overlay(image1: Image, image2: Image, ...) -> Image
```

The images on top of each other, with their centers lined up, and `image1` on
top. (So if `image1` is bigger than the others, they can't be seen!) It can be
given any number of images.

```python example
overlay(rectangle(30, 60, "solid", "orange"),
        ellipse(60, 30, "solid", "purple"))
```

```python example
overlay(ellipse(10, 10, "solid", "red"),
        ellipse(20, 20, "solid", "black"),
        ellipse(30, 30, "solid", "red"),
        ellipse(40, 40, "solid", "black"),
        ellipse(50, 50, "solid", "red"),
        ellipse(60, 60, "solid", "black"))
```

### underlay

```
underlay(image1: Image, image2: Image, ...) -> Image
```

Like `overlay`, but with `image1` on the bottom.

```python example
underlay(rectangle(30, 60, "solid", "orange"),
         ellipse(60, 30, "solid", "purple"))
```

## Lining up edges

These work like the functions above, but their first input(s) say which edges of
the images line up. A horizontal place (`x_place`) is `"left"`, `"center"`, or
`"right"`, and a vertical place (`y_place`) is `"top"`, `"center"`, or
`"bottom"`.

### beside_align

```
beside_align(y_place: str, image1: Image, image2: Image, ...) -> Image
```

Like `beside`, but lined up at the `y_place` edge.

```python example
beside_align("bottom",
             ellipse(20, 70, "solid", "lightsteelblue"),
             ellipse(20, 50, "solid", "mediumslateblue"),
             ellipse(20, 30, "solid", "slateblue"),
             ellipse(20, 10, "solid", "navy"))
```

```python example
beside_align("top",
             ellipse(20, 70, "solid", "mediumorchid"),
             ellipse(20, 50, "solid", "darkorchid"),
             ellipse(20, 30, "solid", "purple"),
             ellipse(20, 10, "solid", "indigo"))
```

### above_align

```
above_align(x_place: str, image1: Image, image2: Image, ...) -> Image
```

Like `above`, but lined up at the `x_place` edge.

```python example
above_align("right",
            ellipse(70, 20, "solid", "gold"),
            ellipse(50, 20, "solid", "goldenrod"),
            ellipse(30, 20, "solid", "darkgoldenrod"),
            ellipse(10, 20, "solid", "sienna"))
```

```python example
above_align("left",
            ellipse(70, 20, "solid", "yellowgreen"),
            ellipse(50, 20, "solid", "olivedrab"),
            ellipse(30, 20, "solid", "darkolivegreen"),
            ellipse(10, 20, "solid", "darkgreen"))
```

### overlay_align

```
overlay_align(x_place: str, y_place: str, image1: Image, image2: Image, ...) -> Image
```

Like `overlay`, but lined up at the `x_place` and `y_place` edges: e.g.,
`"right", "bottom"` puts the images' bottom right corners together.

```python example
overlay_align("left", "center",
              rectangle(30, 60, "solid", "orange"),
              ellipse(60, 30, "solid", "purple"))
```

```python example
overlay_align("right", "bottom",
              rectangle(20, 20, "solid", "silver"),
              rectangle(30, 30, "solid", "seagreen"),
              rectangle(40, 40, "solid", "silver"),
              rectangle(50, 50, "solid", "seagreen"))
```

### underlay_align

```
underlay_align(x_place: str, y_place: str, image1: Image, image2: Image, ...) -> Image
```

Like `overlay_align`, but with `image1` on the bottom.

```python example
underlay_align("right", "top",
               rectangle(50, 50, "solid", "seagreen"),
               rectangle(40, 40, "solid", "silver"),
               rectangle(30, 30, "solid", "seagreen"),
               rectangle(20, 20, "solid", "silver"))
```

## Placing images exactly

### overlay_xy

```
overlay_xy(image1: Image, dx: float, dy: float, image2: Image) -> Image
```

`image1` on top of `image2`, with `image2` moved `dx` pixels to the right and `dy`
pixels down from `image1`'s top left corner. Negative numbers move it left or up.
The result is as big as it needs to be to hold both images: nothing is cut off.

```python example
overlay_xy(rectangle(20, 20, "outline", "black"),
           20, 0,
           rectangle(20, 20, "outline", "black"))
```

```python example
overlay_xy(rectangle(20, 20, "solid", "red"),
           10, 10,
           rectangle(20, 20, "solid", "black"))
```

```python example
overlay_xy(rectangle(20, 20, "solid", "red"),
           -10, -10,
           rectangle(20, 20, "solid", "black"))
```

### underlay_xy

```
underlay_xy(image1: Image, dx: float, dy: float, image2: Image) -> Image
```

Like `overlay_xy`, but with `image1` on the bottom.

```python example
underlay_xy(rectangle(20, 20, "solid", "red"),
            10, 10,
            rectangle(20, 20, "solid", "black"))
```

## Scenes

A scene is a fixed-size canvas, which is useful for drawing the frames of an
[animation](/pll/reactors). In a scene (and in images in general), the point
`(0, 0)` is the **top left** corner: increasing `x` moves right, and increasing
`y` moves **down**.

### empty_scene

```
empty_scene(width: float, height: float) -> Image
```

An empty, white scene that is `width` wide and `height` tall, with a thin
outline.

```python example
empty_scene(160, 90)
```

### place_image

```
place_image(image: Image, x: float, y: float, scene: Image) -> Image
```

`scene`, with `image` placed so that its **center** is at `(x, y)`. Unlike
`overlay_xy`, the result is the same size as `scene`: anything that goes past its
edges is cut off.

```python example
place_image(triangle(32, "solid", "red"), 24, 24, empty_scene(48, 48))
```

```python example
place_image(circle(8, "solid", "tomato"), 0, 0, empty_scene(48, 48))
```

```python example
place_image(circle(4, "solid", "white"), 18, 6,
            place_image(circle(4, "solid", "white"), 0, 6,
                        place_image(circle(4, "solid", "white"), 14, 32,
                                    rectangle(48, 48, "solid", "navy"))))
```

### crop

```
crop(x: float, y: float, width: float, height: float, image: Image) -> Image
```

The `width` by `height` piece of `image` whose top left corner is at `(x, y)`.

```python example
crop(0, 0, 40, 40, circle(40, "solid", "chocolate"))
```

```python example
crop(40, 60, 40, 60, ellipse(80, 120, "solid", "dodgerblue"))
```

### frame

```
frame(image: Image) -> Image
```

`image`, with a black outline around its edges.

```python example
frame(ellipse(40, 40, "solid", "gray"))
```

## Transforming images

### rotate

```
rotate(angle: float, image: Image) -> Image
```

`image`, turned `angle` degrees counter-clockwise (or clockwise, if `angle` is
negative). The result is as big as it needs to be to hold the turned image.

```python example
rotate(45, ellipse(60, 20, "solid", "olivedrab"))
```

```python example
rotate(5, rectangle(50, 50, "outline", "black"))
```

```python example
rotate(-90, triangle(40, "solid", "seagreen"))
```

### scale

```
scale(factor: float, image: Image) -> Image
```

`image`, made `factor` times as big: e.g., `2` is twice as wide and twice as
tall, and `0.5` is half as wide and half as tall.

```python example
scale(2, ellipse(20, 30, "solid", "blue"))
```

```python example
scale(0.5, ellipse(20, 30, "solid", "blue"))
```

### flip_horizontal

```
flip_horizontal(image: Image) -> Image
```

`image`, mirrored left to right.

```python example
beside(rotate(30, square(50, "solid", "red")),
       flip_horizontal(rotate(30, square(50, "solid", "blue"))))
```

### flip_vertical

```
flip_vertical(image: Image) -> Image
```

`image`, mirrored top to bottom.

```python example
above(star(40, "solid", "firebrick"),
      scale(0.5, flip_vertical(star(40, "solid", "gray"))))
```

## Sizes

### image_width

```
image_width(image: Image) -> int
```

How many pixels wide `image` is.

```python example
image_width(ellipse(30, 40, "solid", "orange"))
```

```python example
image_width(beside(circle(10, "solid", "red"), circle(20, "solid", "blue")))
```

### image_height

```
image_height(image: Image) -> int
```

How many pixels tall `image` is.

```python example
image_height(ellipse(30, 40, "solid", "orange"))
```

```python example
image_height(overlay(circle(20, "solid", "orange"), circle(30, "solid", "purple")))
```

## Loading pictures

### load_image

```
load_image(source: str) -> Image
```

A picture, read from a file in the same folder as your program (when `source` is
a file name, like `"cat.png"`), or from an address on the web (when `source`
starts with `https://`). It gives you an ordinary image, so everything above
works on it. PNG, JPEG, GIF, WebP, and SVG files are understood.

```python example
doghouse = load_image("https://raw.githubusercontent.com/neu-pdi/cs2000-public-resources/refs/heads/main/static/img/lab5-doghouse.png")
scale(0.25, doghouse)
```

```python example
beside(scale(0.2, doghouse), scale(0.2, flip_horizontal(doghouse)))
```

In the browser, an address on the web only works if its site allows other sites
to read it. If loading fails, download the picture, add it to your repository
(next to your program), and load it by its file name instead.

## Colors

A color can be:

- the name of a color, like `"red"`, `"navy"`, or `"gold"` (any [CSS color
  name](https://developer.mozilla.org/en-US/docs/Web/CSS/named-color) works);
- a hex code, like `"#ff8800"`;
- a tuple `(red, green, blue)`, with each from 0 to 255, like `(255, 136, 0)`;
- a tuple `(red, green, blue, alpha)`, where `alpha` says how see-through the
  color is: `0` is invisible, and `1` (or `255`) is solid.

```python example
beside(circle(20, "solid", "darkorange"),
       circle(20, "solid", "#ff8800"),
       circle(20, "solid", (255, 136, 0)))
```

```python example
overlay(circle(20, "solid", (0, 0, 255, 0.5)),
        rectangle(60, 20, "solid", "gold"))
```
