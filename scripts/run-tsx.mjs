#!/usr/bin/env node
import { existsSync } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "..");
const args = process.argv.slice(2);
let cwd = root;
if (args[0] === "--cwd") {
  const target = args[1];
  if (!target) throw new Error("--cwd requires a workspace-relative directory");
  cwd = path.resolve(root, target);
  args.splice(0, 2);
}
if (!existsSync(cwd)) throw new Error(`Workspace directory does not exist: ${cwd}`);
if (args.length === 0) throw new Error("tsx command arguments are required");

async function resolveTsxCli() {
  const candidates = [
    path.join(cwd, "node_modules", "tsx", "dist", "cli.mjs"),
    path.join(root, "node_modules", "tsx", "dist", "cli.mjs"),
  ];
  for (const candidate of candidates) if (existsSync(candidate)) return candidate;

  const store = path.join(root, "node_modules", ".pnpm");
  if (existsSync(store)) {
    for (const entry of await readdir(store)) {
      if (!entry.startsWith("tsx@")) continue;
      const candidate = path.join(store, entry, "node_modules", "tsx", "dist", "cli.mjs");
      if (existsSync(candidate)) return candidate;
    }
  }
  throw new Error(
    "tsx is not installed for this workspace. Run `cd " + root + " && pnpm install` or `pnpm install:repair`.",
  );
}

const cli = await resolveTsxCli();
const child = spawn(process.execPath, [cli, ...args], { cwd, stdio: "inherit", env: process.env });
child.on("error", (error) => { console.error(error.message); process.exitCode = 1; });
child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exitCode = code ?? 1;
});
