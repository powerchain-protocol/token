"use client";

export default function RouteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main>
      <section className="route-hero">
        <span className="eyebrow">Application error</span>
        <h1>PowerChain could not render this route</h1>
        <p>No transaction was submitted. Retry the route or return to the homepage.</p>
        <button className="primary-button" type="button" onClick={reset}>Retry</button>
      </section>
    </main>
  );
}
