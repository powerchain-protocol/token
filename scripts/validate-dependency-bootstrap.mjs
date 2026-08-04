import fs from "node:fs";
import path from "node:path";
import { REPO_ROOT, assertRepositoryRoot } from "./lib/repo-root.mjs";
assertRepositoryRoot();
const required = [
  ["apps/faucet/package.json", ["predev", "predev:debug", "pretypecheck"]],
  ["apps/client/package.json", ["prebuild", "pretypecheck", "pretest"]],
  ["packages/native-token-client/package.json", ["prebuild", "pretypecheck"]],
];
for (const [file, scripts] of required) {
  const pkg = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, file), "utf8"));
  for (const name of scripts) {
    if (!pkg.scripts?.[name]?.includes("ensure-package-dependencies.mjs")) {
      throw new Error(`${file} is missing dependency bootstrap script ${name}`);
    }
  }
}
console.log("Dependency bootstrap validation passed.");
