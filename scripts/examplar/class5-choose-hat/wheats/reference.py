# Known correct: a sun hat at 80F or above, otherwise no hat.


def choose_hat(temp_in_f):
    if temp_in_f < 80:
        return "no hat"
    else:
        return "sun hat"
