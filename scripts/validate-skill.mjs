#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pairKey } from "./tritype-utils.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(__dirname, "..");
const skillPath = path.join(skillRoot, "SKILL.md");
const dataPath = path.join(skillRoot, "data", "pairs.json");

const skill = fs.readFileSync(skillPath, "utf8");
const frontmatter = skill.match(/^---\n([\s\S]*?)\n---\n/);
if (!frontmatter) throw new Error("SKILL.md is missing YAML frontmatter.");

const fields = Object.fromEntries(
  frontmatter[1].split("\n").map((line) => {
    const index = line.indexOf(":");
    return [line.slice(0, index), line.slice(index + 1).trim()];
  }),
);

if (fields.name !== "tritype-comparison") {
  throw new Error("SKILL.md name must be tritype-comparison.");
}
if (!fields.description) {
  throw new Error("SKILL.md description is required.");
}
if (fields.description.length > 200) {
  throw new Error(`SKILL.md description is ${fields.description.length} characters; Claude.ai allows 200.`);
}

const pairs = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const malformed = [];
const notCanonical = [];
const missingSummary = [];

for (const [key, analysis] of Object.entries(pairs)) {
  const parts = key.split("-");
  if (parts.length !== 2) {
    malformed.push(key);
    continue;
  }

  if (pairKey(parts[0], parts[1]) !== key) notCanonical.push(key);
  if (!analysis.summary || !Array.isArray(analysis.sections)) missingSummary.push(key);
}

if (malformed.length) throw new Error(`Malformed keys: ${malformed.slice(0, 5).join(", ")}`);
if (notCanonical.length) throw new Error(`Non-canonical keys: ${notCanonical.slice(0, 5).join(", ")}`);
if (missingSummary.length) throw new Error(`Missing analysis fields: ${missingSummary.slice(0, 5).join(", ")}`);

process.stdout.write(`Skill is valid. ${Object.keys(pairs).length} pair analyses checked.\n`);
