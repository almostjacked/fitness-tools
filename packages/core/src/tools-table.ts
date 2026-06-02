import { REGISTRY } from "./index.js";

/** A markdown table of the registered tools, generated from the registry. */
export function toolsTableMarkdown(): string {
  const header = "| Tool | Methods | Description |\n|---|---|---|";
  const rows = [...REGISTRY.values()].map(
    (t) => `| \`${t.id}\` | ${t.methods.join(", ")} | ${t.description} |`,
  );
  return [header, ...rows].join("\n");
}
