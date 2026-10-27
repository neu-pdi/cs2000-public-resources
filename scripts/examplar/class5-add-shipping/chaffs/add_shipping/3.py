# Returns only the shipping, not the order plus shipping.


def add_shipping(order_amt):
    if order_amt <= 10:
        return 4
    else:
        return 8
