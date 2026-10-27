# Known correct. NlEmpty and NlLink are the student's own: the notes give the
# data definition, and the tests' examples are built with it.


def contains_3(nl):
    match nl:
        case NlEmpty():
            return False
        case NlLink(first, rest):
            if first == 3:
                return True
            else:
                return contains_3(rest)
