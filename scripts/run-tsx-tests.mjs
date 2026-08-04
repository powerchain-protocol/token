#!/usr/bin/env node
import { existsSync } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const testFiles = process.argv.slice(2).map((value) => path.resolve(root, value));
if (testFiles.length === 0) throw new Error("At least one test file is required");
for (const file of testFiles) if (!existsSync(file)) throw new Error(`Test file does not exist: ${file}`);

async function resolveTsxLoader() {
  const direct = path.join(root, "node_modules", "tsx", "dist", "loader.mjs");
  if (existsSync(direct)) return direct;
  const store = path.join(root, "node_modules", ".pnpm");
  if (existsSync(store)) {
    for (const entry of await readdir(store)) {
      if (!entry.startsWith("tsx@")) continue;
      const candidate = path.join(store, entry, "node_modules", "tsx", "dist", "loader.mjs");
      if (existsSync(candidate)) return candidate;
    }
  }
  throw new Error(`tsx is not installed. Run \`cd ${root} && pnpm install\` or \`pnpm install:repair\`.`);
}

const loader = await resolveTsxLoader();
const child = spawn(process.execPath, ["--test", "--import", pathToFileURL(loader).href, ...testFiles], {
  cwd: root,
  stdio: "inherit",
  env: process.env,
});
child.on("error", (error) => { console.error(error.message); process.exitCode = 1; });
child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exitCode = code ?? 1;
});
