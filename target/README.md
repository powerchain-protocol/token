# Generated Build and Release Artifacts

`target/` is the single workspace output boundary. Program source does **not** live here.

- `cargo/` — Cargo and Rust test/build cache for every program crate
- `deploy/` — compiled Solana SBF artifacts produced by release tooling
- `idl/` — generated/synchronized IDL copies
- `checksums/` — SHA-256 release manifests
- `release/` — release-readiness reports
- `onchain/`, `supply/`, `rehearsal/` — generated evidence records

Canonical source locations:

- `programs/native-token/src/`
- `programs/native-token/idl/powerchain.json`
- `programs/powerpay/src/`

Generated contents under `target/` are ignored by Git and must not be treated as evidence of a production deployment unless separately attested.
