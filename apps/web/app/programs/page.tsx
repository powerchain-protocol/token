import type { Metadata } from "next";
import { PageShell } from "../../components/page-shell";
import { ProgramTestConsole } from "../../components/tools/program-test-console";

export const metadata: Metadata = {
  title: "Programs",
  description: "PowerChain native-token and PowerPay program architecture, testing, and deployment-readiness controls.",
};

export default function ProgramsPage() {
  return (
    <PageShell>
      <section className="route-hero program-route-hero">
        <span className="eyebrow">Solana programs</span>
        <h1>Program testing, conformance, and release controls.</h1>
        <p>Inspect the canonical program profiles, security boundaries, test commands, and evidence-driven deployment status for PWRC and PowerPay.</p>
      </section>
      <section className="section-shell"><ProgramTestConsole /></section>
    </PageShell>
  );
}
