# Looks for any number of at least 3.


def contains_3(nl):
    match nl:
        case NlEmpty():
            return False
        case NlLink(first, rest):
            if first >= 3:
                return True
            else:
                return contains_3(rest)
