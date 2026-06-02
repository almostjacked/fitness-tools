from enum import Enum


class Sex(str, Enum):
    MALE = "male"
    FEMALE = "female"


class Goal(str, Enum):
    CUT = "cut"
    MAINTAIN = "maintain"
    BULK = "bulk"


class ActivityLevel(str, Enum):
    SEDENTARY = "sedentary"
    LIGHT = "light"
    MODERATE = "moderate"
    ACTIVE = "active"
    VERY_ACTIVE = "very_active"


_MULTIPLIERS = {
    ActivityLevel.SEDENTARY: 1.2,
    ActivityLevel.LIGHT: 1.375,
    ActivityLevel.MODERATE: 1.55,
    ActivityLevel.ACTIVE: 1.725,
    ActivityLevel.VERY_ACTIVE: 1.9,
}


def activity_multiplier(activity: "ActivityLevel | float") -> float:
    """Return the TDEE multiplier for an ActivityLevel, or pass a raw float through."""
    if isinstance(activity, (int, float)):
        return float(activity)
    return _MULTIPLIERS[activity]


class Intensity(str, Enum):
    LIGHT = "light"
    MODERATE = "moderate"
    VIGOROUS = "vigorous"


class Occupation(str, Enum):
    DESK = "desk"
    STANDING = "standing"
    MANUAL = "manual"
    HEAVY = "heavy"


class Aggressiveness(str, Enum):
    CONSERVATIVE = "conservative"
    STANDARD = "standard"
    AGGRESSIVE = "aggressive"
