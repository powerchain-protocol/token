import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const required = [
  "apps/web/components/logo.tsx",
  "apps/web/components/provider/wallet-provider.tsx",
  "apps/web/components/provider/wallet-context.tsx",
  "apps/web/components/ui/wallet-button.tsx",
  "apps/web/components/ui/card.tsx",
  "apps/web/components/faucet-interface.tsx",
  "apps/web/components/footer.tsx",
  "apps/web/components/header.tsx",
  "apps/web/components/hero.tsx",
  "apps/web/components/mint-account.tsx",
  "apps/web/lib/constants.ts",
  "apps/web/lib/security.ts",
  "apps/web/app/page.tsx",
  "apps/web/app/layout.tsx",
  "apps/web/app/globals.css"
];

for (const relative of required) {
  await fs.access(path.join(root, relative));
}

const constants = await fs.readFile(path.join(root, "apps/web/shared/tokens.ts"), "utf8");
const security = await fs.readFile(path.join(root, "apps/web/lib/security.ts"), "utf8");
const context = await fs.readFile(path.join(root, "apps/web/components/provider/wallet-context.tsx"), "utf8");
const faucet = await fs.readFile(path.join(root, "apps/web/components/faucet-interface.tsx"), "utf8");
const packageJson = JSON.parse(await fs.readFile(path.join(root, "apps/web/package.json"), "utf8"));

const mint = "PWRCRXXZxbg6FdQZfK3PMD7KP8xfxs9acvifJiG46wc";
const token2022 = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
if (!constants.includes(mint)) throw new Error("App is missing the canonical PWRC mint.");
if (!constants.includes(token2022)) throw new Error("App is missing the canonical Token-2022 program.");
if (!security.includes("Only the canonical PWRC mint is permitted")) throw new Error("Approved-mint guard is missing.");
if (!security.includes("cannot also be the PowerChain program ID")) throw new Error("Mint/program separation guard is missing.");
if (!context.includes("nacl.sign.detached.verify")) throw new Error("Cryptographic wallet-signature verification is missing.");
if (!context.includes("expiresAt") || !context.includes("clearAuthentication")) throw new Error("Wallet authentication expiry or wallet-change invalidation is missing.");
if (!security.includes("solana:mainnet-beta") || !security.includes("Expiration Time")) throw new Error("Wallet authentication is not bound to chain and expiration.");
if (!faucet.includes('TPWRC_MINT_ADDRESS !== "TBA"')) throw new Error("tPWRC TBA lifecycle guard is missing.");
if (packageJson.devDependencies?.typescript !== "^7.0.2") throw new Error("App must use TypeScript ^7.0.2.");

console.log("Native-token application validation passed.");
