import { Logo } from "./logo";
import { Web3Icon } from "./web3-icon";

const venues = [
  { name: "Jupiter", icon: "jupiter", role: "Default routing", copy: "Aggregated quote discovery with wallet-signed execution." },
  { name: "Raydium", icon: "raydium", role: "CPMM / CLMM", copy: "Pool discovery and liquidity venue integration." },
  { name: "Meteora", icon: "meteora", role: "DLMM / DAMM", copy: "Dynamic liquidity and pool analytics boundary." },
  { name: "Orca", icon: "orca", role: "Whirlpools", copy: "Concentrated-liquidity market integration." },
] as const;

export function MarketGrid() {
  return (
    <section className="market-section" id="markets">
      <div className="section-heading light">
        <span className="eyebrow">Liquidity network</span>
        <h2>Trade routes, without surrendering control.</h2>
        <p>PowerPay separates quotes, transaction construction, wallet approval, and finalized settlement. Third-party routes remain non-custodial and independently validated.</p>
      </div>
      <div className="venue-grid">
        {venues.map((venue) => (
          <article className="venue-card" key={venue.name}>
            <div className="venue-icons" aria-hidden="true">
              <Logo iconOnly size={34} />
              <span className="icon-connector" />
              <Web3Icon type="exchange" name={venue.icon} size={40} />
            </div>
            <span>{venue.role}</span>
            <h3>{venue.name}</h3>
            <p>{venue.copy}</p>
            <div className="venue-line" />
          </article>
        ))}
      </div>
    </section>
  );
}
