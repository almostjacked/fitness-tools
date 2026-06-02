import { describe, expect, test } from "vitest";
import { toolsTableMarkdown } from "./tools-table.js";

describe("toolsTableMarkdown", () => {
  const md = toolsTableMarkdown();

  test("is a markdown table with a header row", () => {
    expect(md).toContain("| Tool | Methods | Description |");
    expect(md).toContain("|---|---|---|");
  });

  test("lists all 7 tools with their methods", () => {
    expect(md).toContain("`tdee`");
    expect(md).toContain("mifflin, harris, katch, cunningham");
    expect(md).toContain("`powerlifting-attempts`");
    expect(md).toContain("`muscle-potential`");
    expect(md.split("\n").filter((l) => l.startsWith("| `")).length).toBe(7);
  });
});
