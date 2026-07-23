import { z } from "zod";
import {
  KCAL_PER_KG, endpointSlopeKgPerDay, energyBalanceTdee, olsSlopeKgPerDay,
  type WeightPoint,
} from "../math/adaptive.js";
import { MassSchema, massKg } from "../math/units.js";
import { computeConsensus, roundTo } from "../math/stats.js";
import { DomainError } from "../errors.js";
import {
  MethodResultSchema, SkippedMethodSchema, ConsensusSchema,
} from "../models.js";
import { MethodsSchema, resolveMethods, runMethods, type MethodOutput } from "../dispatch.js";
import type { Tool } from "../registry.js";

const ALL_METHODS = ["regression", "endpoints"];
const REASONS: Record<string, string> = {
  regression: "regression: requires at least 2 distinct dates",
  endpoints: "endpoints: requires a date span of at least 2x window_days",
};

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export const AdaptiveTdeeInput = z.object({
  entries: z
    .array(
      z.object({
        date: z.string().regex(DATE_RE, "expected YYYY-MM-DD"),
        weight: MassSchema,
        kcal: z.number().gt(0).lte(20000),
      }),
    )
    .min(10)
    .max(400),
  window_days: z.number().int().gte(3).lte(14).default(7),
  methods: MethodsSchema,
});
export type AdaptiveTdeeInputT = z.output<typeof AdaptiveTdeeInput>;

export const AdaptiveTdeeOutput = z.object({
  results: z.array(MethodResultSchema),
  consensus: ConsensusSchema.nullable(),
  skipped: z.array(SkippedMethodSchema),
});
export type AdaptiveTdeeOutputT = z.output<typeof AdaptiveTdeeOutput>;

function toPoints(inp: AdaptiveTdeeInputT): { points: WeightPoint[]; meanKcal: number } {
  const stamps = inp.entries.map((e) => ({
    t: Date.parse(`${e.date}T00:00:00Z`), kg: massKg(e.weight), kcal: e.kcal,
  }));
  const seen = new Set<number>();
  for (const s of stamps) {
    if (seen.has(s.t)) throw new DomainError("duplicate date in entries");
    seen.add(s.t);
  }
  stamps.sort((a, b) => a.t - b.t);
  const t0 = stamps[0].t;
  const points = stamps.map((s) => ({
    day: Math.round((s.t - t0) / 86_400_000), weightKg: s.kg,
  }));
  const meanKcal = stamps.reduce((a, s) => a + s.kcal, 0) / stamps.length;
  return { points, meanKcal };
}

export function compute(inp: AdaptiveTdeeInputT): AdaptiveTdeeOutputT {
  const { points, meanKcal } = toPoints(inp);
  const info = (slope: number) => ({
    mean_intake_kcal: roundTo(meanKcal, 0),
    weight_change_kg_per_week: roundTo(slope * 7, 3),
    span_days: points[points.length - 1].day - points[0].day + 1,
    n_entries: points.length,
    kcal_per_kg: KCAL_PER_KG,
  });
  const run = (method: string): MethodOutput => {
    if (method === "regression") {
      const slope = olsSlopeKgPerDay(points);
      return [energyBalanceTdee(meanKcal, slope), info(slope)];
    }
    if (method === "endpoints") {
      let slope: number;
      try {
        slope = endpointSlopeKgPerDay(points, inp.window_days);
      } catch {
        return null; // span too short -> skipped with REASONS.endpoints
      }
      return [energyBalanceTdee(meanKcal, slope), info(slope)];
    }
    throw new DomainError(`unknown method: ${method}`);
  };
  const { requested, explicit } = resolveMethods(inp.methods, ALL_METHODS);
  const { results, skipped } = runMethods(requested, explicit, run, "kcal/day", {
    reasonFn: (m) => REASONS[m] ?? `${m}: required inputs missing`,
    ndigits: 0,
  });
  return { results, consensus: computeConsensus(results.map((r) => r.value)), skipped };
}

export const tool: Tool<AdaptiveTdeeInputT, AdaptiveTdeeOutputT> = {
  id: "adaptive-tdee",
  name: "Adaptive TDEE",
  description:
    "Measure actual TDEE from a logged history of daily weight and calorie intake " +
    "(energy balance: mean intake minus stored energy, Wishnofsky 7700 kcal/kg). " +
    "Use instead of formula TDEE once ~2+ weeks of real data exist.",
  category: "energy",
  tags: ["tdee", "adaptive", "energy-balance", "weight-trend"],
  methods: ALL_METHODS,
  input: AdaptiveTdeeInput,
  output: AdaptiveTdeeOutput,
  compute,
  examples: [
    {
      input: {
        entries: Array.from({ length: 14 }, (_, d) => ({
          date: new Date(Date.UTC(2026, 0, 1 + d)).toISOString().slice(0, 10),
          weight: { value: 80 - 0.05 * d, unit: "kg" },
          kcal: 2500,
        })),
      },
      output: { results: [{ method: "regression", unit: "kcal/day" }] },
    },
  ],
};
