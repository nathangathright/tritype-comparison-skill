#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.resolve(__dirname, "..", "data", "pairs.json");
const pairs = JSON.parse(fs.readFileSync(dataPath, "utf8"));

const args = process.argv.slice(2);
const json = args.includes("--json");
const keys = Object.keys(pairs).sort();

if (json) {
  process.stdout.write(`${JSON.stringify(keys, null, 2)}\n`);
} else {
  process.stdout.write(`${keys.join("\n")}\n`);
}
