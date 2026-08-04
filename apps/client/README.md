# @powerchain/client

Higher-level PowerChain integration client for PWRC, PowerPay, Token-2022, and Solana application workflows. The workspace lives under `apps/client` because it is an executable integration surface rather than a low-level reusable SDK.

## Responsibilities

- environment-aware mainnet-beta and devnet configuration;
- canonical PWRC Token-2022 mint and account validation;
- exact SOL, USDC, and PWRC amount handling;
- transfer preparation and fee-aware settlement helpers;
- Solscan links and finalized RPC verification;
- fail-closed keypair and deployment policy checks.

Low-level reusable APIs remain in `@powerchain/native-token-client` under `packages/native-token-client`.

## Commands

Run from the monorepo root:

```bash
pnpm install:repair
pnpm typecheck:client
pnpm build:client
pnpm test:client
```

Direct package commands are also supported:

```bash
pnpm --filter @powerchain/client typecheck
pnpm --filter @powerchain/client build
pnpm --filter @powerchain/client test
```

The package compiles `@powerchain/standards` and `@powerchain/native-token-client` before its own build and typecheck steps.
