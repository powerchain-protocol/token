import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const commands = Object.freeze([
  "pnpm preflight",
  "pnpm dev:web",
  "pnpm start:faucet",
  "pnpm check:programs",
  "pnpm validate:workspace",
  "pnpm prepare:release",
]);

export async function GET() {
  return NextResponse.json({
    mode: "catalog-only",
    executionEnabled: false,
    commands,
    security: "The web API never accepts or executes arbitrary shell commands.",
  }, { headers: { "Cache-Control": "no-store" } });
}
