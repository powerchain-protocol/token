import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import { assertHttpEndpoint } from "./validation.js";
import { PWRC_MINT_ADDRESS } from "./constants.js";

export interface MainnetIntegrationConfig {
  readonly heliusRpcUrl: string;
  readonly heliusApiKey?: string;
  readonly birdeyeApiKey?: string;
  readonly birdeyeBaseUrl?: string;
  readonly pythHermesUrl?: string;
  readonly solscanBaseUrl?: string;
  readonly timeoutMs?: number;
}

function withSignal(signal?: AbortSignal): Pick<AxiosRequestConfig, "signal"> {
  return signal ? { signal } : {};
}

export class PowerChainMainnetIntegrations {
  readonly #helius: AxiosInstance;
  readonly #birdeye?: AxiosInstance;
  readonly #pyth: AxiosInstance;
  readonly solscanBaseUrl: string;

  constructor(config: MainnetIntegrationConfig) {
    const timeout = config.timeoutMs ?? 10_000;
    this.#helius = axios.create({ baseURL: assertHttpEndpoint(config.heliusRpcUrl).toString(), timeout });
    this.#pyth = axios.create({ baseURL: assertHttpEndpoint(config.pythHermesUrl ?? "https://hermes.pyth.network").toString(), timeout });
    this.solscanBaseUrl = assertHttpEndpoint(config.solscanBaseUrl ?? "https://solscan.io").toString().replace(/\/$/, "");
    if (config.birdeyeApiKey) {
      this.#birdeye = axios.create({
        baseURL: assertHttpEndpoint(config.birdeyeBaseUrl ?? "https://public-api.birdeye.so").toString(),
        timeout,
        headers: { "X-API-KEY": config.birdeyeApiKey, "x-chain": "solana" },
      });
    }
  }

  async getHeliusAsset(mint = PWRC_MINT_ADDRESS, signal?: AbortSignal) {
    const { data } = await this.#helius.post(
      "",
      { jsonrpc: "2.0", id: "pwrc-asset", method: "getAsset", params: { id: mint } },
      withSignal(signal),
    );
    return data;
  }

  async getBirdeyeTokenOverview(mint = PWRC_MINT_ADDRESS, signal?: AbortSignal) {
    if (!this.#birdeye) throw new Error("Birdeye API key is not configured");
    const { data } = await this.#birdeye.get("/defi/token_overview", {
      params: { address: mint },
      ...withSignal(signal),
    });
    return data;
  }

  async getPythLatestPrice(feedId: string, signal?: AbortSignal) {
    if (!/^(0x)?[0-9a-fA-F]{64}$/.test(feedId)) throw new TypeError("Pyth feed ID must be 32-byte hex");
    const { data } = await this.#pyth.get("/v2/updates/price/latest", {
      params: { "ids[]": feedId.replace(/^0x/, "") },
      ...withSignal(signal),
    });
    return data;
  }

  tokenExplorerUrl(mint = PWRC_MINT_ADDRESS) {
    return `${this.solscanBaseUrl}/token/${mint}`;
  }

  transactionExplorerUrl(signature: string) {
    if (!signature.trim()) throw new TypeError("signature is required");
    return `${this.solscanBaseUrl}/tx/${encodeURIComponent(signature)}`;
  }
}
