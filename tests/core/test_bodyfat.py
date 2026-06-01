import pytest
from fitness_core.common import Sex
from fitness_core.bodyfat import siri, navy_bf, jackson_pollock_3, deurenberg

def test_siri():
    assert siri(1.0) == pytest.approx(45.0, abs=1e-6)
    assert siri(1.05) == pytest.approx(21.4286, abs=1e-4)

def test_navy_male_reference():
    bf = navy_bf(Sex.MALE, waist_cm=90, neck_cm=40, height_cm=180)
    assert bf == pytest.approx(18.4, abs=0.2)

def test_navy_female_reference():
    bf = navy_bf(Sex.FEMALE, waist_cm=80, neck_cm=33, height_cm=165, hip_cm=95)
    assert bf == pytest.approx(29.4, abs=0.3)

def test_navy_male_waist_not_greater_than_neck_raises():
    with pytest.raises(ValueError):
        navy_bf(Sex.MALE, waist_cm=40, neck_cm=40, height_cm=180)

def test_jackson_pollock_3_male_reference():
    bf = jackson_pollock_3(Sex.MALE, sum_mm=60, age=30)
    assert bf == pytest.approx(18.0, abs=0.2)

def test_jackson_pollock_3_female_reference():
    bf = jackson_pollock_3(Sex.FEMALE, sum_mm=50, age=25)
    assert bf == pytest.approx(20.5, abs=0.2)

def test_deurenberg_male_reference():
    bf = deurenberg(Sex.MALE, bmi=24.69, age=30)
    assert bf == pytest.approx(20.3, abs=0.1)

def test_navy_requires_hip_for_female():
    with pytest.raises(ValueError):
        navy_bf(Sex.FEMALE, waist_cm=80, neck_cm=33, height_cm=165, hip_cm=None)
