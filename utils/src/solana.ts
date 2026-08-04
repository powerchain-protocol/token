const BASE58_ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const BASE58 = new Set(BASE58_ALPHABET);

export const SOLANA_ADDRESS_MIN_LENGTH = 32;
export const SOLANA_ADDRESS_MAX_LENGTH = 44;

export function isBase58(value: string): boolean {
  return value.length > 0 && [...value].every((character) => BASE58.has(character));
}

export function isSolanaAddress(value: string): boolean {
  return (
    value.length >= SOLANA_ADDRESS_MIN_LENGTH &&
    value.length <= SOLANA_ADDRESS_MAX_LENGTH &&
    isBase58(value)
  );
}

export function assertSolanaAddress(value: string, label = "address"): string {
  if (!isSolanaAddress(value)) throw new TypeError(`${label} must be a valid Solana base58 address`);
  return value;
}

export function redactEndpoint(raw: string): string {
  const url = new URL(raw);
  url.username = "";
  url.password = "";
  for (const key of [...url.searchParams.keys()]) {
    if (/key|token|secret|auth/i.test(key)) url.searchParams.set(key, "REDACTED");
  }
  return url.toString();
}
