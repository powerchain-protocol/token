import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

test("web API v1 exposes discovery and swagger contracts", () => {
  assert.equal(existsSync("apps/web/app/api/v1/route.ts"), true);
  assert.equal(existsSync("apps/web/app/api/v1/swagger.yaml/route.ts"), true);
  const spec = readFileSync("apps/web/public/api/v1/swagger.yaml", "utf8");
  assert.match(spec, /openapi: 3\.1\.0/);
  assert.match(spec, /\/programs:/);
});

test("routing includes canonical v1 redirects", () => {
  const routes = readFileSync("apps/web/lib/routes.ts", "utf8");
  assert.match(routes, /source: "\/api"/);
  assert.match(routes, /source: "\/swagger\.yaml"/);
});
