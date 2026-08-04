import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { inspectKeypairPath, readSecretKeyFile, validateSecretKeyArray } from "../scripts/lib/keypairs.mjs";

test("validates a 64-byte Solana secret key array", () => {
  assert.equal(validateSecretKeyArray(Array.from({ length: 64 }, (_, index) => index)).length, 64);
});

test("rejects malformed secret key arrays", () => {
  assert.throws(() => validateSecretKeyArray([1, 2, 3]), /exactly 64 bytes/);
  assert.throws(() => validateSecretKeyArray([...Array(63).fill(0), 256]), /invalid byte/);
});

test("accepts a private regular keypair file outside the repository", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "pwrc-keypair-"));
  const file = path.join(dir, "devnet.json");
  fs.writeFileSync(file, JSON.stringify(Array(64).fill(7)), { mode: 0o600 });
  fs.chmodSync(file, 0o600);
  const result = inspectKeypairPath(file, { repoRoot: process.cwd() });
  assert.equal(result.resolvedPath, file);
  assert.equal(readSecretKeyFile(file, { repoRoot: process.cwd() }).length, 64);
});

test("rejects repository-contained and permissive keypair files", () => {
  const repoFile = path.join(process.cwd(), ".tmp-keypair-test.json");
  fs.writeFileSync(repoFile, JSON.stringify(Array(64).fill(1)), { mode: 0o600 });
  try {
    assert.throws(() => inspectKeypairPath(repoFile, { repoRoot: process.cwd() }), /outside the repository/);
  } finally {
    fs.rmSync(repoFile, { force: true });
  }

  if (process.platform !== "win32") {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "pwrc-keypair-mode-"));
    const file = path.join(dir, "bad.json");
    fs.writeFileSync(file, JSON.stringify(Array(64).fill(1)), { mode: 0o644 });
    fs.chmodSync(file, 0o644);
    assert.throws(() => inspectKeypairPath(file, { repoRoot: process.cwd() }), /0600 or stricter/);
  }
});
