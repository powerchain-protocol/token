import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const repair = fs.readFileSync(path.join(root, "scripts/repair-workspace.mjs"), "utf8");
const manifest = JSON.parse(fs.readFileSync(path.join(root, "config/workspace.json"), "utf8"));

test("workspace repair quarantines non-empty legacy trees", () => {
  assert.match(repair, /target\/recovery/);
  assert.match(repair, /quarantineLegacyPath/);
  assert.match(repair, /fs\.renameSync\(absolutePath, destination\)/);
});

test("workspace repair restores security ignore boundaries", () => {
  for (const entry of [".env.production", "env/.env.production", "keypairs/", "secrets/", "**/target/"]) {
    assert.ok(repair.includes(JSON.stringify(entry)), `missing repair boundary ${entry}`);
  }
});

test("workspace manifest forbids all legacy root trees", () => {
  for (const entry of ["app", "client", "faucets", "components", "idl"]) {
    assert.ok(manifest.legacyPathsForbidden.includes(entry), `missing forbidden legacy path ${entry}`);
  }
});
