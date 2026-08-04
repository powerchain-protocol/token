import type { Metadata } from "next";
import { FaucetInterface } from "../../components/faucet-interface";
import { PageShell } from "../../components/page-shell";

export const metadata: Metadata = {
  title: "Devnet Faucets",
  description: "Request Solana devnet SOL and test tPWRC for integration testing.",
};

export default function FaucetPage() {
  return (
    <PageShell>
      <section className="route-hero">
        <span className="eyebrow">Solana devnet</span>
        <h1>Developer faucets</h1>
        <p>Authenticated test funding for native SOL and the separate tPWRC Token-2022 profile.</p>
      </section>
      <FaucetInterface />
    </PageShell>
  );
}
