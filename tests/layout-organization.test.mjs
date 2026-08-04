import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("program source and generated outputs have separate canonical boundaries", async () => {
  assert.equal(existsSync(new URL("../programs/native-token/idl/powerchain.json", import.meta.url)), true);
  assert.equal(existsSync(new URL("../idl", import.meta.url)), false);
  assert.equal(existsSync(new URL("../programs/native-token/target", import.meta.url)), false);
  assert.equal(existsSync(new URL("../programs/powerpay/target", import.meta.url)), false);
  const runner = await readFile(new URL("../scripts/run-rust-tool.mjs", import.meta.url), "utf8");
  assert.match(runner, /CARGO_TARGET_DIR/);
  assert.match(runner, /target\/cargo/);
});

test("React components live inside the web application", () => {
  assert.equal(existsSync(new URL("../components", import.meta.url)), false);
  assert.equal(existsSync(new URL("../apps/web/components/token/pwrc-logo.tsx", import.meta.url)), true);
});
