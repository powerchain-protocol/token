const FAQS = [
  ["Is PWRC deployed?", "The canonical mint is configured, while production program deployment remains gated by audits, reproducible builds, and governance evidence."],
  ["What is tPWRC?", "tPWRC is a separate Solana devnet Token-2022 test asset. Its mint remains TBA until the controlled devnet creation ceremony."],
  ["How are fees handled?", "PWRC uses a 250-basis-point Token-2022 transfer fee. PowerPay service fees are separate and displayed before wallet approval."],
  ["Are DEX routes custodial?", "No. Quotes are observational and every swap or payment transaction requires explicit wallet signing."],
] as const;

export function Faq() {
  return (
    <section className="section-shell" aria-labelledby="faq-title">
      <span className="eyebrow">FAQ</span>
      <h2 id="faq-title">Common questions</h2>
      <div className="faq-list">
        {FAQS.map(([question, answer]) => (
          <details key={question}><summary>{question}</summary><p>{answer}</p></details>
        ))}
      </div>
    </section>
  );
}
