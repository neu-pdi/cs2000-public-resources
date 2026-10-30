# The boundary is at 75F rather than 80F.


def choose_hat(temp_in_f):
    if temp_in_f < 75:
        return "no hat"
    else:
        return "sun hat"
