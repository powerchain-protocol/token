import type { NextRequest } from "next/server";
import { corsJson, corsOptions } from "../../../lib/cors";
import { API_V1 } from "../../../config/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function OPTIONS(request: NextRequest) {
  return corsOptions(request);
}

export function GET(request: NextRequest) {
  return corsJson(request, {
    ok: true,
    service: "powerchain-api",
    version: "v1",
    productionDeployment: false,
    documentation: API_V1.openapi,
    routes: API_V1,
  });
}
