# PowerChain Applications

All executable and application-facing workspaces live under `apps/`. Reusable SDKs remain under `packages/`.

| Application | Package | Default port | Purpose |
|---|---|---:|---|
| Web | `@powerchain/web` | 3005 | PWRC, PowerPay, standards, wallets, developer tools, APIs, and legal pages |
| Faucet | `@powerchain/faucet` | 3015 | Standalone devnet SOL and tPWRC faucet service with debug mode |
| Client | `@powerchain/client` | — | Higher-level Node.js client and integration application for PWRC and PowerPay |

## Commands

```bash
pnpm dev:web
pnpm dev:faucet
pnpm dev:faucet:debug
pnpm build:client
pnpm typecheck:client
pnpm test:client
```

Application workspaces are discovered through `apps/*`. Legacy root `app/`, `faucets/`, and `client/` directories are rejected by the layout validator.
