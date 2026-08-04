import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("Rust programs inherit one canonical Cargo workspace", () => {
  const rootManifest = read("Cargo.toml");
  assert.match(rootManifest, /\[workspace\]/);
  assert.match(rootManifest, /programs\/native-token/);
  assert.match(rootManifest, /programs\/powerpay/);
  for (const file of ["programs/native-token/Cargo.toml", "programs/powerpay/Cargo.toml"]) {
    const manifest = read(file);
    assert.match(manifest, /version\.workspace = true/);
    assert.match(manifest, /rust-version\.workspace = true/);
    assert.match(manifest, /\[lints\]\s+workspace = true/);
    assert.doesNotMatch(manifest, /\[profile\.release\]/);
  }
});

test("Rust toolchain and release safety policy are pinned", () => {
  const toolchain = read("rust-toolchain.toml");
  const rootManifest = read("Cargo.toml");
  assert.match(toolchain, /channel = "1\.84\.1"/);
  assert.match(toolchain, /"clippy"/);
  assert.match(toolchain, /"rustfmt"/);
  assert.match(rootManifest, /overflow-checks = true/);
  assert.match(rootManifest, /panic = "abort"/);
  assert.match(rootManifest, /unwrap_used = "deny"/);
  assert.match(rootManifest, /expect_used = "deny"/);
});
