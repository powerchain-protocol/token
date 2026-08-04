# PowerChain Programs

This directory contains the Rust reference programs for the PTK-001 and PPAY-001 release candidates. Program IDs remain deployment-specific and must never be inferred from token mint addresses.

## Programs

| Program | Specification | Purpose | Deployment |
|---|---|---|---|
| `native-token` | PTK-001 | Frozen PWRC supply, lifecycle, Token-2022 profile, burn accounting | Experimental RC |
| `powerpay` | PPAY-001 | SOL, USDC, and PWRC payment lifecycle and settlement accounting | Experimental RC |
| `mainnet-program` | Deployment profile | Mainnet-beta release and authority gates | Program ID TBA |

## Security model

- Every mutable transition requires an explicit signer and writable-account boundary.
- Instruction and state formats are versioned and reject malformed or trailing bytes.
- Monetary calculations use checked integer arithmetic only.
- Nonces are strictly increasing within their state domain.
- Mainnet authorities must be governance-controlled multisig/timelock accounts.
- External RPC, oracle, market-data, and DEX providers are non-authoritative inputs.

## Commands

```bash
pnpm validate:workspace
pnpm check:programs
pnpm test:program:rust
pnpm test:powerpay
pnpm build:program:sbf
pnpm build:powerpay
```

Cargo and the Solana SBF toolchain are required for Rust tests and deployable builds. The repository root `Cargo.toml` is the canonical Cargo workspace manifest, and `rust-toolchain.toml` pins the supported compiler, Clippy, and rustfmt toolchain.

## Optimized build profile

Program release builds inherit one canonical root profile with one codegen unit, fat LTO, overflow checks, panic abort, symbol stripping, size optimization, and a shared root Cargo target directory. Package manifests inherit versions, Rust edition, MSRV, dependencies, and lint policy from the workspace to prevent configuration drift. Run program commands from the repository root so toolchain checks and artifact paths remain deterministic. Source validation does not imply deployment or audit completion.

## Program development contract

The root Cargo workspace is the only supported build boundary. Program crates inherit the release profile, lint policy, dependency versions, Rust edition, MSRV, license, and artifact destination from the root manifests.

```text
Cargo.toml                  # canonical workspace and optimized profiles
rust-toolchain.toml         # pinned compiler, rustfmt, and Clippy
programs/native-token/      # PTK-001 source, tests, IDL, metadata
programs/powerpay/          # PPAY-001 source and tests
programs/mainnet-program/   # deployment profile only; no duplicate source
target/cargo/               # generated Cargo output
target/deploy/              # generated SBF artifacts
target/idl/                 # generated IDL copies
```

### Required release evidence

A program may be described as source-validated only after deterministic validators pass. Mainnet deployment, production readiness, and audit completion require separate evidence for the deployed program ID, upgrade authority, verified binary checksum, reproducible build, live account ownership, independent review, and operational controls.

### Performance and safety priorities

1. Reject malformed instruction data and trailing bytes before account mutation.
2. Verify signer, writable, owner, mint, and PDA boundaries before CPI.
3. Use checked integer arithmetic for fees, supply, settlements, and refunds.
4. Keep account reads and writes deterministic and bounded.
5. Avoid heap allocation and unnecessary cloning in program execution paths.
6. Keep Token-2022 CPI calls explicit and test adversarial account ordering.
7. Preserve stable instruction and error ABI compatibility.
