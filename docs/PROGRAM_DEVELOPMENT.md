# PowerChain Program Development

## Scope

This document defines the local development, optimization, validation, and evidence boundaries for the PTK-001 native-token and PPAY-001 PowerPay programs.

## Canonical source ownership

- `programs/native-token/` owns the PWRC program source, tests, metadata, and canonical IDL.
- `programs/powerpay/` owns the payment-settlement program source and tests.
- `programs/mainnet-program/` contains deployment policy only and does not duplicate Rust source.
- Root `target/` contains all generated Cargo, SBF, IDL, checksum, and release artifacts.

## Optimized build

All crates inherit the root release profile: size optimization, one codegen unit, fat LTO, checked overflow, panic abort, stripped symbols, and disabled incremental compilation. The root Rust toolchain file pins the compiler, rustfmt, and Clippy.

## Security gates

Program changes must preserve signer and owner verification, writable-account checks, deterministic state encoding, checked arithmetic, nonce monotonicity, lifecycle controls, replay resistance, Token-2022 CPI boundaries, and stable error codes.

## Commands

```bash
pnpm validate:rust-workspace
pnpm validate:powerpay
pnpm test:program:rust
pnpm test:powerpay
pnpm build:program:sbf
pnpm build:powerpay
```

Rust tests require Cargo. SBF builds additionally require the Solana or Agave build toolchain. Missing toolchains are reported by the guarded root runner.

## Evidence status

Passing source and policy validators does not prove that a program is deployed, audited, immutable, or production-ready. Those claims require independent deployment and release evidence.
