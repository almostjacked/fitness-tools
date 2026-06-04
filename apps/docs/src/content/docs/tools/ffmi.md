---
title: Fat-Free Mass Index (FFMI)
description: Compute FFMI and its height-adjusted form, and flag whether it exceeds the natural ceiling.
---

**Tool id:** `ffmi` · **Methods:** standard

Compute the Fat-Free Mass Index (FFMI) and its height-adjusted form from weight and
body fat percentage (or lean mass directly), and flag whether the result exceeds the
~25 natural ceiling (Kouri et al. 1995).

## Input

| Field | Type | Notes |
|---|---|---|
| `height` | `{ value, unit }` | `cm` or `in` — required |
| `weight` | `{ value, unit }` | `kg` or `lb` — required |
| `body_fat` | number \| null | body-fat %, 2–70; required if `lean_mass` is absent |
| `lean_mass` | `{ value, unit }` \| null | fat-free mass — alternative to `body_fat` |
| `methods` | `string[] \| "all"` | defaults to `"all"` |

## Methods

- **standard** — Calculates raw FFMI (kg/m²), height-adjusted FFMI normalized to a 1.8 m
  reference, and whether the raw value exceeds the FFMI_NATURAL_CAP of 25.

## Example

```ts
import { REGISTRY } from "@almostjacked/fitness-tools";
const ffmi = REGISTRY.get("ffmi")!;
ffmi.compute(ffmi.input.parse({
  height: { value: 170, unit: "cm" },
  weight: { value: 80, unit: "kg" },
  body_fat: 12,
}));
```

```ts
{
  results: [
    {
      method: "standard",
      value: 24.36,
      unit: "kg/m²",
      detail: {
        ffm_kg: 70.4,
        ffmi_adjusted: 24.97,
        above_natural_limit: false,
      },
    },
  ],
  consensus: null,
}
```

## Call it another way

- **Over HTTP:** `POST /v1/tools/ffmi` — see the [HTTP API](/fitness-tools/api/).
- **From an agent:** the `ffmi` MCP tool — see the [MCP server](/fitness-tools/mcp/server/).
