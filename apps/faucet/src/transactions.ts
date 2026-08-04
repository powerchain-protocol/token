import {
  createAssociatedTokenAccountIdempotentInstruction,
  createTransferCheckedWithFeeInstruction,
} from "@solana/spl-token";
import { PublicKey, type TransactionInstruction } from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  calculateTransferFeeBaseUnits,
} from "@powerchain/native-token-client";
import type { FaucetAccounts } from "./accounts.js";

export interface FaucetTransferPlan {
  readonly amountBaseUnits: bigint;
  readonly expectedFeeBaseUnits: bigint;
  readonly netAmountBaseUnits: bigint;
  readonly instructions: readonly TransactionInstruction[];
}

export function createFaucetTransferPlan(args: {
  accounts: FaucetAccounts;
  payer: PublicKey;
  amountBaseUnits: bigint;
}): FaucetTransferPlan {
  if (args.amountBaseUnits <= 0n) throw new RangeError("Faucet amount must be positive.");
  const fee = calculateTransferFeeBaseUnits(args.amountBaseUnits);
  if (fee >= args.amountBaseUnits) throw new RangeError("Faucet fee must be lower than the gross amount.");

  const instructions = [
    createAssociatedTokenAccountIdempotentInstruction(
      args.payer,
      args.accounts.recipientTokenAccount,
      args.accounts.recipientOwner,
      args.accounts.mint,
      TOKEN_2022_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    ),
    createTransferCheckedWithFeeInstruction(
      args.accounts.treasuryTokenAccount,
      args.accounts.mint,
      args.accounts.recipientTokenAccount,
      args.accounts.treasuryOwner,
      args.amountBaseUnits,
      9,
      fee,
      [],
      TOKEN_2022_PROGRAM_ID,
    ),
  ] as const;

  return Object.freeze({
    amountBaseUnits: args.amountBaseUnits,
    expectedFeeBaseUnits: fee,
    netAmountBaseUnits: args.amountBaseUnits - fee,
    instructions,
  });
}
