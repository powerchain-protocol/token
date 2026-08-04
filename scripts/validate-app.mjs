import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const required = [
  "app/components/provider/wallet-provider.tsx",
  "app/components/provider/wallet-context.tsx",
  "app/components/ui/wallet-button.tsx",
  "app/components/ui/card.tsx",
  "app/components/faucet-interface.tsx",
  "app/components/footer.tsx",
  "app/components/header.tsx",
  "app/components/hero.tsx",
  "app/components/mint-account.tsx",
  "app/lib/constants.ts",
  "app/lib/security.ts",
  "app/app/page.tsx",
  "app/app/layout.tsx",
  "app/app/globals.css"
];

for (const relative of required) {
  await fs.access(path.join(root, relative));
}

const constants = await fs.readFile(path.join(root, "app/lib/constants.ts"), "utf8");
const security = await fs.readFile(path.join(root, "app/lib/security.ts"), "utf8");
const context = await fs.readFile(path.join(root, "app/components/provider/wallet-context.tsx"), "utf8");
const faucet = await fs.readFile(path.join(root, "app/components/faucet-interface.tsx"), "utf8");
const packageJson = JSON.parse(await fs.readFile(path.join(root, "app/package.json"), "utf8"));

const mint = "PWRCRXXZxbg6FdQZfK3PMD7KP8xfxs9acvifJiG46wc";
const token2022 = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
if (!constants.includes(mint)) throw new Error("App is missing the canonical PWRC mint.");
if (!constants.includes(token2022)) throw new Error("App is missing the canonical Token-2022 program.");
if (!security.includes("Only the canonical PWRC mint is permitted")) throw new Error("Approved-mint guard is missing.");
if (!security.includes("cannot also be the PowerChain program ID")) throw new Error("Mint/program separation guard is missing.");
if (!context.includes("nacl.sign.detached.verify")) throw new Error("Cryptographic wallet-signature verification is missing.");
if (!faucet.includes('TPWRC_MINT_ADDRESS !== "TBA"')) throw new Error("tPWRC TBA lifecycle guard is missing.");
if (packageJson.devDependencies?.typescript !== "^7.0.2") throw new Error("App must use TypeScript ^7.0.2.");

console.log("Native-token application validation passed.");
