# Only looks at the top pancake.


def has_blueberry(s):
    match s:
        case Plate():
            return False
        case Pancake(flavor, below):
            return flavor == "blueberry"
