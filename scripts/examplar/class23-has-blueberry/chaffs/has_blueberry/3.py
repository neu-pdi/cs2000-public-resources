# Never looks at the flavor, so it is always False.


def has_blueberry(s):
    match s:
        case Plate():
            return False
        case Pancake(flavor, below):
            return has_blueberry(below)
