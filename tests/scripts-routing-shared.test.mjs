import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const root = new URL("../", import.meta.url);
const read = (path) => fs.readFileSync(new URL(path, root), "utf8");

test("environment helper exports the canonical parser", () => {
  const source = read("scripts/lib/env.mjs");
  assert.match(source, /export async function parseEnvFile/);
  assert.match(source, /export const readEnvFile = parseEnvFile/);
});

test("supply and on-chain scripts use canonical environment keys", () => {
  for (const file of ["scripts/attest-supply.mjs", "scripts/verify-onchain-mint.mjs"]) {
    const source = read(file);
    assert.doesNotMatch(source, /PWRC_MINT_ADDRESS|SOLANA_CLUSTER|SOLANA_TOKEN_PROGRAM_ID/);
    assert.match(source, /POWERCHAIN_PWRC_MINT/);
    assert.match(source, /POWERCHAIN_CLUSTER/);
  }
});

test("web redirects and shared utilities are present", () => {
  const config = read("apps/web/next.config.mjs");
  assert.match(config, /async redirects\(\)/);
  assert.match(config, /source: "\/powerpay"/);
  for (const file of ["apps/web/shared/metrics.ts", "apps/web/shared/formats.ts", "apps/web/shared/tokens.ts"]) {
    assert.equal(fs.existsSync(new URL(file, root)), true, `${file} must exist`);
  }
});

test("production environment profiles are ignored", () => {
  const ignore = read(".gitignore");
  assert.match(ignore, /^\.env\.production$/m);
  assert.match(ignore, /^env\/\.env\.production$/m);
});
