import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const ui = readFileSync("apps/web/components/faucet-interface.tsx", "utf8");
const route = readFileSync("apps/web/app/api/faucets/native-sol/route.ts", "utf8");
const css = readFileSync("apps/web/app/globals.css", "utf8");

test("native SOL faucet accepts a validated Solana recipient address", () => {
  assert.match(ui, /new PublicKey\(value\.trim\(\)\)/);
  assert.match(ui, /Recipient address/);
  assert.match(ui, /Use connected wallet/);
  assert.match(ui, /recipient: normalizedRecipient/);
  assert.match(route, /parseRecipient/);
  assert.match(route, /requestAirdrop/);
  assert.match(route, /recipientType: "solana-address"/);
});

test("native SOL faucet keeps devnet safety and abuse controls", () => {
  assert.match(route, /MAX_REQUESTS_PER_WINDOW = 1/);
  assert.match(route, /MAX_LAMPORTS_PER_DAY = 4_000_000_000/);
  assert.match(route, /requestFingerprint/);
  assert.match(route, /Authenticated wallet must match the faucet recipient/);
  assert.match(ui, /never request a seed phrase or private key/);
  assert.match(css, /\.faucet-security-notice/);
  assert.match(css, /text-align:center/);
});
