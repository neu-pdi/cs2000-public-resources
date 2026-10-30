# An empty plate has a blueberry pancake.


def has_blueberry(s):
    match s:
        case Plate():
            return True
        case Pancake(flavor, below):
            if flavor == "blueberry":
                return True
            else:
                return has_blueberry(below)
