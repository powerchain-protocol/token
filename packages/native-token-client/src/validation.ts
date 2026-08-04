import { PublicKey } from "@solana/web3.js";
import {
  PWRC_GENESIS_SUPPLY_BASE_UNITS,
  PWRC_MAX_TRANSFER_FEE_BASE_UNITS,
  PWRC_TRANSFER_FEE_BASIS_POINTS,
} from "./constants.js";

export const MAX_SOURCE_ACCOUNTS_PER_INSTRUCTION = 24 as const;
export const MAX_RPC_METHOD_LENGTH = 64 as const;

export function assertPositiveBaseUnits(value: bigint, field = "amount"): void {
  if (value <= 0n) throw new RangeError(`${field} must be greater than zero.`);
  if (value > PWRC_GENESIS_SUPPLY_BASE_UNITS) {
    throw new RangeError(`${field} exceeds the PTK-001 maximum supply.`);
  }
}

export function assertTransferFeePolicy(input: {
  readonly basisPoints: number;
  readonly maximumFeeBaseUnits: bigint;
}): void {
  if (!Number.isSafeInteger(input.basisPoints)) {
    throw new TypeError("Transfer fee basis points must be a safe integer.");
  }
  if (input.basisPoints !== PWRC_TRANSFER_FEE_BASIS_POINTS) {
    throw new RangeError(
      `Canonical PWRC transfer fee must be ${PWRC_TRANSFER_FEE_BASIS_POINTS} basis points.`,
    );
  }
  if (input.maximumFeeBaseUnits < 0n) {
    throw new RangeError("Maximum transfer fee cannot be negative.");
  }
  if (input.maximumFeeBaseUnits > PWRC_MAX_TRANSFER_FEE_BASE_UNITS) {
    throw new RangeError("Maximum transfer fee exceeds the canonical PWRC cap.");
  }
}

export function assertDistinctPublicKeys(
  keys: readonly PublicKey[],
  field = "accounts",
): void {
  const encoded = keys.map((key) => key.toBase58());
  if (new Set(encoded).size !== encoded.length) {
    throw new Error(`${field} must not contain duplicate public keys.`);
  }
}

export function assertBoundedPublicKeys(
  keys: readonly PublicKey[],
  field = "accounts",
  maximum = MAX_SOURCE_ACCOUNTS_PER_INSTRUCTION,
): void {
  if (keys.length === 0) throw new RangeError(`${field} cannot be empty.`);
  if (keys.length > maximum) {
    throw new RangeError(`${field} cannot contain more than ${maximum} entries.`);
  }
  assertDistinctPublicKeys(keys, field);
}

export function assertDifferentPublicKeys(
  left: PublicKey,
  right: PublicKey,
  message: string,
): void {
  if (left.equals(right)) throw new Error(message);
}

export function assertRpcMethod(method: string): void {
  if (!/^[A-Za-z][A-Za-z0-9]{0,63}$/.test(method)) {
    throw new TypeError(
      `Invalid Solana RPC method. Expected 1-${MAX_RPC_METHOD_LENGTH} alphanumeric characters.`,
    );
  }
}

export function assertHttpEndpoint(endpoint: string): URL {
  let parsed: URL;
  try {
    parsed = new URL(endpoint);
  } catch {
    throw new TypeError("RPC endpoint must be a valid absolute URL.");
  }
  if (parsed.protocol !== "https:" && parsed.hostname !== "localhost" && parsed.hostname !== "127.0.0.1") {
    throw new Error("RPC endpoint must use HTTPS except for localhost development.");
  }
  if (parsed.username || parsed.password) {
    throw new Error("RPC credentials must not be embedded in the endpoint URL.");
  }
  return parsed;
}
