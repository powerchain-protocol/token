# PowerChain Mainnet Program Profile

This directory defines the deployment boundary for the future PowerChain mainnet program. It does **not** claim that a program has been deployed.

## Canonical asset

- PWRC mint: `PWRCRXXZxbg6FdQZfK3PMD7KP8xfxs9acvifJiG46wc`
- Token program: SPL Token-2022
- Mainnet program ID: configured through `POWERCHAIN_MAINNET_PROGRAM_ID` / `NEXT_PUBLIC_POWERCHAIN_MAINNET_PROGRAM_ID`

The PWRC mint is an asset account and MUST NOT be reused as a program ID or wallet authority.

## Authority model

Program upgrades, transfer-fee configuration, withheld-fee withdrawal, treasury operations, and metadata updates require separate governance-controlled authorities. The UI authenticates users through wallet signatures but never grants protocol authority based on a connected wallet address.
