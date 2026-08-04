import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const webPackage = JSON.parse(await readFile("apps/web/package.json", "utf8"));
const installGuard = await readFile("scripts/lib/workspace-dependencies.mjs", "utf8");
const launcher = await readFile("scripts/run-next.mjs", "utf8");
const workspace = await readFile("pnpm-workspace.yaml", "utf8");

test("web scripts use the package-resolved Next launcher", () => {
  assert.match(webPackage.scripts.dev, /run-next\.mjs dev/);
  assert.match(webPackage.scripts.build, /run-next\.mjs build/);
  assert.match(webPackage.scripts.start, /run-next\.mjs start/);
  assert.doesNotMatch(webPackage.scripts.dev, /^next\s/);
});

test("workspace dependency checks resolve Next from the web package", () => {
  assert.match(installGuard, /createRequire\(WEB_PACKAGE_JSON\)/);
  assert.match(installGuard, /next\/dist\/bin\/next/);
  assert.match(launcher, /spawn\(process\.execPath/);
});

test("pnpm does not perform redundant dependency verification before every script", () => {
  assert.match(workspace, /verifyDepsBeforeRun:\s*false/);
});
