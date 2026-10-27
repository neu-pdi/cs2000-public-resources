# The empty list contains 3.


def contains_3(nl):
    match nl:
        case NlEmpty():
            return True
        case NlLink(first, rest):
            if first == 3:
                return True
            else:
                return contains_3(rest)
