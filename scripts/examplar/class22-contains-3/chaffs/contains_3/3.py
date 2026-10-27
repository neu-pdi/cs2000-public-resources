# Never looks at first, so it is always False.


def contains_3(nl):
    match nl:
        case NlEmpty():
            return False
        case NlLink(first, rest):
            return contains_3(rest)
