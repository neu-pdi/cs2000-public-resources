def test_discount_price():
    assert discount_price(50) == 50 * 0.8
    assert discount_price(100) == 100
    assert discount_price(99.99) == 99.99 * 0.8
    assert discount_price(120) == 120


def test_apply_discounts():
    test_table = table(["price"], [[50], [100], [120], [0]])
    assert apply_discounts(test_table) == table(
        ["price"], [[50 * 0.8], [100], [120], [0]]
    )
