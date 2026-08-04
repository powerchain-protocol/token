# PowerChain Native Token Program

<p align="center">
  <img src="../../public/assets/token/pwrc.png" alt="PowerChain PWRC token logo" width="160" height="160" />
</p>
`programs/native-token` is the experimental `1.0.0-rc.0` reference implementation of the PTK-001 PWRC monetary primitives and the Solana Token-2022 implementation profile.

## Status

- Specification: PTK-001
- Asset: PowerChain (`PWRC`)
- Decimals: `9`
- Genesis and maximum supply: `18,446,000,000 PWRC`
- Post-genesis minting: prohibited
- Target runtime: Solana SBF
- Target cluster: mainnet-beta
- Framework: Pinocchio
- Production deployment: no
- Audit: required before production

The address `11111111111111111111111111111111` is the Solana System Program and is never a valid PowerChain deployment. The PowerChain mainnet program ID remains `TBA` until a separately deployed and verified SBF program is published.

## Layout

```text
programs/native-token/
├── src/lib.rs                 # Frozen constants and fixed-supply state machine
├── src/errors.rs              # Stable 39-code program error ABI
├── src/profile.rs             # Fail-closed mainnet program profile
├── src/extensions.rs          # Token-2022 extension policy
├── src/metadata.rs            # Canonical metadata and logo URIs
├── tests/native_token.rs      # Monetary and lifecycle tests
├── idl/powerchain.json        # Experimental PTK-001 IDL
├── metadata/metaplex.json     # Metaplex-compatible off-chain metadata
├── metadata/token-2022.json   # TokenMetadata extension payload
├── scripts/validate-metadata.mjs
└── target/                      # Local reproducible build outputs only
```

## Token-2022 profile

Required extensions:

- `MetadataPointer`
- `TokenMetadata`

Optional after governance and security review:

- `TransferFeeConfig`
- `PermanentDelegate`
- `MintCloseAuthority`
- `GroupPointer`
- `GroupMemberPointer`

Planned but inactive:

- `TransferHook`
- `ConfidentialTransferMint`

Prohibited for the canonical fixed-unit PWRC profile:

- `InterestBearingConfig`
- `NonTransferable`

Extension initialization order is security-sensitive. Mint extensions must be allocated and initialized before the mint itself where required by Token-2022. A production deployment script must verify every configured authority, extension, metadata URI, mint supply, and program ID after deployment.

## Official links

- Website: `https://powerchain.energy`
- Documentation: `https://docs.powerchain.energy`
- Whitepaper: `https://whitepaper.powerchain.energy`
- X: `https://x.com/powerchain_ai`
- Telegram: `https://t.me/powerchain_official`

These links are included in the canonical, Metaplex-compatible, and Token-2022 metadata payloads.

## Metadata

- Canonical application metadata: `/public/metadata/metadata.json`
- Metaplex-compatible metadata: `/public/metadata/metaplex.json`
- Token-2022 metadata payload: `/programs/native-token/metadata/token-2022.json`
- PNG: `/public/assets/token/pwrc.png`
- SVG: `/public/assets/token/pwrc.svg`

Public metadata uses absolute production-style URIs. Deployments on another domain must rewrite and verify those URIs before mint initialization.

## Logo helpers

The React helper is located at `components/token/pwrc-logo.tsx` and exports:

- `PwrcLogo`
- `getPwrcLogoUrl`
- `PWRC_LOGO_PNG`
- `PWRC_LOGO_SVG`
- `PWRC_METADATA_URI`

## Build and test

```bash
cargo fmt --manifest-path programs/native-token/Cargo.toml -- --check
cargo test --manifest-path programs/native-token/Cargo.toml
cargo build --release --manifest-path programs/native-token/Cargo.toml
cargo build-sbf --manifest-path programs/native-token/Cargo.toml --features program,mainnet-beta
node programs/native-token/scripts/validate-metadata.mjs
```

## Security boundaries

The supply state machine is authoritative only when backed by verified Solana accounts and Token-2022 CPI execution. Helius, Birdeye, explorers, indexers, caches, and APIs are observational services and must never authorize minting, burning, supply changes, or governance transitions. Pyth feeds may support pricing or settlement policy but cannot modify the fixed-supply invariant.

Before production: replace the placeholder program address, complete independent audits, establish a timelocked multisig upgrade authority, verify reproducible SBF builds, publish checksums, run local-validator and mainnet-fork tests, and verify mint and metadata accounts from multiple independent RPC providers.
## SPL Token-2022 and Anchor clients

The Rust state machine is paired with the following workspace packages:

- `@powerchain/native-token-client` — Anchor-compatible IDL loading, deployed-program validation, Token-2022 mint checks, mint sizing, and checked burn instructions.
- `@powerchain/token-metadata` — canonical PWRC metadata and logo URI helpers.

The client depends on `@coral-xyz/anchor`, `@solana/web3.js`, `@solana/spl-token`, and `@solana/spl-token-metadata`. The program itself remains Pinocchio-based. Anchor is a client and IDL compatibility layer here, not an assertion that the Rust program uses Anchor macros.

Configuration lives under `/config`, and secret-bearing values are supplied through `.env` using `/env/.env.example` as the template.

## Canonical 2.5% transfer fee

`TransferFeeConfig` is required for the canonical PWRC Token-2022 mint profile. The configured transfer fee is `250` basis points (`2.50%`) with a default maximum fee of `1,000,000 PWRC` per transfer. The maximum fee and authorities must be verified from the live mint before signing or submitting a transaction.

Token-2022 withholds assessed fees on recipient token accounts. Withheld fees may later be harvested to the mint and withdrawn only by the configured withdraw-withheld authority. This fee flow does not issue additional tokens and must preserve the PTK-001 fixed maximum supply.

PWRC remains transferable, fungible, and tradeable. Integrators must use Token-2022-aware associated token accounts and checked-with-fee transfer instructions. Legacy SPL Token-only venues that do not support Token-2022 transfer-fee extensions are not compatible with canonical PWRC transfers.

Client helpers under `packages/native-token-client` include:

- `parsePwrcAmount` and `formatPwrcAmount` for exact 9-decimal bigint handling
- `calculateTransferFeeBaseUnits` for deterministic 2.5% fee calculation and cap handling
- `createPwrcTransferFeeConfigInstruction` for mint initialization
- `createPwrcTransferInstruction` for checked Token-2022 transfers with the expected fee
- `assertPwrcMint` for decimals, supply, mint-authority, and fee-extension verification
- `assertSolanaAddress` using `bs58`
- `PowerChainRpcClient` using `axios`


### Explorer profile

Solscan is the default public explorer. Canonical routes use `/token/{mint}`, `/account/{address}`, and `/tx/{signature}`. Mainnet-beta is the default cluster; non-mainnet links must include an explicit cluster query. Explorer output is informational and must not replace direct Token-2022 account validation.

## Solana account requirements

The PWRC mint and every PWRC token account MUST be owned by the SPL Token-2022
Program (`TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb`). Associated token
accounts MUST be derived using the wallet, Token-2022 program ID, and mint under
the Associated Token Program (`ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL`).
The legacy SPL Token Program is not a valid owner for PWRC accounts.

## Program architecture upgrade

The native-token crate now separates frozen economics from runtime plumbing:

- `instruction.rs` defines a versioned, bounded wire format with exact-length decoding.
- `state.rs` defines the stable `PWRCST01` account discriminator, state version, and exact 83-byte layout.
- `processor.rs` enforces signer, writable-account, and owner checks before state transitions.
- `token2022.rs` freezes canonical Solana program IDs, the PWRC mint, decimals, transfer-fee profile, required extensions, and revocation requirements.
- `profile.rs` exposes the deployment-independent mainnet profile and rejects placeholder, System Program, or mint-as-program addresses.
- Runtime adapters must deserialize into these pure primitives, perform Token-2022 CPI, then commit state only after every check succeeds.

### Stable state layout

| Offset | Length | Field |
| ---: | ---: | --- |
| 0 | 8 | `PWRCST01` discriminator |
| 8 | 1 | state version (`1`) |
| 9 | 32 | governance authority |
| 41 | 1 | lifecycle status |
| 42 | 16 | circulating supply base units |
| 58 | 16 | cumulative burned supply base units |
| 74 | 1 | genesis-complete flag |
| 75 | 8 | monotonic nonce |

Unknown instruction and state versions fail closed. Trailing instruction bytes are rejected.

## Stable error ABI

Program-specific failures are defined in `src/errors.rs` and documented in
[`ERRORS.md`](./ERRORS.md). Numeric discriminants are frozen: existing codes
must never be reordered or reused. Runtime adapters return them as Solana custom
program errors, while Rust clients can decode them with
`NativeTokenError::try_from(code)`.

## Security invariants

The program test suite now verifies atomic failure for unauthorized calls and invalid account preconditions, terminal deprecation behavior, supply preservation, and round-trip stability for every published custom error code. Production authority signing remains outside the program and must follow PTK-KEY-001; private key material is never stored in program accounts or instruction data.
