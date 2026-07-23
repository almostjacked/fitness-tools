import { z } from "zod";
import { DomainError } from "./errors.js";
import type { MethodResult, SkippedMethod } from "./models.js";
import { roundTo } from "./math/stats.js";

/** Accepted shapes for a tool's `methods` input: "all" (default), a single
 * method name, or a list of names. LLM callers routinely send a bare name
 * ("epley", "neat-eat"); the earlier array-or-"all" union rejected that shape
 * and caused real failed tool calls in MCP clients. */
export const MethodsSchema = z.union([z.array(z.string()), z.string()]).default("all");
export type MethodsInput = z.output<typeof MethodsSchema>;

export function resolveMethods(
  methods: MethodsInput,
  allMethods: readonly string[],
): { requested: string[]; explicit: boolean } {
  if (methods === "all") return { requested: [...allMethods], explicit: false };
  if (typeof methods === "string") return { requested: [methods], explicit: true };
  return { requested: methods, explicit: true };
}

export type MethodOutput = [number, Record<string, unknown> | null] | null;
export type ComputeFn = (method: string) => MethodOutput;

export interface RunMethodsOptions {
  reasonFn?: (method: string) => string;
  ndigits?: number;
}

export function runMethods(
  requested: string[],
  explicit: boolean,
  computeFn: ComputeFn,
  unit: string,
  opts: RunMethodsOptions = {},
): { results: MethodResult[]; skipped: SkippedMethod[] } {
  const { reasonFn, ndigits = 1 } = opts;
  const results: MethodResult[] = [];
  const skipped: SkippedMethod[] = [];
  const seen = new Set<string>();
  for (const m of requested) {
    if (seen.has(m)) continue;
    seen.add(m);
    const out = computeFn(m);
    if (out === null) {
      const reason = reasonFn ? reasonFn(m) : `${m}: required inputs missing`;
      if (explicit) throw new DomainError(reason);
      skipped.push({ method: m, reason });
      continue;
    }
    const [value, detail] = out;
    results.push({ method: m, value: roundTo(value, ndigits), unit, detail });
  }
  return { results, skipped };
}
