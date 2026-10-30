def test_choose_hat():
    assert choose_hat(80) == "sun hat"
    assert choose_hat(79.5) == "no hat"
    assert choose_hat(50) == "no hat"
    assert choose_hat(95) == "sun hat"
    assert choose_hat(-10) == "no hat"
