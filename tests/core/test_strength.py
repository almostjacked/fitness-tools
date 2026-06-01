import pytest
from fitness_core.strength import one_rep_max, ORM_METHODS

def test_epley_reference():
    assert one_rep_max("epley", 100, 5) == pytest.approx(116.6667, abs=0.001)

def test_brzycki_reference():
    assert one_rep_max("brzycki", 100, 5) == pytest.approx(112.5, abs=0.001)

def test_oconner_reference():
    assert one_rep_max("oconner", 100, 5) == pytest.approx(112.5, abs=0.001)

def test_one_rep_max_at_one_rep_returns_weight():
    # Brzycki returns the input weight exactly at 1 rep: 100*36/36 == 100
    assert one_rep_max("brzycki", 100, 1) == pytest.approx(100.0, abs=0.001)

def test_all_methods_defined():
    for m in ORM_METHODS:
        assert one_rep_max(m, 100, 5) > 100

def test_lombardi_reference():
    assert one_rep_max("lombardi", 100, 5) == pytest.approx(117.462, abs=0.01)

def test_wathan_reference():
    assert one_rep_max("wathan", 100, 5) == pytest.approx(116.583, abs=0.01)

def test_mayhew_reference():
    assert one_rep_max("mayhew", 100, 5) == pytest.approx(119.011, abs=0.01)

def test_brzycki_undefined_at_37_reps():
    with pytest.raises(ValueError):
        one_rep_max("brzycki", 100, 37)
