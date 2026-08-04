import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const readJson = async (path) => JSON.parse(await readFile(new URL(`../${path}`, import.meta.url), "utf8"));

test("on-chain verification freezes the canonical Token-2022 profile", async () => {
  const policy = await readJson("config/onchain-verification.json");
  assert.equal(policy.expected.decimals, 9);
  assert.equal(policy.expected.transferFeeBasisPoints, 250);
  assert.deepEqual(policy.expected.requiredExtensions, ["TransferFeeConfig", "MetadataPointer", "TokenMetadata"]);
  assert.equal(policy.requiredProgramOwner, "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb");
});

test("supply attestation uses exact base-unit strings", async () => {
  const policy = await readJson("config/supply-attestation.json");
  assert.equal(policy.genesisSupplyBaseUnits, "18446000000000000000");
  assert.equal(policy.decimals, 9);
  assert.equal(policy.postGenesisMintAllowed, false);
});

test("release status includes on-chain and supply evidence", async () => {
  const source = await readFile(new URL("../scripts/release-status.mjs", import.meta.url), "utf8");
  assert.match(source, /production-mint-verification\.json/);
  assert.match(source, /latest-attestation\.json/);
});
