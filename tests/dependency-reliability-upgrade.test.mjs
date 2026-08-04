import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("dependency repair blocks recursion and concurrent installs", () => {
  const source = read("scripts/ensure-package-dependencies.mjs");
  assert.match(source, /POWERCHAIN_DEPENDENCY_REPAIR_ACTIVE/);
  assert.match(source, /pnpm-install\.lock/);
  assert.match(source, /--prefer-offline/);
});

test("critical workspace dependency doctor covers all runtime surfaces", () => {
  const source = read("scripts/dependency-doctor.mjs");
  for (const workspace of ["apps/web", "apps/faucet", "apps/client", "packages/native-token-client"]) {
    assert.match(source, new RegExp(workspace.replace("/", "\\/")));
  }
});

test("production environment profiles are absent and ignored", () => {
  assert.equal(fs.existsSync(path.join(root, ".env.production")), false);
  assert.equal(fs.existsSync(path.join(root, "env/.env.production")), false);
  const ignore = read(".gitignore");
  assert.match(ignore, /^\.env\.production$/m);
  assert.match(ignore, /^env\/\.env\.production$/m);
});
