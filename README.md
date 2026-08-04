<p align="center">
  <img src="public/assets/token/pwrc.png" alt="PowerChain PWRC" width="144" height="144" />
</p>

<h1 align="center">PowerChain PTK-001</h1>

<p align="center">
  <strong>Programmable native currency, Token-2022 settlement, and PowerPay infrastructure for the PowerChain energy economy.</strong>
</p>

<p align="center">
  <a href="https://docs.powerchain.energy">Documentation</a> ·
  <a href="https://powerchain.energy">Website</a> ·
  <a href="https://whitepaper.powerchain.energy">Whitepaper</a> ·
  <a href="CHANGELOG.md">Changelog</a> ·
  <a href="DISCLAIMER.md">Disclaimer</a>
</p>

> [!IMPORTANT]
> This repository is an experimental `1.0.0-rc.0` reference implementation. Production activation remains blocked until independent audits, governance ceremonies, reproducible builds, deployment verification, permanent hosting checks, and compatibility sign-offs are complete.

## Overview

This monorepo implements the **PTK-001 PowerChain native-currency profile** and supporting payment infrastructure. It combines a Pinocchio-based Solana program, SPL Token-2022 clients, PowerPay settlement primitives, wallet-authenticated web applications, devnet faucets, metadata, provider integrations, and fail-closed release tooling.

### Canonical assets

| Property | PWRC | tPWRC |
| --- | --- | --- |
| Role | Canonical PowerChain asset | Devnet test asset |
| Cluster | Mainnet-beta target | Solana devnet only |
| Mint | `PWRCRXXZxbg6FdQZfK3PMD7KP8xfxs9acvifJiG46wc` | `TBA` until created and verified |
| Token program | SPL Token-2022 | SPL Token-2022 |
| Decimals | `9` | `9` |
| Transfer fee | `250` bps (`2.5%`) | `250` bps (`2.5%`) |
| Required extensions | TransferFeeConfig, MetadataPointer, TokenMetadata | Same test profile |

**Canonical Token-2022 program**

```text
TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
```

PWRC is fungible and transferable. Token-2022 withholds the configured transfer fee without minting additional supply or changing the PTK-001 fixed-supply invariant.

## Canonical services

| Service | URL |
|---|---|
| PowerPay | `https://payments.powerchain.energy` |
| API v1 | `https://api.powerchain.energy/api/v1` |
| Documentation | `https://docs.powerchain.energy` |

## Architecture

```text
app/                          Next.js wallet, faucet, PowerPay, API, and legal UI
client/                       Application-facing PWRC client
config/                       Frozen profiles, authorities, integrations, and release policy
faucets/                      Native SOL and tPWRC devnet faucet services
packages/native-token-client/ Token-2022, fees, accounts, transactions, DEX, RPC, explorer
packages/token-metadata/      Canonical metadata builders and validation
programs/native-token/        PTK-001 Pinocchio program and stable ABI
programs/powerpay/            SOL, USDC, and PWRC payment reference program
public/                       Hosted PWRC logos and metadata
scripts/                      Validation, rehearsal, evidence, and release automation
tests/                        Security, policy, routing, metadata, and adversarial tests
utils/                        Dependency-light shared TypeScript utilities
```

## Capabilities

- **PTK-001 monetary invariants:** exact genesis supply, no post-genesis minting, burns, pause/resume, authority rotation, and terminal deprecation.
- **Token-2022 integration:** fee-aware checked transfers, ATA creation, fee harvesting and withdrawal, metadata extensions, and mint validation.
- **PowerPay:** integer-safe SOL, USDC, and PWRC rates, settlement lifecycle, slippage limits, refunds, and replay protection.
- **Market connectivity:** Jupiter routing plus Raydium, Meteora, and Orca discovery boundaries; Solscan is the default explorer.
- **Solana Pay:** non-custodial payment URLs for native SOL and supported tokens.
- **Devnet operations:** separate tPWRC lifecycle and a secured native SOL faucet requesting exactly `2,000,000,000` lamports.
- **Release assurance:** on-chain verification, supply attestations, checksums, audit evidence, compatibility attestations, and governance gates.

## Requirements

- Node.js `24.14.0` or newer
- pnpm `11.20.0`
- Rust toolchain
- Anza/Solana SBF toolchain for program builds

## Installation

```bash
corepack enable
corepack prepare pnpm@11.20.0 --activate
pnpm install
```

pnpm 11 uses the `allowBuilds` map in `pnpm-workspace.yaml`. Required web build scripts are explicitly approved; optional native accelerators are explicitly denied. No interactive `pnpm approve-builds` step is required for the committed dependency graph.

## Development

```bash
pnpm dev:app                 # start the wallet and PowerPay web app
pnpm scripts:list            # print the command catalog
pnpm check:quick             # deterministic validation and Node policy tests
pnpm check:all               # typecheck, tests, workspace validation, security
pnpm build                   # build every TypeScript workspace package
pnpm test                    # run Node and package tests
```

### Program commands

```bash
pnpm test:program:rust       # native-token Rust unit/property/adversarial tests
pnpm build:program:sbf       # native-token Pinocchio SBF build
pnpm test:powerpay           # PowerPay Rust tests
pnpm build:powerpay          # PowerPay SBF build
```

### Release commands

```bash
pnpm validate:workspace
pnpm metadata:check
pnpm mainnet:check
pnpm prepare:release
pnpm release:status
pnpm release:gate
```

## Security model

- Wallet authentication proves browser-session wallet control only; each financial transaction still requires an independent wallet signature.
- The canonical PWRC mint is never treated as a wallet, governance authority, or program ID.
- Production authorities require governance multisig, timelock, HSM/KMS, hardware-wallet, or isolated-signer controls.
- Local JSON keypairs are prohibited in production and tightly constrained on devnet.
- RPC and market-data providers are observational and cannot redefine supply, authority, or settlement invariants.
- Production configuration fails closed when addresses, secrets, audits, or evidence remain placeholders.

See [Security](docs/SECURITY.md), [Deployment](docs/DEPLOYMENT.md), [Release Gates](docs/RELEASE_GATES.md), and [Disclaimer](DISCLAIMER.md).

## Devnet assets and faucets

`tPWRC` remains `TBA` until a separate Token-2022 devnet mint is created and verified. Configure it atomically with:

```bash
pnpm tpwrc:configure -- <DEVNET_MINT>
```

The native SOL faucet is separate from tPWRC. It requests exactly **2 SOL** from Solana devnet through a server-side route after wallet-proof validation and rate-limit checks.

## Documentation

- [PTK-001 documentation](https://docs.powerchain.energy/standards/ptk-001)
- [PWRC documentation](https://docs.powerchain.energy/token/pwrc)
- [Scripts](scripts/README.md)
- [Faucets](faucets/README.md)
- [Shared utilities](utils/README.md)
- [Changelog](CHANGELOG.md)

## License

Licensed under the [Apache License 2.0](LICENSE). Third-party protocols, wallets, exchanges, and DEX venues remain independent of PowerChain.
