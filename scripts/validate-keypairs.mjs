#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { readEnvFile } from "./lib/env.mjs";
import { inspectKeypairPath, readSecretKeyFile, redactKeypairPath } from "./lib/keypairs.mjs";

const envFile = process.argv[2] ?? ".env.devnet";
const profile = process.argv[3] ?? "devnet";
const env = await readEnvFile(envFile);
const keypairPath = env.TPWRC_FAUCET_TREASURY_KEYPAIR_PATH?.trim();

if (profile === "production") {
  if (keypairPath) {
    throw new Error("Production forbids TPWRC_FAUCET_TREASURY_KEYPAIR_PATH; use a remote, HSM, KMS, hardware, or multisig signer.");
  }
  console.log("Keypair policy passed: production uses no local keypair file.");
  process.exit(0);
}

if (!keypairPath) {
  console.log("Keypair policy passed: no local devnet keypair configured.");
  process.exit(0);
}

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
inspectKeypairPath(keypairPath, { repoRoot, rejectRepositoryPaths: true });
readSecretKeyFile(keypairPath, { repoRoot, rejectRepositoryPaths: true });
console.log(`Keypair policy passed for ${redactKeypairPath(keypairPath)}.`);
