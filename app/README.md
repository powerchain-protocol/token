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
