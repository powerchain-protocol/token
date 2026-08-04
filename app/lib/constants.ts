import { PublicKey } from "@solana/web3.js";

export const APPROVED_PWRC_MINT_ADDRESS =
  "PWRCRXXZxbg6FdQZfK3PMD7KP8xfxs9acvifJiG46wc" as const;

export const APPROVED_PWRC_MINT = new PublicKey(APPROVED_PWRC_MINT_ADDRESS);

export const TOKEN_2022_PROGRAM_ADDRESS =
  "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb" as const;

export const SOLSCAN_PWRC_URL =
  `https://solscan.io/token/${APPROVED_PWRC_MINT_ADDRESS}` as const;

export const MAINNET_PROGRAM_ID =
  process.env.NEXT_PUBLIC_POWERCHAIN_MAINNET_PROGRAM_ID?.trim() || null;

export function getMainnetRpcUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SOLANA_MAINNET_RPC_URL?.trim();
  if (configured) return configured;
  if (process.env.NODE_ENV === "production") {
    throw new Error("NEXT_PUBLIC_SOLANA_MAINNET_RPC_URL is required in production.");
  }
  return "https://api.mainnet-beta.solana.com";
}

export const TPWRC_MINT_ADDRESS =
  process.env.NEXT_PUBLIC_TPWRC_MINT?.trim() || "TBA";
