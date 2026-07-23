import { describe, expect, test } from "vitest";
import app from "./worker.js";

const initBody = {
  jsonrpc: "2.0", id: 1, method: "initialize",
  params: {
    protocolVersion: "2025-03-26",
    capabilities: {},
    clientInfo: { name: "test", version: "0.0.0" },
  },
};

describe("worker fetch handler", () => {
  test("GET /health returns ok", async () => {
    const res = await app.request("/health");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
  });

  test("POST /mcp initialize returns a successful MCP response", async () => {
    const res = await app.request("/mcp", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json, text/event-stream",
      },
      body: JSON.stringify(initBody),
    });
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain("fitness-tools");
    expect(text).toContain("serverInfo");
  });
});
