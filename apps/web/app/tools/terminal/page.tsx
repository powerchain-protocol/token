import type { Metadata } from "next";
import { PageShell } from "../../../components/page-shell";
import { DeveloperTerminal } from "../../../components/tools/developer-terminal";

export const metadata: Metadata = {
  title: "Developer Terminal",
  description: "A safe PowerChain workspace command catalog for applications, programs, validation, and release workflows.",
};

export default function TerminalPage() {
  return (
    <PageShell>
      <section className="route-hero tool-route-hero">
        <span className="eyebrow">Developer tools</span>
        <h1>One terminal for the complete PowerChain workspace.</h1>
        <p>Search and copy canonical pnpm, Solana program, faucet, validation, and release commands without exposing browser-side shell execution.</p>
      </section>
      <section className="section-shell terminal-shell"><DeveloperTerminal /></section>
    </PageShell>
  );
}
