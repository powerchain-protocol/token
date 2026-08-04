import Link from "next/link";
import { APPROVED_PWRC_MINT_ADDRESS } from "../lib/constants";
import { APP_ROUTES, EXTERNAL_ROUTES } from "../lib/routes";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <Logo theme="dark" subtitle="Programmable energy settlement" size={38} />
        <p>Experimental reference implementation. Production activation remains gated.</p>
      </div>
      <div className="footer-links">
        <a href={EXTERNAL_ROUTES.docs} target="_blank" rel="noreferrer">Documentation</a>
        <a href={`https://solscan.io/token/${APPROVED_PWRC_MINT_ADDRESS}`} target="_blank" rel="noreferrer">Solscan</a>
        <Link href={APP_ROUTES.standard}>Standards</Link>
        <Link href={APP_ROUTES.legal}>Legal</Link>
        <Link href={APP_ROUTES.privacy}>Privacy</Link>
        <Link href={APP_ROUTES.cookies}>Cookies</Link>
      </div>
    </footer>
  );
}
