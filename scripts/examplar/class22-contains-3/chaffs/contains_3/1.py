# Only looks at the first element.


def contains_3(nl):
    match nl:
        case NlEmpty():
            return False
        case NlLink(first, rest):
            return first == 3
