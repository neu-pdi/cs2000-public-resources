# Gives the amount taken off, not the new price.


def discount_price(price):
    if price < 100:
        return price * 0.2
    else:
        return price


def apply_discounts(t):
    return t.transform_column("price", discount_price)
