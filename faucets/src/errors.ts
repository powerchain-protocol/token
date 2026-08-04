export enum FaucetErrorCode {
  InvalidCluster = "FAUCET_INVALID_CLUSTER",
  InvalidRecipient = "FAUCET_INVALID_RECIPIENT",
  InvalidAmount = "FAUCET_INVALID_AMOUNT",
  AmountLimitExceeded = "FAUCET_AMOUNT_LIMIT_EXCEEDED",
  RateLimitExceeded = "FAUCET_RATE_LIMIT_EXCEEDED",
  TreasuryBalanceLow = "FAUCET_TREASURY_BALANCE_LOW",
  TreasuryReserveViolation = "FAUCET_TREASURY_RESERVE_VIOLATION",
  MintMismatch = "FAUCET_MINT_MISMATCH",
  TokenProgramMismatch = "FAUCET_TOKEN_PROGRAM_MISMATCH",
  MissingTreasurySigner = "FAUCET_MISSING_TREASURY_SIGNER",
  TransactionExpired = "FAUCET_TRANSACTION_EXPIRED",
  SimulationFailed = "FAUCET_SIMULATION_FAILED",
  SubmissionFailed = "FAUCET_SUBMISSION_FAILED",
  InvalidKeypair = "FAUCET_INVALID_KEYPAIR",
  InsecureKeypair = "FAUCET_INSECURE_KEYPAIR",
  KeypairMismatch = "FAUCET_KEYPAIR_MISMATCH",
  AirdropUnavailable = "FAUCET_AIRDROP_UNAVAILABLE",
  Disabled = "FAUCET_DISABLED"
}

export class FaucetError extends Error {
  constructor(
    readonly code: FaucetErrorCode,
    message: string,
    readonly retryable = false,
    readonly cause?: unknown,
  ) {
    super(message);
    this.name = "FaucetError";
  }
}
