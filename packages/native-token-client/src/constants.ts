import { PublicKey } from "@solana/web3.js";
import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";

export const PTK_SPECIFICATION_ID = "PTK-001" as const;
export const PTK_VERSION = "1.0.0-rc.0" as const;
export const PWRC_NAME = "PowerChain" as const;
export const PWRC_SYMBOL = "PWRC" as const;
export const PWRC_DECIMALS = 9 as const;
export const PWRC_GENESIS_SUPPLY = 18_446_000_000n;
export const PWRC_BASE_UNITS_PER_TOKEN = 10n ** BigInt(PWRC_DECIMALS);
export const PWRC_GENESIS_SUPPLY_BASE_UNITS =
  PWRC_GENESIS_SUPPLY * PWRC_BASE_UNITS_PER_TOKEN;

/** Token-2022 transfer fee: 2.50% = 250 basis points. */
export const PWRC_TRANSFER_FEE_BASIS_POINTS = 250 as const;
export const PWRC_TRANSFER_FEE_PERCENT = 2.5 as const;

/**
 * Maximum fee per transfer in base units. The default profile caps the fee at
 * 1,000,000 PWRC. Governance may lower this before deployment, but clients
 * must read the live mint configuration rather than assuming this value.
 */
export const PWRC_MAX_TRANSFER_FEE_TOKENS = 1_000_000n;
export const PWRC_MAX_TRANSFER_FEE_BASE_UNITS =
  PWRC_MAX_TRANSFER_FEE_TOKENS * PWRC_BASE_UNITS_PER_TOKEN;

export const PLACEHOLDER_PROGRAM_ID = new PublicKey(
  "11111111111111111111111111111111",
);
export const PWRC_TOKEN_PROGRAM_ID = TOKEN_2022_PROGRAM_ID;
export const PWRC_METADATA_URI =
  "https://powerchain.energy/metadata/metaplex.json" as const;
export const PWRC_LOGO_URI =
  "https://powerchain.energy/assets/token/pwrc.png" as const;

export const PWRC_DEFAULT_EXPLORER = "solscan" as const;
export const PWRC_SOLSCAN_BASE_URL = "https://solscan.io" as const;

export const PWRC_DOCUMENTATION_URL = "https://docs.powerchain.energy" as const;
