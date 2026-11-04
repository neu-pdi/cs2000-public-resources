from dataclasses import dataclass


@dataclass
class Plate:
    pass


@dataclass
class Pancake:
    flavor: str
    below: "Stack"


Stack = Plate | Pancake


def test_has_blueberry():
    assert not has_blueberry(Plate())
    assert has_blueberry(Pancake("blueberry", Plate()))
    assert has_blueberry(Pancake("plain", Pancake("blueberry", Plate())))
    assert has_blueberry(Pancake("plain", Pancake("banana", Pancake("blueberry", Plate()))))
    assert not has_blueberry(Pancake("plain", Pancake("banana", Pancake("chocolate", Plate()))))
