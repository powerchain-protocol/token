import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { TOKEN_2022_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@powerchain/native-token-client";

export interface FaucetAccounts {
  readonly mint: PublicKey;
  readonly treasuryOwner: PublicKey;
  readonly treasuryTokenAccount: PublicKey;
  readonly recipientOwner: PublicKey;
  readonly recipientTokenAccount: PublicKey;
}

export function deriveFaucetAccounts(args: {
  mint: PublicKey;
  treasuryOwner: PublicKey;
  recipientOwner: PublicKey;
}): FaucetAccounts {
  if (args.treasuryOwner.equals(args.recipientOwner)) throw new Error("Treasury and recipient owners must be distinct.");
  return Object.freeze({
    ...args,
    treasuryTokenAccount: getAssociatedTokenAddressSync(
      args.mint, args.treasuryOwner, false, TOKEN_2022_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID,
    ),
    recipientTokenAccount: getAssociatedTokenAddressSync(
      args.mint, args.recipientOwner, false, TOKEN_2022_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID,
    ),
  });
}
