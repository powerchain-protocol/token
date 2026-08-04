# PowerChain PWRC Native Token Workspace

<p align="center">
  <img src="public/assets/token/pwrc.png" alt="PowerChain PWRC token logo" width="160" height="160" />
</p>

Release-candidate implementation of **PTK-001**, the PowerChain native PWRC economic and Token-2022 profile. The workspace contains the Pinocchio Rust program, TypeScript clients, metadata, devnet tPWRC faucet, release tooling, validation, and audit evidence gates.

> **Status:** experimental reference implementation. Production activation remains blocked until independent audits, governance ceremonies, reproducible-build evidence, finalized deployment verification, permanent-hosting checks, and compatibility sign-offs pass.

## Canonical profile

| Property | PWRC | tPWRC |
| --- | --- | --- |
| Purpose | Canonical PowerChain asset | Devnet test asset |
| Cluster | mainnet-beta target | devnet only |
| Decimals | `9` | `9` |
| Token program | SPL Token-2022 | SPL Token-2022 |
| Transfer fee | `250` bps (`2.5%`) | `250` bps (`2.5%`) |
| Required extensions | TransferFeeConfig, MetadataPointer, TokenMetadata | Same test profile |
| Mint | `PWRCRXXZxbg6FdQZfK3PMD7KP8xfxs9acvifJiG46wc` | `TBA` — created later as a separate devnet Token-2022 mint |

Canonical Token-2022 program:

```text
TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
```

## Workspace

```text
programs/native-token/       Pinocchio Rust program and stable ABI
packages/native-token-client Token-2022, fee, account, RPC and explorer client
packages/token-metadata/     Canonical metadata helpers
client/                      Application-facing PWRC client
faucets/                     Policy-enforced devnet tPWRC faucet
utils/                       Shared dependency-light TypeScript utilities
config/                      Frozen profiles, authorities and release policy
scripts/                     Validation, rehearsal and release tooling
tests/                       Workspace security and policy tests
public/                      Hosted logo and metadata assets
docs/                        Deployment, security and release runbooks
```

## Setup

```bash
corepack enable
corepack prepare pnpm@11.20.0 --activate
pnpm install
pnpm scripts:list
```

Node `24.14.0+`, pnpm `11.18.0+`, Rust, and the Solana/Anza SBF toolchain are expected for the complete build matrix.

## Common commands

```bash
pnpm check:quick          # deterministic validation and Node policy tests
pnpm check:all            # typecheck, tests, validation and security checks
pnpm validate:workspace   # synchronized IDL, frozen profile, config, faucet, assets, metadata
pnpm test:program:rust    # Rust unit, property and adversarial tests
pnpm build:program:sbf    # Pinocchio Solana SBF build
pnpm check:faucets        # tPWRC faucet typecheck and tests
pnpm prepare:release      # SHA-256 checksum generation
pnpm release:status       # consolidated readiness report
```

## Token behavior

PWRC and tPWRC are transferable, fungible Token-2022 assets. Transfers use checked-with-fee instructions. The configured fee is withheld by Token-2022; it does not mint supply or weaken the PTK-001 fixed-supply invariant.

The client includes:

- exact `bigint` parsing and formatting for 9 decimals;
- gross, fee, and net quotes;
- net-to-gross fee calculation;
- canonical Token-2022 ATA derivation;
- idempotent ATA creation;
- checked fee-aware transfers and burns;
- withheld-fee harvesting and authority-controlled withdrawal;
- legacy and v0 transaction builders with compute-budget controls;
- Solscan-default token, account, transaction, and block links.

## Program and account safety

The Rust program defines versioned instruction and state codecs, stable error codes, signer/writable/owner checks, monotonic nonces, supply invariants, governance authority rotation, pause/resume, deprecation, and a frozen Token-2022 mint profile.

Canonical Solana programs are maintained in `config/programs.json`. The legacy SPL Token Program is exposed only for detection and interoperability; PWRC accounts must be owned by Token-2022.

## Devnet faucet

The [`/faucets`](./faucets/) package distributes only tPWRC on devnet from a pre-funded treasury. It rejects production clusters, canonical PWRC, incorrect program ownership, policy-limit violations, and insufficient treasury reserve.

```bash
pnpm validate:faucet
pnpm check:faucets
```

## Validation and release assurance

```bash
pnpm validate:devnet
pnpm health:devnet
pnpm verify:onchain:devnet
pnpm attest:supply:devnet
pnpm rehearsal:devnet:plan
pnpm validate:evidence
pnpm release:gate
```

The production gate validates evidence content and hashes, not just file presence. Missing audits, unresolved critical findings, mismatched reproducible builds, incomplete governance ceremonies, failed hosting verification, or unapproved compatibility evidence block release.

## Environment profiles

- `.env.devnet` — tPWRC rehearsal and devnet integrations.
- `.env.production` — guarded mainnet-beta profile; placeholders intentionally fail validation.
- `.env.example` — safe local template.

Secrets must be injected through a secret manager. Never commit keypairs, seed phrases, RPC/API credentials, or governance signer material.

## Documentation

- Documentation: https://docs.powerchain.energy
- PWRC: https://docs.powerchain.energy/token/pwrc
- PTK-001: https://docs.powerchain.energy/standards/ptk-001
- Security: [`docs/SECURITY.md`](docs/SECURITY.md)
- Deployment: [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)
- Devnet rehearsal: [`docs/DEVNET_REHEARSAL.md`](docs/DEVNET_REHEARSAL.md)
- Release gates: [`docs/RELEASE_GATES.md`](docs/RELEASE_GATES.md)
- Script catalog: [`scripts/README.md`](scripts/README.md)
- Shared utilities: [`utils/README.md`](utils/README.md)

## Official links

- Website: https://powerchain.energy
- Documentation: https://docs.powerchain.energy
- Whitepaper: https://whitepaper.powerchain.energy
- X: https://x.com/powerchain_ai
- Telegram: https://t.me/powerchain_official

Licensed under Apache-2.0.

## Key management

PTK-KEY-001 prohibits production JSON keypair files. Production authorities must use governance multisig, HSM/KMS, hardware-wallet, or isolated-signer controls. Devnet keypairs are allowed only outside the repository with `0600` permissions and public-key matching.

```bash
pnpm security:keys
pnpm validate:keypairs:devnet
pnpm validate:keypairs:production
```
## TypeScript 7 and mainnet integrations

The workspace targets TypeScript `^7.0.2`. Canonical metadata is generated from `config/metadata.source.json` so public JSON, Metaplex metadata, and Token-2022 metadata remain synchronized.

```bash
pnpm metadata:generate
pnpm metadata:check
pnpm mainnet:check
```

Mainnet integrations are observational boundaries: Helius supplies RPC/DAS reads, Birdeye supplies market data, Pyth Hermes supplies approved price-feed observations, and Solscan is the default explorer. None of these providers may mutate or redefine PTK-001 supply accounting.


## tPWRC mint status

The tPWRC devnet mint is intentionally **TBA**. `TPWRC_MINT=TBA` is a non-address sentinel and must be replaced only after a dedicated Token-2022 mint is created on Solana devnet and verified against the frozen test profile. The faucet remains disabled until that replacement is complete. The canonical PWRC mint must never be reused for tPWRC.

### Configure the tPWRC devnet mint

After creating the separate Token-2022 devnet mint, synchronize it atomically:

```bash
pnpm tpwrc:configure -- <DEVNET_MINT>
```

This updates both devnet environment files, the tPWRC profile, and the faucet profile. It rejects the canonical PWRC mint and keeps the faucet disabled until the mint is independently verified on-chain.

## Latest safety upgrade

The faucet now treats transaction submission and allowance accounting as one
recoverable operation: previews never consume allowance, failed submissions
restore the reservation, Solana preflight remains enabled, and retries are
bounded. Production faucet deployments must replace the development in-memory
store with an atomic distributed implementation.

The Rust program lifecycle also now requires completed genesis before pause or
resume, rejects no-op authority rotations, and rejects completed states that
remain marked `GenesisPending`.

## Native-token web application

The workspace now includes `app/`, a light-first wallet and faucet interface using white, light gray, dark green, onyx, and black. It provides a wallet-provider popup, cryptographically verified wallet sign-in, canonical PWRC mint-account verification, Solscan links, and a tPWRC faucet interface that remains disabled while the devnet mint is `TBA`.

```bash
pnpm dev:app
pnpm build:app
pnpm validate:mainnet-program
```

The only approved canonical asset mint is `PWRCRXXZxbg6FdQZfK3PMD7KP8xfxs9acvifJiG46wc`. This address is a Token-2022 mint account—not a wallet authority and not a PowerChain program ID. Mainnet authority remains governance-controlled through separate multisig and timelock accounts.
