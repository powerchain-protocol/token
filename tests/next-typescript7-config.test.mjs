import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const jsConfig = new URL("../apps/web/next.config.mjs", import.meta.url);
const tsConfig = new URL("../apps/web/next.config.ts", import.meta.url);

test("Next config is JavaScript so TypeScript 7 CLI mode can bootstrap", async () => {
  assert.equal(existsSync(jsConfig), true);
  assert.equal(existsSync(tsConfig), false);

  const source = await readFile(jsConfig, "utf8");
  assert.match(source, /useTypeScriptCli:\s*true/);
  assert.match(source, /export default nextConfig/);
});

test("web package retains TypeScript 7 and an explicit typecheck script", async () => {
  const pkg = JSON.parse(await readFile(new URL("../apps/web/package.json", import.meta.url), "utf8"));
  assert.match(pkg.devDependencies.typescript, /^\^7\./);
  assert.equal(pkg.scripts.typecheck, "tsc --noEmit");
});
