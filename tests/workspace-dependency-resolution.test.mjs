import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const source = fs.readFileSync("scripts/lib/workspace-dependencies.mjs", "utf8");

test("Next resolution supports app, root and pnpm virtual store layouts", () => {
  assert.match(source, /createRequire\(WEB_PACKAGE_JSON\)/);
  assert.match(source, /createRequire\(ROOT_PACKAGE_JSON\)/);
  assert.match(source, /findInPnpmStore/);
  assert.match(source, /install:repair/);
});
