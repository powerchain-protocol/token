import { PublicKey, type Commitment } from "@solana/web3.js";
import {
  PLACEHOLDER_PROGRAM_ID,
  PWRC_DEFAULT_EXPLORER,
  PWRC_DOCUMENTATION_URL,
  PWRC_TOKEN_PROGRAM_ID,
} from "@powerchain/native-token-client";

export type PowerChainCluster = "mainnet-beta" | "devnet" | "testnet" | "localnet";

export interface PowerChainClientConfig {
  readonly cluster: PowerChainCluster;
  readonly rpcEndpoint: string;
  readonly wsEndpoint?: string;
  readonly mintAddress: string;
  readonly programId?: string;
  readonly commitment?: Commitment;
  readonly explorer?: "solscan" | "solana";
  readonly apiKey?: string;
  readonly timeoutMs?: number;
  readonly maximumRetries?: number;
}

export interface ResolvedPowerChainClientConfig {
  readonly cluster: PowerChainCluster;
  readonly rpcEndpoint: string;
  readonly wsEndpoint?: string;
  readonly mint: PublicKey;
  readonly programId?: PublicKey;
  readonly tokenProgramId: PublicKey;
  readonly commitment: Commitment;
  readonly explorer: "solscan" | "solana";
  readonly apiKey?: string;
  readonly timeoutMs: number;
  readonly maximumRetries: number;
  readonly documentationUrl: string;
}

function parseEndpoint(value: string, protocol: "http" | "ws"): string {
  const parsed = new URL(value);
  const allowed = protocol === "http" ? ["https:"] : ["wss:"];
  const localhost = parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
  if (!allowed.includes(parsed.protocol) && !localhost) {
    throw new Error(`${protocol.toUpperCase()} endpoint must use ${allowed.join(" or ")} outside localhost.`);
  }
  if (parsed.username || parsed.password) {
    throw new Error("Credentials must not be embedded in provider endpoints.");
  }
  return parsed.toString();
}

export function resolvePowerChainClientConfig(
  config: PowerChainClientConfig,
): ResolvedPowerChainClientConfig {
  const mint = new PublicKey(config.mintAddress);
  const programId = config.programId ? new PublicKey(config.programId) : undefined;

  if (mint.equals(PublicKey.default)) {
    throw new Error("PWRC mint address cannot be the System Program placeholder.");
  }
  if (programId?.equals(PLACEHOLDER_PROGRAM_ID)) {
    throw new Error("PowerChain program ID cannot use the placeholder address.");
  }
  const timeoutMs = config.timeoutMs ?? 10_000;
  const maximumRetries = config.maximumRetries ?? 2;
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 500 || timeoutMs > 60_000) {
    throw new RangeError("timeoutMs must be an integer from 500 to 60,000.");
  }
  if (!Number.isSafeInteger(maximumRetries) || maximumRetries < 0 || maximumRetries > 5) {
    throw new RangeError("maximumRetries must be an integer from 0 to 5.");
  }

  return Object.freeze({
    cluster: config.cluster,
    rpcEndpoint: parseEndpoint(config.rpcEndpoint, "http"),
    ...(config.wsEndpoint ? { wsEndpoint: parseEndpoint(config.wsEndpoint, "ws") } : {}),
    mint,
    ...(programId ? { programId } : {}),
    tokenProgramId: PWRC_TOKEN_PROGRAM_ID,
    commitment: config.commitment ?? "confirmed",
    explorer: config.explorer ?? PWRC_DEFAULT_EXPLORER,
    ...(config.apiKey?.trim() ? { apiKey: config.apiKey.trim() } : {}),
    timeoutMs,
    maximumRetries,
    documentationUrl: PWRC_DOCUMENTATION_URL,
  });
}
