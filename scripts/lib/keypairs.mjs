import fs from "node:fs";
import path from "node:path";

export class KeypairPolicyError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "KeypairPolicyError";
    this.code = code;
  }
}

export function validateSecretKeyArray(value) {
  if (!Array.isArray(value) || value.length !== 64) {
    throw new KeypairPolicyError("KEYPAIR_LENGTH", "Solana keypair JSON must contain exactly 64 bytes.");
  }
  for (const byte of value) {
    if (!Number.isInteger(byte) || byte < 0 || byte > 255) {
      throw new KeypairPolicyError("KEYPAIR_BYTE", "Solana keypair JSON contains an invalid byte.");
    }
  }
  return Uint8Array.from(value);
}

export function inspectKeypairPath(filePath, options = {}) {
  const resolved = path.resolve(filePath);
  const repoRoot = path.resolve(options.repoRoot ?? process.cwd());
  const stats = fs.lstatSync(resolved);

  if (stats.isSymbolicLink()) {
    throw new KeypairPolicyError("KEYPAIR_SYMLINK", "Keypair path must not be a symbolic link.");
  }
  if (!stats.isFile()) {
    throw new KeypairPolicyError("KEYPAIR_NOT_FILE", "Keypair path must reference a regular file.");
  }
  if (options.rejectRepositoryPaths !== false && (resolved === repoRoot || resolved.startsWith(`${repoRoot}${path.sep}`))) {
    throw new KeypairPolicyError("KEYPAIR_IN_REPOSITORY", "Keypair files must be stored outside the repository.");
  }

  if (process.platform !== "win32") {
    const mode = stats.mode & 0o777;
    if ((mode & 0o077) !== 0) {
      throw new KeypairPolicyError("KEYPAIR_PERMISSIONS", `Keypair file permissions must be 0600 or stricter; observed ${mode.toString(8).padStart(4, "0")}.`);
    }
  }

  return Object.freeze({ resolvedPath: resolved, size: stats.size });
}

export function readSecretKeyFile(filePath, options = {}) {
  const inspection = inspectKeypairPath(filePath, options);
  const source = fs.readFileSync(inspection.resolvedPath, "utf8");
  let parsed;
  try {
    parsed = JSON.parse(source);
  } catch {
    throw new KeypairPolicyError("KEYPAIR_JSON", "Keypair file is not valid JSON.");
  }
  return validateSecretKeyArray(parsed);
}

export function redactKeypairPath(filePath) {
  if (!filePath) return "<unset>";
  return `<redacted>/${path.basename(filePath)}`;
}
