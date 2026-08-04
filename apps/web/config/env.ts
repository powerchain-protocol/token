function readPublicUrl(name: string, fallback: string): string {
  const value = process.env[name]?.trim();
  const candidate = value || fallback;
  const url = new URL(candidate);
  if (url.protocol !== "https:" && url.hostname !== "localhost") {
    throw new Error(`${name} must use HTTPS outside localhost.`);
  }
  return url.toString().replace(/\/$/, "");
}

export const PUBLIC_ENV = Object.freeze({
  cluster: process.env.NEXT_PUBLIC_SOLANA_CLUSTER?.trim() || "devnet",
  rpcUrl: readPublicUrl("NEXT_PUBLIC_SOLANA_RPC_URL", "https://api.devnet.solana.com"),
  siteUrl: readPublicUrl("NEXT_PUBLIC_SITE_URL", "https://powerchain.energy"),
  apiUrl: readPublicUrl("NEXT_PUBLIC_API_URL", "https://api.powerchain.energy/api/v1"),
} as const);
