import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const service = fs.readFileSync("faucets/src/service.ts", "utf8");
const rateLimit = fs.readFileSync("faucets/src/rate-limit.ts", "utf8");
const rust = fs.readFileSync("programs/native-token/src/lib.rs", "utf8");

test("faucet preview does not consume allowance", () => {
  const prepareBody = service.match(/async prepare\([\s\S]*?\n  }\n\n  async distribute/)?.[0] ?? "";
  assert.match(prepareBody, /createUsageReservation/);
  assert.doesNotMatch(prepareBody, /reserveUsage/);
  assert.doesNotMatch(prepareBody, /usageStore\.put/);
});

test("failed faucet submission rolls back allowance", () => {
  assert.match(service, /reservation = await this\.reserveUsage/);
  assert.match(service, /if \(reservation\) await this\.rollbackUsage\(reservation\)/);
  assert.match(rateLimit, /delete\(key: string\): Promise<void>/);
});

test("faucet submission keeps preflight enabled and retries bounded", () => {
  assert.match(service, /skipPreflight: false/);
  assert.match(service, /maxRetries: 3/);
});

test("native-token lifecycle requires completed genesis", () => {
  const pause = rust.match(/pub fn pause[\s\S]*?pub fn resume/)?.[0] ?? "";
  const resume = rust.match(/pub fn resume[\s\S]*?pub fn transfer_authority/)?.[0] ?? "";
  assert.match(pause, /assert_genesis_complete/);
  assert.match(resume, /assert_genesis_complete/);
});

test("authority rotation rejects no-op changes", () => {
  assert.match(rust, /new_authority == \[0u8; 32\] \|\| new_authority == self\.authority/);
});
