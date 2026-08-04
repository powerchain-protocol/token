# PWRC Devnet Rehearsal

The rehearsal is a mandatory, evidence-producing release gate. It does not use the mainnet genesis allocation. Use a clearly labelled test mint and record every transaction signature.

## Sequence

1. Create a Token-2022 mint owned by `TokenzQd...PxuEb` with `TransferFeeConfig`, `MetadataPointer`, and `TokenMetadata` allocated before mint initialization.
2. Set decimals to 9, transfer fee to exactly 250 basis points, and maximum fee to 1,000,000 PWRC base-unit equivalent.
3. Set fee-configuration and withheld-withdraw authorities to separate governance-controlled roles.
4. Mint the exact configured devnet test supply, verify it, then permanently revoke mint authority. Keep freeze authority null.
5. Create sender, recipient, treasury, and fee-vault ATAs using Token-2022 in the ATA seeds.
6. Test fee-aware transfers at boundary amounts: 1 base unit, below-cap fee, exact-cap fee, above-cap fee, full balance, insufficient balance, wrong decimals, stale expected fee, wrong token program, duplicate accounts, and replay attempts.
7. Burn tokens and prove `live supply + burned supply = issued supply` in the rehearsal ledger.
8. Harvest withheld fees from recipient accounts to the mint; withdraw only through the governance withdrawal authority to the treasury ATA.
9. Verify Solscan token/account/transaction links and capture screenshots or machine-readable API evidence.
10. Run the compatibility matrix. A product is confirmed only after its exact send/deposit/withdraw/swap path succeeds with correct net accounting.

Run `pnpm rehearsal:devnet:plan` to create the blocked/readiness report. Live chain execution requires funded devnet keys and explicit environment values.
