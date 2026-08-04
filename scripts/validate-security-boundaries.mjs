import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { REPO_ROOT } from "./lib/repo-root.mjs";
const gitignore=fs.readFileSync(path.join(REPO_ROOT,".gitignore"),"utf8");
for(const entry of [".env.production","env/.env.production","keypairs/","secrets/","**/target/"]){assert.ok(gitignore.includes(entry),`missing .gitignore boundary: ${entry}`);}
for(const forbidden of [".env.production","env/.env.production","app","client","faucets"]){assert.equal(fs.existsSync(path.join(REPO_ROOT,forbidden)),false,`${forbidden} must not exist`);}
const authority=JSON.parse(fs.readFileSync(path.join(REPO_ROOT,"config/authorities.json"),"utf8"));
assert.equal(authority.recommendedProductionControl.hotWalletAllowed,false);
const pnpm=fs.readFileSync(path.join(REPO_ROOT,"pnpm-workspace.yaml"),"utf8");
assert.ok(pnpm.includes("allowBuilds"));
assert.ok(!pnpm.includes('  - "app"'));
console.log("Security boundary validation passed.");
