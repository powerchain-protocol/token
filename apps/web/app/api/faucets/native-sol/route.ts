import { createHash } from "node:crypto";
import nacl from "tweetnacl";
import { Connection, PublicKey } from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";
import {
  NATIVE_SOL_FAUCET_AMOUNT_LAMPORTS,
  NATIVE_SOL_FAUCET_AMOUNT_SOL,
  SOLANA_DEVNET_CLUSTER,
  getServerDevnetRpcUrl,
} from "../../../../lib/constants";
import {
  createSignInMessage,
  isAuthenticationChallengeCurrent,
  type WalletAuthenticationChallenge,
} from "../../../../lib/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REQUEST_WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 1;
const MAX_LAMPORTS_PER_DAY = 4_000_000_000;
const CONFIRMATION_TIMEOUT_MS = 30_000;
const POLL_INTERVAL_MS = 500;
const MAX_REQUEST_BYTES = 16_384;

type Usage = {
  day: string;
  distributedLamports: number;
  requestCount: number;
  windowStartedAt: number;
};

type WalletProof = {
  wallet?: unknown;
  message?: unknown;
  signature?: unknown;
  challenge?: unknown;
};

type NativeSolRequestBody = {
  recipient?: unknown;
  proof?: unknown;
};

const globalState = globalThis as typeof globalThis & {
  __powerchainNativeSolUsage?: Map<string, Usage>;
  __powerchainNativeSolIpUsage?: Map<string, Usage>;
  __powerchainNativeSolActive?: Set<string>;
};

const usage = globalState.__powerchainNativeSolUsage ??= new Map<string, Usage>();
const ipUsage = globalState.__powerchainNativeSolIpUsage ??= new Map<string, Usage>();
const active = globalState.__powerchainNativeSolActive ??= new Set<string>();

function decodeBase64(value: string): Uint8Array {
  return new Uint8Array(Buffer.from(value, "base64"));
}

function requestFingerprint(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const source = forwarded || request.headers.get("x-real-ip") || "unknown";
  return createHash("sha256").update(source).digest("hex").slice(0, 24);
}

function parseRecipient(value: unknown): PublicKey {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error("A Solana-compatible recipient address is required.");
  }
  try {
    return new PublicKey(value.trim());
  } catch {
    throw new Error("Recipient must be a valid Solana wallet address.");
  }
}

function assertOptionalAuthentication(
  request: NextRequest,
  proof: unknown,
  recipient: PublicKey,
): void {
  if (proof === undefined || proof === null) return;
  if (typeof proof !== "object") throw new Error("Wallet authentication proof is malformed.");

  const body = proof as WalletProof;
  if (
    typeof body.wallet !== "string" ||
    typeof body.message !== "string" ||
    typeof body.signature !== "string" ||
    typeof body.challenge !== "object" ||
    body.challenge === null
  ) {
    throw new Error("A complete wallet authentication proof is required.");
  }

  const challenge = body.challenge as WalletAuthenticationChallenge;
  const wallet = new PublicKey(body.wallet.trim());
  const origin = new URL(request.url).origin;

  if (!wallet.equals(recipient)) {
    throw new Error("Authenticated wallet must match the faucet recipient.");
  }
  if (challenge.uri !== origin || challenge.domain !== new URL(origin).host) {
    throw new Error("Wallet proof origin does not match this application.");
  }
  if (!isAuthenticationChallengeCurrent(challenge, wallet.toBase58())) {
    throw new Error("Wallet authentication proof is invalid or expired.");
  }

  const expectedMessage = new TextDecoder().decode(createSignInMessage(challenge));
  if (body.message !== expectedMessage) {
    throw new Error("Wallet authentication message does not match its challenge.");
  }

  const valid = nacl.sign.detached.verify(
    new TextEncoder().encode(body.message),
    decodeBase64(body.signature),
    wallet.toBytes(),
  );
  if (!valid) throw new Error("Wallet authentication signature is invalid.");
}

function reserve(store: Map<string, Usage>, key: string, label: string): Usage | null {
  const now = Date.now();
  const day = new Date(now).toISOString().slice(0, 10);
  const previous = store.get(key) ?? null;
  const sameWindow = Boolean(previous && now - previous.windowStartedAt < REQUEST_WINDOW_MS);
  const requestCount = sameWindow && previous ? previous.requestCount + 1 : 1;
  const distributedLamports =
    (previous?.day === day ? previous.distributedLamports : 0) +
    NATIVE_SOL_FAUCET_AMOUNT_LAMPORTS;

  if (requestCount > MAX_REQUESTS_PER_WINDOW) {
    throw new Error(`${label} faucet request limit exceeded. Try again later.`);
  }
  if (distributedLamports > MAX_LAMPORTS_PER_DAY) {
    throw new Error(`${label} daily faucet allowance exceeded.`);
  }

  store.set(key, {
    day,
    distributedLamports,
    requestCount,
    windowStartedAt: sameWindow && previous ? previous.windowStartedAt : now,
  });
  return previous;
}

function rollback(store: Map<string, Usage>, key: string, previous: Usage | null): void {
  if (previous) store.set(key, previous);
  else store.delete(key);
}

async function confirmSignature(connection: Connection, signature: string): Promise<void> {
  const deadline = Date.now() + CONFIRMATION_TIMEOUT_MS;
  while (Date.now() < deadline) {
    const response = await connection.getSignatureStatuses([signature], {
      searchTransactionHistory: true,
    });
    const status = response.value[0];
    if (status?.err) throw new Error(`Airdrop transaction failed: ${JSON.stringify(status.err)}`);
    if (status?.confirmationStatus === "confirmed" || status?.confirmationStatus === "finalized") return;
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }
  throw new Error("Timed out while confirming the devnet airdrop.");
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    enabled: process.env.NATIVE_SOL_FAUCET_ENABLED !== "false",
    cluster: SOLANA_DEVNET_CLUSTER,
    amountSol: NATIVE_SOL_FAUCET_AMOUNT_SOL,
    amountLamports: NATIVE_SOL_FAUCET_AMOUNT_LAMPORTS,
    recipientType: "solana-address",
    authentication: "optional-matching-wallet-proof",
  });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (process.env.NATIVE_SOL_FAUCET_ENABLED === "false") {
    return NextResponse.json({ error: "Native SOL faucet is disabled." }, { status: 503 });
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_REQUEST_BYTES) {
    return NextResponse.json({ error: "Faucet request body is too large." }, { status: 413 });
  }

  let walletKey = "";
  let ipKey = "";
  let previousWallet: Usage | null = null;
  let previousIp: Usage | null = null;
  try {
    const body = (await request.json()) as NativeSolRequestBody;
    const recipient = parseRecipient(body.recipient);
    assertOptionalAuthentication(request, body.proof, recipient);
    walletKey = recipient.toBase58();
    ipKey = requestFingerprint(request);

    if (active.has(walletKey)) {
      return NextResponse.json(
        { error: "A native SOL faucet request is already in progress for this address." },
        { status: 429 },
      );
    }

    active.add(walletKey);
    previousWallet = reserve(usage, walletKey, "Address");
    previousIp = reserve(ipUsage, ipKey, "Client");

    const connection = new Connection(getServerDevnetRpcUrl(), "confirmed");
    const signature = await connection.requestAirdrop(
      recipient,
      NATIVE_SOL_FAUCET_AMOUNT_LAMPORTS,
    );
    await confirmSignature(connection, signature);

    return NextResponse.json({
      cluster: SOLANA_DEVNET_CLUSTER,
      recipient: walletKey,
      signature,
      amountLamports: NATIVE_SOL_FAUCET_AMOUNT_LAMPORTS,
      amountSol: NATIVE_SOL_FAUCET_AMOUNT_SOL,
      explorerUrl: `https://solscan.io/tx/${signature}?cluster=devnet`,
    });
  } catch (error) {
    if (walletKey) rollback(usage, walletKey, previousWallet);
    if (ipKey) rollback(ipUsage, ipKey, previousIp);
    const message = error instanceof Error ? error.message : "Native SOL faucet request failed.";
    const status = /limit|allowance|progress/i.test(message)
      ? 429
      : /required|valid|proof|signature|origin|wallet|recipient|match/i.test(message)
        ? 400
        : 503;
    return NextResponse.json({ error: message }, { status });
  } finally {
    if (walletKey) active.delete(walletKey);
  }
}
