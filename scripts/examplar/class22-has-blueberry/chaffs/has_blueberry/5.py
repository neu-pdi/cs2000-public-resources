# Counts any flavor starting with b, like banana.


def has_blueberry(s):
    match s:
        case Plate():
            return False
        case Pancake(flavor, below):
            if flavor[0] == "b":
                return True
            else:
                return has_blueberry(below)
