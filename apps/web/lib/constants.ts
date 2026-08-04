import { TOKEN_ADDRESSES, TOKEN_DECIMALS, LAMPORTS_PER_SOL, PWRC_BASE_UNITS_PER_TOKEN, PWRC_GENESIS_SUPPLY_BASE_UNITS, PWRC_MINT } from "../shared/tokens";

export const APPROVED_PWRC_MINT_ADDRESS = TOKEN_ADDRESSES.pwrcMint;
export const APPROVED_PWRC_MINT = PWRC_MINT;
export const TOKEN_PROGRAM_ADDRESS = TOKEN_ADDRESSES.legacyTokenProgram;
export const TOKEN_2022_PROGRAM_ADDRESS = TOKEN_ADDRESSES.token2022Program;
export const ASSOCIATED_TOKEN_PROGRAM_ADDRESS = TOKEN_ADDRESSES.associatedTokenProgram;
export const MEMO_PROGRAM_ADDRESS = TOKEN_ADDRESSES.memoProgram;
export const SOL_DECIMALS = TOKEN_DECIMALS.SOL;
export { LAMPORTS_PER_SOL, PWRC_BASE_UNITS_PER_TOKEN, PWRC_GENESIS_SUPPLY_BASE_UNITS };
export const NATIVE_SOL_FAUCET_AMOUNT_SOL = 2 as const;
export const NATIVE_SOL_FAUCET_AMOUNT_LAMPORTS = 2_000_000_000 as const;
export const SOLANA_DEVNET_CLUSTER = "devnet" as const;
export const PWRC_DECIMALS = TOKEN_DECIMALS.PWRC;
export const SOLSCAN_PWRC_URL = `https://solscan.io/token/${APPROVED_PWRC_MINT_ADDRESS}` as const;
export const MAINNET_PROGRAM_ID = process.env.NEXT_PUBLIC_POWERCHAIN_MAINNET_PROGRAM_ID?.trim() || null;

function assertHttpUrl(value: string, name: string, allowHttpLocalhost = false): string {
  const url = new URL(value);
  const local = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  if (url.username || url.password) throw new Error(`${name} must not contain credentials.`);
  if (url.protocol !== "https:" && !(allowHttpLocalhost && local && url.protocol === "http:")) throw new Error(`${name} must use HTTPS.`);
  return url.toString();
}

export function getMainnetRpcUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SOLANA_MAINNET_RPC_URL?.trim();
  if (configured) return assertHttpUrl(configured, "NEXT_PUBLIC_SOLANA_MAINNET_RPC_URL");
  if (process.env.NODE_ENV === "production") throw new Error("NEXT_PUBLIC_SOLANA_MAINNET_RPC_URL is required in production.");
  return "https://api.mainnet-beta.solana.com";
}

export const TPWRC_MINT_ADDRESS = process.env.NEXT_PUBLIC_TPWRC_MINT?.trim() || "TBA";

export function getDevnetRpcUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SOLANA_DEVNET_RPC_URL?.trim();
  return configured ? assertHttpUrl(configured, "NEXT_PUBLIC_SOLANA_DEVNET_RPC_URL", true) : "https://api.devnet.solana.com";
}

export function getServerDevnetRpcUrl(): string {
  const configured = process.env.SOLANA_DEVNET_RPC_URL?.trim() || process.env.HELIUS_DEVNET_RPC_URL?.trim();
  if (configured) return assertHttpUrl(configured, "SOLANA_DEVNET_RPC_URL", true);
  if (process.env.NODE_ENV === "production") throw new Error("SOLANA_DEVNET_RPC_URL is required for the production faucet route.");
  return "https://api.devnet.solana.com";
}

if (NATIVE_SOL_FAUCET_AMOUNT_LAMPORTS !== NATIVE_SOL_FAUCET_AMOUNT_SOL * LAMPORTS_PER_SOL) throw new Error("Native SOL faucet lamport conversion is inconsistent.");
