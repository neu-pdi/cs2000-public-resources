# Known correct, written differently.


def discount_price(price):
    if price >= 100:
        return price
    return 0.8 * price


def apply_discounts(t):
    return t.transform_column("price", lambda p: discount_price(p))
