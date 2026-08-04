import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  ComputeBudgetProgram,
  PublicKey,
  SystemProgram,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY,
} from "@solana/web3.js";

/** Canonical Solana program IDs used by the PWRC integration. */
export const SOLANA_PROGRAM_IDS = Object.freeze({
  system: SystemProgram.programId,
  tokenLegacy: TOKEN_PROGRAM_ID,
  token2022: TOKEN_2022_PROGRAM_ID,
  associatedToken: ASSOCIATED_TOKEN_PROGRAM_ID,
  computeBudget: ComputeBudgetProgram.programId,
  memoV2: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
  metaplexTokenMetadata: new PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
  ),
  sysvarClock: SYSVAR_CLOCK_PUBKEY,
  sysvarRent: SYSVAR_RENT_PUBKEY,
});

export const SOLANA_PROGRAM_ID_STRINGS = Object.freeze(
  Object.fromEntries(
    Object.entries(SOLANA_PROGRAM_IDS).map(([name, address]) => [
      name,
      address.toBase58(),
    ]),
  ) as Record<keyof typeof SOLANA_PROGRAM_IDS, string>,
);

export type SupportedTokenProgram = "token-2022" | "spl-token";

export function getTokenProgramId(
  program: SupportedTokenProgram = "token-2022",
): PublicKey {
  return program === "token-2022" ? TOKEN_2022_PROGRAM_ID : TOKEN_PROGRAM_ID;
}

export function isSupportedTokenProgramId(programId: PublicKey): boolean {
  return (
    programId.equals(TOKEN_2022_PROGRAM_ID) || programId.equals(TOKEN_PROGRAM_ID)
  );
}

export function assertPwrcTokenProgramId(programId: PublicKey): void {
  if (!programId.equals(TOKEN_2022_PROGRAM_ID)) {
    throw new Error(
      `PWRC requires the Token-2022 Program (${TOKEN_2022_PROGRAM_ID.toBase58()}); received ${programId.toBase58()}`,
    );
  }
}
