import assert from "node:assert/strict";
import test from "node:test";
import { quotePwrcTransfer } from "./fees.js";

test("quotes the canonical 2.5 percent transfer fee", () => {
  const quote = quotePwrcTransfer("100");
  assert.equal(quote.grossAmount, "100");
  assert.equal(quote.feeAmount, "2.5");
  assert.equal(quote.netAmount, "97.5");
  assert.equal(quote.basisPoints, 250);
  assert.equal(quote.feePercent, "2.50");
});

test("rejects non-positive transfers", () => {
  assert.throws(() => quotePwrcTransfer("0"), /positive/);
});
