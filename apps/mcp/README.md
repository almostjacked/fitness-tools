# @almostjacked/fitness-tools-mcp

[![MCP Registry](https://img.shields.io/badge/MCP_Registry-io.github.almostjacked%2Ffitness--tools-blue)](https://registry.modelcontextprotocol.io/v0/servers?search=almostjacked)
[![Install in Cursor](https://img.shields.io/badge/Cursor-Install_MCP-black)](https://cursor.com/install-mcp?name=fitness-tools&config=eyJ0eXBlIjogImh0dHAiLCAidXJsIjogImh0dHBzOi8vZml0bmVzcy10b29scy1tY3AuYWp3YWxsYWNlbXVzaWMud29ya2Vycy5kZXYvbWNwIn0%3D)
[![Install in VS Code](https://img.shields.io/badge/VS_Code-Install_MCP-0098FF)](https://insiders.vscode.dev/redirect/mcp/install?name=fitness-tools&config=%7B%22type%22%3A%20%22http%22%2C%20%22url%22%3A%20%22https%3A//fitness-tools-mcp.ajwallacemusic.workers.dev/mcp%22%7D)

An [MCP](https://modelcontextprotocol.io) stdio server that exposes the
[`@almostjacked/fitness-tools`](../../packages/core) calculators as MCP tools —
one tool per calculator (TDEE, body fat, 1RM, macros, activity multiplier,
powerlifting attempts, muscle potential). Same math as the library and the
[HTTP API](../api); the only difference is the protocol.

Works with any MCP-compatible client (Claude Code, Claude Desktop, Cursor,
Windsurf, Zed, Cline, Continue, and others).

## Use it

### Hosted (no install)

Add a custom connector in claude.ai / Claude Desktop → Settings → Connectors:

    https://fitness-tools-mcp.ajwallacemusic.workers.dev/mcp

### Claude Desktop one-click

Download [`fitness-tools.mcpb`](https://github.com/almostjacked/fitness-tools/releases)
and double-click it.

### npx (no install)

```bash
npx @almostjacked/fitness-tools-mcp
```

### Claude Code

```bash
claude mcp add fitness-tools -- npx -y @almostjacked/fitness-tools-mcp
```

### Claude Desktop / generic client config

```json
{
  "mcpServers": {
    "fitness-tools": {
      "command": "npx",
      "args": ["-y", "@almostjacked/fitness-tools-mcp"]
    }
  }
}
```

## Tools

> Per-tool inputs, methods, and citations live on the [tool pages](https://almostjacked.github.io/fitness-tools/tools/tdee/) — identical across library, HTTP, and MCP.

Each tool returns both `structuredContent` (validated against the calculator's
output schema) and a JSON text fallback. Invalid input and domain errors come
back as tool errors (`isError: true`), not crashes.

For agent-facing usage — picking a tool, reading `consensus`/`skipped`, error handling, and
a chained workflow — see the [consumer guide](https://almostjacked.github.io/fitness-tools/mcp/agents/).

## Develop

```bash
pnpm -C apps/mcp test       # vitest (in-memory client/server)
pnpm -C apps/mcp build      # emit dist/
pnpm -C apps/mcp dev        # tsx watch (stdio)
```
