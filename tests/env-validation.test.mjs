import test from "node:test";
import assert from "node:assert/strict";
import { validateDeploymentEnv } from "../scripts/lib/env.mjs";

const base = {
  POWERCHAIN_ENV: "devnet",
  POWERCHAIN_CLUSTER: "devnet",
  POWERCHAIN_PROGRAM_ID: "11111111111111111111111111111111",
  POWERCHAIN_PRODUCTION_DEPLOYMENT: "false",
  SOLANA_RPC_URL: "https://api.devnet.solana.com",
  SOLANA_WS_URL: "wss://api.devnet.solana.com",
  PWRC_DECIMALS: "9",
  PWRC_TRANSFER_FEE_BASIS_POINTS: "250",
  PWRC_MAXIMUM_TRANSFER_FEE_TOKENS: "1000000",
  PWRC_TOKEN_PROGRAM_ID: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
  POWERCHAIN_DOCS_URL: "https://docs.powerchain.energy",
  POWERCHAIN_EXPLORER: "solscan",
};

test("accepts the safe devnet profile", () => {
  assert.doesNotThrow(() => validateDeploymentEnv(base, "devnet"));
});

test("rejects incorrect fee basis points", () => {
  assert.throws(() => validateDeploymentEnv({ ...base, PWRC_TRANSFER_FEE_BASIS_POINTS: "200" }, "devnet"));
});

test("rejects plaintext RPC", () => {
  assert.throws(() => validateDeploymentEnv({ ...base, SOLANA_RPC_URL: "http://rpc.example.com" }, "devnet"));
});

test("production rejects placeholders", () => {
  assert.throws(() => validateDeploymentEnv({
    ...base,
    POWERCHAIN_ENV: "production",
    POWERCHAIN_CLUSTER: "mainnet-beta",
    POWERCHAIN_PWRC_MINT: "REQUIRED_MAINNET_MINT",
    HELIUS_API_KEY: "REQUIRED_HELIUS_API_KEY",
    SOLSCAN_API_KEY: "REQUIRED_SOLSCAN_API_KEY",
    BIRDEYE_API_KEY: "REQUIRED_BIRDEYE_API_KEY",
  }, "production"));
});
