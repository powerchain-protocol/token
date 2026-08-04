# PowerChain Release and Validation Scripts

The scripts directory contains deterministic, non-interactive checks for PTK-001 development, devnet rehearsal, evidence collection, and production release gating.

## Command map

Run `pnpm scripts:list` to print the maintained command catalog.

### Core validation

| Script | Purpose |
| --- | --- |
| `validate-workspace.mjs` | Runs the complete deterministic validation sequence. |
| `validate-frozen-profile.mjs` | Verifies frozen PTK-001 constants and profile fingerprint. |
| `validate-config.mjs` | Cross-checks JSON configuration and canonical addresses. |
| `validate-faucet.mjs` | Verifies the devnet-only tPWRC faucet policy. |
| `validate-assets.mjs` | Checks required logo and metadata assets. |
| `sync-idl.mjs` | Keeps root and program IDL copies identical. |

### Network and deployment

| Script | Purpose |
| --- | --- |
| `validate-env.mjs` | Validates cluster-specific environment profiles. |
| `health-check.mjs` | Performs a bounded Solana JSON-RPC health probe. |
| `verify-onchain-mint.mjs` | Verifies finalized Token-2022 mint state. |
| `attest-supply.mjs` | Produces a supply observation and RPC fingerprint. |
| `devnet-rehearsal.mjs` | Generates the rehearsal plan. |
| `record-devnet-evidence.mjs` | Validates and records transaction evidence. |

### Release assurance

| Script | Purpose |
| --- | --- |
| `verify-hosting.mjs` | Checks metadata URIs, content types, and asset integrity. |
| `validate-evidence.mjs` | Validates audit, governance, hosting, compatibility, and build attestations. |
| `release-status.mjs` | Produces a consolidated release-readiness report. |
| `release-gate.mjs` | Fails closed unless every production requirement passes. |
| `prepare-release.mjs` | Generates SHA-256 checksums for release artifacts. |

## Shared helpers

Reusable Node helpers live under `scripts/lib/`:

- `env.mjs` — environment parsing and profile validation.
- `fs.mjs` — small file and JSON helpers.
- `validation.mjs` — structured error/warning collection.

Application-facing TypeScript utilities live in [`/utils`](../utils/). Script helpers remain dependency-free so release checks can run before workspace installation.

## Safety rules

Scripts must never print private keys, seed phrases, bearer tokens, or full credential-bearing RPC URLs. Network checks must use bounded timeouts and release scripts must fail closed on missing or inconsistent evidence.
