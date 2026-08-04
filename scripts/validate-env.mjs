import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const [file = ".env.devnet", profile = "devnet"] = process.argv.slice(2);
const source = await readFile(resolve(file), "utf8");
const env = Object.fromEntries(
  source.split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const index = line.indexOf("=");
      assert.ok(index > 0, `Invalid environment line: ${line}`);
      return [line.slice(0, index), line.slice(index + 1)];
    }),
);

const required = [
  "POWERCHAIN_ENV", "POWERCHAIN_CLUSTER", "POWERCHAIN_PROGRAM_ID",
  "SOLANA_RPC_URL", "SOLANA_WS_URL", "PWRC_DECIMALS",
  "PWRC_TRANSFER_FEE_BASIS_POINTS", "PWRC_MAXIMUM_TRANSFER_FEE_TOKENS",
  "PWRC_TOKEN_PROGRAM_ID", "POWERCHAIN_DOCS_URL", "POWERCHAIN_EXPLORER",
];
for (const key of required) assert.ok(key in env, `${key} is required`);

assert.equal(env.PWRC_DECIMALS, "9");
assert.equal(env.PWRC_TRANSFER_FEE_BASIS_POINTS, "250");
assert.equal(env.PWRC_MAXIMUM_TRANSFER_FEE_TOKENS, "1000000");
assert.equal(env.PWRC_TOKEN_PROGRAM_ID, "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb");
assert.equal(new URL(env.POWERCHAIN_DOCS_URL).protocol, "https:");
assert.equal(env.POWERCHAIN_EXPLORER, "solscan");

for (const key of ["SOLANA_RPC_URL", "SOLANA_WS_URL"]) {
  const url = new URL(env[key]);
  assert.ok(["https:", "wss:"].includes(url.protocol), `${key} must be encrypted`);
  assert.equal(url.username, "", `${key} must not embed credentials`);
  assert.equal(url.password, "", `${key} must not embed credentials`);
}

if (profile === "production") {
  assert.equal(env.POWERCHAIN_ENV, "production");
  assert.equal(env.POWERCHAIN_CLUSTER, "mainnet-beta");
  assert.equal(env.POWERCHAIN_PRODUCTION_DEPLOYMENT, "false", "Keep false until audited release activation");
  assert.notEqual(env.POWERCHAIN_PROGRAM_ID, "11111111111111111111111111111111");
  assert.ok(env.POWERCHAIN_PWRC_MINT && !env.POWERCHAIN_PWRC_MINT.startsWith("REQUIRED_"));
  assert.ok(env.HELIUS_API_KEY && !env.HELIUS_API_KEY.startsWith("REQUIRED_"));
  assert.ok(env.SOLSCAN_API_KEY && !env.SOLSCAN_API_KEY.startsWith("REQUIRED_"));
  assert.ok(env.BIRDEYE_API_KEY && !env.BIRDEYE_API_KEY.startsWith("REQUIRED_"));
} else {
  assert.equal(env.POWERCHAIN_ENV, "devnet");
  assert.equal(env.POWERCHAIN_CLUSTER, "devnet");
}

console.log(`${profile} environment validation passed: ${file}`);
