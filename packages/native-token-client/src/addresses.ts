import bs58 from "bs58";
import { PublicKey } from "@solana/web3.js";

export function decodeBase58Address(address: string): Uint8Array {
  const decoded = bs58.decode(address);
  if (decoded.length !== 32) {
    throw new RangeError("A Solana public key must decode to exactly 32 bytes.");
  }
  return decoded;
}

export function encodeBase58Address(bytes: Uint8Array): string {
  if (bytes.length !== 32) {
    throw new RangeError("A Solana public key must contain exactly 32 bytes.");
  }
  return bs58.encode(bytes);
}

export function assertSolanaAddress(address: string): PublicKey {
  decodeBase58Address(address);
  return new PublicKey(address);
}
