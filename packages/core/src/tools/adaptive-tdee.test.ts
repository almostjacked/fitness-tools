import { describe, expect, test } from "vitest";
import { tool, AdaptiveTdeeInput } from "./adaptive-tdee.js";

function series(days: number, w0: number, slopePerDay: number, kcal: number) {
  return Array.from({ length: days }, (_, d) => ({
    date: new Date(Date.UTC(2026, 0, 1 + d)).toISOString().slice(0, 10),
    weight: { value: w0 + slopePerDay * d, unit: "kg" as const },
    kcal,
  }));
}

describe("adaptive-tdee tool", () => {
  test("linear 28-day cut: both methods agree, TDEE = intake + deficit", () => {
    // -0.05 kg/day at 2500 kcal -> TDEE = 2500 + 0.05*7700 = 2885
    const out = tool.compute(AdaptiveTdeeInput.parse({ entries: series(28, 80, -0.05, 2500) }));
    expect(out.skipped).toEqual([]);
    expect(out.results.map((r) => r.method).sort()).toEqual(["endpoints", "regression"]);
    for (const r of out.results) {
      expect(r.value).toBeCloseTo(2885, 0);
      expect(r.unit).toBe("kcal/day");
    }
    expect(out.consensus).not.toBeNull();
    expect(out.consensus!.mean).toBeCloseTo(2885, 0);
  });

  test("short span skips endpoints with a reason, regression still runs", () => {
    const out = tool.compute(AdaptiveTdeeInput.parse({ entries: series(10, 80, -0.05, 2500) }));
    expect(out.results.map((r) => r.method)).toEqual(["regression"]);
    expect(out.skipped.some((s) => s.method === "endpoints")).toBe(true);
  });

  test("lb weights convert", () => {
    const entries = series(28, 176.37, -0.11, 2500).map((e) => ({
      ...e, weight: { value: e.weight.value, unit: "lb" as const },
    }));
    const out = tool.compute(AdaptiveTdeeInput.parse({ entries }));
    // -0.11 lb/day = -0.0499 kg/day -> ~2884 kcal
    expect(out.results[0].value).toBeCloseTo(2884, 0);
  });

  test("duplicate dates are a DomainError", () => {
    const entries = series(14, 80, 0, 2500);
    entries[1] = { ...entries[0] };
    expect(() => tool.compute(AdaptiveTdeeInput.parse({ entries }))).toThrow(/duplicate/);
  });

  test("info reports trend and intake", () => {
    const out = tool.compute(AdaptiveTdeeInput.parse({ entries: series(28, 80, -0.05, 2500) }));
    const reg = out.results.find((r) => r.method === "regression")!;
    expect(reg.detail).toMatchObject({ mean_intake_kcal: 2500, n_entries: 28 });
    expect((reg.detail as any).weight_change_kg_per_week).toBeCloseTo(-0.35, 2);
  });
});
