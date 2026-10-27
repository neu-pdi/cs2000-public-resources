# Known correct, written differently.


def contains_3(nl):
    match nl:
        case NlLink(first, rest):
            return first == 3 or contains_3(rest)
        case _:
            return False
