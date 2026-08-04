# PowerPay Program

PowerPay is the PPAY-001 reference settlement program for SOL, mainnet USDC, and PWRC Token-2022 payments. The crate is an experimental release candidate and does not claim a production deployment. The canonical product surface is `https://payments.powerchain.energy`, with API v1 at `https://api.powerchain.energy/api/v1`.

## Deterministic lifecycle

`Initialize → CreatePayment → Authorize → Settle → Partial/Full Refund`

Payments may also be cancelled before settlement. Every state-changing instruction uses a strictly increasing nonce. Instruction data is versioned, bounded to 128 bytes, and rejects trailing bytes.

## Accounting

- SOL: 9 decimals / lamports
- USDC: 6 decimals / legacy SPL Token Program
- PWRC: 9 decimals / SPL Token-2022
- Service fee: 200 basis points by default, governance-configurable up to 1,000 basis points
- Fee calculation: ceiling-rounded integer arithmetic
- Refund ceiling: settled net amount only

## Security boundaries

The core rejects missing signatures, non-writable accounts, invalid owners, replayed nonces, expired payments, wrong status transitions, duplicate payment initialization, and refunds beyond the net settled amount. DEX quotes and external rates are off-chain observations and never bypass signed settlement instructions.

## Commands

```bash
pnpm test:powerpay
pnpm build:powerpay
pnpm validate:powerpay
```

## Canonical endpoints

| Surface | URL | Status |
|---|---|---|
| PowerPay web | `https://payments.powerchain.energy` | Canonical product domain |
| API v1 | `https://api.powerchain.energy/api/v1` | CORS allowlisted API domain |
| Documentation | `https://docs.powerchain.energy` | Protocol and integration docs |

The program ID remains `TBA` until a verified mainnet-beta deployment is completed. Domains are service identifiers only and never substitute for on-chain program IDs or authorities.
