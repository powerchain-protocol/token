import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);

test("evidence policy includes independent audits and operational evidence", async () => {
  const policy = JSON.parse(await readFile(new URL("config/evidence-policy.json", root), "utf8"));
  const keys = Object.keys(policy.requiredEvidence);
  for (const required of ["programAudit", "economicPolicyAudit", "devnetRehearsal", "hosting", "compatibility", "reproducibleBuild", "authorityCeremony"]) {
    assert.ok(keys.includes(required), `missing ${required}`);
  }
});

test("authority rotation requires timelock, quorum, simulation, rollback and verification", async () => {
  const policy = JSON.parse(await readFile(new URL("config/authority-rotation.json", root), "utf8"));
  assert.equal(policy.timelockHours, 48);
  assert.equal(policy.minimumApprovals, 5);
  assert.equal(policy.totalSigners, 7);
  assert.equal(policy.requirements.simulationRequired, true);
  assert.equal(policy.requirements.rollbackPlanRequired, true);
  assert.equal(policy.requirements.postExecutionVerificationRequired, true);
});
