# Independent Audit Evidence

This directory intentionally contains **no self-issued audit approval**. Production requires two independent engagements:

1. `audits/program/FINAL_REPORT.pdf` — Rust/Pinocchio, Token-2022 CPI, authority, replay, arithmetic, account-validation, and upgrade-control audit.
2. `audits/economic-policy/FINAL_REPORT.pdf` — PTK-001 supply, 250 bps fee, maximum fee, treasury flows, governance, market-integrity, and disclosure audit.

Each report must identify the auditor, scope, commit SHA, frozen-profile SHA-256, findings, remediation status, and signed final opinion. The release gate fails until both externally produced reports exist. Placeholder or internally authored reports are not acceptable.
