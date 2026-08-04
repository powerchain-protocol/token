export const PPAY_001 = Object.freeze({
  id: "PPAY-001",
  version: "1.0.0-rc.1",
  status: "experimental-reference-implementation",
  serviceFeeBasisPoints: 200,
  supportedAssets: Object.freeze([
    Object.freeze({ symbol: "SOL", decimals: 9, program: "system" }),
    Object.freeze({ symbol: "USDC", decimals: 6, program: "spl-token", mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" }),
    Object.freeze({ symbol: "PWRC", decimals: 9, program: "token-2022", mint: "PWRCRXXZxbg6FdQZfK3PMD7KP8xfxs9acvifJiG46wc" }),
  ]),
  domains: Object.freeze({
    payments: "https://payments.powerchain.energy",
    api: "https://api.powerchain.energy/api/v1",
    documentation: "https://docs.powerchain.energy",
  }),
  deployment: Object.freeze({ network: "mainnet-beta", programId: "TBA", production: false }),
} as const);

export type Ppay001Profile = typeof PPAY_001;
