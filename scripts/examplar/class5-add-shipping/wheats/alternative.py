# Known correct, written differently.


def add_shipping(order_amt):
    shipping = 4 if order_amt <= 10 else 8
    return order_amt + shipping
