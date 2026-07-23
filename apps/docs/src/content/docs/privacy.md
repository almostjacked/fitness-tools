---
title: Privacy Policy
description: Privacy policy for the fitness-tools calculators, MCP server, and desktop extension.
---

_Last updated: 2026-07-23_

This policy covers the `@almostjacked/fitness-tools` library, the
`@almostjacked/fitness-tools-mcp` MCP server (local stdio, the Claude Desktop
extension, and the hosted connector at
`fitness-tools-mcp.ajwallacemusic.workers.dev`), and the reference HTTP API.

## Data collection

**We do not collect, store, or share any personal data.**

The calculators are stateless, deterministic functions. Inputs you provide
(such as weight, height, age, or logged intake) are used only to compute the
result of the call that contains them, and exist only for the duration of that
call.

- **No accounts.** Nothing to sign up for; no identifiers are created.
- **No storage.** No database, no server-side persistence of inputs or results.
- **No logging of inputs.** The hosted connector does not record request bodies.
  Cloudflare, the hosting platform, processes requests to serve them and may
  record standard operational metadata (such as request counts and IP-level
  traffic data) per the [Cloudflare privacy policy](https://www.cloudflare.com/privacypolicy/).
- **No third-party sharing.** Your inputs are not sent to anyone. The local
  (stdio / desktop extension) versions run entirely on your machine and make
  no network calls.
- **No retention.** Because nothing is stored, there is nothing to retain or
  delete.

## Health data

Inputs may include health-related measurements (body weight, body fat,
calorie intake). These are processed in memory to produce the calculation
result and are never stored or transmitted onward.

## Contact

Questions or concerns: open an issue at
[github.com/almostjacked/fitness-tools](https://github.com/almostjacked/fitness-tools/issues)
or email <ajwallacemusic@gmail.com>.
