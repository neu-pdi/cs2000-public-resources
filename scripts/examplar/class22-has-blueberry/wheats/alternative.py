# Known correct, written differently.


def has_blueberry(s):
    match s:
        case Pancake(flavor, below):
            return flavor == "blueberry" or has_blueberry(below)
        case _:
            return False
