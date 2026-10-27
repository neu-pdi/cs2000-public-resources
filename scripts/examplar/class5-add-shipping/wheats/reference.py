# Known correct: $4 shipping for orders of $10 or less, $8 above.


def add_shipping(order_amt):
    if order_amt <= 10:
        return order_amt + 4
    else:
        return order_amt + 8
