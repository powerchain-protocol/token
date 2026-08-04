import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const loader = fs.readFileSync("scripts/lib/load-deployment-env.mjs", "utf8");
const attest = fs.readFileSync("scripts/attest-supply.mjs", "utf8");
const verify = fs.readFileSync("scripts/verify-onchain-mint.mjs", "utf8");

test("deployment env loader supports both parser export names", () => {
  assert.match(loader, /parseEnvFile \?\? envModule\.readEnvFile/);
});

test("attestation scripts use compatibility env loader", () => {
  assert.match(attest, /loadDeploymentEnv/);
  assert.match(verify, /loadDeploymentEnv/);
  assert.doesNotMatch(attest, /import \{ parseEnvFile/);
  assert.doesNotMatch(verify, /import \{ parseEnvFile/);
});
