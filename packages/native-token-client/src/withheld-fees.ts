import {
  TOKEN_2022_PROGRAM_ID,
  createHarvestWithheldTokensToMintInstruction,
  createWithdrawWithheldTokensFromAccountsInstruction,
  createWithdrawWithheldTokensFromMintInstruction,
} from "@solana/spl-token";
import { PublicKey, type TransactionInstruction } from "@solana/web3.js";
import {
  assertBoundedPublicKeys,
  assertDifferentPublicKeys,
  assertDistinctPublicKeys,
} from "./validation.js";

function assertSigners(signers: readonly PublicKey[]): void {
  assertDistinctPublicKeys(signers, "multisigSigners");
  if (signers.length > 11) throw new RangeError("Solana multisig supports at most 11 signer public keys.");
}

/** Permissionless collection of withheld fees from token accounts into the mint. */
export function createPwrcHarvestWithheldFeesInstruction(input: {
  readonly mint: PublicKey;
  readonly sourceTokenAccounts: readonly PublicKey[];
}): TransactionInstruction {
  assertBoundedPublicKeys(input.sourceTokenAccounts, "sourceTokenAccounts");
  return createHarvestWithheldTokensToMintInstruction(
    input.mint,
    [...input.sourceTokenAccounts],
    TOKEN_2022_PROGRAM_ID,
  );
}

/** Authority-gated withdrawal of fees previously harvested into the mint. */
export function createPwrcWithdrawWithheldFeesFromMintInstruction(input: {
  readonly mint: PublicKey;
  readonly destinationTokenAccount: PublicKey;
  readonly withdrawWithheldAuthority: PublicKey;
  readonly multisigSigners?: readonly PublicKey[];
}): TransactionInstruction {
  assertDifferentPublicKeys(
    input.destinationTokenAccount,
    input.mint,
    "Fee destination token account cannot equal the mint address.",
  );
  const signers = input.multisigSigners ?? [];
  assertSigners(signers);
  return createWithdrawWithheldTokensFromMintInstruction(
    input.mint,
    input.destinationTokenAccount,
    input.withdrawWithheldAuthority,
    [...signers],
    TOKEN_2022_PROGRAM_ID,
  );
}

/** Authority-gated direct withdrawal from token accounts to the fee receiver. */
export function createPwrcWithdrawWithheldFeesFromAccountsInstruction(input: {
  readonly mint: PublicKey;
  readonly destinationTokenAccount: PublicKey;
  readonly withdrawWithheldAuthority: PublicKey;
  readonly sourceTokenAccounts: readonly PublicKey[];
  readonly multisigSigners?: readonly PublicKey[];
}): TransactionInstruction {
  assertBoundedPublicKeys(input.sourceTokenAccounts, "sourceTokenAccounts");
  if (input.sourceTokenAccounts.some((source) => source.equals(input.destinationTokenAccount))) {
    throw new Error("Fee destination cannot also be a source token account.");
  }
  const signers = input.multisigSigners ?? [];
  assertSigners(signers);
  return createWithdrawWithheldTokensFromAccountsInstruction(
    input.mint,
    input.destinationTokenAccount,
    input.withdrawWithheldAuthority,
    [...signers],
    [...input.sourceTokenAccounts],
    TOKEN_2022_PROGRAM_ID,
  );
}
