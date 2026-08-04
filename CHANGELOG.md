# Changelog

All notable changes to the PowerChain PTK-001 workspace are documented here.
The project follows [Semantic Versioning](https://semver.org/) while it remains a release candidate.

### Program hardening

- Upgraded PowerPay to `1.0.0-rc.1`.
- Added a versioned and bounded instruction ABI with exact-length decoding.
- Implemented deterministic create, authorize, settle, cancel, refund, pause, resume, initialization, and authority-transfer transitions.
- Added ceiling-rounded service-fee accounting and refund ceilings.
- Added payment IDs, payer/merchant separation, expiry enforcement, replay protection, and atomic-failure tests.
- Fixed the missing `PowerPayInstruction` crate export that prevented the processor module from compiling.

## [Unreleased]

### Infrastructure and domains

- Added `api.powerchain.energy` and `payments.powerchain.energy` to the strict PowerPay CORS allowlist.
- Added canonical PowerPay web/API domain metadata to `config/powerpay.json` and Rust constants.
- Added root, application, and program ignore policies plus `.dockerignore`, `.npmignore`, and `.nvmrc`.
- Kept the PowerPay mainnet program ID gated as `TBA` until a verified deployment and governance authority ceremony are complete.


### Added

- PowerPay reference program for SOL, USDC, and PWRC settlement.
- Jupiter quote routing with read-only Raydium, Meteora, and Orca integration boundaries.
- Solana Pay URL construction and `/api/v1` CORS, rates, and quote routes.
- Native Solana devnet faucet requesting exactly 2 SOL per approved wallet request.
- Wallet-signature authentication with domain, URI, nonce, request ID, and expiry binding.
- Professional web application, legal pages, cookie notice, and cinematic light-first styling.
- Independent evidence, audit, hosting, compatibility, reproducible-build, and release gates.

### Changed

- Migrated dependency build-script policy to pnpm 11 `allowBuilds`.
- Classified required builds (`esbuild`, `sharp`, and `protobufjs`) as allowed and optional native accelerators as denied.
- Moved release history out of the root README into this changelog.
- Consolidated PWRC metadata generation from `config/metadata.source.json`.
- Hardened faucet allowance accounting so failed submissions restore reservations.
- Enforced canonical Token-2022 ownership, 9 decimals, and revoked mint/freeze authorities.

### Security

- Production JSON keypairs are prohibited by PTK-KEY-001.
- Mainnet actions fail closed when program IDs, authority addresses, audits, or deployment evidence are missing.
- Faucet routes validate signed wallet proofs server-side and keep managed RPC credentials server-only.
- DEX responses are observational until the user independently signs an execution transaction.

## [1.0.0-rc.0] - 2026-08-04

### Added

- PTK-001 fixed-supply PWRC primitives and frozen Token-2022 profile.
- Canonical PWRC mint configuration and separate tPWRC devnet lifecycle.
- TransferFeeConfig at 250 basis points with a governance-approved maximum fee.
- MetadataPointer and TokenMetadata support with PNG and SVG assets.
- Rust instruction, state, processor, error, Token-2022, and Solana unit modules.
- TypeScript clients for amounts, accounts, fees, transactions, RPC, explorers, metadata, and mainnet integrations.
- Devnet rehearsal, supply attestation, on-chain verification, and SHA-256 release tooling.

[Unreleased]: https://github.com/powerchain-protocol/powerchain/compare/v1.0.0-rc.0...HEAD
[1.0.0-rc.0]: https://github.com/powerchain-protocol/powerchain/releases/tag/v1.0.0-rc.0
