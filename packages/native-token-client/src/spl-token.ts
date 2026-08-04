import {
  ExtensionType,
  TOKEN_2022_PROGRAM_ID,
  createBurnCheckedInstruction,
  createInitializeTransferFeeConfigInstruction,
  createTransferCheckedWithFeeInstruction,
  getMint,
  getMintLen,
  getTransferFeeConfig,
  type Mint,
} from "@solana/spl-token";
import {
  PublicKey,
  TransactionInstruction,
  type Connection,
} from "@solana/web3.js";
import {
  PWRC_DECIMALS,
  PWRC_GENESIS_SUPPLY_BASE_UNITS,
  PWRC_MAX_TRANSFER_FEE_BASE_UNITS,
  PWRC_TRANSFER_FEE_BASIS_POINTS,
} from "./constants.js";
import { calculateTransferFeeBaseUnits } from "./amounts.js";

export const PWRC_REQUIRED_EXTENSIONS = [
  ExtensionType.TransferFeeConfig,
  ExtensionType.MetadataPointer,
  ExtensionType.TokenMetadata,
] as const;

export function getPwrcMintAccountSize(): number {
  return getMintLen([...PWRC_REQUIRED_EXTENSIONS]);
}

export function createPwrcTransferFeeConfigInstruction(input: {
  readonly mint: PublicKey;
  readonly transferFeeConfigAuthority: PublicKey | null;
  readonly withdrawWithheldAuthority: PublicKey | null;
  readonly maximumFeeBaseUnits?: bigint;
}): TransactionInstruction {
  return createInitializeTransferFeeConfigInstruction(
    input.mint,
    input.transferFeeConfigAuthority,
    input.withdrawWithheldAuthority,
    PWRC_TRANSFER_FEE_BASIS_POINTS,
    input.maximumFeeBaseUnits ?? PWRC_MAX_TRANSFER_FEE_BASE_UNITS,
    TOKEN_2022_PROGRAM_ID,
  );
}

export async function fetchPwrcMint(
  connection: Connection,
  mintAddress: PublicKey,
): Promise<Mint> {
  const mint = await getMint(
    connection,
    mintAddress,
    "confirmed",
    TOKEN_2022_PROGRAM_ID,
  );
  assertPwrcMint(mint);
  return mint;
}

export function assertPwrcMint(mint: Mint): void {
  if (mint.decimals !== PWRC_DECIMALS) {
    throw new Error(`PWRC mint decimals must be ${PWRC_DECIMALS}.`);
  }
  if (mint.supply > PWRC_GENESIS_SUPPLY_BASE_UNITS) {
    throw new Error("PWRC mint supply exceeds the PTK-001 maximum supply.");
  }
  if (mint.mintAuthority !== null) {
    throw new Error("Canonical PWRC requires the mint authority to be revoked after genesis.");
  }

  const transferFeeConfig = getTransferFeeConfig(mint);
  if (!transferFeeConfig) {
    throw new Error("Canonical PWRC requires the Token-2022 TransferFeeConfig extension.");
  }

  const older = transferFeeConfig.olderTransferFee;
  const newer = transferFeeConfig.newerTransferFee;
  const configuredBps = Math.max(older.transferFeeBasisPoints, newer.transferFeeBasisPoints);
  if (configuredBps !== PWRC_TRANSFER_FEE_BASIS_POINTS) {
    throw new Error(`PWRC transfer fee must be ${PWRC_TRANSFER_FEE_BASIS_POINTS} basis points.`);
  }
}

export function createPwrcTransferInstruction(input: {
  readonly source: PublicKey;
  readonly mint: PublicKey;
  readonly destination: PublicKey;
  readonly owner: PublicKey;
  readonly amountBaseUnits: bigint;
  readonly maximumFeeBaseUnits?: bigint;
}): TransactionInstruction {
  if (input.amountBaseUnits <= 0n) {
    throw new RangeError("Transfer amount must be positive.");
  }

  const fee = calculateTransferFeeBaseUnits(
    input.amountBaseUnits,
    PWRC_TRANSFER_FEE_BASIS_POINTS,
    input.maximumFeeBaseUnits ?? PWRC_MAX_TRANSFER_FEE_BASE_UNITS,
  );

  return createTransferCheckedWithFeeInstruction(
    input.source,
    input.mint,
    input.destination,
    input.owner,
    input.amountBaseUnits,
    PWRC_DECIMALS,
    fee,
    [],
    TOKEN_2022_PROGRAM_ID,
  );
}

export function createPwrcBurnInstruction(input: {
  readonly tokenAccount: PublicKey;
  readonly mint: PublicKey;
  readonly owner: PublicKey;
  readonly amountBaseUnits: bigint;
}): TransactionInstruction {
  if (input.amountBaseUnits <= 0n) {
    throw new RangeError("Burn amount must be positive.");
  }

  return createBurnCheckedInstruction(
    input.tokenAccount,
    input.mint,
    input.owner,
    input.amountBaseUnits,
    PWRC_DECIMALS,
    [],
    TOKEN_2022_PROGRAM_ID,
  );
}
