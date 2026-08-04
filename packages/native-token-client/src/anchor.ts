import {
  AnchorProvider,
  Program,
  type Idl,
  type Wallet,
} from "@coral-xyz/anchor";
import {
  Connection,
  PublicKey,
  type Commitment,
  type ConfirmOptions,
} from "@solana/web3.js";
import idl from "../../../idl/powerchain.json" with { type: "json" };
import { PLACEHOLDER_PROGRAM_ID } from "./constants.js";

export interface CreatePowerChainProgramOptions {
  readonly connection: Connection;
  readonly wallet: Wallet;
  readonly programId?: PublicKey;
  readonly commitment?: Commitment;
}

export function createPowerChainProgram(
  options: CreatePowerChainProgramOptions,
): Program {
  const programId = options.programId ?? PLACEHOLDER_PROGRAM_ID;
  if (programId.equals(PLACEHOLDER_PROGRAM_ID)) {
    throw new Error(
      "The PTK-001 IDL contains the System Program placeholder. Provide the verified deployed PowerChain program ID.",
    );
  }

  const confirmOptions: ConfirmOptions = {
    commitment: options.commitment ?? "confirmed",
    preflightCommitment: options.commitment ?? "confirmed",
  };
  const provider = new AnchorProvider(
    options.connection,
    options.wallet,
    confirmOptions,
  );

  return new Program({ ...(idl as Idl), address: programId.toBase58() }, provider);
}
