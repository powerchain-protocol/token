import { Logo } from "./logo";
import { Card } from "./ui/card";
import { Web3Icon } from "./web3-icon";

const FEATURES = [
  { title: "Token-2022 native asset", description: "PWRC uses a frozen 9-decimal profile with explicit transfer-fee, metadata, and authority invariants.", type: "network", icon: "solana" },
  { title: "PowerPay settlement", description: "SOL, USDC, and PWRC payment flows use exact integer accounting, signed wallet execution, and auditable lifecycle states.", type: "token", icon: "usdc" },
  { title: "Wallet-controlled execution", description: "Quotes and transaction construction remain separate from wallet approval, preserving non-custodial execution boundaries.", type: "wallet", icon: "phantom" },
  { title: "Devnet testing", description: "Native SOL and the separate tPWRC test profile remain isolated from production authority and treasury boundaries.", type: "token", icon: "sol" },
] as const;

export function Features() {
  return (
    <section className="section-shell capability-section" aria-labelledby="features-title">
      <span className="eyebrow">Platform capabilities</span>
      <h2 id="features-title">Built for secure programmable settlement</h2>
      <div className="capability-grid">
        {FEATURES.map((feature) => (
          <Card key={feature.title} className="capability-card">
            <div className="capability-icons" aria-hidden="true">
              <Logo iconOnly size={38} />
              <span className="icon-connector" />
              <Web3Icon type={feature.type} name={feature.icon} size={38} />
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
