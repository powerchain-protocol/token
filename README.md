<div align="center">

# PowerChain Native Token & PowerPay Workspace

**PTK-001 PWRC Token-2022 · PPAY-001 PowerPay · Solana devnet tooling · Web and faucet applications**

`1.0.0-rc.0` · Apache-2.0 · Node 24.14.0 · pnpm 11.20.0

</div>

## Overview

This monorepo contains the reference implementation and developer tooling for the PowerChain PWRC native-token profile and PowerPay settlement program. It keeps application code, reusable TypeScript packages, Solana programs, canonical IDLs, metadata, environment profiles, validation scripts, and generated release artifacts in explicit boundaries.

The workspace does not claim a mainnet deployment, independent audit, active DEX listing, or configured production authority unless corresponding evidence is present.

## Canonical layout

```text
apps/
├── web/                 Next.js wallet, token, payments, programs, and developer UI
└── faucet/              Standalone devnet SOL and tPWRC faucet service

packages/
├── native-token-client/ Token-2022, RPC, account, DEX, and program client APIs
├── standards/           PTK-001 and related machine-readable profiles
└── token-metadata/      Metadata generation and validation

├── client/               Higher-level PowerChain integration client
utils/                   Dependency-light Node utilities
programs/
├── native-token/        PTK-001 Rust program source and canonical IDL
├── powerpay/            PPAY-001 Rust program source
└── mainnet-program/     Evidence-gated deployment profile

scripts/                 Validation, recovery, attestation, and release tooling
target/                  Generated Cargo, SBF, IDL, checksum, and release output
```

Generated output belongs under `target/`; program-local `target/` directories and legacy root `app/`, `faucets/`, `components/`, or `idl/` trees are rejected by validation.

## Canonical assets

| Asset | Decimals | Program | Status |
| --- | ---: | --- | --- |
| SOL | 9 | System Program | Native Solana asset |
| USDC | 6 | SPL Token Program | Canonical mainnet mint profile |
| PWRC | 9 | SPL Token-2022 | Canonical mint profile |
| tPWRC | 9 | SPL Token-2022 | Separate devnet-only profile |

PWRC maximum and genesis supply is fixed at `18,446,000,000 PWRC`. The informational initial reference price is `$0.000002 USD`; it is not an oracle or guaranteed market price.

## Requirements

- Node.js `24.14.0`
- pnpm `11.20.0`
- Rust through `rustup` for program tests
- Solana or Agave CLI for `cargo build-sbf`

```bash
corepack enable
corepack prepare pnpm@11.20.0 --activate
```

## Installation

Always install from the repository root:

```bash
cd /workspaces/token
pnpm install:repair
pnpm preflight
```

`install:repair` restores `.nvmrc`, removes only safe empty legacy directories, clears stale incremental state, and performs a forced workspace installation using the committed pnpm layout.

## Development

```bash
pnpm dev:web             # http://localhost:3005
pnpm dev:faucet          # http://localhost:3015
pnpm dev:faucet:debug    # development-only faucet diagnostics
```

Useful diagnostics:

```bash
pnpm dev:doctor
pnpm workspace:status
pnpm workspace:status:json
pnpm dev:reset
```

When Node reports `uv_cwd`, open a new terminal or `cd` into an existing repository path before running any Node or pnpm command.

## Quality gates

```bash
pnpm typecheck
pnpm build
pnpm test
pnpm check:quick
pnpm check:all
```

Deterministic structural validation:

```bash
pnpm validate:workspace
pnpm validate:layout
pnpm validate:routing
pnpm validate:packages
pnpm validate:workspace-manifest
pnpm workspace:commands
```

## Devnet workflow

```bash
pnpm env:bootstrap:devnet
pnpm check:devnet-token
pnpm verify:onchain:devnet
pnpm attest:supply:devnet
```

Supply attestation requires a real deployed devnet Token-2022 mint in `.env.devnet`:

```env
POWERCHAIN_PWRC_MINT=<DEVNET_MINT_ADDRESS>
```

Attestations are written under `target/supply/`. The scripts use finalized commitment, exact base-unit strings, and a hashed RPC-origin fingerprint.

## Program workflow

```bash
pnpm programs:doctor
pnpm test:program:rust
pnpm build:program:sbf
pnpm test:powerpay
pnpm build:powerpay
```

Cargo and SBF output is centralized under `target/cargo/` and `target/deploy/`.

## Applications and routes

The web app includes:

- `/token` — canonical PWRC profile and mint verification
- `/payments` — PowerPay, SOL, USDC, PWRC, DEX, and Solana Pay surfaces
- `/faucet` — wallet-authenticated devnet faucet interface
- `/standard` — PTK-001 and profile documentation
- `/programs` — native-token and PowerPay testing console
- `/tools/terminal` — safe command catalog without browser-side shell execution
- `/developers`, `/status`, `/about`, and `/legals/*`

The standalone faucet exposes `/`, `/health`, `/api/v1`, `/standard/`, and development-only debug routes when explicitly enabled.

## Security boundaries

- Mainnet program IDs and authorities remain `TBA` until verified deployment evidence exists.
- Faucet execution is devnet-only and does not expose treasury or production keys.
- Wallet authentication is domain, URI, chain, wallet, nonce, request ID, and expiry bound.
- Production release gating fails closed without audit, governance, build, hosting, and on-chain evidence.
- `.env.production` and `env/.env.production` are ignored and deployment-managed.
- DEX quotes remain off-chain observations; execution requires a separate wallet signature.

## Release workflow

```bash
pnpm metadata:check
pnpm prepare:release
pnpm release:status
pnpm release:gate
```

`release:gate` is intentionally strict and may remain blocked until independent evidence is supplied.

## Documentation

- [`CHANGELOG.md`](CHANGELOG.md)
- [`DISCLAIMER.md`](DISCLAIMER.md)
- [`scripts/README.md`](scripts/README.md)
- [`apps/README.md`](apps/README.md)
- [`packages/README.md`](packages/README.md)
- [`programs/README.md`](programs/README.md)
- [`target/README.md`](target/README.md)

Run `pnpm scripts:list` for the maintained command catalog.

## License

Apache License 2.0. See repository license metadata and individual third-party dependency licenses.

## Clean dependency recovery

When a Codespaces restore or extracted archive leaves package links incomplete, run:

```bash
cd /workspaces/token
pnpm install:clean
pnpm validate:web-toolchain
pnpm typecheck
pnpm build
```

This is the supported recovery path for missing React, Next.js, Solana SDK, wallet-adapter, or JSX type declarations.

## Reliable workspace bootstrap

For a fresh checkout or restored Codespace, run:

```bash
pnpm bootstrap
```

Diagnose package resolution without starting applications:

```bash
pnpm deps:doctor
pnpm dev:faucet:doctor
pnpm check:dependencies
```

Repair a partially linked pnpm workspace:

```bash
pnpm deps:repair
```

Production environment files are deployment-managed and intentionally excluded from the repository. Create them from `.env.example` only in the deployment environment.

## Web workspace resolution

The Next.js application uses the repository root as its Turbopack root. During local development, `@powerchain/standards` and `@powerchain/native-token-client` resolve directly to their TypeScript source entry points, so the web app does not depend on stale `dist/` output or package-local pnpm links.

```bash
cd /workspaces/token
pnpm workspace:repair
pnpm install
pnpm dev:web
```

If a terminal reports `uv_cwd`, that terminal is still attached to a directory that was moved or quarantined. Open a new terminal or change to `/workspaces/token` before running Node or pnpm.

The web route `/standard` presents the machine-readable PTK-001 and PPAY-001 profiles. The `/programs` route presents source validation, security boundaries, commands, and evidence-driven deployment status.

## Versioned web API

The web application exposes a documented `/api/v1` boundary. OpenAPI is available at `/api/v1/swagger.yaml`, with the canonical source retained in `docs/api/v1/swagger.yaml`. Web configuration is centralized under `apps/web/config/`, reusable client hooks under `apps/web/hooks/`, and typed route registries under `apps/web/lib/routes.ts`.
