import { describe, it, expect } from "vitest";
import { compute, FfmiInput } from "./ffmi.js";
import { DomainError } from "../errors.js";

const base = { height: { value: 170, unit: "cm" }, weight: { value: 80, unit: "kg" } };

describe("ffmi tool", () => {
  it("computes raw + adjusted FFMI and the natural-limit flag", () => {
    const out = compute(FfmiInput.parse({ ...base, body_fat: 12 }));
    expect(out.consensus).toBeNull();
    expect(out.results).toHaveLength(1);
    const r = out.results[0];
    expect(r.method).toBe("standard");
    expect(r.unit).toBe("kg/m²");
    expect(r.value).toBeCloseTo(24.36, 2);
    expect(r.detail).toMatchObject({
      ffm_kg: 70.4,
      ffmi_adjusted: 24.97,
      above_natural_limit: false,
    });
  });

  it("accepts lean_mass directly", () => {
    const out = compute(FfmiInput.parse({ ...base, lean_mass: { value: 70.4, unit: "kg" } }));
    expect(out.results[0].value).toBeCloseTo(24.36, 2);
  });

  it("throws when neither body_fat nor lean_mass is given", () => {
    expect(() => compute(FfmiInput.parse({ ...base }))).toThrow(DomainError);
  });
});
