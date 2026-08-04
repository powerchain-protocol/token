import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const webPackage = JSON.parse(fs.readFileSync("apps/web/package.json", "utf8"));
const nextConfig = fs.readFileSync("apps/web/next.config.mjs", "utf8");
const loading = fs.readFileSync("apps/web/app/loading.tsx", "utf8");
const notFound = fs.readFileSync("apps/web/app/not-found.tsx", "utf8");
const explicit404 = fs.readFileSync("apps/web/app/404/page.tsx", "utf8");

test("web builds workspace dependencies before dev and production builds", () => {
  assert.match(webPackage.scripts["deps:build"], /@powerchain\/standards/);
  assert.match(webPackage.scripts["deps:build"], /@powerchain\/native-token-client/);
  assert.equal(webPackage.scripts.predev, "pnpm run deps:build");
  assert.equal(webPackage.scripts.prebuild, "pnpm run deps:build");
  assert.match(nextConfig, /transpilePackages/);
  assert.match(nextConfig, /@powerchain\/standards/);
});

test("app router provides accessible loading and 404 states", () => {
  assert.match(loading, /aria-busy="true"/);
  assert.match(loading, /Preparing PowerChain/);
  assert.match(notFound, /Error 404/);
  assert.match(notFound, /Return home/);
  assert.match(explicit404, /notFound\(\)/);
});
