import type { Metadata } from "next";
import { MarketGrid } from "../../components/market-grid";
import { PageShell } from "../../components/page-shell";
import { PowerPayHero } from "../../components/powerpay-hero";

export const metadata: Metadata = {
  title: "PowerPay",
  description: "Non-custodial SOL, USDC, and PWRC payment and settlement infrastructure.",
};

export default function PaymentsPage() {
  return (
    <PageShell>
      <PowerPayHero />
      <MarketGrid />
    </PageShell>
  );
}
