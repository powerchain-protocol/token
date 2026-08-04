import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(root, "config/workspace.json"), "utf8"));
const rootPackage = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));

test("workspace manifest freezes canonical applications and ports", () => {
  assert.equal(manifest.applications.web.package, "@powerchain/web");
  assert.equal(manifest.applications.web.port, 3005);
  assert.equal(manifest.applications.faucet.package, "@powerchain/faucet");
  assert.equal(manifest.applications.faucet.port, 3015);
});

test("workspace manifest matches runtime versions", () => {
  assert.equal(manifest.packageManager, rootPackage.packageManager);
  assert.equal(manifest.nodeVersion, fs.readFileSync(path.join(root, ".nvmrc"), "utf8").trim());
});

test("legacy root app and faucets directories remain forbidden", () => {
  assert.deepEqual(manifest.legacyPathsForbidden, ["app", "client", "faucets", "components", "idl"]);
  for (const directory of manifest.legacyPathsForbidden) {
    assert.equal(fs.existsSync(path.join(root, directory)), false);
  }
});
