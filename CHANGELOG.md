## Web runtime, standards UI, and program documentation upgrade

- Set the Next.js Turbopack root to the monorepo root.
- Added source aliases for standards and native-token client workspaces.
- Added Webpack fallback aliases and TypeScript path mappings.
- Fixed favicon metadata and smooth-scroll route-transition signaling.
- Removed redundant Phantom wallet-adapter registration.
- Upgraded standards and programs UI with evidence-driven status and responsive cards.
- Added program development and optimization documentation.

## Unreleased — security and program optimization

- Removed legacy root app, client, and faucet workspaces.
- Hardened production environment and key-material boundaries.
- Expanded deterministic workspace validation.
- Routed Rust/SBF commands through the toolchain-aware runner.
- Optimized release profiles for native-token and PowerPay programs.
- Made workspace manifest validation recoverable when `.nvmrc` is missing.


## 1.0.0-rc.0 — Web toolchain and dependency-link hardening

- Added explicit React, React DOM, and Node type discovery to the web TypeScript profile.
- Added `validate:web-toolchain` and integrated it into workspace validation.
- Added `install:clean` and `typecheck:web:clean` recovery commands.
- Extended workspace repair to remove stale dependency links and obsolete `next.config.ts`.
- Added strict component typing for React children, input events, and selected program fallback.
- Added regression coverage for Next/React/Solana dependencies and the canonical ESM Next config.

# Changelog

- Moved `@powerchain/client` from the repository root into `apps/client`.
- Updated workspace discovery, TypeScript paths, scripts, validators, cleanup tasks, tests, and READMEs for the canonical `apps/*` application layout.
- Added a layout regression gate that forbids the legacy root `client/` directory.

## Unreleased — command and documentation normalization

- Normalized the root `package.json` command surface and removed obsolete `dev:app` / `build:app` aliases.
- Added canonical status, preflight, cleanup, client, manifest, and command-surface scripts.
- Added command-surface validation to the deterministic workspace gate.
- Made devnet supply attestation bootstrap the committed devnet environment profile.
- Rebuilt the root and scripts READMEs and aligned app, package, client, program, test, and utility documentation with the canonical monorepo.


### Fixed

- Enabled Next.js TypeScript CLI mode for TypeScript 7.
- Corrected native-token-client strict optional-property and constant exports.
- Added Node typings and separate build/typecheck configurations.
- Added `/about`, shared Features and FAQ components, and application icons.
- Added a root-install guard with actionable startup guidance.

## 1.0.0-rc.2 - 2026-08-04

### Fixed

- Corrected pnpm workspace discovery to use `apps/*` instead of removed root `app` and `faucets` paths.
- Added standalone client dependency prebuilds and Node type declarations.
- Added centralized web route definitions and `/api/v1/routes`.
- Normalized standalone faucet routes, including `/standard/`.
- Updated package and application READMEs.


All notable changes to the PowerChain PTK-001 workspace are documented here.
The project follows [Semantic Versioning](https://semver.org/) while it remains a release candidate.

### Program hardening

- Upgraded PowerPay to `1.0.0-rc.1`.
- Added a versioned and bounded instruction ABI with exact-length decoding.
- Implemented deterministic create, authorize, settle, cancel, refund, pause, resume, initialization, and authority-transfer transitions.
- Added ceiling-rounded service-fee accounting and refund ceilings.
- Added payment IDs, payer/merchant separation, expiry enforcement, replay protection, and atomic-failure tests.
- Fixed the missing `PowerPayInstruction` crate export that prevented the processor module from compiling.

### Fixed

- Added repository-root resolution for metadata and PowerPay validators.
- Disabled pnpm automatic dependency installation before scripts with `verifyDepsBeforeRun: false`.
- Added workspace recovery and doctor commands for deleted-current-directory (`uv_cwd`) failures.
- Routed the production release gate through a direct Node entrypoint to avoid nested pnpm install checks.

## [Unreleased]

### Workspace observability and drift prevention

- Added `config/workspace.json` as the canonical inventory for applications, packages, programs, ports, Node/pnpm versions, and public service domains.
- Added `pnpm workspace:status` and `pnpm workspace:status:json` for environment, dependency, route-surface, and port diagnostics.
- Added `pnpm preflight` and `pnpm validate:workspace-manifest`.
- Added validation that forbids stale root `app/` and `faucets/` directories after the monorepo migration.
- Added regression coverage for canonical web and faucet package names and ports.
### Fixed — Workspace Node typings and package compilation

- Added package-local `@types/node` support to `@powerchain/standards`.
- Enabled Node typings in the standards, utilities, faucet, and web TypeScript configurations.
- Strengthened package-graph validation to detect Node APIs and Node tests without local typings.
- Prevented `node:test`, `node:assert/strict`, `node:crypto`, and `node:fs/promises` compile failures under TypeScript 7.

### Monorepo and routing

- Moved the Next.js application to `apps/web`.
- Moved faucet domain services to `apps/faucet`.
- Added `/faucet`, `/payments`, `/token`, `/developers`, and `/status` routes.
- Added `/api/v1/health`, global loading, not-found, and error boundaries.
- Corrected API route imports after the monorepo move.
- Added deterministic synchronization of canonical public assets into `apps/web/public`.
- Corrected package-level TypeScript configuration inheritance.
- Added workspace recovery guidance for stale deleted working directories.


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

## Unreleased — Workspace reliability and application metadata

### Added

- Package-graph validation for all seven TypeScript workspace projects.
- Validation of package-local Node typings and workspace dependency references.
- Typed API route registry for the web application.
- PWA manifest, robots policy, sitemap generation, and richer application metadata.
- Root commands `validate:packages` and `dev:doctor`.

### Changed

- Added `/about` and all legal routes to the centralized application route registry.
- Expanded routing validation to cover metadata routes and application icons.
- Improved Open Graph, Twitter, favicon, Apple icon, theme-color, and manifest metadata.

### Environment profile reliability

- Added committed-profile fallback resolution for `.env.devnet` and `.env.production`.
- Added `pnpm env:bootstrap:devnet` and `pnpm env:bootstrap:production`.
- Updated `check:devnet-token` to bootstrap the root devnet profile before validation.
- Replaced raw missing-file `ENOENT` failures with actionable environment diagnostics.

### Workspace startup hardening

- Replaced fragile root `.bin/next` checks with package-local Next.js resolution.
- Added a direct Node-based Next.js launcher for development, build, and start commands.
- Added dependency diagnostics to `pnpm doctor` and actionable recovery messages for missing installs and stale `uv_cwd` shells.
- Added `pnpm clean:generated` and `pnpm dev:reset` to remove stale Next.js, TypeScript, and package build output.
- Removed the committed `apps/web/tsconfig.tsbuildinfo` artifact.
- Disabled redundant pnpm dependency verification before every workspace script while preserving the explicit build-script allowlist.

## 2026-08-04 — Developer tools and program console

### Added

- Safe web developer terminal at `/tools/terminal` with searchable, copyable workspace commands.
- Program testing and conformance UI at `/programs` for PTK-001 and PPAY-001.
- Read-only API catalogs at `/api/v1/tools/terminal` and `/api/v1/programs`.
- Standalone faucet landing UI under `apps/faucet`.
- Regression tests for terminal safety, program coverage, faucet placement, and canonical port usage.

### Changed

- Standalone faucet default port corrected from `3010` to the canonical workspace port `3015`.
- Next.js resolution can now fall back to pnpm's virtual store when app-local links are temporarily missing.
- Primary navigation and sitemap now include Programs and Terminal.

### Security

- Browser terminal remains catalog-only and cannot execute arbitrary shell input.
- Program status remains evidence-driven; source validation is not represented as deployment or audit completion.

### Standalone faucet debug mode

- Added a development-only `/debug` console to `apps/faucet`.
- Added sanitized runtime diagnostics and bounded in-memory request events.
- Added dry-run SOL and tPWRC request simulation without fund movement.
- Added strict production lockout for faucet debugging.
- Added root commands `dev:faucet:debug` and `start:faucet:debug`.

### Fixed — Next.js 16 + TypeScript 7 startup

- Replaced `apps/web/next.config.ts` with `apps/web/next.config.mjs` so Next.js can read `experimental.useTypeScriptCli` before attempting to load the TypeScript 7 compiler API.
- Added regression coverage for the JavaScript config bootstrap boundary.
- Preserved explicit project-local `tsc --noEmit` type checking.

## Workspace repair and Rust toolchain diagnostics

- Added a committed hoisted pnpm install profile so application and package dependencies remain resolvable after Codespaces restores and archive extraction.
- Added `pnpm workspace:repair` to restore `.nvmrc`, remove empty legacy root application directories, and clear stale TypeScript incremental state.
- Added `pnpm install:repair` for deterministic workspace relinking.
- Replaced bare Cargo scripts with a toolchain-aware runner that explains how to install Rust and Solana SBF tooling when unavailable.
- Hardened workspace-manifest validation so a missing `.nvmrc` produces an actionable diagnostic instead of an uncaught `ENOENT`.

### Fixed — workspace TypeScript runner and faucet development startup

- Added package-aware `tsx` launchers that resolve from app-local links, the root install, or pnpm's virtual store.
- Updated the standalone faucet development commands to avoid fragile local `.bin/tsx` assumptions.
- Updated client TypeScript test execution to use the shared loader resolver.
- Added root `tsx` tooling and a `test:client` command.
- Fixed the TypeScript 7 `Error.cause` override requirement in the faucet error type.
- Added regression coverage for the shared TSX runner and TypeScript 7 override boundary.

## Workspace organization hardening

- Made `programs/native-token/idl/powerchain.json` the canonical PTK-001 IDL source.
- Removed the duplicate root `idl/` and root React `components/` compatibility trees.
- Moved the PWRC logo component into `apps/web/components/token/`.
- Centralized all Cargo outputs under `target/cargo/` through `CARGO_TARGET_DIR`.
- Added canonical layout validation and regression coverage.

## Unreleased — scripts, routing, and shared utilities

- Fixed `attest:supply:*` and on-chain verification scripts to use the canonical environment parser and variable names.
- Added shared token constants, metrics, and formatting utilities under `apps/web/shared/`.
- Added typed API routes and legacy redirects for old `/pages`, `/powerpay`, `/faucets`, and `/tools` URLs.
- Added deployment-managed production environment files to `.gitignore`.

## Environment loader and dependency resolution hardening

- Added a compatibility deployment-environment loader supporting both `parseEnvFile` and the legacy `readEnvFile` export.
- Updated supply attestation and on-chain mint verification to use the compatibility loader.
- Expanded Next.js resolution across app-local, root-hoisted, and pnpm virtual-store layouts.
- Improved doctor/install guidance to recommend `pnpm install:repair` for partially linked workspaces.
- Added regression coverage for environment-loader compatibility and workspace dependency resolution.

## Dependency bootstrap hardening

- Added a shared package dependency bootstrapper for the faucet, integration client, and native-token client.
- Development, build, typecheck, and test commands now repair incomplete pnpm workspace links before execution.
- Added explicit recovery guidance for stale-shell `uv_cwd` failures.
- Added dependency-bootstrap validation to the canonical workspace gate.
- Clarified the mainnet program profile as a deployment boundary rather than a duplicate program source tree.

### Workspace dependency reliability upgrade

- Added a cross-workspace dependency doctor for web, faucet, integration client, and native-token SDK.
- Added install recursion protection and a filesystem lock for automatic pnpm repairs.
- Added JSON-capable dependency inspection with declared/resolved status.
- Added `bootstrap`, `check:dependencies`, `dev:faucet:doctor`, and `typecheck:sdk` commands.
- Removed committed production environment profiles; production secrets remain deployment-managed.

## Rust TOML workspace hardening

- Added a root Cargo workspace for `native-token` and `powerpay`.
- Added `rust-toolchain.toml` with Rust 1.84.1, Clippy, and rustfmt.
- Centralized package metadata, dependency versions, lints, and release profiles.
- Removed duplicated package-local release profiles.
- Added strict Clippy policy for panic, unwrap, expect, correctness, and suspicious patterns.
- Added `pnpm validate:rust-workspace` and integrated it into workspace validation.

## Workspace recovery hardening

- Non-empty legacy root trees are now moved safely into `target/recovery/` instead of blocking preflight or being deleted.
- Workspace repair restores required `.gitignore` boundaries for production environments, key material, secrets, and generated Rust targets.
- The canonical workspace manifest now forbids root `components/` and `idl/` compatibility trees in addition to `app/`, `client/`, and `faucets/`.

## Developer and faucet UI refinement

- Added a compact, responsive developers-page hero with platform metrics.
- Added Radix Icons to developer resource cards and introduced a featured dark-green API card.
- Standardized smooth card shadows, hover elevation, and bottom-aligned resource actions.
- Reworked faucet cards as equal-height professional panels with aligned primary actions.
- Preserved the PWRC hero coin at a 250px desktop ceiling while improving responsive containment on tablets and mobile.

## 2026-08-04 — Web route resilience and faucet completion

- Build `@powerchain/standards` and `@powerchain/native-token-client` before Next.js development and production builds.
- Transpile canonical workspace packages through Next.js.
- Added accessible App Router loading and not-found states plus an explicit `/404` route.
- Completed address-based Solana devnet faucet UI and API logic with validation, rate limits, confirmation polling, and centered safety messaging.

## API v1, configuration, hooks, and token UI

- Fixed strict TypeScript 7 SDK errors in amount parsing, DEX/mainnet request configuration, explorer options, RPC headers, and canonical PWRC mint exports.
- Added centralized web configuration under `apps/web/config/` and reusable browser hooks under `apps/web/hooks/`.
- Added `/api/v1` discovery, OpenAPI redirect, and `/api/v1/swagger.yaml`.
- Added canonical Swagger sources under `docs/api/v1/` and `apps/web/public/api/v1/`.
- Expanded application/API route registries and legacy redirects.
- Upgraded the PWRC token route with profile, authority, and machine-readable API control cards.
