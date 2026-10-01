#level beginner
# The example flags for the Day 1 reading (days/1.md), drawn with PLL's image
# functions, so they are pictures students could eventually make themselves.
# To regenerate static/img/day1-flags.svg, from the repository root:
#   npx pll-python scripts/day1-flags.py --save-images /tmp/flags
#   cp /tmp/flags/image-1.svg static/img/day1-flags.svg

RED = (218, 32, 26)
BLUE = (37, 55, 156)
ORANGE = (242, 110, 32)
AUSTRIA_RED = (234, 40, 57)
NIGER_ORANGE = (234, 124, 32)
NIGER_GREEN = (46, 170, 80)
YELLOW = (249, 209, 55)
COLOMBIA_BLUE = (32, 57, 140)
COLOMBIA_RED = (206, 25, 40)
ZAMBIA_GREEN = (43, 157, 94)
BANGLADESH_GREEN = (33, 131, 86)
BANGLADESH_RED = (239, 40, 64)
EDGE = (200, 200, 200)


def stripes(width, height, top, middle, bottom):
    """a flag with three equal horizontal stripes"""
    stripe = height / 3
    return above(
        rectangle(width, stripe, "solid", top),
        rectangle(width, stripe, "solid", middle),
        rectangle(width, stripe, "solid", bottom),
    )


def edged(flag):
    """the flag, with a light outline, so white stripes show against a white page"""
    return overlay(
        rectangle(image_width(flag), image_height(flag), "outline", EDGE),
        flag,
    )


armenia = stripes(180, 105, RED, BLUE, ORANGE)
armenia_small = stripes(84, 49, RED, BLUE, ORANGE)
austria = stripes(180, 105, AUSTRIA_RED, "white", AUSTRIA_RED)
niger = overlay(
    circle(15, "solid", NIGER_ORANGE),
    stripes(180, 105, NIGER_ORANGE, "white", NIGER_GREEN),
)
colombia = above(
    rectangle(180, 52, "solid", YELLOW),
    rectangle(180, 26, "solid", COLOMBIA_BLUE),
    rectangle(180, 26, "solid", COLOMBIA_RED),
)

zambia_stripes = beside(
    rectangle(18, 66, "solid", "red"),
    rectangle(18, 66, "solid", "black"),
    rectangle(18, 66, "solid", ORANGE),
)
zambia_eagle = overlay(
    ellipse(38, 8, "solid", ORANGE),
    triangle(12, "solid", ORANGE),
)
zambia = overlay_align(
    "right",
    "bottom",
    zambia_stripes,
    underlay_xy(
        rectangle(180, 105, "solid", ZAMBIA_GREEN),
        128,
        14,
        zambia_eagle,
    ),
)
flagpole = rectangle(5, 250, "solid", (139, 69, 19))
zambia_on_pole = beside_align("top", flagpole, edged(zambia))

bangladesh = underlay_xy(
    rectangle(180, 105, "solid", BANGLADESH_GREEN),
    47,
    18,
    circle(35, "solid", BANGLADESH_RED),
)


def gap(width, height):
    """empty space, for laying out the flags"""
    return rectangle(width, height, "solid", (255, 255, 255, 0))


def labeled(flag, name):
    """the flag, with its name to its right"""
    return beside(flag, gap(20, 10), text(name, 22, "black"))


left = above_align(
    "left",
    labeled(beside_align("top", edged(armenia), gap(20, 10), edged(armenia_small)), "Armenia"),
    gap(10, 40),
    labeled(edged(austria), "Austria"),
    gap(10, 40),
    labeled(edged(niger), "Niger"),
)
right = above_align(
    "left",
    labeled(edged(colombia), "Colombia"),
    gap(10, 40),
    labeled(zambia_on_pole, "Zambia"),
    gap(10, 25),
    labeled(edged(bangladesh), "Bangladesh"),
)
flags = beside_align("top", left, gap(60, 10), right)
all_flags = overlay(flags, rectangle(image_width(flags) + 30, image_height(flags) + 30, "solid", "white"))
all_flags
