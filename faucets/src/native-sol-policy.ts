import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export interface NativeSolFaucetPolicy {
  readonly enabled: boolean;
  readonly cluster: "devnet";
  readonly amountLamports: number;
  readonly maximumPerWalletPerDayLamports: number;
  readonly requestWindowSeconds: number;
  readonly maximumRequestsPerWindow: number;
  readonly confirmationCommitment: "confirmed" | "finalized";
}

export const NATIVE_SOL_FAUCET_AMOUNT_SOL = 2 as const;
export const NATIVE_SOL_FAUCET_AMOUNT_LAMPORTS =
  NATIVE_SOL_FAUCET_AMOUNT_SOL * LAMPORTS_PER_SOL;

export const DEFAULT_NATIVE_SOL_FAUCET_POLICY: NativeSolFaucetPolicy = Object.freeze({
  enabled: true,
  cluster: "devnet",
  amountLamports: NATIVE_SOL_FAUCET_AMOUNT_LAMPORTS,
  maximumPerWalletPerDayLamports: 4 * LAMPORTS_PER_SOL,
  requestWindowSeconds: 3600,
  maximumRequestsPerWindow: 1,
  confirmationCommitment: "confirmed",
});

export function validateNativeSolFaucetPolicy(policy: NativeSolFaucetPolicy): void {
  if (!policy.enabled) return;
  if (policy.cluster !== "devnet") {
    throw new Error("Native SOL faucet must remain devnet-only.");
  }
  if (policy.amountLamports !== NATIVE_SOL_FAUCET_AMOUNT_LAMPORTS) {
    throw new Error("Native SOL faucet must request exactly 2 SOL.");
  }
  if (!Number.isSafeInteger(policy.amountLamports) || policy.amountLamports <= 0) {
    throw new Error("Native SOL faucet amount must be a positive safe integer.");
  }
  if (
    !Number.isSafeInteger(policy.maximumPerWalletPerDayLamports) ||
    policy.maximumPerWalletPerDayLamports < policy.amountLamports
  ) {
    throw new Error("Native SOL daily allowance must cover at least one request.");
  }
  if (!Number.isSafeInteger(policy.requestWindowSeconds) || policy.requestWindowSeconds < 60) {
    throw new Error("Native SOL request window must be at least 60 seconds.");
  }
  if (!Number.isSafeInteger(policy.maximumRequestsPerWindow) || policy.maximumRequestsPerWindow < 1) {
    throw new Error("Native SOL request limit must be a positive safe integer.");
  }
}
