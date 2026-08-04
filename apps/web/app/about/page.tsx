import { Faq } from "../../components/faq";
import { Features } from "../../components/features";
import { PageShell } from "../../components/page-shell";

export default function AboutPage() {
  return <PageShell><section className="section-shell page-intro"><span className="eyebrow">About PowerChain</span><h1>Programmable energy and digital-asset infrastructure</h1><p>PowerChain combines PTK-001 token primitives, Token-2022 settlement, PowerPay payments, wallet-authenticated applications, and standards-led release governance.</p></section><Features/><Faq/></PageShell>;
}
