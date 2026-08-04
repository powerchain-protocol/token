import fs from "node:fs";
import path from "node:path";
import { REPO_ROOT } from "./lib/repo-root.mjs";

const pkg = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, "package.json"), "utf8"));
const scripts = pkg.scripts ?? {};
const required = [
  "dev:web", "dev:faucet", "dev:faucet:debug", "dev:doctor", "dev:reset",
  "build", "build:web", "build:faucet", "build:client",
  "typecheck", "typecheck:web", "typecheck:faucet", "typecheck:client",
  "test", "test:client", "test:faucet", "test:program:rust", "test:powerpay",
  "validate:workspace", "validate:workspace-manifest", "validate:layout", "validate:routing",
  "check:quick", "check:all", "preflight", "workspace:repair", "workspace:status",
  "attest:supply:devnet", "verify:onchain:devnet", "prepare:release", "release:status", "release:gate",
];
for (const name of required) {
  if (typeof scripts[name] !== "string" || !scripts[name].trim()) {
    throw new Error(`Missing canonical root script: ${name}`);
  }
}
for (const removed of ["dev:app", "build:app"]) {
  if (removed in scripts) throw new Error(`Obsolete script alias remains: ${removed}`);
}
const help = fs.readFileSync(path.join(REPO_ROOT, "scripts/help.mjs"), "utf8");
for (const name of ["preflight", "workspace:status", "dev:faucet:debug", "attest:supply:devnet", "validate:layout"]) {
  if (!help.includes(`pnpm ${name}`)) throw new Error(`Command catalog omits pnpm ${name}`);
}
console.log(`Root command surface validated (${required.length} canonical commands).`);
