import fs from "node:fs";
import path from "node:path";
import { REPO_ROOT, assertRepositoryRoot } from "./lib/repo-root.mjs";

assertRepositoryRoot();

const webRoot = path.join(REPO_ROOT, "apps/web");
const packageJson = JSON.parse(fs.readFileSync(path.join(webRoot, "package.json"), "utf8"));
const tsconfig = JSON.parse(fs.readFileSync(path.join(webRoot, "tsconfig.json"), "utf8"));
const failures = [];

for (const dependency of [
  "next",
  "react",
  "react-dom",
  "@solana/web3.js",
  "@solana/wallet-adapter-base",
  "@solana/wallet-adapter-react",
  "@solana/wallet-adapter-wallets",
  "tweetnacl",
]) {
  if (!packageJson.dependencies?.[dependency]) failures.push(`missing web dependency: ${dependency}`);
}

for (const dependency of ["@types/node", "@types/react", "@types/react-dom", "typescript"]) {
  if (!packageJson.devDependencies?.[dependency]) failures.push(`missing web devDependency: ${dependency}`);
}

const types = tsconfig.compilerOptions?.types ?? [];
for (const type of ["node", "react", "react-dom"]) {
  if (!types.includes(type)) failures.push(`apps/web tsconfig must enable ${type} types`);
}

if (fs.existsSync(path.join(webRoot, "next.config.ts"))) {
  failures.push("obsolete apps/web/next.config.ts must be removed; use next.config.mjs");
}
if (!fs.existsSync(path.join(webRoot, "next.config.mjs"))) {
  failures.push("apps/web/next.config.mjs is missing");
}

if (failures.length) {
  console.error("Web toolchain validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Web toolchain validation passed.");
