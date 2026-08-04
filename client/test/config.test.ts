import assert from "node:assert/strict";
import test from "node:test";
import { resolvePowerChainClientConfig } from "../src/config.js";

const mintAddress = "PWRCRXXZxbg6FdQZfK3PMD7KP8xfxs9acvifJiG46wc";

test("resolves a secure devnet client profile", () => {
  const config = resolvePowerChainClientConfig({
    cluster: "devnet",
    rpcEndpoint: "https://api.devnet.solana.com",
    wsEndpoint: "wss://api.devnet.solana.com",
    mintAddress,
  });
  assert.equal(config.cluster, "devnet");
  assert.equal(config.explorer, "solscan");
  assert.equal(config.mint.toBase58(), mintAddress);
});

test("rejects insecure remote RPC endpoints", () => {
  assert.throws(() => resolvePowerChainClientConfig({
    cluster: "mainnet-beta",
    rpcEndpoint: "http://rpc.example.com",
    mintAddress,
  }), /HTTPS/);
});
