import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const token = JSON.parse(fs.readFileSync(new URL("../config/token.json", import.meta.url)));
const devnet = JSON.parse(fs.readFileSync(new URL("../config/devnet-token.json", import.meta.url)));

test("tPWRC is a separate devnet-only Token-2022 profile", () => {
  assert.equal(devnet.symbol, "tPWRC");
  assert.equal(devnet.ticker, "tPWRC");
  assert.equal(devnet.cluster, "devnet");
  assert.equal(devnet.production, false);
  assert.equal(devnet.tokenProgramId, token.tokenProgramId);
  assert.equal(devnet.mint, "TBA");
  assert.equal(devnet.mintStatus, "pending-devnet-creation");
  assert.equal(devnet.separateFromCanonicalPwrc, true);
});

test("tPWRC preserves the frozen fee and decimal policy", () => {
  assert.equal(devnet.decimals, 9);
  assert.equal(devnet.transferFeeBasisPoints, 250);
  assert.deepEqual(devnet.requiredExtensions, ["TransferFeeConfig", "MetadataPointer", "TokenMetadata"]);
});
