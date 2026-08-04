# PowerChain Packages

Reusable TypeScript packages shared by applications, services, CI, and release tooling.

| Package | Purpose |
|---|---|
| `@powerchain/native-token-client` | Token-2022 accounts, fees, transactions, DEX/RPC adapters, and PWRC validation |
| `@powerchain/token-metadata` | Canonical metadata generation, validation, and logo URI helpers |
| `@powerchain/standards` | Dependency-free PTK-001 and PPAY-001 machine-readable profiles |

All packages use TypeScript `^7.0.2`, strict compilation, ESM exports, and exact integer monetary handling.

## Package workflow

```bash
pnpm validate:packages
pnpm typecheck
pnpm build
pnpm test
```

Reusable TypeScript code belongs under `packages/`; application-only React code belongs under `apps/web`.
