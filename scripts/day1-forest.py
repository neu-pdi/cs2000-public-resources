#level beginner
# The example trees for the Class 1 notes, drawn with PLL's image functions,
# so they are pictures students could eventually make themselves.
# To regenerate static/img/day1-forest.svg, from the repository root:
#   npx pll-python scripts/day1-forest.py --save-images /tmp/forest
#   cp /tmp/forest/image-1.svg static/img/day1-forest.svg

TRUNK = (120, 72, 40)
PINE = (34, 110, 60)
SPRUCE = (70, 130, 140)
LEAF = (70, 160, 70)
AUTUMN = (230, 120, 30)
APPLE = (210, 30, 40)
GRASS = (130, 190, 100)


def pine(size, color):
    """a triangle of needles on a trunk, the trunk in proportion to the tree"""
    return above(
        triangle(size, "solid", color),
        rectangle(size / 6, size / 3, "solid", TRUNK),
    )


def leafy(radius, color):
    """a round crown of leaves on a trunk"""
    return above(
        circle(radius, "solid", color),
        rectangle(radius / 3, radius, "solid", TRUNK),
    )


def apples(crown):
    """the crown, with three apples on it"""
    return overlay_xy(
        circle(6, "solid", APPLE),
        -18,
        -40,
        overlay_xy(
            circle(6, "solid", APPLE),
            -50,
            -22,
            overlay_xy(circle(6, "solid", APPLE), -30, -60, crown),
        ),
    )


big_pine = pine(120, PINE)
small_pine = pine(60, PINE)
spruce = pine(96, SPRUCE)
summer = leafy(45, LEAF)
autumn = leafy(36, AUTUMN)
apple = apples(leafy(45, LEAF))
tiered = above(
    triangle(60, "solid", PINE),
    triangle(90, "solid", PINE),
    rectangle(15, 30, "solid", TRUNK),
)


def gap(width):
    """empty space between trees"""
    return rectangle(width, 10, "solid", (255, 255, 255, 0))


trees = beside_align(
    "bottom",
    big_pine, gap(25), small_pine, gap(25), summer, gap(25), spruce,
    gap(25), autumn, gap(25), tiered, gap(25), apple,
)
forest = above(trees, rectangle(image_width(trees) + 40, 14, "solid", GRASS))
overlay(forest, rectangle(image_width(forest) + 30, image_height(forest) + 30, "solid", "white"))
