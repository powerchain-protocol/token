import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  createAssociatedTokenAccountIdempotentInstruction,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import { PublicKey, type TransactionInstruction } from "@solana/web3.js";

export function getPwrcAssociatedTokenAddress(input: {
  readonly mint: PublicKey;
  readonly owner: PublicKey;
  readonly allowOwnerOffCurve?: boolean;
}): PublicKey {
  return getAssociatedTokenAddressSync(
    input.mint,
    input.owner,
    input.allowOwnerOffCurve ?? false,
    TOKEN_2022_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
  );
}

export function createPwrcAssociatedTokenAccountInstruction(input: {
  readonly payer: PublicKey;
  readonly mint: PublicKey;
  readonly owner: PublicKey;
  readonly associatedTokenAccount?: PublicKey;
}): TransactionInstruction {
  const associatedTokenAccount =
    input.associatedTokenAccount ??
    getPwrcAssociatedTokenAddress({ mint: input.mint, owner: input.owner });

  return createAssociatedTokenAccountIdempotentInstruction(
    input.payer,
    associatedTokenAccount,
    input.owner,
    input.mint,
    TOKEN_2022_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
  );
}
