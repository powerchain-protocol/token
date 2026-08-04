import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    data: [
      {
        id: "native-token",
        name: "PWRC Native Token",
        standard: "PTK-001",
        path: "programs/native-token",
        programId: "TBA",
        productionDeployment: false,
      },
      {
        id: "powerpay",
        name: "PowerPay",
        standard: "PPAY-001",
        path: "programs/powerpay",
        programId: "TBA",
        productionDeployment: false,
      },
    ],
    disclaimer: "Source validation does not imply deployment, audit completion, or mainnet availability.",
  }, { headers: { "Cache-Control": "no-store" } });
}
