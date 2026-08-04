import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const canonicalIdl = path.join(root, "programs/native-token/idl/powerchain.json");
const targets = [
  path.join(root, "target/idl/powerchain.json"),
  path.join(root, "apps/web/public/idl/powerchain.json"),
];

for (const destination of targets) {
  await mkdir(path.dirname(destination), { recursive: true });
  await copyFile(canonicalIdl, destination);
}

console.log("IDL outputs synchronized from programs/native-token/idl/powerchain.json.");
