import type { Metadata } from "next";
import { CheckCircledIcon, CodeIcon, LockClosedIcon } from "@radix-ui/react-icons";
import { MintAccount } from "../../components/mint-account";
import { PageShell } from "../../components/page-shell";
import { Card } from "../../components/ui/card";
import { API_V1 } from "../../config/api";

export const metadata: Metadata = {
  title: "PWRC Token",
  description: "Canonical PTK-001 PWRC Token-2022 mint and frozen economic profile.",
};

const controls = [
  { icon: CheckCircledIcon, title: "Frozen profile", text: "9 decimals and an 18.446 billion PWRC maximum supply." },
  { icon: LockClosedIcon, title: "Revoked authorities", text: "The verification surface fails closed if mint or freeze authority remains active." },
  { icon: CodeIcon, title: "Machine readable", text: `Inspect the canonical profile through ${API_V1.standards}.` },
] as const;

export default function TokenPage() {
  return (
    <PageShell>
      <section className="route-hero token-route-hero">
        <span className="eyebrow">PTK-001 · Token-2022</span>
        <h1>Canonical PWRC token</h1>
        <p>Verify the approved Token-2022 mint, exact supply ceiling, decimal precision, and revoked authorities against the frozen PowerChain profile.</p>
      </section>
      <section className="token-control-grid" aria-label="PWRC token controls">
        {controls.map(({ icon: Icon, title, text }) => (
          <Card className="token-control-card" key={title}>
            <Icon width={22} height={22} aria-hidden="true" />
            <h2>{title}</h2>
            <p>{text}</p>
          </Card>
        ))}
      </section>
      <section className="mint-section"><MintAccount /></section>
    </PageShell>
  );
}
