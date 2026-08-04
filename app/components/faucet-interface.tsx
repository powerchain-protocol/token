"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useMemo, useState } from "react";
import { TPWRC_MINT_ADDRESS } from "../lib/constants";
import { useWalletSecurity } from "./provider/wallet-context";
import { Card, CardContent, CardHeader } from "./ui/card";

export function FaucetInterface() {
  const { publicKey, connected } = useWallet();
  const { authenticated } = useWalletSecurity();
  const [amount, setAmount] = useState("1000");
  const [message, setMessage] = useState<string | null>(null);
  const configured = TPWRC_MINT_ADDRESS !== "TBA";
  const fee = useMemo(() => {
    const numeric = Number(amount);
    return Number.isFinite(numeric) ? numeric * 0.025 : 0;
  }, [amount]);

  const request = async () => {
    if (!connected || !publicKey) return setMessage("Connect a wallet first.");
    if (!authenticated) return setMessage("Verify your wallet signature first.");
    if (!configured) return setMessage("The tPWRC devnet mint is TBA. Faucet distribution is disabled.");
    setMessage("Faucet request is ready for the secured server endpoint.");
  };

  return (
    <section className="section" id="faucet">
      <div className="section-heading">
        <span className="eyebrow">Devnet utility</span>
        <h2>tPWRC faucet</h2>
        <p>Test fee-aware Token-2022 transfers before using canonical PWRC on mainnet-beta.</p>
      </div>
      <Card className="faucet-card">
        <CardHeader>
          <div><span className="status-pill pending">Solana devnet</span><h3>Request test tokens</h3></div>
          <span className={`status-pill ${configured ? "verified" : "pending"}`}>{configured ? "Mint configured" : "Mint TBA"}</span>
        </CardHeader>
        <CardContent>
          <label className="field-label" htmlFor="amount">Amount</label>
          <div className="amount-field"><input id="amount" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} /><span>tPWRC</span></div>
          <div className="quote-grid">
            <div><span>Transfer fee</span><strong>{fee.toLocaleString(undefined, { maximumFractionDigits: 9 })} tPWRC</strong></div>
            <div><span>Estimated received</span><strong>{Math.max(0, Number(amount || 0) - fee).toLocaleString(undefined, { maximumFractionDigits: 9 })} tPWRC</strong></div>
          </div>
          <button className="primary-button full" type="button" disabled={!configured} onClick={() => void request()}>
            {configured ? "Request tPWRC" : "Available after mint creation"}
          </button>
          {message ? <p className="notice">{message}</p> : null}
          <p className="security-note">The faucet never requests a seed phrase or private key. Wallet signatures authenticate the session but do not authorize hidden transfers.</p>
        </CardContent>
      </Card>
    </section>
  );
}
