import { FaucetInterface } from "../components/faucet-interface";
import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { MintAccount } from "../components/mint-account";
import { Hero } from "../components/hero";
import { Card } from "../components/ui/card";
import { MarketGrid } from "../components/market-grid";
import { PowerPayHero } from "../components/powerpay-hero";
import { Features } from "../components/features";
import { Faq } from "../components/faq";
export default function Page(){return <main><Header/><Hero/><PowerPayHero/><section className="mint-section"><MintAccount/></section><section className="security-grid" id="security"><Card><span className="eyebrow">Asset boundary</span><h3>Approved mints only</h3><p>SOL, USDC, and PWRC use explicit program, mint, decimal, and authority policies before transaction construction.</p></Card><Card><span className="eyebrow">Authentication</span><h3>Wallet signature</h3><p>Domain-bound nonce signatures authenticate sessions while every payment or swap still requires separate wallet approval.</p></Card><Card><span className="eyebrow">Settlement</span><h3>Finalized and observable</h3><p>Quotes are informational; balances and status are accepted only from validated Solana RPC observations.</p></Card></section><Features/><MarketGrid/><FaucetInterface/><Faq/><Footer/></main>}
