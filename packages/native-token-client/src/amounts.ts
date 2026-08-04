import {
  PWRC_BASE_UNITS_PER_TOKEN,
  PWRC_DECIMALS,
  PWRC_TRANSFER_FEE_BASIS_POINTS,
} from "./constants.js";

const DECIMAL_PATTERN = /^\d+(?:\.\d+)?$/;

/** Convert a human PWRC amount into exact Token-2022 base units. */
export function parsePwrcAmount(value: string | number | bigint): bigint {
  if (typeof value === "bigint") {
    if (value < 0n) throw new RangeError("PWRC amount cannot be negative.");
    return value * PWRC_BASE_UNITS_PER_TOKEN;
  }

  const normalized = typeof value === "number" ? value.toString() : value.trim();
  if (!DECIMAL_PATTERN.test(normalized)) {
    throw new TypeError(`Invalid PWRC decimal amount: ${normalized}`);
  }

  const [whole = "0", fraction = ""] = normalized.split(".");
  if (fraction.length > PWRC_DECIMALS) {
    throw new RangeError(`PWRC supports at most ${PWRC_DECIMALS} decimal places.`);
  }

  const paddedFraction = fraction.padEnd(PWRC_DECIMALS, "0");
  return BigInt(whole) * PWRC_BASE_UNITS_PER_TOKEN + BigInt(paddedFraction || "0");
}

/** Convert base units into a canonical, non-scientific PWRC string. */
export function formatPwrcAmount(baseUnits: bigint): string {
  if (baseUnits < 0n) throw new RangeError("PWRC base units cannot be negative.");

  const whole = baseUnits / PWRC_BASE_UNITS_PER_TOKEN;
  const fraction = baseUnits % PWRC_BASE_UNITS_PER_TOKEN;
  if (fraction === 0n) return whole.toString();

  const fractionText = fraction
    .toString()
    .padStart(PWRC_DECIMALS, "0")
    .replace(/0+$/, "");
  return `${whole}.${fractionText}`;
}

/** Token-2022 rounds transfer fees upward, then applies the configured cap. */
export function calculateTransferFeeBaseUnits(
  amountBaseUnits: bigint,
  basisPoints: number = PWRC_TRANSFER_FEE_BASIS_POINTS,
  maximumFeeBaseUnits?: bigint,
): bigint {
  if (amountBaseUnits < 0n) throw new RangeError("Transfer amount cannot be negative.");
  if (!Number.isInteger(basisPoints) || basisPoints < 0 || basisPoints > 10_000) {
    throw new RangeError("Transfer fee basis points must be an integer from 0 to 10,000.");
  }

  const numerator = amountBaseUnits * BigInt(basisPoints);
  const fee = (numerator + 9_999n) / 10_000n;
  return maximumFeeBaseUnits === undefined || fee <= maximumFeeBaseUnits
    ? fee
    : maximumFeeBaseUnits;
}

export function calculateNetTransferAmount(
  grossAmountBaseUnits: bigint,
  feeBaseUnits: bigint,
): bigint {
  if (feeBaseUnits < 0n || feeBaseUnits > grossAmountBaseUnits) {
    throw new RangeError("Transfer fee must be between zero and the gross amount.");
  }
  return grossAmountBaseUnits - feeBaseUnits;
}
