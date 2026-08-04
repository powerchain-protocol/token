import { PPAY_001, PTK_001 } from "@powerchain/standards";

export const POWERCHAIN_TOKEN_STANDARD = PTK_001;
export const POWERCHAIN_PAYMENT_STANDARD = PPAY_001;

export function getCanonicalTokenProfile() {
  return POWERCHAIN_TOKEN_STANDARD;
}

export function getCanonicalPaymentProfile() {
  return POWERCHAIN_PAYMENT_STANDARD;
}

export function assertCanonicalPwrcMint(value: string): void {
  if (value !== PTK_001.asset.mint) {
    throw new Error(`Expected canonical PWRC mint ${PTK_001.asset.mint}.`);
  }
}
