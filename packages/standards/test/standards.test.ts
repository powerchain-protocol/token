import test from "node:test";
import assert from "node:assert/strict";
import { PPAY_001, PTK_001, assertBasisPoints, isReleaseCandidateVersion } from "../src/index.js";

test("PTK-001 frozen profile remains exact", () => {
  assert.equal(PTK_001.asset.decimals, 9);
  assert.equal(PTK_001.solana.transferFeeBasisPoints, 250);
  assert.equal(PTK_001.asset.genesisSupplyBaseUnits, "18446000000000000000");
});

test("PPAY-001 keeps asset decimal boundaries", () => {
  assert.deepEqual(PPAY_001.supportedAssets.map((asset) => [asset.symbol, asset.decimals]), [["SOL", 9], ["USDC", 6], ["PWRC", 9]]);
});

test("standard validators fail closed", () => {
  assert.equal(isReleaseCandidateVersion("1.0.0-rc.1"), true);
  assert.throws(() => assertBasisPoints(10_001), RangeError);
});
