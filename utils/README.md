# `@powerchain/utils`

Dependency-light primitives shared by PTK-001 scripts, clients, faucet services, and release tooling.

## Modules

- `assert` — typed invariant failures and exhaustive-branch protection.
- `crypto` — SHA-256 helpers for files and canonical JSON.
- `json` — typed JSON loading, deterministic serialization, and atomic-style output preparation.
- `result` — minimal `Result<T, E>` helpers for explicit failure handling.
- `solana` — base58 address checks and safe endpoint redaction.

The package intentionally contains no wallet, RPC, signing, or secret-management logic. Domain-specific behavior remains in `@powerchain/native-token-client`, `/client`, and `/faucets`.

```bash
pnpm --filter @powerchain/utils typecheck
pnpm --filter @powerchain/utils test
```

Documentation: https://docs.powerchain.energy
