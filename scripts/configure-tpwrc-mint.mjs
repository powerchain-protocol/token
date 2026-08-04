#!/usr/bin/env node
import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { assertBase58Address } from "./lib/env.mjs";

const root = resolve(import.meta.dirname, "..");
const args = process.argv.slice(2);
const mint = args.find((value) => !value.startsWith("--"));
const dryRun = args.includes("--dry-run");
const enableFaucet = args.includes("--enable-faucet");
const canonicalMint = "PWRCRXXZxbg6FdQZfK3PMD7KP8xfxs9acvifJiG46wc";

assert.ok(mint, "Usage: node scripts/configure-tpwrc-mint.mjs <DEVNET_MINT> [--dry-run] [--enable-faucet]");
assertBase58Address(mint, "TPWRC_MINT");
assert.notEqual(mint, canonicalMint, "tPWRC must not reuse the canonical PWRC mint");

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function writeJson(path, value) {
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function replaceEnvValue(source, key, value) {
  const pattern = new RegExp(`^${key}=.*$`, "m");
  assert.match(source, pattern, `${key} is missing from environment profile`);
  return source.replace(pattern, `${key}=${value}`);
}

const devnetPath = resolve(root, "config/devnet-token.json");
const faucetPath = resolve(root, "faucets/config/tpwrc-faucet.json");
const envPaths = [resolve(root, ".env.devnet"), resolve(root, "env/.env.devnet")];

const devnet = await readJson(devnetPath);
const faucet = await readJson(faucetPath);

devnet.mint = mint;
devnet.mintStatus = "configured-awaiting-onchain-verification";
devnet.mintResolution = "Verify the dedicated tPWRC Token-2022 devnet mint on-chain before enabling distribution.";

faucet.mint = mint;
faucet.mintStatus = "configured-awaiting-onchain-verification";
faucet.enabled = enableFaucet;

const envUpdates = [];
for (const path of envPaths) {
  const source = await readFile(path, "utf8");
  envUpdates.push([path, replaceEnvValue(source, "TPWRC_MINT", mint)]);
}

console.log(JSON.stringify({
  mint,
  dryRun,
  faucetEnabled: enableFaucet,
  status: devnet.mintStatus,
  files: [devnetPath, faucetPath, ...envPaths],
}, null, 2));

if (!dryRun) {
  await writeJson(devnetPath, devnet);
  await writeJson(faucetPath, faucet);
  for (const [path, source] of envUpdates) await writeFile(path, source, "utf8");
}
