# PTK-001 native-token errors

`NativeTokenError` is the stable custom-error ABI for the PWRC native-token program.
Existing numeric codes are frozen and MUST NOT be reordered or reused. New errors
must be appended to `src/errors.rs` and covered by round-trip tests.

The Solana/Pinocchio adapter returns these values as `ProgramError::Custom(code)`.
Clients should decode the custom code through `NativeTokenError::try_from(code)`.

## Ranges

| Codes | Domain |
| --- | --- |
| 1–4 | authority and genesis |
| 5–10 | amount, supply, arithmetic, and replay |
| 11–17 | lifecycle, instruction, state, and authority validation |
| 18–20 | signer and account access |
| 21–25 | frozen Token-2022 profile |
| 26–31 | transaction account topology |
| 32–36 | fee and metadata validation |
| 37–39 | deployment, expiry, and configuration |

Only `TransactionExpired` is classified as retryable. Authorization, replay,
owner, mint, account-derivation, fee-mismatch, and configuration failures are
security-relevant and should be emitted to audit telemetry without logging secrets.
