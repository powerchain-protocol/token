import type { PowerChainClientConfig, PowerChainCluster } from "./config.js";

export type EnvironmentSource = Readonly<Record<string, string | undefined>>;

function required(source: EnvironmentSource, key: string): string {
  const value = source[key]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

function parseCluster(value: string | undefined): PowerChainCluster {
  const cluster = value?.trim() || "devnet";
  if (!["mainnet-beta", "devnet", "testnet", "localnet"].includes(cluster)) {
    throw new Error(`Unsupported POWERCHAIN_CLUSTER: ${cluster}`);
  }
  return cluster as PowerChainCluster;
}

export function powerChainClientConfigFromEnv(
  source: EnvironmentSource = process.env,
): PowerChainClientConfig {
  const cluster = parseCluster(source.POWERCHAIN_CLUSTER);
  const wsEndpoint = source.POWERCHAIN_RPC_WS?.trim();
  const programId = source.POWERCHAIN_PROGRAM_ID?.trim();
  const apiKey = source.HELIUS_API_KEY?.trim();
  return {
    cluster,
    rpcEndpoint: required(source, "POWERCHAIN_RPC_HTTP"),
    mintAddress: required(source, "PWRC_MINT_ADDRESS"),
    ...(wsEndpoint ? { wsEndpoint } : {}),
    ...(programId ? { programId } : {}),
    ...(apiKey ? { apiKey } : {}),
    explorer: source.POWERCHAIN_EXPLORER === "solana" ? "solana" : "solscan",
  };
}
