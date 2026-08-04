# @powerchain/native-token-client

Typed SPL Token-2022 primitives for canonical PWRC and devnet tPWRC.

Includes exact decimal conversion, transfer-fee handlers, associated-token-account helpers, transaction builders, explorer URLs, metadata validation, DEX discovery clients, and mainnet provider adapters.

```bash
pnpm --filter @powerchain/native-token-client build
pnpm --filter @powerchain/native-token-client typecheck
```

PWRC uses 9 decimals and a frozen 250-basis-point Token-2022 transfer-fee profile. External market and RPC providers are observational and never authoritative for supply accounting.

## Dependency boundary

This package directly declares every external module imported by its source, including Anchor, Solana Web3, SPL Token, Axios, and bs58. Its build and typecheck preflight verifies those modules before invoking TypeScript, preventing a missing installation from surfacing as dozens of unrelated compiler errors.

```bash
cd /workspaces/token
pnpm install:clean
pnpm --filter @powerchain/native-token-client build
```
