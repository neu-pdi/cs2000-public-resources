# The boundary is at $20 rather than $10.


def add_shipping(order_amt):
    if order_amt <= 20:
        return order_amt + 4
    else:
        return order_amt + 8
