import { getAccount, getAssociatedTokenAddressSync } from "@solana/spl-token";
import {
  Connection,
  PublicKey,
  Transaction,
  type Signer,
} from "@solana/web3.js";
import {
  TOKEN_2022_PROGRAM_ID,
  formatPwrcAmount,
  parsePwrcAmount,
} from "@powerchain/native-token-client";
import { FaucetError, FaucetErrorCode } from "./errors.js";
import { deriveFaucetAccounts } from "./accounts.js";
import { createFaucetTransferPlan, type FaucetTransferPlan } from "./transactions.js";
import {
  DEFAULT_TPWRC_FAUCET_POLICY,
  validateFaucetPolicy,
  type FaucetPolicy,
} from "./policy.js";
import {
  InMemoryFaucetUsageStore,
  type FaucetUsage,
  type FaucetUsageStore,
} from "./rate-limit.js";

export interface FaucetRequest {
  readonly recipient: string;
  readonly amount?: string;
}

export interface FaucetQuote {
  readonly recipient: string;
  readonly grossAmount: string;
  readonly feeAmount: string;
  readonly netAmount: string;
}

export interface PreparedFaucetTransfer extends FaucetQuote {
  readonly plan: FaucetTransferPlan;
  readonly usageKey: string;
  readonly usage: FaucetUsage;
  readonly previousUsage: FaucetUsage | null;
}

interface UsageReservation {
  readonly key: string;
  readonly previous: FaucetUsage | null;
}

export class TPwrcFaucetService {
  private readonly activeRecipients = new Set<string>();

  constructor(
    readonly connection: Connection,
    readonly mint: PublicKey,
    readonly treasuryOwner: PublicKey,
    readonly policy: FaucetPolicy = DEFAULT_TPWRC_FAUCET_POLICY,
    readonly usageStore: FaucetUsageStore = new InMemoryFaucetUsageStore(),
  ) {
    validateFaucetPolicy(policy);
  }

  async quote(request: FaucetRequest): Promise<FaucetQuote> {
    const prepared = await this.prepare(request);
    return Object.freeze({
      recipient: prepared.recipient,
      grossAmount: prepared.grossAmount,
      feeAmount: prepared.feeAmount,
      netAmount: prepared.netAmount,
    });
  }

  async prepare(request: FaucetRequest): Promise<PreparedFaucetTransfer> {
    const recipient = this.parseRecipient(request.recipient);
    const amount = this.parseAmount(request.amount);
    const plan = createFaucetTransferPlan({
      accounts: deriveFaucetAccounts({
        mint: this.mint,
        treasuryOwner: this.treasuryOwner,
        recipientOwner: recipient,
      }),
      payer: this.treasuryOwner,
      amountBaseUnits: amount,
    });

    await this.assertTreasuryReserve(plan);
    const usageKey = this.usageKey(recipient);
    const previousUsage = await this.usageStore.get(usageKey);
    const usage = this.createUsageReservation(previousUsage, amount);

    return Object.freeze({
      recipient: recipient.toBase58(),
      grossAmount: formatPwrcAmount(plan.amountBaseUnits),
      feeAmount: formatPwrcAmount(plan.expectedFeeBaseUnits),
      netAmount: formatPwrcAmount(plan.netAmountBaseUnits),
      plan,
      usageKey,
      usage,
      previousUsage,
    });
  }

  async distribute(request: FaucetRequest, treasurySigner: Signer): Promise<string> {
    if (!treasurySigner.publicKey.equals(this.treasuryOwner)) {
      throw new FaucetError(
        FaucetErrorCode.KeypairMismatch,
        "Treasury signer does not match the configured faucet authority.",
      );
    }

    const recipientKey = request.recipient.trim();
    if (this.activeRecipients.has(recipientKey)) {
      throw new FaucetError(
        FaucetErrorCode.RateLimitExceeded,
        "A faucet request for this wallet is already in progress.",
        true,
      );
    }

    this.activeRecipients.add(recipientKey);
    let reservation: UsageReservation | null = null;
    try {
      const prepared = await this.prepare(request);
      reservation = await this.reserveUsage(prepared);

      const latest = await this.connection.getLatestBlockhash(this.policy.confirmationCommitment);
      const transaction = new Transaction({
        feePayer: this.treasuryOwner,
        recentBlockhash: latest.blockhash,
      }).add(...prepared.plan.instructions);
      transaction.sign(treasurySigner);

      const signature = await this.connection.sendRawTransaction(transaction.serialize(), {
        skipPreflight: false,
        maxRetries: 3,
        preflightCommitment: this.policy.confirmationCommitment,
      });
      const confirmation = await this.connection.confirmTransaction(
        { signature, ...latest },
        this.policy.confirmationCommitment,
      );
      if (confirmation.value.err) {
        throw new FaucetError(
          FaucetErrorCode.SubmissionFailed,
          `Faucet transaction failed: ${JSON.stringify(confirmation.value.err)}`,
        );
      }
      return signature;
    } catch (cause) {
      if (reservation) await this.rollbackUsage(reservation);
      if (cause instanceof FaucetError) throw cause;
      throw new FaucetError(
        FaucetErrorCode.SubmissionFailed,
        "Unable to submit the tPWRC faucet transaction.",
        true,
        cause,
      );
    } finally {
      this.activeRecipients.delete(recipientKey);
    }
  }

  private parseRecipient(value: string): PublicKey {
    this.assertEnabled();
    let recipient: PublicKey;
    try {
      recipient = new PublicKey(value);
    } catch (cause) {
      throw new FaucetError(
        FaucetErrorCode.InvalidRecipient,
        "Recipient is not a valid Solana address.",
        false,
        cause,
      );
    }
    if (recipient.equals(this.treasuryOwner)) {
      throw new FaucetError(
        FaucetErrorCode.InvalidRecipient,
        "Recipient cannot be the faucet treasury owner.",
      );
    }
    return recipient;
  }

  private parseAmount(value?: string): bigint {
    let amount: bigint;
    try {
      amount = value ? parsePwrcAmount(value) : this.policy.amountPerRequestBaseUnits;
    } catch (cause) {
      throw new FaucetError(FaucetErrorCode.InvalidAmount, "Invalid tPWRC amount.", false, cause);
    }
    if (amount <= 0n || amount > this.policy.maximumPerRequestBaseUnits) {
      throw new FaucetError(
        FaucetErrorCode.AmountLimitExceeded,
        "Requested tPWRC amount exceeds the faucet policy.",
      );
    }
    return amount;
  }

  private assertEnabled(): void {
    if (!this.policy.enabled) {
      throw new FaucetError(FaucetErrorCode.Disabled, "tPWRC faucet is disabled.");
    }
  }

  private async assertTreasuryReserve(plan: FaucetTransferPlan): Promise<void> {
    let account;
    try {
      const treasuryTokenAccount = getAssociatedTokenAddressSync(
        this.mint,
        this.treasuryOwner,
        false,
        TOKEN_2022_PROGRAM_ID,
      );
      account = await getAccount(
        this.connection,
        treasuryTokenAccount,
        this.policy.confirmationCommitment,
        TOKEN_2022_PROGRAM_ID,
      );
    } catch (cause) {
      throw new FaucetError(
        FaucetErrorCode.TreasuryBalanceLow,
        "Unable to load the tPWRC faucet treasury token account.",
        true,
        cause,
      );
    }
    const required = plan.amountBaseUnits + this.policy.minimumTreasuryReserveBaseUnits;
    if (account.amount < required) {
      throw new FaucetError(
        FaucetErrorCode.TreasuryReserveViolation,
        "Faucet treasury would fall below the configured reserve.",
      );
    }
  }

  private usageKey(recipient: PublicKey): string {
    const day = new Date().toISOString().slice(0, 10);
    return `${recipient.toBase58()}:${day}`;
  }

  private createUsageReservation(previous: FaucetUsage | null, amount: bigint): FaucetUsage {
    const now = Date.now();
    const day = new Date(now).toISOString().slice(0, 10);
    const windowExpired = !previous || now - previous.windowStartedAtMs >= this.policy.requestWindowSeconds * 1000;
    const requestCount = windowExpired ? 1 : previous.requestCount + 1;
    const distributedBaseUnits = (previous?.day === day ? previous.distributedBaseUnits : 0n) + amount;

    if (requestCount > this.policy.maximumRequestsPerWindow) {
      throw new FaucetError(FaucetErrorCode.RateLimitExceeded, "Hourly faucet request limit exceeded.", true);
    }
    if (distributedBaseUnits > this.policy.maximumPerWalletPerDayBaseUnits) {
      throw new FaucetError(FaucetErrorCode.AmountLimitExceeded, "Daily wallet faucet allowance exceeded.");
    }

    return Object.freeze({
      requestCount,
      distributedBaseUnits,
      windowStartedAtMs: windowExpired ? now : previous.windowStartedAtMs,
      day,
    });
  }

  private async reserveUsage(prepared: PreparedFaucetTransfer): Promise<UsageReservation> {
    await this.usageStore.put(
      prepared.usageKey,
      prepared.usage,
      Math.max(this.policy.requestWindowSeconds, 86_400),
    );
    return Object.freeze({ key: prepared.usageKey, previous: prepared.previousUsage });
  }

  private async rollbackUsage(reservation: UsageReservation): Promise<void> {
    if (reservation.previous) {
      await this.usageStore.put(reservation.key, reservation.previous, 86_400);
    } else {
      await this.usageStore.delete(reservation.key);
    }
  }
}
