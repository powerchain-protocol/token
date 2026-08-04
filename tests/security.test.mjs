import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const load = async (path) => JSON.parse(await readFile(new URL(`../${path}`, import.meta.url), "utf8"));

test("canonical PWRC profile remains transferable and fixed supply", async () => {
  const token = await load("config/token.json");
  const extensions = await load("config/extensions.json");
  assert.equal(token.postGenesisMint, false);
  assert.equal(token.transferable, true);
  assert.equal(token.assetClass, "fungible");
  assert.equal(token.tradeable, true);
  assert.ok(extensions.prohibited.includes("NonTransferable"));
  assert.ok(!extensions.required.includes("PermanentDelegate"));
});

test("fee policy is synchronized and bounded", async () => {
  const token = await load("config/token.json");
  const extensions = await load("config/extensions.json");
  assert.equal(token.transferFeeBasisPoints, 250);
  assert.equal(extensions.transferFee.basisPoints, 250);
  assert.equal(token.maximumTransferFeeTokens, extensions.transferFee.maximumFeeTokens);
  assert.ok(BigInt(token.maximumTransferFeeTokens) <= 1_000_000n);
});

test("production authority policy forbids hot wallets", async () => {
  const authorities = await load("config/authorities.json");
  assert.equal(authorities.recommendedProductionControl.type, "governance-multisig");
  assert.equal(authorities.recommendedProductionControl.hotWalletAllowed, false);
  assert.ok(authorities.recommendedProductionControl.timelockHours >= 48);
});
