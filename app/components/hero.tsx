import Image from "next/image";
import { Logo } from "./logo";
import { APPROVED_PWRC_MINT_ADDRESS, SOLSCAN_PWRC_URL } from "../lib/constants";

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <Logo className="hero-brand" subtitle="PWRC · PTK-001" size={48} />
        <span className="eyebrow">PTK-001 · SPL Token-2022</span>
        <h1>PowerChain native currency infrastructure.</h1>
        <p>Secure wallet access, fee-aware transactions, verified token accounts, and governance-controlled program operations for PWRC.</p>
        <div className="hero-actions">
          <a className="primary-button" href="#faucet">Open devnet faucet</a>
          <a className="secondary-button" href={SOLSCAN_PWRC_URL} target="_blank" rel="noreferrer">View on Solscan</a>
        </div>
        <div className="mint-line"><span>Approved mint</span><code>{APPROVED_PWRC_MINT_ADDRESS}</code></div>
      </div>
      <div className="token-visual" aria-hidden="true">
        <div className="token-halo" />
        <Image src="/assets/token/pwrc.png" width={340} height={340} alt="" priority />
      </div>
    </section>
  );
}
