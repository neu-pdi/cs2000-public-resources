# A price of exactly 100 is discounted too.


def discount_price(price):
    if price <= 100:
        return price * 0.8
    else:
        return price


def apply_discounts(t):
    return t.transform_column("price", discount_price)
