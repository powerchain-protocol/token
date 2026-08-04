import Link from "next/link";
import { EXTERNAL_ROUTES, PRIMARY_NAVIGATION } from "../lib/routes";
import { Logo } from "./logo";
import { WalletButton } from "./ui/wallet-button";

export function Header() {
  return (
    <header className="site-header">
      <Logo href="/" priority />
      <nav aria-label="Primary navigation">
        {PRIMARY_NAVIGATION.map((item) => (
          <Link key={item.href} href={item.href}>{item.label}</Link>
        ))}
        <a href={EXTERNAL_ROUTES.docs} target="_blank" rel="noreferrer">Docs</a>
      </nav>
      <WalletButton />
    </header>
  );
}
