import { TOKEN_DECIMALS, PWRC_INITIAL_REFERENCE_PRICE_USD } from "./tokens";

export const PLATFORM_METRICS = Object.freeze([
  { label: "SOL / PWRC decimals", value: String(TOKEN_DECIMALS.PWRC) },
  { label: "USDC decimals", value: String(TOKEN_DECIMALS.USDC) },
  { label: "PowerPay service policy", value: "2%" },
  { label: "PWRC reference price", value: `$${PWRC_INITIAL_REFERENCE_PRICE_USD}` },
] as const);

export type PlatformMetric = (typeof PLATFORM_METRICS)[number];
