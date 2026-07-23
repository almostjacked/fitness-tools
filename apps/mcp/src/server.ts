import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerAll } from "./tools.js";
import { VERSION } from "./version.js";

/** Build a fully-registered MCP server (no transport attached). */
export function buildServer(): McpServer {
  const server = new McpServer({
    name: "@almostjacked/fitness-tools-mcp",
    version: VERSION,
  });
  registerAll(server);
  return server;
}
