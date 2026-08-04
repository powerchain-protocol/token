import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

test("workspace repair and install policy are committed", () => {
  const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  const npmrc = fs.readFileSync(path.join(root, ".npmrc"), "utf8");
  assert.match(packageJson.scripts["workspace:repair"], /repair-workspace\.mjs/);
  assert.match(packageJson.scripts.preinstall, /repair-workspace\.mjs/);
  assert.match(npmrc, /node-linker=hoisted/);
  assert.match(npmrc, /link-workspace-packages=true/);
});

test("Rust commands use the toolchain-aware wrapper", () => {
  const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  for (const name of ["test:program:rust", "build:program:sbf", "test:powerpay", "build:powerpay"]) {
    assert.match(packageJson.scripts[name], /run-rust-tool\.mjs/);
  }
});
