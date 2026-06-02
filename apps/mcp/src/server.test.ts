import { describe, expect, test } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { REGISTRY } from "@almostjacked/fitness-tools";
import { buildServer } from "./server.js";

async function connect(): Promise<Client> {
  const [clientT, serverT] = InMemoryTransport.createLinkedPair();
  const server = buildServer();
  await server.connect(serverT);
  const client = new Client({ name: "test", version: "0.0.0" });
  await client.connect(clientT);
  return client;
}

describe("mcp server contract", () => {
  test("advertises every registry tool with object schemas", async () => {
    const client = await connect();
    const { tools } = await client.listTools();
    const names = new Set(tools.map((t) => t.name));

    expect(tools.length).toBe(7);
    for (const id of REGISTRY.keys()) expect(names.has(id)).toBe(true);

    const tdee = tools.find((t) => t.name === "tdee")!;
    expect(tdee.description).toContain("TDEE");
    expect((tdee.inputSchema as { type?: string }).type).toBe("object");
    expect((tdee.outputSchema as { type?: string } | undefined)?.type).toBe("object");
  });
});
