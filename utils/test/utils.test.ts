import test from "node:test";
import assert from "node:assert/strict";
import { isSolanaAddress, redactEndpoint, sha256Json, stableJson } from "../src/index.js";

test("stableJson sorts object keys recursively", () => {
  assert.equal(stableJson({ z: 1, a: { y: 2, b: 3 } }), '{"a":{"b":3,"y":2},"z":1}');
});

test("sha256Json is deterministic", () => {
  assert.equal(sha256Json({ b: 2, a: 1 }), sha256Json({ a: 1, b: 2 }));
});

test("Solana address validation rejects punctuation", () => {
  assert.equal(isSolanaAddress("11111111111111111111111111111111"), true);
  assert.equal(isSolanaAddress("not-a-solana-address"), false);
});

test("endpoint redaction removes sensitive query values", () => {
  assert.equal(
    redactEndpoint("https://rpc.example.test/?api-key=secret&cluster=devnet"),
    "https://rpc.example.test/?api-key=REDACTED&cluster=devnet",
  );
});
