import { FaucetInterface } from "../components/faucet-interface";
import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { MintAccount } from "../components/mint-account";
import { Hero } from "../components/hero";
import { Card } from "../components/ui/card";

export default function Page() {
  return (
    <main>
      <Header />
      <Hero />
      <section className="mint-section"><MintAccount /></section>
      <section className="security-grid" id="security">
        <Card><span className="eyebrow">Asset boundary</span><h3>Approved mint only</h3><p>Every PWRC operation validates the canonical mint and Token-2022 ownership before building a transaction.</p></Card>
        <Card><span className="eyebrow">Authentication</span><h3>Wallet signature</h3><p>Users sign a human-readable nonce. The signature authenticates the session and is separate from transaction approval.</p></Card>
        <Card><span className="eyebrow">Authority</span><h3>Governance controlled</h3><p>Mainnet authorities must be configured independently through governance, multisig, and timelock controls.</p></Card>
      </section>
      <FaucetInterface />
      <Footer />
    </main>
  );
}
