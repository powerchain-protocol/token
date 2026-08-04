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

Cargo and the Solana SBF toolchain are required for Rust tests and deployable builds.
