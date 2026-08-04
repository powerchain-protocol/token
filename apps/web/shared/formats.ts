const INTEGER_PATTERN = /^-?\d+$/;

export function formatBaseUnits(amount: bigint | string, decimals: number, maximumFractionDigits = decimals): string {
  const value = typeof amount === "bigint" ? amount : BigInt(amount);
  const negative = value < 0n;
  const absolute = negative ? -value : value;
  const divisor = 10n ** BigInt(decimals);
  const whole = absolute / divisor;
  const fraction = absolute % divisor;
  const fractionText = fraction.toString().padStart(decimals, "0").slice(0, maximumFractionDigits).replace(/0+$/, "");
  return `${negative ? "-" : ""}${whole.toLocaleString("en-US")}${fractionText ? `.${fractionText}` : ""}`;
}

export function parseDecimalToBaseUnits(value: string, decimals: number): bigint {
  const normalized = value.trim();
  if (!normalized) throw new Error("Amount is required.");
  const [whole = "0", fraction = ""] = normalized.split(".");
  if (!INTEGER_PATTERN.test(whole) || !/^\d*$/.test(fraction)) throw new Error("Amount must be a decimal number.");
  if (fraction.length > decimals) throw new Error(`Amount supports at most ${decimals} decimal places.`);
  const sign = whole.startsWith("-") ? -1n : 1n;
  const wholeDigits = whole.replace("-", "");
  const base = BigInt(wholeDigits || "0") * 10n ** BigInt(decimals);
  const fractional = BigInt((fraction + "0".repeat(decimals)).slice(0, decimals) || "0");
  return sign * (base + fractional);
}

export function formatAddress(value: string, prefix = 6, suffix = 6): string {
  if (value.length <= prefix + suffix + 1) return value;
  return `${value.slice(0, prefix)}…${value.slice(-suffix)}`;
}

export function formatPercentBasisPoints(basisPoints: number): string {
  return `${(basisPoints / 100).toLocaleString("en-US", { maximumFractionDigits: 2 })}%`;
}

export function formatDateTime(value: string | number | Date): string {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "medium" }).format(new Date(value));
}
