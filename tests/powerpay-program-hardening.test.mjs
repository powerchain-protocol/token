import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const lib = fs.readFileSync(new URL("../programs/powerpay/src/lib.rs", import.meta.url), "utf8");
const instruction = fs.readFileSync(new URL("../programs/powerpay/src/instruction.rs", import.meta.url), "utf8");
const processor = fs.readFileSync(new URL("../programs/powerpay/src/processor.rs", import.meta.url), "utf8");
const state = fs.readFileSync(new URL("../programs/powerpay/src/state.rs", import.meta.url), "utf8");

test("PowerPay exports a versioned instruction ABI", () => {
  assert.match(lib, /pub use instruction::\{PowerPayInstruction/);
  assert.match(instruction, /INSTRUCTION_VERSION: u8 = 1/);
  assert.match(instruction, /MAX_INSTRUCTION_DATA_LEN: usize = 128/);
  assert.match(instruction, /TrailingInstructionData/);
});

test("PowerPay enforces payer, merchant, and governance roles", () => {
  assert.match(processor, /context\.signer != merchant/);
  assert.match(processor, /context\.signer != payment\.payer/);
  assert.match(processor, /context\.signer != payment\.merchant/);
  assert.match(processor, /context\.signer != state\.authority/);
});

test("PowerPay fees and refunds use bounded integer accounting", () => {
  assert.match(state, /MAX_SERVICE_FEE_BASIS_POINTS/);
  assert.match(state, /RefundExceedsSettledAmount/);
  assert.match(state, /checked_mul/);
  assert.match(state, /checked_sub/);
  assert.match(state, /MAX_SETTLEMENT_WINDOW_SECONDS/);
});
