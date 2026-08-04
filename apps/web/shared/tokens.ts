import { PublicKey } from "@solana/web3.js";

export const TOKEN_ADDRESSES = Object.freeze({
  pwrcMint: "PWRCRXXZxbg6FdQZfK3PMD7KP8xfxs9acvifJiG46wc",
  legacyTokenProgram: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
  token2022Program: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
  associatedTokenProgram: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
  memoProgram: "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr",
  usdcMainnetMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
} as const);

export const TOKEN_DECIMALS = Object.freeze({ SOL: 9, PWRC: 9, USDC: 6, tPWRC: 9 } as const);
export const LAMPORTS_PER_SOL = 1_000_000_000 as const;
export const PWRC_BASE_UNITS_PER_TOKEN = 1_000_000_000n;
export const PWRC_GENESIS_SUPPLY_BASE_UNITS = 18_446_000_000_000_000_000n;
export const PWRC_INITIAL_REFERENCE_PRICE_MICRO_USD = 2n;
export const PWRC_INITIAL_REFERENCE_PRICE_USD = "0.000002" as const;
export const PWRC_MINT = new PublicKey(TOKEN_ADDRESSES.pwrcMint);
