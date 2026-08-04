export type SolanaCluster = "mainnet-beta" | "devnet" | "testnet" | "localnet";
export type ExplorerProvider = "solscan" | "solana-explorer";
export type ExplorerEntity = "account" | "token" | "transaction" | "block";

export const DEFAULT_EXPLORER: ExplorerProvider = "solscan";

const PROVIDER_BASE_URLS: Readonly<Record<ExplorerProvider, string>> = {
  solscan: "https://solscan.io",
  "solana-explorer": "https://explorer.solana.com",
};

function entityPath(provider: ExplorerProvider, entity: ExplorerEntity): string {
  if (provider === "solscan") {
    return entity === "transaction" ? "tx" : entity;
  }
  if (entity === "transaction") return "tx";
  return entity === "token" ? "address" : entity;
}

function appendCluster(url: URL, cluster: SolanaCluster): void {
  if (cluster === "mainnet-beta") return;
  url.searchParams.set("cluster", cluster === "localnet" ? "custom" : cluster);
}

export function buildExplorerUrl(input: {
  readonly value: string | number | bigint;
  readonly entity: ExplorerEntity;
  readonly cluster?: SolanaCluster;
  readonly provider?: ExplorerProvider;
  readonly customRpcUrl?: string;
}): string {
  const provider = input.provider ?? DEFAULT_EXPLORER;
  const cluster = input.cluster ?? "mainnet-beta";
  const value = String(input.value).trim();
  if (!value) throw new TypeError("Explorer value cannot be empty.");

  const url = new URL(
    `${PROVIDER_BASE_URLS[provider]}/${entityPath(provider, input.entity)}/${encodeURIComponent(value)}`,
  );
  appendCluster(url, cluster);

  if (cluster === "localnet") {
    if (!input.customRpcUrl) {
      throw new Error("A custom RPC URL is required for localnet explorer links.");
    }
    url.searchParams.set("customUrl", input.customRpcUrl);
  }
  return url.toString();
}

export const getPwrcTokenExplorerUrl = (mint: string, cluster?: SolanaCluster): string =>
  buildExplorerUrl({ entity: "token", value: mint, cluster });

export const getTransactionExplorerUrl = (signature: string, cluster?: SolanaCluster): string =>
  buildExplorerUrl({ entity: "transaction", value: signature, cluster });

export const getAccountExplorerUrl = (address: string, cluster?: SolanaCluster): string =>
  buildExplorerUrl({ entity: "account", value: address, cluster });
