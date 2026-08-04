import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
const root = path.resolve(import.meta.dirname, "..");
const files = [
  "programs/native-token/idl/powerchain.json",
  "public/metadata/metadata.json",
  "public/metadata/metaplex.json",
  "public/assets/token/pwrc.png",
  "public/assets/token/pwrc.svg",
];
const lines=[];
for (const file of files) {
  const bytes=await readFile(path.join(root,file));
  lines.push(`${createHash("sha256").update(bytes).digest("hex")}  ${file}`);
}
await mkdir(path.join(root,"target/checksums"),{recursive:true});
await writeFile(path.join(root,"target/checksums/SHA256SUMS"),lines.join("\n")+"\n");
console.log("Release checksums generated.");
