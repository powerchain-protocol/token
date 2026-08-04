# PWRC Security Policy

PWRC is an experimental PTK-001 reference implementation. It is not production-ready until the deployed binaries, mint configuration, authorities, metadata, and integration clients have completed independent review.

## Mandatory production controls

- Revoke the genesis mint authority after the exact fixed supply is issued.
- Keep freeze authority disabled for the canonical transferable profile.
- Place fee authorities behind the approved governance multisig and timelock.
- Separate fee collection, treasury custody, deployment, and upgrade roles.
- Verify Token-2022 program ownership, decimals, extensions, supply, and live fee epochs before constructing transfers.
- Simulate transactions and display gross amount, fee, and net amount before signature.
- Never trust Solscan, Helius, Birdeye, or other indexers as monetary authority.
- Test withheld-fee harvesting and withdrawal with multisig signers on devnet.
- Publish reproducible build checksums and the final program and mint addresses.

## Reporting

Do not disclose suspected vulnerabilities publicly before coordinated review. Use the security contact published at https://docs.powerchain.energy/security.

## Validation gates

The release pipeline MUST reject a candidate when any of the following is true:

- PWRC decimals are not exactly `9`.
- Genesis or maximum supply differs from `18,446,000,000 PWRC`.
- The Token-2022 transfer fee differs from `250` basis points.
- The configured maximum fee exceeds `1,000,000 PWRC`.
- Mint or freeze authority remains active after genesis finalization.
- Transfer-fee authorities are missing, duplicated, or assigned to an unapproved hot wallet.
- Required extensions are missing or `NonTransferable` is enabled.
- IDL, metadata, public assets, and configuration disagree.
- A production manifest still contains the System Program placeholder address.
- RPC endpoints use insecure transport outside localhost.

## Client-side safeguards

The TypeScript client validates positive bounded amounts, exact decimal precision,
canonical fee policy, distinct transfer accounts, bounded fee-harvest account lists,
unique multisig signers, HTTPS RPC endpoints, JSON-RPC response IDs, response size,
timeouts, cancellation, and limited retries. These checks supplement on-chain
validation and MUST NOT be treated as a replacement for it.

## Operational controls

Production fee withdrawal SHOULD require the documented 5-of-7 governance
multisig and a minimum 48-hour timelock. Fee withdrawals MUST be auditable and
reconciled against Token-2022 withheld balances. API keys, RPC credentials, and
signing material MUST never be committed to source control or embedded in public
client bundles.
