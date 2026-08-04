import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  return NextResponse.redirect(new URL("/api/v1/swagger.yaml", request.url), 307);
}
