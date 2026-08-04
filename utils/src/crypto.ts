import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { stableJson } from "./json.js";

export function sha256(value: string | Uint8Array): string {
  return createHash("sha256").update(value).digest("hex");
}

export async function sha256File(path: string): Promise<string> {
  return sha256(await readFile(path));
}

export function sha256Json(value: unknown): string {
  return sha256(stableJson(value));
}
