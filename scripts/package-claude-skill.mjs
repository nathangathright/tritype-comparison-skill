#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const skillRoot = path.resolve(__dirname, "..");
const skillName = "tritype-comparison";
const distDir = path.join(skillRoot, "dist");
const stageRoot = path.join(distDir, "stage");
const stageSkill = path.join(stageRoot, skillName);
const zipPath = path.join(distDir, `${skillName}.zip`);

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
    return;
  }
  fs.copyFileSync(src, dest);
}

fs.rmSync(stageRoot, { recursive: true, force: true });
fs.rmSync(zipPath, { force: true });
fs.mkdirSync(stageSkill, { recursive: true });

copyRecursive(path.join(skillRoot, "SKILL.md"), path.join(stageSkill, "SKILL.md"));
copyRecursive(path.join(skillRoot, "data"), path.join(stageSkill, "data"));

const stageScripts = path.join(stageSkill, "scripts");
fs.mkdirSync(stageScripts, { recursive: true });
for (const script of ["lookup-pair.mjs", "list-pairs.mjs", "tritype-utils.mjs"]) {
  copyRecursive(path.join(skillRoot, "scripts", script), path.join(stageScripts, script));
}

const zip = spawnSync("zip", ["-qr", zipPath, skillName], {
  cwd: stageRoot,
  encoding: "utf8",
});

if (zip.status !== 0) {
  process.stderr.write(zip.stderr || "Failed to create ZIP.\n");
  process.exit(zip.status ?? 1);
}

fs.rmSync(stageRoot, { recursive: true, force: true });
process.stdout.write(`${zipPath}\n`);
