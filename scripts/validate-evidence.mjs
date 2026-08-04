import { access, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const root = new URL("../", import.meta.url);
const policy = JSON.parse(await readFile(new URL("config/evidence-policy.json", root), "utf8"));
const failures = [];

async function exists(path) { try { await access(new URL(path, root)); return true; } catch { return false; } }
async function json(path) { return JSON.parse(await readFile(new URL(path, root), "utf8")); }
async function sha256(path) { return createHash("sha256").update(await readFile(new URL(path, root))).digest("hex"); }

for (const [name, rule] of Object.entries(policy.requiredEvidence)) {
  if (!(await exists(rule.path))) { failures.push(`${name}: missing ${rule.path}`); continue; }
  if (rule.attestation) {
    if (!(await exists(rule.attestation))) { failures.push(`${name}: missing ${rule.attestation}`); continue; }
    const att = await json(rule.attestation);
    for (const field of rule.requiredFields ?? []) if (!(field in att)) failures.push(`${name}: attestation missing ${field}`);
    if (att.criticalFindingsOpen !== 0) failures.push(`${name}: critical findings remain open`);
    const actual = await sha256(rule.path);
    if (att.reportSha256 !== actual) failures.push(`${name}: report SHA-256 mismatch`);
  } else {
    const data = await json(rule.path);
    if (rule.requiredStatus && data.status !== rule.requiredStatus) failures.push(`${name}: expected status ${rule.requiredStatus}, got ${data.status}`);
  }
}
if (failures.length) throw new Error(`Evidence validation failed:\n- ${failures.join("\n- ")}`);
console.log("All release evidence is present, structurally valid, and checksum-linked.");
