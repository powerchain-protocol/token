import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

export const PLACEHOLDER_PROGRAM_ID = "11111111111111111111111111111111";
export const TOKEN_2022_PROGRAM_ID = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";

export async function parseEnvFile(file) {
  const source = await readFile(resolve(file), "utf8");
  const entries = [];
  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const index = line.indexOf("=");
    assert.ok(index > 0, `Invalid environment line: ${rawLine}`);
    const key = line.slice(0, index).trim();
    const value = line.slice(index + 1).trim();
    assert.match(key, /^[A-Z][A-Z0-9_]*$/, `Invalid environment key: ${key}`);
    assert.ok(!entries.some(([existing]) => existing === key), `Duplicate environment key: ${key}`);
    entries.push([key, value]);
  }
  return Object.fromEntries(entries);
}

export const readEnvFile = parseEnvFile;

export function requireEnv(env, key) {
  assert.ok(Object.hasOwn(env, key), `${key} is required`);
  assert.notEqual(env[key], "", `${key} must not be empty`);
  return env[key];
}

export function assertEncryptedUrl(value, key, protocols) {
  const url = new URL(value);
  assert.ok(protocols.includes(url.protocol), `${key} must use ${protocols.join(" or ")}`);
  assert.equal(url.username, "", `${key} must not embed credentials`);
  assert.equal(url.password, "", `${key} must not embed credentials`);
  assert.equal(url.hash, "", `${key} must not include a fragment`);
  return url;
}

export function assertBase58Address(value, key, { allowPlaceholder = false } = {}) {
  assert.match(value, /^[1-9A-HJ-NP-Za-km-z]{32,44}$/, `${key} must be a base58 Solana address`);
  if (!allowPlaceholder) assert.notEqual(value, PLACEHOLDER_PROGRAM_ID, `${key} must not use the placeholder address`);
}

export function assertSecret(value, key, { required }) {
  if (!required && (!value || value.startsWith("OPTIONAL_"))) return;
  assert.ok(value, `${key} is required`);
  assert.ok(!value.startsWith("REQUIRED_"), `${key} must be injected by the deployment secret manager`);
  assert.ok(value.length >= 16, `${key} appears too short`);
}

export function validateDeploymentEnv(env, profile) {
  const required = [
    "POWERCHAIN_ENV", "POWERCHAIN_CLUSTER", "POWERCHAIN_PROGRAM_ID",
    "SOLANA_RPC_URL", "SOLANA_WS_URL", "PWRC_DECIMALS",
    "PWRC_TRANSFER_FEE_BASIS_POINTS", "PWRC_MAXIMUM_TRANSFER_FEE_TOKENS",
    "PWRC_TOKEN_PROGRAM_ID", "POWERCHAIN_DOCS_URL", "POWERCHAIN_EXPLORER",
    "POWERCHAIN_PRODUCTION_DEPLOYMENT",
  ];
  for (const key of required) requireEnv(env, key);

  assert.equal(env.PWRC_DECIMALS, "9");
  assert.equal(env.PWRC_TRANSFER_FEE_BASIS_POINTS, "250");
  assert.equal(env.PWRC_MAXIMUM_TRANSFER_FEE_TOKENS, "1000000");
  assert.equal(env.PWRC_TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID);
  assert.equal(env.POWERCHAIN_EXPLORER, "solscan");
  assertEncryptedUrl(env.POWERCHAIN_DOCS_URL, "POWERCHAIN_DOCS_URL", ["https:"]);
  assertEncryptedUrl(env.SOLANA_RPC_URL, "SOLANA_RPC_URL", ["https:"]);
  assertEncryptedUrl(env.SOLANA_WS_URL, "SOLANA_WS_URL", ["wss:"]);

  const production = profile === "production";
  assert.equal(env.POWERCHAIN_ENV, production ? "production" : "devnet");
  assert.equal(env.POWERCHAIN_CLUSTER, production ? "mainnet-beta" : "devnet");
  assert.equal(env.POWERCHAIN_PRODUCTION_DEPLOYMENT, "false", "Activation requires a separately reviewed release change");
  assertBase58Address(env.POWERCHAIN_PROGRAM_ID, "POWERCHAIN_PROGRAM_ID", { allowPlaceholder: !production });

  if (env.POWERCHAIN_PWRC_MINT && !env.POWERCHAIN_PWRC_MINT.startsWith("REQUIRED_")) {
    assertBase58Address(env.POWERCHAIN_PWRC_MINT, "POWERCHAIN_PWRC_MINT");
  } else if (production) {
    assert.fail("POWERCHAIN_PWRC_MINT must be configured for production");
  }

  for (const key of ["HELIUS_API_KEY", "SOLSCAN_API_KEY", "BIRDEYE_API_KEY"]) {
    assertSecret(env[key], key, { required: production });
  }

  return { profile, production, cluster: env.POWERCHAIN_CLUSTER };
}
