import assert from "node:assert/strict";
import { readEnvFile, validateDeploymentEnv } from "./lib/env.mjs";

const [file = ".env.devnet", profile = "devnet"] = process.argv.slice(2);
const env = await readEnvFile(file);
validateDeploymentEnv(env, profile);

const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 8_000);
try {
  const response = await fetch(env.SOLANA_RPC_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "getHealth" }),
    signal: controller.signal,
  });
  assert.equal(response.ok, true, `RPC health HTTP ${response.status}`);
  const payload = await response.json();
  assert.equal(payload.jsonrpc, "2.0");
  assert.equal(payload.id, 1);
  assert.equal(payload.result, "ok", payload.error?.message ?? "RPC health check failed");
  console.log(`${profile} RPC health check passed: ${new URL(env.SOLANA_RPC_URL).host}`);
} finally {
  clearTimeout(timeout);
}
