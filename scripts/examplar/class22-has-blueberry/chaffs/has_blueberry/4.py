# Only looks at the top two pancakes.


def has_blueberry(s):
    match s:
        case Plate():
            return False
        case Pancake(top, Pancake(second, below)):
            return top == "blueberry" or second == "blueberry"
        case Pancake(top, below):
            return top == "blueberry"
