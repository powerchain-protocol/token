import { spawnSync } from "node:child_process";
import path from "node:path";

const workspaceRoot = path.resolve(import.meta.dirname, "..");

const [mode, manifestPath, ...extraArgs] = process.argv.slice(2);
if (!mode || !manifestPath) {
  console.error("Usage: node scripts/run-rust-tool.mjs <test|build-sbf> <Cargo.toml> [...args]");
  process.exit(2);
}

const probe = spawnSync("cargo", ["--version"], { encoding: "utf8" });
if (probe.error?.code === "ENOENT") {
  console.error([
    "Rust toolchain is not installed.",
    "Install Rust first: https://rustup.rs",
    "For Solana SBF builds, also install the Solana/Agave CLI providing `cargo build-sbf`.",
    `Requested operation: ${mode} (${manifestPath})`,
  ].join("\n"));
  process.exit(127);
}
if (probe.status !== 0) {
  process.stderr.write(probe.stderr || "Unable to execute cargo.\n");
  process.exit(probe.status ?? 1);
}

const args = mode === "test"
  ? ["test", "--manifest-path", manifestPath, "--all-targets", ...extraArgs]
  : mode === "build-sbf"
    ? ["build-sbf", "--manifest-path", manifestPath, ...extraArgs]
    : null;

if (!args) {
  console.error(`Unsupported Rust operation: ${mode}`);
  process.exit(2);
}

const result = spawnSync("cargo", args, {
  stdio: "inherit",
  cwd: workspaceRoot,
  env: {
    ...process.env,
    CARGO_TARGET_DIR: process.env.CARGO_TARGET_DIR ?? path.join(workspaceRoot, "target/cargo"),
  },
});
if (result.error?.code === "ENOENT") {
  console.error("Cargo became unavailable while launching the requested command.");
  process.exit(127);
}
process.exit(result.status ?? 1);
