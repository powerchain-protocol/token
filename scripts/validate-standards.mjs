import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const required = [
  "packages/standards/package.json",
  "packages/standards/src/ptk-001.ts",
  "packages/standards/src/ppay-001.ts",
  "programs/native-token/src/standard.rs",
  "programs/powerpay/src/standard.rs",
  "apps/web/app/standard/page.tsx",
  "apps/web/app/api/v1/standard/route.ts",
  "apps/faucet/src/standard.ts",
];
for (const file of required) await fs.access(path.join(root, file));
const ptk = await fs.readFile(path.join(root, "packages/standards/src/ptk-001.ts"), "utf8");
const ppay = await fs.readFile(path.join(root, "packages/standards/src/ppay-001.ts"), "utf8");
const faucet = await fs.readFile(path.join(root, "apps/faucet/src/standard.ts"), "utf8");
if (!ptk.includes('transferFeeBasisPoints: 250')) throw new Error("PTK-001 fee profile drifted.");
if (!ptk.includes('decimals: 9')) throw new Error("PTK-001 decimals drifted.");
if (!ppay.includes('{ symbol: "USDC", decimals: 6')) throw new Error("PPAY-001 USDC decimal profile drifted.");
if (!ppay.includes('programId: "TBA"')) throw new Error("PowerPay must remain fail-closed before deployment.");
if (!faucet.includes('id: "PFAUCET-001"')) throw new Error("Faucet standard profile is missing.");
console.log("PowerChain standards validation passed.");
