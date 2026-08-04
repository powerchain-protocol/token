import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const debug = fs.readFileSync(new URL("../apps/faucet/src/debug.ts", import.meta.url), "utf8");
const server = fs.readFileSync(new URL("../apps/faucet/src/server.ts", import.meta.url), "utf8");
const pkg = JSON.parse(fs.readFileSync(new URL("../apps/faucet/package.json", import.meta.url), "utf8"));

test("faucet debug mode is development-only", () => {
  assert.match(debug, /env\.NODE_ENV !== "production"/);
  assert.match(debug, /env\.FAUCET_DEBUG_MODE === "true"/);
});

test("debug simulation cannot execute or expose private material", () => {
  assert.match(debug, /executionPerformed: false/);
  assert.match(debug, /privateKeyExposure: false/);
  assert.match(debug, /mainnetExecution: false/);
  assert.match(debug, /fingerprintWallet/);
});

test("debug routes are conditionally exposed", () => {
  assert.match(server, /\/api\/v1\/debug\/status/);
  assert.match(server, /\/api\/v1\/debug\/events/);
  assert.match(server, /\/api\/v1\/debug\/simulate/);
  assert.match(server, /if \(!debugEnabled\)/);
  assert.equal(typeof pkg.scripts["dev:debug"], "string");
});
