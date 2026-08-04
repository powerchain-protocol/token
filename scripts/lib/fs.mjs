import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import { dirname } from "node:path";

export async function exists(path) {
  try { await access(path, constants.F_OK); return true; } catch { return false; }
}

export async function readText(path) { return readFile(path, "utf8"); }

export async function readJson(path) { return JSON.parse(await readText(path)); }

export async function writeJson(path, value) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}
