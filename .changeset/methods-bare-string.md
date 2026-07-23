---
"@almostjacked/fitness-tools": patch
---

fix: `methods` now accepts a bare method name (e.g. `"epley"`, `"neat-eat"`) in
addition to an array or `"all"`. LLM MCP clients routinely send the bare-string
shape; the previous array-or-"all" union rejected it with a Zod validation
error, causing failed tool calls. A single name behaves exactly like a
one-element array (explicit mode: missing inputs raise instead of skipping).
