import { PTK_001 } from "@powerchain/standards";
import { DEFAULT_NATIVE_SOL_FAUCET_POLICY } from "./native-sol-policy.js";
import { DEFAULT_TPWRC_FAUCET_POLICY } from "./policy.js";

export const FAUCET_STANDARD = Object.freeze({
  id: "PFAUCET-001",
  version: "1.0.0-rc.0",
  status: "devnet-only",
  cluster: "devnet",
  routes: Object.freeze({ health: "/health", standard: "/standard", apiStandard: "/api/v1/standard" }),
  nativeSol: Object.freeze({
    enabled: DEFAULT_NATIVE_SOL_FAUCET_POLICY.enabled,
    amountLamports: DEFAULT_NATIVE_SOL_FAUCET_POLICY.amountLamports,
    decimals: 9,
  }),
  testToken: Object.freeze({
    symbol: "tPWRC",
    mint: "TBA",
    decimals: PTK_001.asset.decimals,
    tokenProgram: PTK_001.solana.tokenProgram,
    transferFeeBasisPoints: PTK_001.solana.transferFeeBasisPoints,
    enabled: DEFAULT_TPWRC_FAUCET_POLICY.enabled,
  }),
  production: false,
} as const);
