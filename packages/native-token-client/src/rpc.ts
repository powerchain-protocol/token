import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
} from "axios";
import { assertHttpEndpoint, assertRpcMethod } from "./validation.js";

export interface SolanaRpcResponse<T> {
  readonly jsonrpc: "2.0";
  readonly id: string | number;
  readonly result?: T;
  readonly error?: {
    readonly code: number;
    readonly message: string;
    readonly data?: unknown;
  };
}

export class PowerChainRpcError extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly rpcCode?: number,
    readonly retryable = false,
  ) {
    super(message);
    this.name = "PowerChainRpcError";
  }
}

export class PowerChainRpcClient {
  readonly #http: AxiosInstance;
  readonly #apiKey?: string;
  readonly #maximumRetries: number;
  #requestId = 0;

  constructor(input: {
    readonly endpoint: string;
    readonly apiKey?: string;
    readonly timeoutMs?: number;
    readonly maximumRetries?: number;
  }) {
    const endpoint = assertHttpEndpoint(input.endpoint);
    const timeoutMs = input.timeoutMs ?? 10_000;
    if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 500 || timeoutMs > 60_000) {
      throw new RangeError("RPC timeout must be an integer from 500 to 60,000 ms.");
    }
    this.#maximumRetries = input.maximumRetries ?? 2;
    if (!Number.isSafeInteger(this.#maximumRetries) || this.#maximumRetries < 0 || this.#maximumRetries > 5) {
      throw new RangeError("RPC maximumRetries must be an integer from 0 to 5.");
    }

    this.#apiKey = input.apiKey?.trim() || undefined;
    this.#http = axios.create({
      baseURL: endpoint.toString(),
      timeout: timeoutMs,
      maxContentLength: 2_000_000,
      maxBodyLength: 256_000,
      headers: { "Content-Type": "application/json" },
      validateStatus: (status) => status >= 200 && status < 300,
    });
  }

  async request<T>(
    method: string,
    params: readonly unknown[] = [],
    signal?: AbortSignal,
  ): Promise<T> {
    assertRpcMethod(method);
    if (!Array.isArray(params)) throw new TypeError("RPC params must be an array.");

    const id = ++this.#requestId;
    const config: AxiosRequestConfig = {
      signal,
      headers: this.#apiKey ? { Authorization: `Bearer ${this.#apiKey}` } : undefined,
    };

    for (let attempt = 0; ; attempt += 1) {
      try {
        const response = await this.#http.post<SolanaRpcResponse<T>>(
          "",
          { jsonrpc: "2.0", id, method, params },
          config,
        );
        const body = response.data;
        if (body.jsonrpc !== "2.0" || body.id !== id) {
          throw new PowerChainRpcError("Malformed or mismatched JSON-RPC response.", "INVALID_RESPONSE");
        }
        if (body.error) {
          const retryable = body.error.code === -32005 || body.error.code === -32004;
          throw new PowerChainRpcError(
            `Solana RPC ${method} failed (${body.error.code}): ${body.error.message}`,
            "RPC_ERROR",
            body.error.code,
            retryable,
          );
        }
        if (body.result === undefined) {
          throw new PowerChainRpcError(`Solana RPC ${method} returned no result.`, "INVALID_RESPONSE");
        }
        return body.result;
      } catch (error) {
        const normalized = normalizeRpcError(error, method);
        if (!normalized.retryable || attempt >= this.#maximumRetries || signal?.aborted) throw normalized;
        await delay(Math.min(250 * 2 ** attempt, 1_000), signal);
      }
    }
  }

  getHealth(signal?: AbortSignal): Promise<string> {
    return this.request<string>("getHealth", [], signal);
  }

  getTokenSupply(mint: string, signal?: AbortSignal): Promise<{
    readonly context: { readonly slot: number };
    readonly value: {
      readonly amount: string;
      readonly decimals: number;
      readonly uiAmountString: string;
    };
  }> {
    return this.request("getTokenSupply", [mint, { commitment: "confirmed" }], signal);
  }
}

function normalizeRpcError(error: unknown, method: string): PowerChainRpcError {
  if (error instanceof PowerChainRpcError) return error;
  if (error instanceof AxiosError) {
    const retryable = error.code === "ECONNABORTED" || error.code === "ETIMEDOUT" || (error.response?.status ?? 0) >= 500 || error.response?.status === 429;
    return new PowerChainRpcError(
      `Solana RPC ${method} transport failure: ${error.message}`,
      error.response?.status === 429 ? "RATE_LIMITED" : "TRANSPORT_ERROR",
      undefined,
      retryable,
    );
  }
  return new PowerChainRpcError(
    `Solana RPC ${method} failed: ${error instanceof Error ? error.message : "unknown error"}`,
    "UNKNOWN_ERROR",
  );
}

function delay(milliseconds: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new PowerChainRpcError("RPC request aborted.", "ABORTED"));
    const timer = setTimeout(resolve, milliseconds);
    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new PowerChainRpcError("RPC request aborted.", "ABORTED"));
    }, { once: true });
  });
}
