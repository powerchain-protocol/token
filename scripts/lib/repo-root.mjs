import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const MODULE_DIR = path.dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = path.resolve(MODULE_DIR, "../..");

export function assertRepositoryRoot(root = REPO_ROOT) {
  const required = ["package.json", "pnpm-workspace.yaml", "config", "programs", "apps"];
  for (const entry of required) {
    if (!fs.existsSync(path.join(root, entry))) {
      throw new Error(`Invalid PowerChain repository root: missing ${entry} at ${root}`);
    }
  }
  return root;
}
