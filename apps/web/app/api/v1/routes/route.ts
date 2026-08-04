import { NextResponse } from "next/server";
import { APP_ROUTES, EXTERNAL_ROUTES } from "../../../../lib/routes";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    { ok: true, version: "v1", application: APP_ROUTES, external: EXTERNAL_ROUTES },
    { headers: { "cache-control": "no-store" } },
  );
}
