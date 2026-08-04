import test from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_TPWRC_FAUCET_POLICY, validateFaucetPolicy } from "../src/policy.js";

test("default tPWRC faucet policy is valid", () => {
  assert.doesNotThrow(() => validateFaucetPolicy(DEFAULT_TPWRC_FAUCET_POLICY));
});

test("faucet cannot target mainnet or canonical PWRC", () => {
  assert.throws(() => validateFaucetPolicy({ ...DEFAULT_TPWRC_FAUCET_POLICY, cluster: "mainnet-beta" as never }));
});
