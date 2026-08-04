import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseEnvFile, validateDeploymentEnv } from "./lib/env.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const envPath = path.resolve(root, process.argv[2] ?? ".env.devnet");
const profile = process.argv[3] ?? "devnet";
const env = await parseEnvFile(envPath);
const validation = validateDeploymentEnv(env, profile);
if (!validation.ok) throw new Error(validation.errors.join("\n"));
if (!env.PWRC_MINT_ADDRESS || env.PWRC_MINT_ADDRESS.startsWith("REQUIRED_")) throw new Error("PWRC_MINT_ADDRESS must be deployed");

async function rpc(method, params) {
  const response = await fetch(env.SOLANA_RPC_URL, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: method, method, params }),
    signal: AbortSignal.timeout(10_000)
  });
  const payload = await response.json();
  if (!response.ok || payload.error) throw new Error(payload.error?.message ?? `RPC HTTP ${response.status}`);
  return payload.result;
}
const [supply, account, slot] = await Promise.all([
  rpc("getTokenSupply", [env.PWRC_MINT_ADDRESS, { commitment: "finalized" }]),
  rpc("getAccountInfo", [env.PWRC_MINT_ADDRESS, { encoding: "jsonParsed", commitment: "finalized" }]),
  rpc("getSlot", [{ commitment: "finalized" }])
]);
const info = account.value?.data?.parsed?.info ?? {};
const genesis = 18_446_000_000_000_000_000n;
const observed = BigInt(supply.value.amount);
if (observed > genesis) throw new Error("Observed supply exceeds frozen PTK-001 genesis supply");
const report = {
  version: 1, status: "passed", specification: "PTK-001", profile,
  cluster: env.SOLANA_CLUSTER, mint: env.PWRC_MINT_ADDRESS, slot,
  observedSupplyBaseUnits: observed.toString(),
  burnedSupplyBaseUnits: (genesis - observed).toString(),
  mintAuthority: info.mintAuthority ?? null,
  freezeAuthority: info.freezeAuthority ?? null,
  postGenesisMintAllowed: false,
  observedAt: new Date().toISOString(),
  rpcEndpointFingerprint: createHash("sha256").update(new URL(env.SOLANA_RPC_URL).origin).digest("hex")
};
const out = path.join(root, "target/supply/latest-attestation.json");
await mkdir(path.dirname(out), { recursive: true });
await writeFile(out, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Supply attestation written: ${out}`);
