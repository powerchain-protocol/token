import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const checks = [
  ["IDL synchronization", "scripts/sync-idl.mjs"],
  ["Frozen PTK-001 profile", "scripts/validate-frozen-profile.mjs"],
  ["Workspace configuration", "scripts/validate-config.mjs"],
  ["Faucet configuration", "scripts/validate-faucet.mjs"],
  ["Public assets", "scripts/validate-assets.mjs"],
  ["Token metadata", "programs/native-token/scripts/validate-metadata.mjs"],
];

const failures = [];
for (const [label, script] of checks) {
  console.log(`\n== ${label} ==`);
  const result = spawnSync(process.execPath, [resolve(root, script)], { cwd: root, stdio: "inherit" });
  if (result.status !== 0) failures.push(label);
}
if (failures.length) {
  console.error(`\nWorkspace validation failed: ${failures.join(", ")}`);
  process.exit(1);
}
console.log(`\nWorkspace validation passed (${checks.length} checks).`);
