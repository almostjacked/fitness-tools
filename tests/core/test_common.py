from fitness_core.common import Sex, ActivityLevel, Goal, activity_multiplier

def test_activity_multiplier_values():
    assert activity_multiplier(ActivityLevel.SEDENTARY) == 1.2
    assert activity_multiplier(ActivityLevel.MODERATE) == 1.55
    assert activity_multiplier(ActivityLevel.VERY_ACTIVE) == 1.9

def test_activity_multiplier_accepts_float_passthrough():
    assert activity_multiplier(1.43) == 1.43

def test_sex_and_goal_values():
    assert Sex.MALE.value == "male"
    assert Goal.CUT.value == "cut"

def test_phase2_enums():
    from fitness_core.common import Intensity, Occupation, Aggressiveness
    assert Intensity.MODERATE.value == "moderate"
    assert Occupation.DESK.value == "desk"
    assert Aggressiveness.STANDARD.value == "standard"
