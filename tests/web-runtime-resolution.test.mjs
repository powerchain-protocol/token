import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const nextConfig = readFileSync("apps/web/next.config.mjs", "utf8");
const tsconfig = readFileSync("apps/web/tsconfig.json", "utf8");
const layout = readFileSync("apps/web/app/layout.tsx", "utf8");
const walletProvider = readFileSync("apps/web/components/provider/wallet-provider.tsx", "utf8");
const standardPage = readFileSync("apps/web/app/standard/page.tsx", "utf8");
const programs = readFileSync("apps/web/components/tools/program-test-console.tsx", "utf8");

test("Turbopack uses the monorepo root and source aliases", () => {
  assert.match(nextConfig, /turbopack:\s*\{/);
  assert.match(nextConfig, /root:\s*workspaceRoot/);
  assert.match(nextConfig, /@powerchain\/standards/);
  assert.match(nextConfig, /packages\/standards\/src\/index\.ts/);
  assert.match(tsconfig, /packages\/standards\/src\/index\.ts/);
});

test("web metadata and scrolling use App Router conventions", () => {
  assert.match(layout, /data-scroll-behavior="smooth"/);
  assert.match(layout, /\/icon\.png/);
  assert.match(layout, /\/favicon\.png/);
});

test("wallet provider avoids redundant Phantom adapter registration", () => {
  assert.doesNotMatch(walletProvider, /PhantomWalletAdapter/);
});

test("standards and programs expose upgraded evidence-driven UI", () => {
  assert.match(standardPage, /Standards are policy—not deployment evidence/);
  assert.match(standardPage, /standard-overview-grid/);
  assert.match(programs, /Fail-closed production gates/);
  assert.match(programs, /Root Cargo workspace/);
});
