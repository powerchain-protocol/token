import { Logo } from "../components/logo";

export default function Loading() {
  return (
    <main className="route-state-page" aria-busy="true" aria-live="polite">
      <section className="route-state-card">
        <Logo iconOnly size={42} />
        <span className="eyebrow">Loading</span>
        <h1>Preparing PowerChain</h1>
        <p>Loading routes, wallet services, and verified protocol configuration.</p>
        <div className="route-loading-bar" aria-hidden="true"><span /></div>
      </section>
    </main>
  );
}
