import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const required = [
  "public/assets/token/pwrc.png",
  "public/assets/token/pwrc.svg",
  "public/metadata/metadata.json",
  "public/metadata/metaplex.json",
  "programs/native-token/metadata/token-2022.json",
  "programs/native-token/idl/powerchain.json",
];
for (const file of required) await access(path.join(root, file), constants.R_OK);

const metadata = JSON.parse(await readFile(path.join(root, "public/metadata/metadata.json"), "utf8"));
const expected = {
  website: "https://powerchain.energy",
  whitepaper: "https://whitepaper.powerchain.energy",
  x: "https://x.com/powerchain_ai",
  telegram: "https://t.me/powerchain_official",
};
if (metadata.website !== expected.website || metadata.whitepaper !== expected.whitepaper) throw new Error("Canonical website metadata mismatch");
if (metadata.socials?.x !== expected.x || metadata.socials?.telegram !== expected.telegram) throw new Error("Canonical social metadata mismatch");
if (metadata.symbol !== "PWRC" || metadata.properties?.specification !== "PTK-001") throw new Error("PWRC identity metadata mismatch");
console.log("PWRC assets and metadata are valid.");
