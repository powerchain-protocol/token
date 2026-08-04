# PowerChain Client

Production-safe application client for PWRC, the PTK-001 fungible Token-2022 asset.

[Documentation](https://docs.powerchain.energy) · [Solscan](https://solscan.io)

## Capabilities

- Devnet and mainnet-beta provider profiles
- Canonical PWRC mint and Token-2022 validation
- Exact 9-decimal amount handling
- 250-basis-point transfer-fee quotes
- Token-2022 associated-token-account derivation
- Fee-aware checked transfers
- Recipient account creation
- Transaction confirmation and Solscan links
- Fail-closed endpoint and placeholder validation

## Example

```ts
import { createPowerChainClient } from "@powerchain/client";

const client = createPowerChainClient({
  cluster: "devnet",
  rpcEndpoint: process.env.POWERCHAIN_RPC_HTTP!,
  wsEndpoint: process.env.POWERCHAIN_RPC_WS,
  mintAddress: process.env.PWRC_MINT_ADDRESS!,
});

const quote = client.quoteTransfer("100");
// gross: 100 PWRC, fee: 2.5 PWRC, net: 97.5 PWRC
```

A production client must use a verified PWRC mint, audited program deployment, secure secret injection, and an RPC provider appropriate for the expected request volume.
