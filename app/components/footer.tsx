import { APPROVED_PWRC_MINT_ADDRESS } from "../lib/constants";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <Logo theme="dark" subtitle="PTK-001" size={42} />
        <p>Experimental reference implementation. Production activation remains gated.</p>
      </div>
      <div className="footer-links">
        <a href="https://docs.powerchain.energy" target="_blank" rel="noreferrer">Documentation</a>
        <a href={`https://solscan.io/token/${APPROVED_PWRC_MINT_ADDRESS}`} target="_blank" rel="noreferrer">Solscan</a>
      </div>
    </footer>
  );
}
