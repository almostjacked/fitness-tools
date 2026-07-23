/** Energy density of body-mass change: Wishnofsky (1958) 3500 kcal/lb ≈ 7700 kcal/kg. */
export const KCAL_PER_KG = 7700;

/** One weight observation, `day` = whole days since the first observation. */
export interface WeightPoint {
  day: number;
  weightKg: number;
}

const mean = (xs: number[]): number => xs.reduce((a, b) => a + b, 0) / xs.length;

/** Ordinary-least-squares slope (kg/day) of weight vs day. Needs >= 2 distinct days. */
export function olsSlopeKgPerDay(points: WeightPoint[]): number {
  if (points.length < 2) throw new Error("need at least 2 points");
  const mx = mean(points.map((p) => p.day));
  const my = mean(points.map((p) => p.weightKg));
  let num = 0;
  let den = 0;
  for (const p of points) {
    num += (p.day - mx) * (p.weightKg - my);
    den += (p.day - mx) ** 2;
  }
  if (den === 0) throw new Error("all points share one day");
  return num / den;
}

/**
 * Slope (kg/day) from the difference between the mean of the first `windowDays`
 * and the mean of the last `windowDays` of observations (smooths water noise).
 * Throws when the two windows overlap (date span < 2 * windowDays).
 */
export function endpointSlopeKgPerDay(points: WeightPoint[], windowDays: number): number {
  const days = points.map((p) => p.day);
  const first = Math.min(...days);
  const last = Math.max(...days);
  if (last - first + 1 < 2 * windowDays)
    throw new Error(`date span must be at least ${2 * windowDays} days (2x window)`);
  const head = points.filter((p) => p.day < first + windowDays);
  const tail = points.filter((p) => p.day > last - windowDays);
  const dDay = mean(tail.map((p) => p.day)) - mean(head.map((p) => p.day));
  return (mean(tail.map((p) => p.weightKg)) - mean(head.map((p) => p.weightKg))) / dDay;
}

/** Measured TDEE: mean intake minus the energy stored/released by weight change. */
export function energyBalanceTdee(meanIntakeKcal: number, slopeKgPerDay: number): number {
  return meanIntakeKcal - slopeKgPerDay * KCAL_PER_KG;
}
