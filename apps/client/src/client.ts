import {
  Connection,
  PublicKey,
  Transaction,
  type SendOptions,
  type Signer,
  type TransactionInstruction,
} from "@solana/web3.js";
import {
  createPwrcAssociatedTokenAccountInstruction,
  createPwrcTransferInstruction,
  fetchPwrcMint,
  getPwrcAssociatedTokenAddress,
  buildExplorerUrl,
  parsePwrcAmount,
  quotePwrcTransfer,
  type PwrcTransferQuote,
} from "@powerchain/native-token-client";
import { resolvePowerChainClientConfig, type PowerChainClientConfig } from "./config.js";

export interface PrepareTransferInput {
  readonly owner: PublicKey;
  readonly recipient: PublicKey;
  readonly amount: string;
  readonly createRecipientAccount?: boolean;
}

export interface PreparedPwrcTransfer {
  readonly quote: PwrcTransferQuote;
  readonly sourceTokenAccount: PublicKey;
  readonly destinationTokenAccount: PublicKey;
  readonly instructions: readonly TransactionInstruction[];
}

export class PowerChainClient {
  readonly config;
  readonly connection: Connection;

  constructor(config: PowerChainClientConfig) {
    this.config = resolvePowerChainClientConfig(config);
    this.connection = new Connection(this.config.rpcEndpoint, {
      commitment: this.config.commitment,
      ...(this.config.wsEndpoint ? { wsEndpoint: this.config.wsEndpoint } : {}),
      disableRetryOnRateLimit: true,
    });
  }

  async assertReady(): Promise<void> {
    const [version, mint] = await Promise.all([
      this.connection.getVersion(),
      fetchPwrcMint(this.connection, this.config.mint),
    ]);
    if (!version["solana-core"]) {
      throw new Error("RPC did not return a valid Solana core version.");
    }
    if (!mint.isInitialized) {
      throw new Error("PWRC mint is not initialized.");
    }
  }

  quoteTransfer(amount: string): PwrcTransferQuote {
    return quotePwrcTransfer(amount);
  }

  async getBalance(owner: PublicKey): Promise<bigint> {
    const account = getPwrcAssociatedTokenAddress({ owner, mint: this.config.mint });
    const response = await this.connection.getTokenAccountBalance(account, this.config.commitment);
    return BigInt(response.value.amount);
  }

  async prepareTransfer(input: PrepareTransferInput): Promise<PreparedPwrcTransfer> {
    if (input.owner.equals(input.recipient)) {
      throw new Error("PWRC transfer recipient must differ from the owner.");
    }
    const amountBaseUnits = parsePwrcAmount(input.amount);
    const quote = quotePwrcTransfer(input.amount);
    const sourceTokenAccount = getPwrcAssociatedTokenAddress({ owner: input.owner, mint: this.config.mint });
    const destinationTokenAccount = getPwrcAssociatedTokenAddress({ owner: input.recipient, mint: this.config.mint });
    const instructions: TransactionInstruction[] = [];

    if (input.createRecipientAccount ?? true) {
      const destinationInfo = await this.connection.getAccountInfo(destinationTokenAccount, this.config.commitment);
      if (destinationInfo === null) {
        instructions.push(createPwrcAssociatedTokenAccountInstruction({
          payer: input.owner,
          owner: input.recipient,
          mint: this.config.mint,
        }));
      }
    }

    instructions.push(createPwrcTransferInstruction({
      source: sourceTokenAccount,
      mint: this.config.mint,
      destination: destinationTokenAccount,
      owner: input.owner,
      amountBaseUnits,
    }));

    return Object.freeze({
      quote,
      sourceTokenAccount,
      destinationTokenAccount,
      instructions: Object.freeze(instructions),
    });
  }

  async sendPreparedTransfer(input: {
    readonly prepared: PreparedPwrcTransfer;
    readonly payer: Signer;
    readonly additionalSigners?: readonly Signer[];
    readonly sendOptions?: SendOptions;
  }): Promise<{ readonly signature: string; readonly explorerUrl: string }> {
    const latest = await this.connection.getLatestBlockhash(this.config.commitment);
    const transaction = new Transaction({
      feePayer: input.payer.publicKey,
      blockhash: latest.blockhash,
      lastValidBlockHeight: latest.lastValidBlockHeight,
    }).add(...input.prepared.instructions);

    transaction.sign(input.payer, ...(input.additionalSigners ?? []));
    const signature = await this.connection.sendRawTransaction(
      transaction.serialize(),
      { maxRetries: 3, preflightCommitment: this.config.commitment, ...input.sendOptions },
    );
    await this.connection.confirmTransaction({ signature, ...latest }, this.config.commitment);
    return Object.freeze({
      signature,
      explorerUrl: buildExplorerUrl({
        entity: "transaction",
        value: signature,
        cluster: this.config.cluster,
        provider: this.config.explorer === "solana" ? "solana-explorer" : "solscan",
        ...(this.config.cluster === "localnet" ? { customRpcUrl: this.config.rpcEndpoint } : {}),
      }),
    });
  }

  tokenExplorerUrl(): string {
    return buildExplorerUrl({
      entity: "token",
      value: this.config.mint.toBase58(),
      cluster: this.config.cluster,
      provider: this.config.explorer === "solana" ? "solana-explorer" : "solscan",
      ...(this.config.cluster === "localnet" ? { customRpcUrl: this.config.rpcEndpoint } : {}),
    });
  }
}

export function createPowerChainClient(config: PowerChainClientConfig): PowerChainClient {
  return new PowerChainClient(config);
}
