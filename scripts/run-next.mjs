import { spawn } from "node:child_process";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { assertWorkspaceDependencies } from "./lib/workspace-dependencies.mjs";

let status;
try {
  status = assertWorkspaceDependencies();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Usage: node scripts/run-next.mjs <dev|build|start> [...args]");
  process.exit(2);
}

const child = spawn(process.execPath, [status.nextCli, ...args], {
  cwd: fileURLToPath(new URL("../apps/web/", import.meta.url)),
  env: process.env,
  stdio: "inherit",
});

child.on("error", (error) => {
  console.error(`Unable to start Next.js: ${error.message}`);
  process.exitCode = 1;
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exitCode = code ?? 1;
});
