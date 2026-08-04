# @powerchain/faucet

Standalone, devnet-only service for native SOL and the separate tPWRC Token-2022 test profile.

## Features

- exact 2 SOL devnet airdrop policy (`2,000,000,000` lamports);
- fee-aware tPWRC transaction planning;
- wallet, amount, reserve, cluster, and rate-limit validation;
- atomic usage reservation with rollback on failure;
- hardened server-side keypair loading for tPWRC treasury operations;
- normalized routes with optional trailing slashes;
- no mainnet or production faucet behavior.

## Routes

```text
GET  /health
GET  /api/v1
GET  /api/v1/health
GET  /standard/
GET  /api/v1/standard
POST /api/v1/requests/validate
```

## Commands

```bash
pnpm --filter @powerchain/faucet build
pnpm --filter @powerchain/faucet test
pnpm --filter @powerchain/faucet start
```

The tPWRC mint remains `TBA` until a separate devnet Token-2022 mint is created and verified. Canonical PWRC is never distributed by this service.

## Debug mode

The standalone faucet includes a development-only diagnostics mode. It is disabled by default and cannot be enabled when `NODE_ENV=production`.

```bash
pnpm dev:faucet:debug
```

Open:

- `http://localhost:3015/debug`
- `GET /api/v1/debug/status`
- `GET /api/v1/debug/events`
- `POST /api/v1/debug/simulate`

Debug mode provides sanitized runtime status, dry-run request simulation, and a bounded in-memory event ring. Wallet addresses are represented only by a short SHA-256 fingerprint. It never sends funds, exposes private keys, enables mainnet execution, or executes arbitrary shell commands.

## Root-driven workflow

```bash
cd /workspaces/token
pnpm install:repair
pnpm dev:faucet
pnpm dev:faucet:debug
```

The standalone service runs on port `3015`. Debug mode is development-only, dry-run capable, and cannot activate in production.

## Dependency recovery

The development commands verify the monorepo dependency graph before starting. If `tsx`, Solana SDK packages, or workspace links are missing, the package performs a root `pnpm install --force` repair automatically.

Run commands from a valid directory. If Node reports `uv_cwd` or `process.cwd failed`, the current shell is still attached to a directory that was moved or deleted. Recover with:

```bash
cd /workspaces/token
pnpm install:clean
pnpm dev:faucet
```

Debug mode:

```bash
cd /workspaces/token
pnpm dev:faucet:debug
```
