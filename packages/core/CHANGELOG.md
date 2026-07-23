# @almostjacked/fitness-tools

## 0.3.0

### Minor Changes

- 6e58eb2: Add adaptive-tdee calculator: measured TDEE from logged daily weight and calorie intake (energy balance, regression + endpoints methods with consensus).

## 0.2.1

### Patch Changes

- ef7290e: fix: `methods` now accepts a bare method name (e.g. `"epley"`, `"neat-eat"`) in
  addition to an array or `"all"`. LLM MCP clients routinely send the bare-string
  shape; the previous array-or-"all" union rejected it with a Zod validation
  error, causing failed tool calls. A single name behaves exactly like a
  one-element array (explicit mode: missing inputs raise instead of skipping).

## 0.2.0

### Minor Changes

- ee38e0d: Add FFMI and RSMI body-composition calculators.

  - `ffmi` — Fat-Free Mass Index: raw and height-adjusted FFMI from weight and body fat (or lean mass), with a natural-limit flag (compared against the height-normalized value).
  - `rsmi` — Relative Skeletal Muscle Index: from a DXA value (`direct`) and/or an anthropometric estimate (`wen-2011`), flagged against EWGSOP2, AWGS, and Baumgartner sarcopenia cutoffs.

  Additive only — no existing calculator outputs change. Both tools are exposed over the MCP server as well.

## 0.1.0

### Minor Changes

- e9b499d: Initial public release. Validated, self-describing fitness calculators — BMR/TDEE, body
  fat, 1RM, macros, activity multiplier, powerlifting attempts, and natural muscular
  potential — each running multiple published formulas with a consensus across them.
  Isomorphic (browser + server), one dependency (zod).
