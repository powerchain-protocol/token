import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const rootPackage = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const faucetPackage = JSON.parse(readFileSync(new URL("../apps/faucet/package.json", import.meta.url), "utf8"));
const clientPackage = JSON.parse(readFileSync(new URL("../apps/client/package.json", import.meta.url), "utf8"));
const errorsSource = readFileSync(new URL("../apps/faucet/src/errors.ts", import.meta.url), "utf8");

test("tsx is centrally declared and launched through package-aware scripts", () => {
  assert.equal(rootPackage.devDependencies.tsx, "^4.20.6");
  assert.match(rootPackage.scripts["dev:faucet"], /@powerchain\/faucet/);
  assert.match(faucetPackage.scripts.dev, /run-tsx\.mjs/);
  assert.match(clientPackage.scripts.test, /run-tsx-tests\.mjs/);
});

test("TypeScript 7 Error cause property uses override", () => {
  assert.match(errorsSource, /override readonly cause\?: unknown/);
});
