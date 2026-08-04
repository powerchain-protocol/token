import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  type Commitment,
} from "@solana/web3.js";
import { FaucetError, FaucetErrorCode } from "./errors.js";
import {
  DEFAULT_NATIVE_SOL_FAUCET_POLICY,
  type NativeSolFaucetPolicy,
  validateNativeSolFaucetPolicy,
} from "./native-sol-policy.js";
import {
  InMemoryFaucetUsageStore,
  type FaucetUsage,
  type FaucetUsageStore,
} from "./rate-limit.js";

export interface NativeSolFaucetReceipt {
  readonly recipient: string;
  readonly signature: string;
  readonly amountLamports: number;
  readonly amountSol: number;
  readonly explorerUrl: string;
}

interface UsageReservation {
  readonly key: string;
  readonly previous: FaucetUsage | null;
}

/**
 * Devnet-only native SOL faucet backed by Solana's requestAirdrop RPC method.
 * It never signs a treasury transfer and must never be enabled for mainnet-beta.
 */
export class NativeSolFaucetService {
  private readonly activeRecipients = new Set<string>();

  constructor(
    readonly connection: Connection,
    readonly policy: NativeSolFaucetPolicy = DEFAULT_NATIVE_SOL_FAUCET_POLICY,
    readonly usageStore: FaucetUsageStore = new InMemoryFaucetUsageStore(),
  ) {
    validateNativeSolFaucetPolicy(policy);
  }

  async request(recipientAddress: string): Promise<NativeSolFaucetReceipt> {
    this.assertEnabled();
    const recipient = this.parseRecipient(recipientAddress);
    const key = recipient.toBase58();

    if (this.activeRecipients.has(key)) {
      throw new FaucetError(
        FaucetErrorCode.RateLimitExceeded,
        "A native SOL faucet request for this wallet is already in progress.",
        true,
      );
    }

    this.activeRecipients.add(key);
    let reservation: UsageReservation | null = null;
    try {
      reservation = await this.reserveUsage(recipient);
      const signature = await this.connection.requestAirdrop(
        recipient,
        this.policy.amountLamports,
      );
      const confirmation = await this.connection.confirmTransaction(
        signature,
        this.policy.confirmationCommitment as Commitment,
      );
      if (confirmation.value.err) {
        throw new FaucetError(
          FaucetErrorCode.SubmissionFailed,
          `Native SOL airdrop failed: ${JSON.stringify(confirmation.value.err)}`,
          true,
        );
      }

      return Object.freeze({
        recipient: key,
        signature,
        amountLamports: this.policy.amountLamports,
        amountSol: this.policy.amountLamports / LAMPORTS_PER_SOL,
        explorerUrl: `https://solscan.io/tx/${signature}?cluster=devnet`,
      });
    } catch (cause) {
      if (reservation) await this.rollbackUsage(reservation);
      if (cause instanceof FaucetError) throw cause;
      throw new FaucetError(
        FaucetErrorCode.AirdropUnavailable,
        "The Solana devnet airdrop endpoint is unavailable or rate limited.",
        true,
        cause,
      );
    } finally {
      this.activeRecipients.delete(key);
    }
  }

  private assertEnabled(): void {
    if (!this.policy.enabled) {
      throw new FaucetError(FaucetErrorCode.Disabled, "Native SOL faucet is disabled.");
    }
    if (this.policy.cluster !== "devnet") {
      throw new FaucetError(
        FaucetErrorCode.InvalidCluster,
        "Native SOL faucet is available only on Solana devnet.",
      );
    }
  }

  private parseRecipient(value: string): PublicKey {
    try {
      return new PublicKey(value.trim());
    } catch (cause) {
      throw new FaucetError(
        FaucetErrorCode.InvalidRecipient,
        "Recipient is not a valid Solana address.",
        false,
        cause,
      );
    }
  }

  private usageKey(recipient: PublicKey): string {
    return `native-sol:${recipient.toBase58()}:${new Date().toISOString().slice(0, 10)}`;
  }

  private async reserveUsage(recipient: PublicKey): Promise<UsageReservation> {
    const key = this.usageKey(recipient);
    const previous = await this.usageStore.get(key);
    const now = Date.now();
    const day = new Date(now).toISOString().slice(0, 10);
    const windowExpired =
      !previous ||
      now - previous.windowStartedAtMs >= this.policy.requestWindowSeconds * 1000;
    const requestCount = windowExpired ? 1 : previous.requestCount + 1;
    const distributedBaseUnits =
      (previous?.day === day ? previous.distributedBaseUnits : 0n) +
      BigInt(this.policy.amountLamports);

    if (requestCount > this.policy.maximumRequestsPerWindow) {
      throw new FaucetError(
        FaucetErrorCode.RateLimitExceeded,
        "Native SOL faucet request limit exceeded.",
        true,
      );
    }
    if (distributedBaseUnits > BigInt(this.policy.maximumPerWalletPerDayLamports)) {
      throw new FaucetError(
        FaucetErrorCode.AmountLimitExceeded,
        "Native SOL daily wallet allowance exceeded.",
      );
    }

    const usage: FaucetUsage = Object.freeze({
      requestCount,
      distributedBaseUnits,
      windowStartedAtMs: windowExpired ? now : previous.windowStartedAtMs,
      day,
    });
    await this.usageStore.put(
      key,
      usage,
      Math.max(this.policy.requestWindowSeconds, 86_400),
    );
    return Object.freeze({ key, previous });
  }

  private async rollbackUsage(reservation: UsageReservation): Promise<void> {
    if (reservation.previous) {
      await this.usageStore.put(reservation.key, reservation.previous, 86_400);
    } else {
      await this.usageStore.delete(reservation.key);
    }
  }
}
