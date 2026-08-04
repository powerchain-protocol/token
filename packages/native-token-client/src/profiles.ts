import { PublicKey } from "@solana/web3.js";
import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import {
  PWRC_DECIMALS,
  PWRC_MAX_TRANSFER_FEE_BASE_UNITS,
  PWRC_TRANSFER_FEE_BASIS_POINTS,
} from "./constants.js";

export type PwrcNetworkProfileId = "production" | "devnet-test";

export interface PwrcTokenProfile {
  readonly id: PwrcNetworkProfileId;
  readonly cluster: "mainnet-beta" | "devnet";
  readonly name: string;
  readonly symbol: "PWRC" | "tPWRC";
  readonly ticker: "PWRC" | "tPWRC";
  readonly decimals: typeof PWRC_DECIMALS;
  readonly tokenProgramId: PublicKey;
  readonly mint: PublicKey | null;
  readonly transferFeeBasisPoints: typeof PWRC_TRANSFER_FEE_BASIS_POINTS;
  readonly maximumTransferFeeBaseUnits: bigint;
  readonly production: boolean;
}

export const PWRC_PRODUCTION_PROFILE: PwrcTokenProfile = Object.freeze({
  id: "production",
  cluster: "mainnet-beta",
  name: "PowerChain",
  symbol: "PWRC",
  ticker: "PWRC",
  decimals: PWRC_DECIMALS,
  tokenProgramId: TOKEN_2022_PROGRAM_ID,
  mint: new PublicKey("PWRCRXXZxbg6FdQZfK3PMD7KP8xfxs9acvifJiG46wc"),
  transferFeeBasisPoints: PWRC_TRANSFER_FEE_BASIS_POINTS,
  maximumTransferFeeBaseUnits: PWRC_MAX_TRANSFER_FEE_BASE_UNITS,
  production: true,
});

/**
 * Devnet-only Token-2022 test profile. The mint is intentionally supplied by
 * deployment configuration so tPWRC can never be confused with canonical PWRC.
 */
export function createTPwrcDevnetProfile(mintAddress?: string): PwrcTokenProfile {
  const mint = mintAddress?.trim() ? new PublicKey(mintAddress.trim()) : null;
  if (mint?.equals(PWRC_PRODUCTION_PROFILE.mint!)) {
    throw new Error("tPWRC must use a separate devnet mint from canonical PWRC.");
  }
  return Object.freeze({
    id: "devnet-test",
    cluster: "devnet",
    name: "PowerChain Test Token",
    symbol: "tPWRC",
    ticker: "tPWRC",
    decimals: PWRC_DECIMALS,
    tokenProgramId: TOKEN_2022_PROGRAM_ID,
    mint,
    transferFeeBasisPoints: PWRC_TRANSFER_FEE_BASIS_POINTS,
    maximumTransferFeeBaseUnits: PWRC_MAX_TRANSFER_FEE_BASE_UNITS,
    production: false,
  });
}

export function assertProfileMint(profile: PwrcTokenProfile): PublicKey {
  if (!profile.mint) throw new Error(`${profile.ticker} mint is not configured.`);
  return profile.mint;
}
