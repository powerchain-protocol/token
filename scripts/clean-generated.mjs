import fs from "node:fs";
import path from "node:path";

import { REPO_ROOT, assertRepositoryRoot } from "./lib/repo-root.mjs";

assertRepositoryRoot();

const targets = [
  "apps/web/.next",
  "apps/web/tsconfig.tsbuildinfo",
  "apps/faucet/dist",
  "client/dist",
  "packages/native-token-client/dist",
  "packages/standards/dist",
  "packages/token-metadata/dist",
  "utils/dist",
];

for (const target of targets) {
  const absolute = path.join(REPO_ROOT, target);
  fs.rmSync(absolute, { force: true, recursive: true });
  console.log(`cleaned ${target}`);
}
