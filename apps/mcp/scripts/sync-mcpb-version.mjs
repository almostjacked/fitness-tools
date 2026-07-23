import { readFileSync, writeFileSync } from "node:fs";

const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url)));
const url = new URL("../mcpb/manifest.json", import.meta.url);
const manifest = JSON.parse(readFileSync(url));
manifest.version = pkg.version;
writeFileSync(url, JSON.stringify(manifest, null, 2) + "\n");
console.log(`mcpb manifest version -> ${pkg.version}`);
