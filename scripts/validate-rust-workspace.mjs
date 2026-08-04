import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const required = ["Cargo.toml", "rust-toolchain.toml", "programs/native-token/Cargo.toml", "programs/powerpay/Cargo.toml"];
const errors = [];
for (const file of required) if (!fs.existsSync(path.join(root, file))) errors.push(`missing ${file}`);

const workspace = fs.readFileSync(path.join(root, "Cargo.toml"), "utf8");
for (const token of [
  '[workspace]',
  'resolver = "2"',
  '"programs/native-token"',
  '"programs/powerpay"',
  '[workspace.dependencies]',
  '[workspace.lints.rust]',
  '[workspace.lints.clippy]',
  '[profile.release]',
  'overflow-checks = true',
  'panic = "abort"',
  'lto = "fat"',
]) if (!workspace.includes(token)) errors.push(`root Cargo.toml missing ${token}`);

for (const rel of ["programs/native-token/Cargo.toml", "programs/powerpay/Cargo.toml"]) {
  const manifest = fs.readFileSync(path.join(root, rel), "utf8");
  for (const token of ["version.workspace = true", "edition.workspace = true", "rust-version.workspace = true", "license.workspace = true", "[lints]", "workspace = true"]) {
    if (!manifest.includes(token)) errors.push(`${rel} missing ${token}`);
  }
  if (manifest.includes("[profile.release]")) errors.push(`${rel} must not define a package-local release profile`);
}

const toolchain = fs.readFileSync(path.join(root, "rust-toolchain.toml"), "utf8");
for (const token of ['channel = "1.84.1"', '"clippy"', '"rustfmt"']) if (!toolchain.includes(token)) errors.push(`rust-toolchain.toml missing ${token}`);

if (errors.length) {
  console.error(errors.map((e) => `✗ ${e}`).join("\n"));
  process.exit(1);
}
console.log("Rust workspace TOML validation passed.");
