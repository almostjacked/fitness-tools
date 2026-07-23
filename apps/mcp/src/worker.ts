import { Hono } from "hono";
import { StreamableHTTPTransport } from "@hono/mcp";
import { buildServer } from "./server.js";

/**
 * Stateless remote MCP over streamable HTTP. One server per request — the
 * calculators are pure, so there is no session state to keep.
 */
const app = new Hono();

app.get("/health", (c) => c.json({ ok: true }));

app.post("/mcp", async (c) => {
  const server = buildServer();
  const transport = new StreamableHTTPTransport();
  await server.connect(transport);
  // No explicit close: the server is stateless and per-request; the transport
  // aborts its stream when the response completes, and nothing else holds
  // resources. A GET push channel would never receive messages (fresh server
  // per request), so non-POST methods are rejected above.
  return transport.handleRequest(c);
});

app.on(["GET", "DELETE"], "/mcp", (c) => {
  c.header("Allow", "POST");
  return c.json({ error: "method not allowed: stateless server, POST only" }, 405);
});

export default app;
