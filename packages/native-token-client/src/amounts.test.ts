import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateTransferFeeBaseUnits,
  formatPwrcAmount,
  parsePwrcAmount,
} from "./amounts.js";

test("PWRC decimal conversion is exact", () => {
  assert.equal(parsePwrcAmount("1"), 1_000_000_000n);
  assert.equal(parsePwrcAmount("1.000000001"), 1_000_000_001n);
  assert.equal(formatPwrcAmount(1_000_000_001n), "1.000000001");
});

test("2.5% transfer fee rounds upward in base units", () => {
  assert.equal(calculateTransferFeeBaseUnits(100_000_000_000n), 2_500_000_000n);
  assert.equal(calculateTransferFeeBaseUnits(1n), 1n);
});

test("fee cap is enforced", () => {
  assert.equal(calculateTransferFeeBaseUnits(1_000_000n, 250, 100n), 100n);
});
