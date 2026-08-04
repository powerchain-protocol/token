# PowerChain Native Token App

A production-oriented Next.js interface for canonical PWRC and the devnet tPWRC faucet.

## Security boundaries

- The only accepted PWRC mint is `PWRCRXXZxbg6FdQZfK3PMD7KP8xfxs9acvifJiG46wc`.
- The mint must be owned by SPL Token-2022 and use 9 decimals.
- Users authenticate by signing a human-readable, single-session nonce.
- A wallet signature authenticates the user; it does not grant protocol authority or approve a transaction.
- The mint address is never treated as a program ID, signer, or governance authority.
- Mainnet requires a managed HTTPS RPC through `NEXT_PUBLIC_SOLANA_MAINNET_RPC_URL`.
- The mainnet program ID remains `TBA` until a real deployment is verified.
- tPWRC faucet actions remain disabled while `NEXT_PUBLIC_TPWRC_MINT=TBA`.

## Components

```text
components/
├── provider/
│   ├── wallet-context.tsx
│   └── wallet-provider.tsx
├── ui/
│   ├── card.tsx
│   └── wallet-button.tsx
├── faucet-interface.tsx
├── footer.tsx
├── header.tsx
├── hero.tsx
└── mint-account.tsx
```

## Run

```bash
pnpm install
pnpm dev:app
```

The application runs at `http://localhost:3005`.

## Reliable local startup

Install dependencies once from the monorepo root, not from this directory:

```bash
cd /workspaces/token
corepack enable
corepack prepare pnpm@11.20.0 --activate
pnpm install
pnpm dev:web
```

When Node reports `uv_cwd`, the active terminal is attached to a directory that no longer exists. Open a new terminal or run `cd /workspaces/token` before invoking Node or pnpm. Use `pnpm dev:doctor` from the repository root to validate the workspace and installation before starting Next.js.

## Metadata routes

The web app publishes framework-native metadata routes:

- `/manifest.webmanifest`
- `/robots.txt`
- `/sitemap.xml`

Application icons are defined through the App Router and mirrored into `public/` for broad browser compatibility.

## Web3 icon system

The web application uses `@web3icons/react` for branded network, token, wallet, and exchange icons. Dynamic icons are isolated behind `components/web3-icon.tsx`, while the proprietary PWRC mark remains served from `/assets/token/pwrc.png`.

The header and footer share the same PowerChain lockup. Capability, liquidity, and faucet surfaces pair the PWRC mark with the relevant Web3 icon and provide a visual fallback when an upstream icon is unavailable.

## API v1 and configuration

Application routes are centralized in `lib/routes.ts`, API paths in `config/api.ts`, public runtime configuration in `config/env.ts`, and site metadata in `config/site.ts`.

OpenAPI is available at `/api/v1/swagger.yaml`; `/api` redirects to `/api/v1`.

Shared client hooks live under `hooks/` and must remain browser-only modules.
