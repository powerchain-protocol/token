import { PPAY_001 } from "@powerchain/standards";

export type PowerPayAsset = "SOL" | "USDC" | "PWRC";

export interface PowerPayAmount {
  readonly asset: PowerPayAsset;
  readonly amountBaseUnits: bigint;
  readonly decimals: number;
}

export function getPowerPayAssetDecimals(asset: PowerPayAsset): number {
  const profile = PPAY_001.supportedAssets.find((entry) => entry.symbol === asset);
  if (!profile) throw new Error(`Unsupported PowerPay asset: ${asset}`);
  return profile.decimals;
}

export function createPowerPayAmount(asset: PowerPayAsset, amountBaseUnits: bigint): PowerPayAmount {
  if (amountBaseUnits <= 0n) throw new RangeError("PowerPay amount must be positive.");
  return Object.freeze({ asset, amountBaseUnits, decimals: getPowerPayAssetDecimals(asset) });
}
