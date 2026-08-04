export * from "./ptk-001.js";
export * from "./ppay-001.js";

export type StandardId = "PTK-001" | "PPAY-001";

export function isReleaseCandidateVersion(value: string): boolean {
  return /^\d+\.\d+\.\d+-rc\.\d+$/.test(value);
}

export function assertBasisPoints(value: number, label = "basis points"): void {
  if (!Number.isInteger(value) || value < 0 || value > 10_000) {
    throw new RangeError(`${label} must be an integer between 0 and 10,000.`);
  }
}
