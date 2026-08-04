import Link from "next/link";
import { ArrowLeftIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { PageShell } from "../components/page-shell";
import { Logo } from "../components/logo";

export default function NotFound() {
  return (
    <PageShell>
      <section className="route-state-page route-not-found">
        <div className="route-state-card">
          <Logo iconOnly size={48} />
          <span className="eyebrow">Error 404</span>
          <h1>Route not found</h1>
          <p>The requested PowerChain page does not exist or has moved to a canonical route.</p>
          <div className="route-state-actions">
            <Link className="primary-button" href="/"><ArrowLeftIcon aria-hidden="true" />Return home</Link>
            <Link className="secondary-button" href="/tools/terminal"><MagnifyingGlassIcon aria-hidden="true" />Open tools</Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
