#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(__dirname, "..");
const skillName = "tritype-comparison";
const target = path.join(os.homedir(), ".claude", "skills", skillName);

fs.mkdirSync(path.dirname(target), { recursive: true });
fs.rmSync(target, { recursive: true, force: true });
fs.symlinkSync(skillRoot, target, "dir");

process.stdout.write(`${target} -> ${skillRoot}\n`);
