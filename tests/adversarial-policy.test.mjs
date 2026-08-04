import test from "node:test"; import assert from "node:assert/strict"; import { readFile } from "node:fs/promises";
const root=new URL("../",import.meta.url); const auth=JSON.parse(await readFile(new URL("config/authorities.json",root),"utf8")); const policy=JSON.parse(await readFile(new URL("config/evidence-policy.json",root),"utf8"));
test("single-signer and hot-wallet governance are forbidden",()=>{assert.equal(auth.recommendedProductionControl.hotWalletAllowed,false);assert.equal(auth.recommendedProductionControl.threshold,"5-of-7")});
test("production is blocked without independent evidence",()=>{assert.ok(policy.requiredEvidence.programAudit);assert.ok(policy.requiredEvidence.economicPolicyAudit);assert.ok(policy.requiredEvidence.reproducibleBuild)});
