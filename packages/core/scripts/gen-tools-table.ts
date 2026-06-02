import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { toolsTableMarkdown } from "../src/tools-table.js";

const START = "<!-- tools:start -->";
const END = "<!-- tools:end -->";

const here = dirname(fileURLToPath(import.meta.url));
const readme = join(here, "..", "README.md");

const src = readFileSync(readme, "utf8");
const before = src.indexOf(START);
const after = src.indexOf(END);
if (before === -1 || after === -1) {
  throw new Error(`README is missing ${START} / ${END} markers`);
}

const block = `${START}\n${toolsTableMarkdown()}\n${END}`;
const next = src.slice(0, before) + block + src.slice(after + END.length);
writeFileSync(readme, next);
console.log("Updated tools table in packages/core/README.md");
