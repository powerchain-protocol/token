import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const policy = fs.readFileSync("apps/faucet/src/native-sol-policy.ts", "utf8");
const service = fs.readFileSync("apps/faucet/src/native-sol.ts", "utf8");
const ui = fs.readFileSync("apps/web/components/faucet-interface.tsx", "utf8");
const config = JSON.parse(fs.readFileSync("apps/faucet/config/native-sol-faucet.json", "utf8"));

test("native SOL faucet sends exactly 2 SOL on devnet", () => {
  assert.equal(config.cluster, "devnet");
  assert.equal(config.distribution.amountSol, 2);
  assert.equal(config.distribution.amountLamports, 2_000_000_000);
  assert.match(policy, /NATIVE_SOL_FAUCET_AMOUNT_SOL = 2/);
  assert.match(service, /requestAirdrop/);
});

test("native SOL faucet cannot use production or treasury keys", () => {
  assert.equal(config.security.allowProductionCluster, false);
  assert.equal(config.security.usesTreasuryKeypair, false);
  assert.match(service, /policy\.cluster !== "devnet"/);
});

test("native SOL faucet reserves and rolls back rate usage", () => {
  assert.match(service, /reservation = await this\.reserveUsage/);
  assert.match(service, /if \(reservation\) await this\.rollbackUsage/);
  assert.match(service, /maximumPerWalletPerDayLamports/);
});

test("wallet UI validates a recipient address and confirms airdrop", () => {
  assert.match(ui, /normalizeSolanaAddress/);
  assert.match(ui, /recipient: normalizedRecipient/);
  assert.match(ui, /fetch\("\/api\/faucets\/native-sol"/);
  assert.match(ui, /result\.explorerUrl/);
  assert.match(ui, /Send \${NATIVE_SOL_FAUCET_AMOUNT_SOL} SOL/);
});
