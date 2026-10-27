# The two rates are the wrong way round.


def add_shipping(order_amt):
    if order_amt <= 10:
        return order_amt + 8
    else:
        return order_amt + 4
