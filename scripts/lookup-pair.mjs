#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { archetypeName, pairKey, parseTritypeCode } from "./tritype-utils.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(__dirname, "..");
const dataPath = path.join(skillRoot, "data", "pairs.json");

function usage(exitCode = 0) {
  const stream = exitCode === 0 ? process.stdout : process.stderr;
  stream.write(`Usage:
  node scripts/lookup-pair.mjs <tritype-a> <tritype-b> [--format json|markdown]
  node scripts/lookup-pair.mjs <pair-key> [--format json|markdown]

Examples:
  node scripts/lookup-pair.mjs 378 935
  node scripts/lookup-pair.mjs 378-935 --format markdown
`);
  process.exit(exitCode);
}

const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) usage(0);

let format = "json";
const formatIndex = args.indexOf("--format");
if (formatIndex !== -1) {
  format = args[formatIndex + 1];
  args.splice(formatIndex, 2);
}
if (!["json", "markdown"].includes(format)) {
  console.error(`Unsupported format: ${format}`);
  usage(1);
}

let key;
let requested;
if (args.length === 1 && args[0].includes("-")) {
  const [aCode, bCode] = args[0].split("-");
  key = pairKey(aCode, bCode);
  requested = { a: aCode, b: bCode };
} else if (args.length === 2) {
  key = pairKey(args[0], args[1]);
  requested = { a: args[0], b: args[1] };
} else {
  usage(1);
}

if (!key) {
  console.error("Invalid tritype code. Use canonical lead-first codes with one head, heart, and gut digit.");
  process.exit(1);
}

const pairs = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const analysis = pairs[key];
if (!analysis) {
  console.error(`No analysis found for ${key}.`);
  process.exit(2);
}

const canonicalCodes = key.split("-");
const result = {
  key,
  requested,
  canonical: {
    a: canonicalCodes[0],
    b: canonicalCodes[1],
    archetypeA: archetypeName(canonicalCodes[0]),
    archetypeB: archetypeName(canonicalCodes[1]),
  },
  analysis,
};

if (format === "json") {
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
} else {
  process.stdout.write(`# ${key}

${canonicalCodes[0]} (${result.canonical.archetypeA}) vs ${canonicalCodes[1]} (${result.canonical.archetypeB})

## Summary

${analysis.summary}

${analysis.sections
  .map((section) => `## ${section.heading}\n\n${section.body}`)
  .join("\n\n")}
`);
}
