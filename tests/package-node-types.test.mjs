import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const readJson = (path) => JSON.parse(fs.readFileSync(path, "utf8"));

test("Node-oriented workspace packages declare and enable local Node typings", () => {
  for (const directory of ["packages/standards", "utils", "apps/faucet", "apps/web"]) {
    const packageJson = readJson(`${directory}/package.json`);
    const tsconfig = readJson(`${directory}/tsconfig.json`);
    assert.ok(
      packageJson.devDependencies?.["@types/node"] ?? packageJson.dependencies?.["@types/node"],
      `${directory} must declare @types/node`,
    );
    assert.ok(
      tsconfig.compilerOptions?.types?.includes("node"),
      `${directory} must enable Node types`,
    );
  }
});
