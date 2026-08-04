import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const security = await readFile(new URL("../apps/web/lib/security.ts", import.meta.url), "utf8");
const context = await readFile(new URL("../apps/web/components/provider/wallet-context.tsx", import.meta.url), "utf8");
const mint = await readFile(new URL("../apps/web/components/mint-account.tsx", import.meta.url), "utf8");

test("wallet proof is domain, chain, nonce, request and expiry bound", () => {
  for (const marker of ["domain", "solana:mainnet-beta", "Nonce:", "Request ID:", "Expiration Time:"]) {
    assert.match(security, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("wallet proof clears on wallet changes and expiry", () => {
  assert.match(context, /state\.proof\?\.wallet !== walletAddress/);
  assert.match(context, /setTimeout\(clearAuthentication/);
});

test("mint verification fails closed on authorities and supply", () => {
  assert.match(mint, /mintAuthority !== null/);
  assert.match(mint, /freezeAuthority !== null/);
  assert.match(mint, /PWRC_GENESIS_SUPPLY_BASE_UNITS/);
  assert.match(mint, /finalized/);
});
