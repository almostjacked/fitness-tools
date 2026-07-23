import { describe, expect, test } from "vitest";
import {
  KCAL_PER_KG, energyBalanceTdee, olsSlopeKgPerDay, endpointSlopeKgPerDay,
  type WeightPoint,
} from "./adaptive.js";

function linear(days: number, w0: number, slopePerDay: number): WeightPoint[] {
  return Array.from({ length: days }, (_, day) => ({
    day, weightKg: w0 + slopePerDay * day,
  }));
}

describe("energy-balance adaptive TDEE math", () => {
  // Wishnofsky (1958): 3500 kcal per lb of body mass ≈ 7700 kcal/kg.
  test("pins the Wishnofsky energy density", () => {
    expect(KCAL_PER_KG).toBe(7700);
  });

  test("losing 1 lb/week at 2000 kcal intake implies ~2500 kcal TDEE", () => {
    // 1 lb = 0.45359237 kg over 7 days
    const slope = -0.45359237 / 7;
    expect(energyBalanceTdee(2000, slope)).toBeCloseTo(2499, 0);
  });

  test("OLS slope recovers an exactly linear trend", () => {
    expect(olsSlopeKgPerDay(linear(28, 80, -0.05))).toBeCloseTo(-0.05, 10);
  });

  test("OLS slope handles gaps (irregular days)", () => {
    const pts = linear(28, 80, -0.05).filter((p) => p.day % 3 !== 1);
    expect(olsSlopeKgPerDay(pts)).toBeCloseTo(-0.05, 10);
  });

  test("endpoint slope matches OLS on linear data", () => {
    expect(endpointSlopeKgPerDay(linear(28, 80, -0.05), 7)).toBeCloseTo(-0.05, 10);
  });

  test("endpoint slope throws when windows overlap", () => {
    expect(() => endpointSlopeKgPerDay(linear(10, 80, -0.05), 7)).toThrow(/span/);
  });

  test("weight gain yields TDEE below intake", () => {
    expect(energyBalanceTdee(3000, 0.03)).toBeCloseTo(3000 - 0.03 * 7700, 6);
  });
});
