import {
  PWRC_MAX_TRANSFER_FEE_BASE_UNITS,
  PWRC_TRANSFER_FEE_BASIS_POINTS,
} from "./constants.js";
import {
  calculateTransferFeeBaseUnits,
  formatPwrcAmount,
  parsePwrcAmount,
} from "./amounts.js";

export interface PwrcTransferQuote {
  readonly grossAmountBaseUnits: bigint;
  readonly feeBaseUnits: bigint;
  readonly netAmountBaseUnits: bigint;
  readonly basisPoints: number;
  readonly feePercent: string;
  readonly grossAmount: string;
  readonly feeAmount: string;
  readonly netAmount: string;
}

export function quotePwrcTransferBaseUnits(
  grossAmountBaseUnits: bigint,
  options: {
    readonly basisPoints?: number;
    readonly maximumFeeBaseUnits?: bigint;
  } = {},
): PwrcTransferQuote {
  if (grossAmountBaseUnits <= 0n) {
    throw new RangeError("Transfer amount must be positive.");
  }

  const basisPoints = options.basisPoints ?? PWRC_TRANSFER_FEE_BASIS_POINTS;
  const maximumFeeBaseUnits =
    options.maximumFeeBaseUnits ?? PWRC_MAX_TRANSFER_FEE_BASE_UNITS;
  const feeBaseUnits = calculateTransferFeeBaseUnits(
    grossAmountBaseUnits,
    basisPoints,
    maximumFeeBaseUnits,
  );
  const netAmountBaseUnits = grossAmountBaseUnits - feeBaseUnits;

  return Object.freeze({
    grossAmountBaseUnits,
    feeBaseUnits,
    netAmountBaseUnits,
    basisPoints,
    feePercent: (basisPoints / 100).toFixed(2),
    grossAmount: formatPwrcAmount(grossAmountBaseUnits),
    feeAmount: formatPwrcAmount(feeBaseUnits),
    netAmount: formatPwrcAmount(netAmountBaseUnits),
  });
}

export function quotePwrcTransfer(
  grossAmount: string,
  options?: {
    readonly basisPoints?: number;
    readonly maximumFeeBaseUnits?: bigint;
  },
): PwrcTransferQuote {
  return quotePwrcTransferBaseUnits(parsePwrcAmount(grossAmount), options);
}
