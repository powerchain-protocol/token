import {
  ComputeBudgetProgram,
  PublicKey,
  Transaction,
  TransactionMessage,
  VersionedTransaction,
  type BlockhashWithExpiryBlockHeight,
  type TransactionInstruction,
} from "@solana/web3.js";

export interface PwrcTransactionPlan {
  readonly payer: PublicKey;
  readonly instructions: readonly TransactionInstruction[];
  readonly computeUnitLimit?: number;
  readonly computeUnitPriceMicroLamports?: number;
}

function validateComputeBudget(plan: PwrcTransactionPlan): void {
  if (plan.computeUnitLimit !== undefined &&
      (!Number.isSafeInteger(plan.computeUnitLimit) || plan.computeUnitLimit < 10_000 || plan.computeUnitLimit > 1_400_000)) {
    throw new RangeError("computeUnitLimit must be 10,000–1,400,000.");
  }
  if (plan.computeUnitPriceMicroLamports !== undefined &&
      (!Number.isSafeInteger(plan.computeUnitPriceMicroLamports) || plan.computeUnitPriceMicroLamports < 0)) {
    throw new RangeError("computeUnitPriceMicroLamports must be a non-negative safe integer.");
  }
  if (plan.instructions.length === 0) throw new Error("Transaction plan requires at least one instruction.");
}

export function withComputeBudget(plan: PwrcTransactionPlan): readonly TransactionInstruction[] {
  validateComputeBudget(plan);
  const instructions: TransactionInstruction[] = [];
  if (plan.computeUnitLimit !== undefined) {
    instructions.push(ComputeBudgetProgram.setComputeUnitLimit({ units: plan.computeUnitLimit }));
  }
  if (plan.computeUnitPriceMicroLamports !== undefined) {
    instructions.push(ComputeBudgetProgram.setComputeUnitPrice({ microLamports: plan.computeUnitPriceMicroLamports }));
  }
  instructions.push(...plan.instructions);
  return Object.freeze(instructions);
}

export function buildLegacyPwrcTransaction(
  plan: PwrcTransactionPlan,
  latest: BlockhashWithExpiryBlockHeight,
): Transaction {
  return new Transaction({
    feePayer: plan.payer,
    blockhash: latest.blockhash,
    lastValidBlockHeight: latest.lastValidBlockHeight,
  }).add(...withComputeBudget(plan));
}

export function buildVersionedPwrcTransaction(
  plan: PwrcTransactionPlan,
  latest: BlockhashWithExpiryBlockHeight,
): VersionedTransaction {
  const message = new TransactionMessage({
    payerKey: plan.payer,
    recentBlockhash: latest.blockhash,
    instructions: [...withComputeBudget(plan)],
  }).compileToV0Message();
  return new VersionedTransaction(message);
}
