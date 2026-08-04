import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { resolveEnvironmentFile, profileFileName } from "../scripts/lib/env-file.mjs";
import { REPO_ROOT } from "../scripts/lib/repo-root.mjs";

test("resolves committed canonical devnet profile when root dotfile is absent", async () => {
  const result = await resolveEnvironmentFile(".missing-env-devnet", "devnet");
  assert.equal(result.path, path.join(REPO_ROOT, "env", ".env.devnet"));
  assert.equal(result.source, "canonical-profile");
});

test("profile names are explicit and bounded", () => {
  assert.equal(profileFileName("devnet"), ".env.devnet");
  assert.equal(profileFileName("production"), ".env.production");
  assert.throws(() => profileFileName("localnet"));
});
