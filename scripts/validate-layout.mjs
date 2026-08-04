import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const required = [
  "apps/web",
  "apps/faucet",
  "programs/native-token/src",
  "programs/native-token/idl/powerchain.json",
  "programs/powerpay/src",
  "packages/native-token-client",
  "target/README.md",
];
const forbidden = [
  "app",
  "faucets",
  "components",
  "idl",
  "apps/web/next.config.ts",
  "programs/native-token/target",
  "programs/powerpay/target",
];

for (const item of required) {
  if (!existsSync(path.join(root, item))) throw new Error(`Missing canonical path: ${item}`);
}
for (const item of forbidden) {
  if (existsSync(path.join(root, item))) throw new Error(`Legacy or generated path must be removed: ${item}`);
}

const rustRunner = await readFile(path.join(root, "scripts/run-rust-tool.mjs"), "utf8");
if (!rustRunner.includes('CARGO_TARGET_DIR')) throw new Error("Rust runner must centralize Cargo output under root target/");
const rootTsconfig = JSON.parse(await readFile(path.join(root, "tsconfig.json"), "utf8"));
if (rootTsconfig.include?.some((entry) => entry.startsWith("components/"))) {
  throw new Error("Root TypeScript config must not include the removed root components tree");
}
console.log("Canonical monorepo layout validation passed.");
