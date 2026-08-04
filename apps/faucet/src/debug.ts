import { createHash } from "node:crypto";

const MAX_EVENTS = 100;

export type FaucetDebugEvent = Readonly<{
  id: string;
  at: string;
  method: string;
  path: string;
  status: number;
  durationMs: number;
  walletFingerprint?: string;
  asset?: "SOL" | "tPWRC";
  note?: string;
}>;

const startedAt = Date.now();
const events: FaucetDebugEvent[] = [];
let requests = 0;
let failures = 0;

export function isFaucetDebugEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  return env.NODE_ENV !== "production" && env.FAUCET_DEBUG_MODE === "true";
}

export function fingerprintWallet(wallet: string | undefined): string | undefined {
  if (!wallet) return undefined;
  return createHash("sha256").update(wallet).digest("hex").slice(0, 12);
}

export function recordDebugEvent(event: Omit<FaucetDebugEvent, "id" | "at">): void {
  requests += 1;
  if (event.status >= 400) failures += 1;
  events.unshift({
    ...event,
    id: `${Date.now().toString(36)}-${requests.toString(36)}`,
    at: new Date().toISOString(),
  });
  if (events.length > MAX_EVENTS) events.length = MAX_EVENTS;
}

export function getDebugStatus(): Readonly<Record<string, unknown>> {
  return {
    enabled: true,
    mode: "development-only",
    cluster: "devnet",
    startedAt: new Date(startedAt).toISOString(),
    uptimeSeconds: Math.floor((Date.now() - startedAt) / 1_000),
    requestCount: requests,
    failureCount: failures,
    recentEventCount: events.length,
    policies: {
      nativeSolLamports: 2_000_000_000,
      nativeSolAmount: "2 SOL",
      tpwrcEnabled: process.env.TPWRC_FAUCET_ENABLED === "true",
      arbitraryExecution: false,
      privateKeyExposure: false,
      mainnetExecution: false,
    },
    environment: {
      nodeEnv: process.env.NODE_ENV ?? "development",
      port: process.env.PORT ?? "3015",
      rpcConfigured: Boolean(process.env.SOLANA_DEVNET_RPC_URL),
      publicRpcConfigured: Boolean(process.env.NEXT_PUBLIC_SOLANA_DEVNET_RPC_URL),
    },
  };
}

export function getDebugEvents(): readonly FaucetDebugEvent[] {
  return events;
}

export function simulateFaucetRequest(input: {
  wallet: string;
  asset: "SOL" | "tPWRC";
}): Readonly<Record<string, unknown>> {
  const amount = input.asset === "SOL" ? "2 SOL" : "Configured tPWRC allocation";
  const executable = input.asset === "SOL" || process.env.TPWRC_FAUCET_ENABLED === "true";

  return {
    ok: true,
    simulation: true,
    executionPerformed: false,
    cluster: "devnet",
    walletFingerprint: fingerprintWallet(input.wallet),
    asset: input.asset,
    amount,
    executable,
    blockedReason: executable ? null : "tPWRC faucet is disabled until the devnet mint is configured and verified.",
    checks: [
      "wallet format",
      "devnet-only policy",
      "asset allowlist",
      "rate-limit reservation preview",
      "no treasury or mainnet key access",
    ],
  };
}
