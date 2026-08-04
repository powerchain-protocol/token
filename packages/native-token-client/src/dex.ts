import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import { PublicKey } from "@solana/web3.js";
import { PWRC_MINT_ADDRESS } from "./constants.js";

export const USDC_MAINNET_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
export const PWRC_INITIAL_REFERENCE_PRICE_USD = "0.000002";

export type DexProvider = "jupiter" | "raydium" | "meteora" | "orca";
export interface SwapQuoteRequest {
  inputMint: string;
  outputMint: string;
  amountBaseUnits: bigint;
  slippageBps: number;
}
export interface NormalizedSwapQuote {
  provider: DexProvider;
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  minimumOutAmount?: string;
  priceImpactPct?: string;
  raw: unknown;
}

function validateRequest(request: SwapQuoteRequest): void {
  new PublicKey(request.inputMint);
  new PublicKey(request.outputMint);
  if (request.inputMint === request.outputMint) throw new TypeError("input and output mints must differ");
  if (request.amountBaseUnits <= 0n) throw new RangeError("amount must be positive");
  if (!Number.isInteger(request.slippageBps) || request.slippageBps < 0 || request.slippageBps > 5_000) {
    throw new RangeError("slippageBps must be 0..5000");
  }
}

function withSignal(signal?: AbortSignal): Pick<AxiosRequestConfig, "signal"> {
  return signal ? { signal } : {};
}

export class PowerChainDexClient {
  readonly #jupiter: AxiosInstance;
  readonly #raydium: AxiosInstance;
  readonly #meteora: AxiosInstance;
  readonly #orca: AxiosInstance;

  constructor(timeoutMs = 10_000) {
    this.#jupiter = axios.create({ baseURL: "https://api.jup.ag", timeout: timeoutMs });
    this.#raydium = axios.create({ baseURL: "https://api-v3.raydium.io", timeout: timeoutMs });
    this.#meteora = axios.create({ baseURL: "https://dlmm.datapi.meteora.ag", timeout: timeoutMs });
    this.#orca = axios.create({ baseURL: "https://api.orca.so", timeout: timeoutMs });
  }

  async quoteJupiter(request: SwapQuoteRequest, signal?: AbortSignal): Promise<NormalizedSwapQuote> {
    validateRequest(request);
    const { data } = await this.#jupiter.get("/swap/v1/quote", {
      params: {
        inputMint: request.inputMint,
        outputMint: request.outputMint,
        amount: request.amountBaseUnits.toString(),
        slippageBps: request.slippageBps,
      },
      ...withSignal(signal),
    });
    return {
      provider: "jupiter",
      inputMint: request.inputMint,
      outputMint: request.outputMint,
      inAmount: String(data.inAmount),
      outAmount: String(data.outAmount),
      ...(data.otherAmountThreshold ? { minimumOutAmount: String(data.otherAmountThreshold) } : {}),
      ...(data.priceImpactPct ? { priceImpactPct: String(data.priceImpactPct) } : {}),
      raw: data,
    };
  }

  async getRaydiumPools(mint1 = PWRC_MINT_ADDRESS, mint2 = USDC_MAINNET_MINT, signal?: AbortSignal) {
    new PublicKey(mint1);
    new PublicKey(mint2);
    const { data } = await this.#raydium.get("/pools/info/mint", {
      params: { mint1, mint2, poolType: "all", poolSortField: "default", sortType: "desc", pageSize: 20, page: 1 },
      ...withSignal(signal),
    });
    return data;
  }

  async getMeteoraPool(address: string, signal?: AbortSignal) {
    new PublicKey(address);
    const { data } = await this.#meteora.get(`/pools/${address}`, withSignal(signal));
    return data;
  }

  async getOrcaPools(token = PWRC_MINT_ADDRESS, signal?: AbortSignal) {
    new PublicKey(token);
    const { data } = await this.#orca.get("/v2/solana/pools", {
      params: { tokensBothOf: token },
      ...withSignal(signal),
    });
    return data;
  }
}
