import type { NextRequest } from "next/server";
import { corsJson, corsOptions } from "../../../../lib/cors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function OPTIONS(request: NextRequest) {
  return corsOptions(request);
}

export function GET(request: NextRequest) {
  return corsJson(request, {
    ok: true,
    service: "powerchain-api-v1",
    release: "1.0.0-rc.1",
    productionDeployment: false,
    timestamp: new Date().toISOString(),
  });
}
