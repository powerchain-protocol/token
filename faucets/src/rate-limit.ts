export interface FaucetUsage {
  readonly requestCount: number;
  readonly distributedBaseUnits: bigint;
  readonly windowStartedAtMs: number;
  readonly day: string;
}

export interface FaucetUsageStore {
  get(key: string): Promise<FaucetUsage | null>;
  put(key: string, usage: FaucetUsage, ttlSeconds: number): Promise<void>;
  delete(key: string): Promise<void>;
}

/**
 * Development-only store. Production deployments should provide a distributed
 * implementation with atomic compare-and-set semantics (for example Redis).
 */
export class InMemoryFaucetUsageStore implements FaucetUsageStore {
  private readonly values = new Map<string, { usage: FaucetUsage; expiresAt: number }>();

  async get(key: string): Promise<FaucetUsage | null> {
    const record = this.values.get(key);
    if (!record || record.expiresAt <= Date.now()) {
      this.values.delete(key);
      return null;
    }
    return record.usage;
  }

  async put(key: string, usage: FaucetUsage, ttlSeconds: number): Promise<void> {
    if (!Number.isSafeInteger(ttlSeconds) || ttlSeconds <= 0) {
      throw new RangeError("ttlSeconds must be a positive safe integer.");
    }
    this.values.set(key, {
      usage: Object.freeze({ ...usage }),
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  async delete(key: string): Promise<void> {
    this.values.delete(key);
  }
}
