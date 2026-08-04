#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { REPO_ROOT, assertRepositoryRoot } from "./lib/repo-root.mjs";

assertRepositoryRoot();

const checks = [
  ["apps/web", ["next", "react", "react-dom", "@solana/web3.js"]],
  ["apps/faucet", ["tsx", "typescript", "@powerchain/native-token-client", "@solana/web3.js", "@solana/spl-token"]],
  ["apps/client", ["tsx", "typescript", "@powerchain/native-token-client", "@powerchain/standards"]],
  ["packages/native-token-client", ["typescript", "@coral-xyz/anchor", "@solana/web3.js", "@solana/spl-token", "axios", "bs58", "@powerchain/standards"]],
];

let failed = false;
for (const [workspace, modules] of checks) {
  const result = spawnSync(process.execPath, [
    "scripts/ensure-package-dependencies.mjs",
    workspace,
    ...modules,
  ], { cwd: REPO_ROOT, stdio: "inherit", env: process.env });
  if (result.status !== 0) failed = true;
}

if (failed) {
  console.error(`\nDependency graph is incomplete. Run: cd ${REPO_ROOT} && pnpm deps:repair`);
  process.exit(1);
}
console.log("All critical workspace dependencies resolve.");
