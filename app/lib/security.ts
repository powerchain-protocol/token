import { PublicKey } from "@solana/web3.js";
import {
  APPROVED_PWRC_MINT_ADDRESS,
  MAINNET_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ADDRESS,
} from "./constants";

const SYSTEM_PROGRAM_ID = "11111111111111111111111111111111";

export function assertApprovedPwrcMint(value: string): PublicKey {
  const normalized = new PublicKey(value).toBase58();
  if (normalized !== APPROVED_PWRC_MINT_ADDRESS) {
    throw new Error("Only the canonical PWRC mint is permitted.");
  }
  return new PublicKey(normalized);
}

export function assertToken2022Owner(value: PublicKey): void {
  if (value.toBase58() !== TOKEN_2022_PROGRAM_ADDRESS) {
    throw new Error("PWRC accounts must be owned by SPL Token-2022.");
  }
}

export function getConfiguredMainnetProgramId(): PublicKey {
  if (!MAINNET_PROGRAM_ID || MAINNET_PROGRAM_ID === "TBA") {
    throw new Error("The PowerChain mainnet program ID is not configured.");
  }
  const programId = new PublicKey(MAINNET_PROGRAM_ID);
  if (programId.toBase58() === SYSTEM_PROGRAM_ID) {
    throw new Error("The System Program cannot be used as the PowerChain program ID.");
  }
  if (programId.toBase58() === APPROVED_PWRC_MINT_ADDRESS) {
    throw new Error("The PWRC mint cannot also be the PowerChain program ID.");
  }
  return programId;
}

export function createSignInMessage(input: {
  wallet: string;
  nonce: string;
  issuedAt: string;
}): Uint8Array {
  const message = [
    "PowerChain Wallet Authentication",
    `Wallet: ${input.wallet}`,
    `Mint: ${APPROVED_PWRC_MINT_ADDRESS}`,
    `Nonce: ${input.nonce}`,
    `Issued At: ${input.issuedAt}`,
    "Purpose: Authenticate this browser session. This does not authorize token transfers.",
  ].join("\n");
  return new TextEncoder().encode(message);
}
