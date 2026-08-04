import fs from "node:fs";
import path from "node:path";
import { REPO_ROOT } from "./lib/repo-root.mjs";

const source = path.join(REPO_ROOT, "public");
const destination = path.join(REPO_ROOT, "apps/web/public");

if (!fs.existsSync(source)) throw new Error(`Missing canonical public directory: ${source}`);
fs.rmSync(destination, { recursive: true, force: true });
fs.cpSync(source, destination, { recursive: true });
console.log("Synchronized public assets to apps/web/public.");
