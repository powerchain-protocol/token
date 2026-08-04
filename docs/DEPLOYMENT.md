# PWRC Deployment Checklist

## Pre-deployment

1. Freeze PTK-001 constants and the Token-2022 extension profile.
2. Complete Rust, TypeScript, integration, property, and adversarial tests.
3. Complete independent program and economic-policy audits.
4. Create governance-controlled fee and treasury authorities.
5. Verify metadata URIs, logo integrity, content types, and permanent hosting.
6. Build reproducibly and publish SHA-256 checksums.

## Devnet rehearsal

1. Create the Token-2022 mint with `TransferFeeConfig`, `MetadataPointer`, and `TokenMetadata`.
2. Configure 250 basis points and the approved maximum fee.
3. Issue the exact genesis test supply and revoke mint authority.
4. Test associated token accounts, fee-aware transfers, burns, harvesting, withdrawal, and explorer links.
5. Confirm wallets, custodians, exchanges, and marketplaces support Token-2022 transfer fees.

## Mainnet-beta release gate

Production deployment remains false until the final mint, program ID, audit report, governance addresses, build checksum, and incident-response ownership are published in the release manifest.
