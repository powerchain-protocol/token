import { parsePwrcAmount } from "@powerchain/native-token-client";

export interface FaucetPolicy {
  readonly enabled: boolean;
  readonly cluster: "devnet";
  readonly symbol: "tPWRC";
  readonly decimals: 9;
  readonly amountPerRequestBaseUnits: bigint;
  readonly maximumPerRequestBaseUnits: bigint;
  readonly maximumPerWalletPerDayBaseUnits: bigint;
  readonly minimumTreasuryReserveBaseUnits: bigint;
  readonly requestWindowSeconds: number;
  readonly maximumRequestsPerWindow: number;
  readonly confirmationCommitment: "confirmed" | "finalized";
}

export const DEFAULT_TPWRC_FAUCET_POLICY: FaucetPolicy = Object.freeze({
  enabled: true,
  cluster: "devnet",
  symbol: "tPWRC",
  decimals: 9,
  amountPerRequestBaseUnits: parsePwrcAmount("1000"),
  maximumPerRequestBaseUnits: parsePwrcAmount("5000"),
  maximumPerWalletPerDayBaseUnits: parsePwrcAmount("10000"),
  minimumTreasuryReserveBaseUnits: parsePwrcAmount("1000000"),
  requestWindowSeconds: 3600,
  maximumRequestsPerWindow: 3,
  confirmationCommitment: "confirmed",
});

export function validateFaucetPolicy(policy: FaucetPolicy): void {
  if (!policy.enabled) return;
  if (policy.cluster !== "devnet" || policy.symbol !== "tPWRC" || policy.decimals !== 9) {
    throw new Error("Faucet policy must target devnet tPWRC with 9 decimals.");
  }
  if (policy.amountPerRequestBaseUnits <= 0n || policy.maximumPerRequestBaseUnits <= 0n) {
    throw new Error("Faucet amounts must be positive.");
  }
  if (policy.amountPerRequestBaseUnits > policy.maximumPerRequestBaseUnits) {
    throw new Error("Default request amount exceeds maximum request amount.");
  }
  if (policy.maximumPerRequestBaseUnits > policy.maximumPerWalletPerDayBaseUnits) {
    throw new Error("Per-request maximum exceeds the daily wallet maximum.");
  }
  if (policy.minimumTreasuryReserveBaseUnits < 0n) throw new Error("Treasury reserve cannot be negative.");
  if (!Number.isSafeInteger(policy.requestWindowSeconds) || policy.requestWindowSeconds < 60) {
    throw new Error("requestWindowSeconds must be at least 60 seconds.");
  }
  if (!Number.isSafeInteger(policy.maximumRequestsPerWindow) || policy.maximumRequestsPerWindow < 1) {
    throw new Error("maximumRequestsPerWindow must be a positive safe integer.");
  }
}
