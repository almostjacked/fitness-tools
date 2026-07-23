import { Hono } from "hono";
import { StreamableHTTPTransport } from "@hono/mcp";
import { buildServer } from "./server.js";

/**
 * Stateless remote MCP over streamable HTTP. One server per request — the
 * calculators are pure, so there is no session state to keep.
 */
const app = new Hono();

app.get("/health", (c) => c.json({ ok: true }));

app.all("/mcp", async (c) => {
  const server = buildServer();
  const transport = new StreamableHTTPTransport();
  await server.connect(transport);
  return transport.handleRequest(c);
});

export default app;
