import assert from "node:assert/strict";
import test from "node:test";
import { buildExplorerUrl, DEFAULT_EXPLORER } from "./explorer.js";

test("Solscan is the default explorer", () => {
  assert.equal(DEFAULT_EXPLORER, "solscan");
  assert.equal(
    buildExplorerUrl({ entity: "token", value: "Mint111" }),
    "https://solscan.io/token/Mint111",
  );
});

test("devnet links include the cluster", () => {
  assert.equal(
    buildExplorerUrl({ entity: "transaction", value: "Sig111", cluster: "devnet" }),
    "https://solscan.io/tx/Sig111?cluster=devnet",
  );
});

test("Solana Explorer remains an explicit fallback", () => {
  assert.equal(
    buildExplorerUrl({ entity: "token", value: "Mint111", provider: "solana-explorer" }),
    "https://explorer.solana.com/address/Mint111",
  );
});
