import { Logo } from "./logo";
import { WalletButton } from "./ui/wallet-button";

export function Header() {
  return (
    <header className="site-header">
      <Logo href="/" priority />
      <nav aria-label="Primary navigation">
        <a href="#faucet">Faucet</a>
        <a href="#security">Security</a>
        <a href="https://docs.powerchain.energy" target="_blank" rel="noreferrer">Docs</a>
      </nav>
      <WalletButton />
    </header>
  );
}
