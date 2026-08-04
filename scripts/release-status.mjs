import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const policy = JSON.parse(await readFile(path.join(root, "config/release-policy.json"), "utf8"));
async function exists(p) { try { await access(path.join(root, p)); return true; } catch { return false; } }
const gates = [];
for (const artifact of policy.blockingArtifacts) gates.push({ artifact, present: await exists(artifact) });
for (const extra of ["target/onchain/production-mint-verification.json", "target/supply/latest-attestation.json"]) {
  gates.push({ artifact: extra, present: await exists(extra) });
}
const blocked = gates.filter((g) => !g.present);
const report = {
  version: 1,
  status: blocked.length ? "blocked" : "eligible-for-final-review",
  generatedAt: new Date().toISOString(),
  frozenProfile: policy.tokenInvariants,
  gates,
  blockingCount: blocked.length
};
await mkdir(path.join(root, "target/release"), { recursive: true });
await writeFile(path.join(root, "target/release/status.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(`Release status: ${report.status}; ${blocked.length} blocking artifact(s).`);
if (process.argv.includes("--strict") && blocked.length) process.exitCode = 1;
