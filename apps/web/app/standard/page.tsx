import type { Metadata } from "next";
import { CheckCircledIcon, CodeIcon, LockClosedIcon, ReaderIcon } from "@radix-ui/react-icons";
import { PPAY_001, PTK_001 } from "@powerchain/standards";
import { PageShell } from "../../components/page-shell";
import { Card } from "../../components/ui/card";

export const metadata: Metadata = {
  title: "Standards",
  description: "Machine-readable PTK-001 and PPAY-001 protocol profiles for PowerChain integrations.",
};

const controls = [
  { icon: LockClosedIcon, title: "Fail closed", text: "Unknown authorities, supply, deployment status, or evidence block production claims." },
  { icon: CodeIcon, title: "Machine readable", text: "Typed packages keep applications, SDKs, programs, and release checks on one contract." },
  { icon: CheckCircledIcon, title: "Conformance first", text: "Profiles define what must be verified before a deployment can be treated as compliant." },
] as const;

export default function StandardPage() {
  return (
    <PageShell>
      <section className="route-hero standard-mini-hero">
        <div>
          <span className="eyebrow">PowerChain standards</span>
          <h1>Stable protocol contracts, built for verifiable integrations.</h1>
          <p>Review the frozen monetary, Token-2022, asset-decimal, settlement, security, and deployment boundaries shared by PowerChain programs and clients.</p>
        </div>
        <div className="standard-hero-badge" aria-label="Machine-readable standards">
          <ReaderIcon aria-hidden="true" />
          <strong>PTK-001 + PPAY-001</strong>
          <span>Versioned · typed · evidence-driven</span>
        </div>
      </section>

      <section className="standard-overview-grid" aria-label="PowerChain standards">
        <Card className="standard-profile-card standard-profile-card--primary">
          <div className="standard-card-topline">
            <span className="status-pill verified">{PTK_001.version}</span>
            <span>Native currency</span>
          </div>
          <h2>{PTK_001.id}</h2>
          <h3>PWRC Token-2022 profile</h3>
          <p>Fixed supply, nine decimals, canonical mint identity, required extensions, and bounded transfer-fee policy.</p>
          <dl className="standard-list">
            <div><dt>Mint</dt><dd>{PTK_001.asset.mint}</dd></div>
            <div><dt>Genesis supply</dt><dd>{PTK_001.asset.genesisSupplyTokens} PWRC</dd></div>
            <div><dt>Extensions</dt><dd>{PTK_001.solana.requiredExtensions.join(", ")}</dd></div>
          </dl>
        </Card>

        <Card className="standard-profile-card standard-profile-card--dark">
          <div className="standard-card-topline">
            <span className="status-pill pending">{PPAY_001.version}</span>
            <span>Settlement protocol</span>
          </div>
          <h2>{PPAY_001.id}</h2>
          <h3>PowerPay payment profile</h3>
          <p>Wallet-signed payment lifecycle, exact decimals, bounded service fees, refunds, and fail-closed deployment status.</p>
          <dl className="standard-list">
            <div><dt>Assets</dt><dd>{PPAY_001.supportedAssets.map((asset) => `${asset.symbol}/${asset.decimals}`).join(" · ")}</dd></div>
            <div><dt>Service fee</dt><dd>{PPAY_001.serviceFeeBasisPoints} bps</dd></div>
            <div><dt>Program</dt><dd>{PPAY_001.deployment.programId}</dd></div>
          </dl>
        </Card>
      </section>

      <section className="standard-control-grid" aria-label="Standards controls">
        {controls.map(({ icon: Icon, title, text }) => (
          <article key={title} className="standard-control-card">
            <span className="standard-control-icon"><Icon aria-hidden="true" /></span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </section>

      <section className="section compact-section standard-rule-section">
        <div className="section-heading">
          <span className="eyebrow">Integration rule</span>
          <h2>Standards are policy—not deployment evidence.</h2>
          <p>Applications must still verify live program ownership, mint extensions, authorities, supply, metadata, audit evidence, and release checksums.</p>
        </div>
        <a className="secondary-button" href="/programs">Review program controls</a>
      </section>
    </PageShell>
  );
}
