import type { Metadata } from "next";
import { PageShell } from "../../components/page-shell";
import { Card } from "../../components/ui/card";

export const metadata: Metadata = { title: "Status" };

export default function StatusPage() {
  return (
    <PageShell>
      <section className="route-hero"><span className="eyebrow">System status</span><h1>Release readiness</h1><p>Production remains gated until program IDs, audits, authority ceremonies, and on-chain evidence are verified.</p></section>
      <section className="security-grid">
        <Card><h3>PWRC</h3><p>Canonical mint configured; independent production verification remains required.</p></Card>
        <Card><h3>PowerPay</h3><p>Mainnet program ID is TBA and production deployment is disabled.</p></Card>
        <Card><h3>tPWRC</h3><p>Devnet mint remains TBA until created and verified.</p></Card>
      </section>
    </PageShell>
  );
}
