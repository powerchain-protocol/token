import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { REPO_ROOT, assertRepositoryRoot } from "./lib/repo-root.mjs";
import { inspectWorkspaceDependencies } from "./lib/workspace-dependencies.mjs";

assertRepositoryRoot();
const checks = [];
function check(name, fn) {
  try { const detail = fn(); checks.push({ name, ok: true, detail }); }
  catch (error) { checks.push({ name, ok: false, detail: error instanceof Error ? error.message : String(error) }); }
}
check("repository", () => REPO_ROOT);
check("node", () => process.version);
check("package manager", () => JSON.parse(fs.readFileSync(path.join(REPO_ROOT,"package.json"),"utf8")).packageManager);
check("dependencies", () => {
  const status = inspectWorkspaceDependencies();
  if (!status.installed) {
    throw new Error(`Next.js unresolved (root modules=${status.modulesManifestPresent}, web modules=${status.webNodeModulesPresent})`);
  }
  return `${status.nextPackage} (${status.resolutionMode})`;
});
check("workspace policy", () => {
  const text=fs.readFileSync(path.join(REPO_ROOT,"pnpm-workspace.yaml"),"utf8");
  if(!/verifyDepsBeforeRun:\s*false/.test(text)) throw new Error("verifyDepsBeforeRun must be false");
  if(!/allowBuilds:/.test(text)) throw new Error("allowBuilds is missing");
  return "pnpm 11 policy present";
});
check("app routes", () => {
  for (const file of ["apps/web/app/page.tsx","apps/web/app/layout.tsx","apps/web/app/api/v1/cors/route.ts","apps/web/app/api/faucets/native-sol/route.ts"]) {
    if(!fs.existsSync(path.join(REPO_ROOT,file))) throw new Error(`missing ${file}`);
  }
  return "required routes present";
});
for (const item of checks) console.log(`${item.ok ? "✓" : "✗"} ${item.name}: ${item.detail}`);
if (checks.some((item)=>!item.ok)) process.exitCode=1;
