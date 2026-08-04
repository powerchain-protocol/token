import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRightIcon,
  CodeIcon,
  CubeIcon,
  ExternalLinkIcon,
  LightningBoltIcon,
  ReaderIcon,
} from "@radix-ui/react-icons";
import { PageShell } from "../../components/page-shell";
import { Card } from "../../components/ui/card";

export const metadata: Metadata = { title: "Developers" };

const resources = [
  {
    title: "API v1",
    copy: "Restricted-CORS routes for rates, quotes, health, and wallet-approved execution flows.",
    href: "https://api.powerchain.energy/api/v1",
    label: "Open API",
    icon: LightningBoltIcon,
    external: true,
    featured: true,
  },
  {
    title: "Documentation",
    copy: "Protocol specifications, integration guides, release gates, and deployment evidence.",
    href: "https://docs.powerchain.energy",
    label: "Read docs",
    icon: ReaderIcon,
    external: true,
  },
  {
    title: "Developer terminal",
    copy: "Search and copy canonical workspace, program, validation, and release commands.",
    href: "/tools/terminal",
    label: "Open terminal",
    icon: CodeIcon,
  },
  {
    title: "Program testing",
    copy: "Inspect PTK-001 and PPAY-001 test commands, security boundaries, and deployment status.",
    href: "/programs",
    label: "Open programs",
    icon: CubeIcon,
  },
  {
    title: "Explorer",
    copy: "Inspect the canonical PWRC mint and transaction history through an independent Solana explorer.",
    href: "https://solscan.io/token/PWRCRXXZxbg6FdQZfK3PMD7KP8xfxs9acvifJiG46wc",
    label: "Open Solscan",
    icon: ExternalLinkIcon,
    external: true,
  },
] as const;

export default function DevelopersPage() {
  return (
    <PageShell>
      <section className="developer-mini-hero">
        <div>
          <span className="eyebrow">PowerChain developer platform</span>
          <h1>Build secure energy applications with PWRC and PowerPay.</h1>
          <p>Typed clients, Token-2022 helpers, wallet-approved settlement, secured APIs, and reproducible program tooling in one standards-driven workspace.</p>
        </div>
        <div className="developer-hero-meta" aria-label="Developer platform highlights">
          <span><strong>v1</strong> API boundary</span>
          <span><strong>2</strong> program profiles</span>
          <span><strong>9</strong> PWRC decimals</span>
        </div>
      </section>

      <section className="developer-resource-grid" aria-label="Developer resources">
        {resources.map(({ title, copy, href, label, icon: Icon, external, featured }) => (
          <Card className={`developer-card${featured ? " developer-card--featured" : ""}`} key={title}>
            <div className="developer-card-icon" aria-hidden="true"><Icon /></div>
            <div className="developer-card-copy">
              <h2>{title}</h2>
              <p>{copy}</p>
            </div>
            {external ? (
              <a className="developer-card-action" href={href} target="_blank" rel="noreferrer">
                {label}<ArrowRightIcon />
              </a>
            ) : (
              <Link className="developer-card-action" href={href}>
                {label}<ArrowRightIcon />
              </Link>
            )}
          </Card>
        ))}
      </section>
    </PageShell>
  );
}
