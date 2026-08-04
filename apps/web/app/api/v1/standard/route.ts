import { PPAY_001, PTK_001 } from "@powerchain/standards";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    { ok: true, standards: [PTK_001, PPAY_001] },
    { headers: { "cache-control": "public, max-age=60, stale-while-revalidate=300" } },
  );
}
