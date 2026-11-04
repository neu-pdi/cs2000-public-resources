# Known correct. Plate and Pancake are the student's own: the notes give the
# data definition, and the tests' examples are built with it.


def has_blueberry(s):
    match s:
        case Plate():
            return False
        case Pancake(flavor, below):
            if flavor == "blueberry":
                return True
            else:
                return has_blueberry(below)
