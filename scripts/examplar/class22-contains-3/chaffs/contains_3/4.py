# Only looks at the first two elements.


def contains_3(nl):
    match nl:
        case NlEmpty():
            return False
        case NlLink(first, NlLink(second, rest)):
            return first == 3 or second == 3
        case NlLink(first, rest):
            return first == 3
