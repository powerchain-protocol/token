import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadDeploymentEnv } from "./lib/load-deployment-env.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const envPath = path.resolve(root, process.argv[2] ?? ".env.devnet");
const profile = process.argv[3] ?? "devnet";
const env = await loadDeploymentEnv(envPath, profile);

const rpcUrl = env.SOLANA_RPC_URL;
const mint = env.POWERCHAIN_PWRC_MINT;
if (!mint || mint.startsWith("REQUIRED_")) throw new Error("POWERCHAIN_PWRC_MINT must be a deployed mint");

async function rpc(method, params) {
  const response = await fetch(rpcUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
    signal: AbortSignal.timeout(10_000)
  });
  if (!response.ok) throw new Error(`RPC HTTP ${response.status}`);
  const payload = await response.json();
  if (payload.error) throw new Error(`${method}: ${payload.error.message}`);
  return payload.result;
}

const [account, supply] = await Promise.all([
  rpc("getAccountInfo", [mint, { encoding: "jsonParsed", commitment: "finalized" }]),
  rpc("getTokenSupply", [mint, { commitment: "finalized" }])
]);
if (!account?.value) throw new Error("Mint account not found");

const expectedOwner = env.PWRC_TOKEN_PROGRAM_ID;
const parsed = account.value.data?.parsed?.info ?? {};
const extensions = Array.isArray(parsed.extensions)
  ? parsed.extensions.map((item) => item.extension ?? item.type).filter(Boolean)
  : [];
const required = ["transferFeeConfig", "metadataPointer", "tokenMetadata"];
const normalized = new Set(extensions.map((x) => String(x).replace(/[^a-z]/gi, "").toLowerCase()));
const missingExtensions = required.filter((x) => !normalized.has(x.toLowerCase()));
const failures = [];
if (account.value.owner !== expectedOwner) failures.push(`owner expected ${expectedOwner}, got ${account.value.owner}`);
if (Number(supply.value.decimals) !== 9) failures.push(`decimals expected 9, got ${supply.value.decimals}`);
if (parsed.mintAuthority != null) failures.push("mint authority is not revoked");
if (parsed.freezeAuthority != null) failures.push("freeze authority is not revoked");
if (missingExtensions.length) failures.push(`missing extensions: ${missingExtensions.join(", ")}`);

const report = {
  version: 1,
  status: failures.length ? "failed" : "passed",
  profile,
  cluster: env.POWERCHAIN_CLUSTER,
  mint,
  owner: account.value.owner,
  slot: account.context?.slot ?? null,
  decimals: Number(supply.value.decimals),
  supplyBaseUnits: supply.value.amount,
  mintAuthority: parsed.mintAuthority ?? null,
  freezeAuthority: parsed.freezeAuthority ?? null,
  extensions,
  missingExtensions,
  observedAt: new Date().toISOString(),
  rpcEndpointFingerprint: createHash("sha256").update(new URL(rpcUrl).origin).digest("hex"),
  failures
};
const out = path.join(root, "target/onchain", `${profile}-mint-verification.json`);
await mkdir(path.dirname(out), { recursive: true });
await writeFile(out, `${JSON.stringify(report, null, 2)}\n`);
if (failures.length) throw new Error(`On-chain mint verification failed:\n- ${failures.join("\n- ")}`);
console.log(`On-chain mint verification passed: ${out}`);
