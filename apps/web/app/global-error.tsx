"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body>
        <main>
          <section className="route-hero">
            <span className="eyebrow">Fatal application error</span>
            <h1>PowerChain could not start</h1>
            <p>No transaction was submitted. Verify the runtime configuration and retry.</p>
            <button className="primary-button" type="button" onClick={reset}>Retry</button>
          </section>
        </main>
      </body>
    </html>
  );
}
