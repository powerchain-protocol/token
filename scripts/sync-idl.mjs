import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";
const root = path.resolve(import.meta.dirname, "..");
await mkdir(path.join(root, "target/idl"), { recursive: true });
await copyFile(path.join(root, "idl/powerchain.json"), path.join(root, "programs/native-token/idl/powerchain.json"));
await copyFile(path.join(root, "idl/powerchain.json"), path.join(root, "target/idl/powerchain.json"));
console.log("IDL copies synchronized.");
