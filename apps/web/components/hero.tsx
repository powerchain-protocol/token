import Image from "next/image";
import { APPROVED_PWRC_MINT_ADDRESS, SOLSCAN_PWRC_URL } from "../lib/constants";

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <span className="eyebrow">PTK-001 · SPL Token-2022</span>
        <h1>Native currency infrastructure for programmable energy.</h1>
        <p>Secure wallet access, fee-aware transactions, verified token accounts, and governance-controlled program operations for PWRC.</p>
        <div className="hero-actions">
          <a className="primary-button" href="#faucet">Open devnet faucet</a>
          <a className="secondary-button" href={SOLSCAN_PWRC_URL} target="_blank" rel="noreferrer">View on Solscan</a>
        </div>
        <div className="mint-line"><span>Approved mint</span><code>{APPROVED_PWRC_MINT_ADDRESS}</code></div>
      </div>
      <div className="token-visual" aria-label="PWRC token">
        <div className="token-halo" aria-hidden="true" />
        <Image src="/assets/token/pwrc.png" width={250} height={250} alt="PWRC coin" priority />
      </div>
    </section>
  );
}
