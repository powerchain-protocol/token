/** Stable PTK-001 custom program-error decoder. */
export const PTK_001_ERROR_MESSAGES = {
  1: "the signer is not the configured authority",
  2: "genesis has already been completed",
  3: "genesis has not been completed",
  4: "post-genesis minting is prohibited by PTK-001",
  5: "the token amount is invalid",
  6: "the PTK-001 supply invariant would be violated",
  7: "checked arithmetic overflowed",
  8: "the nonce is not strictly greater than the stored nonce",
  9: "the native-token program is not active",
  10: "the requested amount exceeds available supply",
  11: "the requested lifecycle transition is invalid",
  12: "instruction data is malformed or has an invalid length",
  13: "instruction format version is unsupported",
  14: "instruction discriminator is unknown",
  15: "account data is malformed or violates state invariants",
  16: "persisted state version is unsupported",
  17: "authority is missing, unchanged, or otherwise invalid",
  18: "a required account did not sign",
  19: "a required account is not writable",
  20: "account owner does not match the expected program",
  21: "PWRC must use the canonical SPL Token-2022 program",
  22: "token decimals do not match the frozen PTK-001 value",
  23: "transfer-fee configuration does not match the frozen profile",
  24: "the mint is missing a required Token-2022 extension",
  25: "mint or freeze authority has not been revoked",
  26: "the instruction did not provide enough accounts",
  27: "an account is present in an unexpected position or role",
  28: "the same account was supplied more than once where uniqueness is required",
  29: "source and destination token accounts must be different",
  30: "the supplied mint is not the configured PWRC or tPWRC mint",
  31: "associated token account does not match the canonical derivation",
  32: "calculated or supplied transfer fee exceeds the approved maximum",
  33: "client-provided fee does not match the on-chain Token-2022 calculation",
  34: "maximum transfer fee does not match the approved profile",
  35: "metadata pointer does not target the approved mint metadata",
  36: "token metadata is missing, malformed, or inconsistent",
  37: "program address is invalid or still set to a placeholder",
  38: "transaction blockhash or validity window has expired",
  39: "runtime configuration does not match the frozen PTK-001 profile",
} as const;

export type Ptk001ErrorCode = keyof typeof PTK_001_ERROR_MESSAGES;

export class Ptk001ProgramError extends Error {
  readonly code: number;

  constructor(code: number, message = decodePtk001Error(code)) {
    super(message);
    this.name = "Ptk001ProgramError";
    this.code = code;
  }
}

export function isPtk001ErrorCode(code: number): code is Ptk001ErrorCode {
  return Number.isInteger(code) && code in PTK_001_ERROR_MESSAGES;
}

export function decodePtk001Error(code: number): string {
  if (!isPtk001ErrorCode(code)) {
    return `Unknown PTK-001 program error (${code})`;
  }
  return `PTK-001 error ${code}: ${PTK_001_ERROR_MESSAGES[code]}`;
}

/** Extracts `custom program error: 0x..` from common Solana RPC messages. */
export function parsePtk001Error(error: unknown): Ptk001ProgramError | null {
  const message = error instanceof Error ? error.message : String(error);
  const match = message.match(/custom program error:\s*(0x[0-9a-f]+|\d+)/i);
  if (!match) return null;

  const raw = match[1];
  if (raw === undefined) return null;
  const code = raw.toLowerCase().startsWith("0x")
    ? Number.parseInt(raw.slice(2), 16)
    : Number.parseInt(raw, 10);

  if (!Number.isSafeInteger(code)) return null;
  return new Ptk001ProgramError(code);
}
