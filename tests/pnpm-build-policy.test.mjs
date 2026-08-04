import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const workspace = await readFile(new URL("../pnpm-workspace.yaml", import.meta.url), "utf8");

test("pnpm 11 build scripts are explicitly classified", () => {
  assert.match(workspace, /^allowBuilds:/m);

  for (const dependency of ["esbuild", "sharp", "protobufjs"]) {
    assert.match(workspace, new RegExp(`^  ${dependency}: true$`, "m"));
  }

  for (const dependency of [
    '"@stellar/stellar-sdk"',
    "bigint-buffer",
    "blake-hash",
    "bufferutil",
    "tiny-secp256k1",
    "usb",
    "utf-8-validate",
  ]) {
    assert.match(workspace, new RegExp(`^  ${dependency}: false$`, "m"));
  }

  assert.doesNotMatch(workspace, /^onlyBuiltDependencies:/m);
  assert.doesNotMatch(workspace, /^ignoredBuiltDependencies:/m);
});
