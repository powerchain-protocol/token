import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const root = new URL("../", import.meta.url);
const inputPath = process.argv[2];
if (!inputPath) throw new Error("Usage: node scripts/record-devnet-evidence.mjs <evidence.json>");
const input = JSON.parse(await readFile(inputPath, "utf8"));

const requiredTransactions = [
  "createMint",
  "initializeMetadata",
  "mintGenesisSupply",
  "revokeMintAuthority",
  "createAssociatedTokenAccounts",
  "feeAwareTransfer",
  "burn",
  "harvestWithheldFees",
  "withdrawWithheldFees"
];
const errors = [];
if (input.cluster !== "devnet") errors.push("cluster must be devnet");
if (!input.mint || input.mint === "11111111111111111111111111111111") errors.push("valid mint is required");
if (input.decimals !== 9) errors.push("decimals must be 9");
if (input.transferFeeBasisPoints !== 250) errors.push("transfer fee must be 250 basis points");
if (input.mintAuthority !== null) errors.push("mint authority must be revoked");
for (const key of requiredTransactions) {
  const signature = input.transactions?.[key];
  if (typeof signature !== "string" || signature.length < 64) errors.push(`missing transaction signature: ${key}`);
}
if (!Array.isArray(input.extensionTypes) || !["TransferFeeConfig", "MetadataPointer", "TokenMetadata"].every(x => input.extensionTypes.includes(x))) {
  errors.push("required Token-2022 extensions are missing");
}
if (errors.length) throw new Error(`Invalid devnet evidence: ${errors.join("; ")}`);

const evidenceHash = createHash("sha256").update(JSON.stringify(input)).digest("hex");
const report = {
  status: "passed",
  cluster: "devnet",
  verifiedAt: new Date().toISOString(),
  evidenceHash,
  ...input
};
await mkdir(new URL("target/rehearsal/", root), { recursive: true });
await writeFile(new URL("target/rehearsal/devnet-report.json", root), JSON.stringify(report, null, 2) + "\n");
console.log(`Devnet evidence recorded: ${evidenceHash}`);
