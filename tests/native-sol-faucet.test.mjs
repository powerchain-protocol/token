import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const config = JSON.parse(await readFile(new URL("../faucets/config/native-sol-faucet.json", import.meta.url), "utf8"));
const envProduction = await readFile(new URL("../.env.production", import.meta.url), "utf8");
const source = await readFile(new URL("../faucets/src/native-sol.ts", import.meta.url), "utf8");
const ui = await readFile(new URL("../app/components/faucet-interface.tsx", import.meta.url), "utf8");
const route = await readFile(new URL("../app/app/api/faucets/native-sol/route.ts", import.meta.url), "utf8");
const constants = await readFile(new URL("../app/lib/constants.ts", import.meta.url), "utf8");


test("native SOL faucet sends exactly 2 SOL on devnet", () => {
  assert.equal(config.cluster, "devnet");
  assert.equal(config.asset.decimals, 9);
  assert.equal(config.distribution.amountSol, 2);
  assert.equal(config.distribution.amountLamports, 2_000_000_000);
  assert.match(constants, /LAMPORTS_PER_SOL = 1_000_000_000/);
  assert.match(constants, /NATIVE_SOL_FAUCET_AMOUNT_LAMPORTS = 2_000_000_000/);
});

test("native SOL faucet cannot use production or treasury keys", () => {
  assert.equal(config.security.allowProductionCluster, false);
  assert.equal(config.security.usesTreasuryKeypair, false);
  assert.match(envProduction, /NATIVE_SOL_FAUCET_ENABLED=false/);
});

test("native SOL faucet reserves and rolls back rate usage", () => {
  assert.match(source, /reserveUsage/);
  assert.match(source, /rollbackUsage/);
  assert.match(source, /activeRecipients/);
});

test("wallet UI uses the secured server route", () => {
  assert.match(ui, /authenticated/);
  assert.match(ui, /fetch\("\/api\/faucets\/native-sol"/);
  assert.doesNotMatch(ui, /requestAirdrop\(/);
  assert.match(ui, /Send 2 SOL/);
});

test("server route verifies proof, rate limits, airdrops, and confirms", () => {
  assert.match(route, /nacl\.sign\.detached\.verify/);
  assert.match(route, /requestAirdrop/);
  assert.match(route, /getSignatureStatuses/);
  assert.match(route, /NATIVE_SOL_FAUCET_AMOUNT_LAMPORTS/);
  assert.match(route, /MAX_REQUESTS_PER_WINDOW = 1/);
});
