# An order of exactly $10 is charged the higher rate.


def add_shipping(order_amt):
    if order_amt < 10:
        return order_amt + 4
    else:
        return order_amt + 8
