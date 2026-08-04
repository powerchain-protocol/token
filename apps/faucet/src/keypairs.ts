import { lstat, readFile } from "node:fs/promises";
import path from "node:path";
import { Keypair, PublicKey } from "@solana/web3.js";
import { FaucetError, FaucetErrorCode } from "./errors.js";

export interface LocalKeypairOptions {
  readonly repositoryRoot?: string;
  readonly expectedPublicKey?: PublicKey;
  readonly rejectRepositoryPaths?: boolean;
}

export async function loadDevnetTreasuryKeypair(
  filePath: string,
  options: LocalKeypairOptions = {},
): Promise<Keypair> {
  const resolvedPath = path.resolve(filePath);
  const repositoryRoot = path.resolve(options.repositoryRoot ?? process.cwd());
  const stats = await lstat(resolvedPath);

  if (stats.isSymbolicLink()) {
    throw new FaucetError(FaucetErrorCode.InsecureKeypair, "Treasury keypair path must not be a symbolic link.");
  }
  if (!stats.isFile()) {
    throw new FaucetError(FaucetErrorCode.InvalidKeypair, "Treasury keypair path must reference a regular file.");
  }
  if (
    options.rejectRepositoryPaths !== false
    && (resolvedPath === repositoryRoot || resolvedPath.startsWith(`${repositoryRoot}${path.sep}`))
  ) {
    throw new FaucetError(FaucetErrorCode.InsecureKeypair, "Treasury keypair must be stored outside the repository.");
  }

  if (process.platform !== "win32" && (stats.mode & 0o077) !== 0) {
    throw new FaucetError(FaucetErrorCode.InsecureKeypair, "Treasury keypair permissions must be 0600 or stricter.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(await readFile(resolvedPath, "utf8"));
  } catch (cause) {
    throw new FaucetError(FaucetErrorCode.InvalidKeypair, "Treasury keypair is not valid JSON.", false, cause);
  }

  if (!Array.isArray(parsed) || parsed.length !== 64 || parsed.some((byte) => !Number.isInteger(byte) || byte < 0 || byte > 255)) {
    throw new FaucetError(FaucetErrorCode.InvalidKeypair, "Treasury keypair must contain exactly 64 integer bytes.");
  }

  let keypair: Keypair;
  try {
    keypair = Keypair.fromSecretKey(Uint8Array.from(parsed));
  } catch (cause) {
    throw new FaucetError(FaucetErrorCode.InvalidKeypair, "Treasury keypair failed cryptographic validation.", false, cause);
  }

  if (options.expectedPublicKey && !keypair.publicKey.equals(options.expectedPublicKey)) {
    throw new FaucetError(FaucetErrorCode.KeypairMismatch, "Treasury keypair does not match TPWRC_FAUCET_TREASURY_OWNER.");
  }

  return keypair;
}
