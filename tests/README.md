# Package Tests

Run the package-level metadata and IDL tests with:

```bash
node --test tests/*.test.mjs
node scripts/validate-assets.mjs
```

Rust program tests remain under `programs/native-token/tests/`.

## Test entry points

```bash
pnpm check:quick
pnpm test
pnpm check:all
```

Root regression tests are deterministic and do not imply a deployed, audited, or production-ready program.
