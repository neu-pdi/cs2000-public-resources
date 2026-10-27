def test_add_shipping():
    assert add_shipping(10) == 10 + 4
    assert add_shipping(3.95) == 3.95 + 4
    assert add_shipping(10.01) == 10.01 + 8
    assert add_shipping(20) == 20 + 8
    assert add_shipping(0) == 0 + 4
