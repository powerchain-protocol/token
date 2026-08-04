import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function text(path) {
  return readFile(new URL(path, root), "utf8");
}

async function json(path) {
  return JSON.parse(await text(path));
}

test("Rust error ABI preserves frozen codes and appended range", async () => {
  const source = await text("programs/native-token/src/errors.rs");
  assert.match(source, /Unauthorized = 1/);
  assert.match(source, /AuthorityNotRevoked = 25/);
  assert.match(source, /NotEnoughAccounts = 26/);
  assert.match(source, /ConfigurationMismatch = 39/);
  assert.match(source, /ProgramError::Custom|Self::Custom/);
});

test("all IDL copies expose the same 39 errors", async () => {
  const paths = [
    "idl/powerchain.json",
    "programs/native-token/idl/powerchain.json",
    "target/idl/powerchain.json",
  ];
  const idls = await Promise.all(paths.map(json));
  for (const idl of idls) {
    assert.equal(idl.errors.length, 39);
    assert.equal(idl.errors[0].code, 1);
    assert.equal(idl.errors.at(-1).code, 39);
  }
  assert.deepEqual(idls[0].errors, idls[1].errors);
  assert.deepEqual(idls[1].errors, idls[2].errors);
});

test("TypeScript client exports custom error decoding", async () => {
  const source = await text("packages/native-token-client/src/errors.ts");
  const index = await text("packages/native-token-client/src/index.ts");
  assert.match(source, /parsePtk001Error/);
  assert.match(source, /custom program error/);
  assert.match(index, /\.\/errors\.js/);
});
