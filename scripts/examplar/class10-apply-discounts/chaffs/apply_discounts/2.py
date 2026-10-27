# Only the discounted rows are kept.


def discount_price(price):
    if price < 100:
        return price * 0.8
    else:
        return price


def apply_discounts(t):
    return t.filter(lambda r: r["price"] < 100).transform_column("price", discount_price)
