import assert from "node:assert/strict";
import test from "node:test";
import { powerChainClientConfigFromEnv } from "../src/env.js";

const mintAddress = "PWRCRXXZxbg6FdQZfK3PMD7KP8xfxs9acvifJiG46wc";

test("loads an explicit client environment", () => {
  const config = powerChainClientConfigFromEnv({
    POWERCHAIN_CLUSTER: "devnet",
    POWERCHAIN_RPC_HTTP: "https://api.devnet.solana.com",
    POWERCHAIN_RPC_WS: "wss://api.devnet.solana.com",
    PWRC_MINT_ADDRESS: mintAddress,
  });
  assert.equal(config.cluster, "devnet");
  assert.equal(config.mintAddress, mintAddress);
});

test("does not silently invent a mint", () => {
  assert.throws(() => powerChainClientConfigFromEnv({
    POWERCHAIN_RPC_HTTP: "https://api.devnet.solana.com",
  }), /PWRC_MINT_ADDRESS/);
});
