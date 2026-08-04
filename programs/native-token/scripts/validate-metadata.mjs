import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../../..");
const files = [
  "public/metadata/metadata.json",
  "public/metadata/metaplex.json",
  "programs/native-token/metadata/token-2022.json",
  "programs/native-token/idl/powerchain.json",
];

for (const relativePath of files) {
  const value = JSON.parse(await readFile(resolve(root, relativePath), "utf8"));
  if (!value || typeof value !== "object") throw new Error(`${relativePath} must contain a JSON object`);
  console.log(`validated ${relativePath}`);
}
