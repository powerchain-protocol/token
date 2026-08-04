# PowerChain tPWRC Faucet

The faucet distributes **tPWRC**, the isolated PowerChain test token, on Solana devnet. It never mints or distributes canonical PWRC and refuses production clusters.

## Profile

| Property | Value |
| --- | --- |
| Asset | PowerChain Test Token |
| Symbol | `tPWRC` |
| Cluster | Solana devnet |
| Program | SPL Token-2022 |
| Decimals | `9` |
| Transfer fee | `250` basis points (`2.5%`) |
| Production enabled | No |

## Package structure

```text
faucets/
├── config/tpwrc-faucet.json
├── src/
│   ├── accounts.ts       # Token-2022 ATA derivation and validation
│   ├── errors.ts         # Stable faucet service errors
│   ├── policy.ts         # Request, reserve, cluster, and asset rules
│   ├── rate-limit.ts     # Per-wallet window and daily enforcement
│   ├── service.ts        # Quote and transaction orchestration
│   └── transactions.ts   # Fee-aware checked transfer plans
└── test/policy.test.ts
```

## Security model

- The treasury signer is server-side and supplied through an isolated signer or secret manager.
- Distribution comes from a pre-funded tPWRC treasury; the faucet does not hold mint authority.
- Recipient associated token accounts are created idempotently under Token-2022.
- Transfers use checked-with-fee instructions and expose gross, fee, and net amounts.
- Simulation and confirmed commitment are required by policy.
- Logs should store a recipient hash, request ID, amount, result, and transaction signature—not private keys or raw credentials.
- Canonical PWRC mint addresses and all production clusters are rejected.

## Default limits

| Limit | Default |
| --- | ---: |
| Per request | `1,000 tPWRC` |
| Maximum request | `5,000 tPWRC` |
| Per-wallet daily limit | `10,000 tPWRC` |
| Requests per hour | `3` |
| Minimum treasury reserve | `1,000,000 tPWRC` |

## Environment

```env
TPWRC_MINT=
TPWRC_FAUCET_ENABLED=true
TPWRC_FAUCET_TREASURY_OWNER=
TPWRC_FAUCET_TREASURY_KEYPAIR_PATH=
TPWRC_FAUCET_DEFAULT_AMOUNT=1000
TPWRC_FAUCET_MAX_AMOUNT=5000
TPWRC_FAUCET_DAILY_LIMIT=10000
TPWRC_FAUCET_MINIMUM_RESERVE=1000000
```

Never expose `TPWRC_FAUCET_TREASURY_KEYPAIR_PATH` or signer material to browser code.

## Commands

```bash
pnpm validate:faucet
pnpm build:faucets
pnpm test:faucets
pnpm check:faucets
```

## Example

```ts
const quote = await faucet.quote({
  recipient: walletAddress,
  amount: "1000",
});

// grossAmount: "1000"
// feeAmount: "25"
// netAmount: "975"
```

Documentation: https://docs.powerchain.energy
