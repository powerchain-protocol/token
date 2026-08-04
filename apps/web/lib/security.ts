import { PublicKey } from "@solana/web3.js";
import {
  APPROVED_PWRC_MINT_ADDRESS,
  MAINNET_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ADDRESS,
} from "./constants";

const SYSTEM_PROGRAM_ID = "11111111111111111111111111111111";
export const WALLET_AUTH_CHAIN = "solana:mainnet-beta" as const;
export const WALLET_AUTH_TTL_MS = 5 * 60 * 1000;

export type WalletAuthenticationChallenge = {
  domain: string;
  uri: string;
  wallet: string;
  nonce: string;
  requestId: string;
  issuedAt: string;
  expiresAt: string;
};

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

export function createWalletAuthenticationChallenge(input: {
  wallet: string;
  nonce?: string;
  requestId?: string;
  now?: Date;
  origin?: string;
}): WalletAuthenticationChallenge {
  const now = input.now ?? new Date();
  const origin = input.origin ?? "https://powerchain.energy";
  const url = new URL(origin);
  const expiresAt = new Date(now.getTime() + WALLET_AUTH_TTL_MS);

  return {
    domain: url.host,
    uri: url.origin,
    wallet: new PublicKey(input.wallet).toBase58(),
    nonce: input.nonce ?? crypto.randomUUID(),
    requestId: input.requestId ?? crypto.randomUUID(),
    issuedAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };
}

export function createSignInMessage(challenge: WalletAuthenticationChallenge): Uint8Array {
  const message = [
    `${challenge.domain} requests a PowerChain wallet authentication signature.`,
    "",
    `Wallet: ${challenge.wallet}`,
    `URI: ${challenge.uri}`,
    `Chain: ${WALLET_AUTH_CHAIN}`,
    `Mint: ${APPROVED_PWRC_MINT_ADDRESS}`,
    `Nonce: ${challenge.nonce}`,
    `Request ID: ${challenge.requestId}`,
    `Issued At: ${challenge.issuedAt}`,
    `Expiration Time: ${challenge.expiresAt}`,
    "Purpose: Authenticate this browser session. This does not authorize token transfers.",
  ].join("\n");
  return new TextEncoder().encode(message);
}

export function isAuthenticationChallengeCurrent(
  challenge: WalletAuthenticationChallenge,
  wallet: string,
  now = new Date(),
): boolean {
  return (
    challenge.wallet === new PublicKey(wallet).toBase58() &&
    challenge.expiresAt > now.toISOString() &&
    challenge.issuedAt <= now.toISOString()
  );
}
