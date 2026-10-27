from dataclasses import dataclass


@dataclass
class NlEmpty:
    pass


@dataclass
class NlLink:
    first: float
    rest: "NumList"


NumList = NlEmpty | NlLink


def test_contains_3():
    assert not contains_3(NlEmpty())
    assert contains_3(NlLink(3, NlEmpty()))
    assert contains_3(NlLink(1, NlLink(3, NlEmpty())))
    assert contains_3(NlLink(1, NlLink(2, NlLink(3, NlEmpty()))))
    assert not contains_3(NlLink(1, NlLink(2, NlLink(5, NlEmpty()))))
