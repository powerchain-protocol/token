"use client";

import { CheckCircledIcon, PaperPlaneIcon } from "@radix-ui/react-icons";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useEffect, useMemo, useState } from "react";
import {
  NATIVE_SOL_FAUCET_AMOUNT_SOL,
  TPWRC_MINT_ADDRESS,
} from "../lib/constants";
import { useWalletSecurity } from "./provider/wallet-context";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Logo } from "./logo";
import { Web3Icon } from "./web3-icon";

function normalizeSolanaAddress(value: string): string | null {
  try {
    return new PublicKey(value.trim()).toBase58();
  } catch {
    return null;
  }
}

export function FaucetInterface() {
  const { publicKey, connected } = useWallet();
  const { authenticated, proof } = useWalletSecurity();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("1000");
  const [message, setMessage] = useState<string | null>(null);
  const [solMessage, setSolMessage] = useState<string | null>(null);
  const [requestingSol, setRequestingSol] = useState(false);
  const configured = TPWRC_MINT_ADDRESS !== "TBA";
  const normalizedRecipient = useMemo(() => normalizeSolanaAddress(recipient), [recipient]);
  const fee = useMemo(() => {
    const numeric = Number(amount);
    return Number.isFinite(numeric) ? numeric * 0.025 : 0;
  }, [amount]);

  useEffect(() => {
    if (publicKey && !recipient) setRecipient(publicKey.toBase58());
  }, [publicKey, recipient]);

  const useConnectedWallet = () => {
    if (!publicKey) {
      setSolMessage("Connect a Solana wallet first, or paste any valid Solana devnet address.");
      return;
    }
    setRecipient(publicKey.toBase58());
    setSolMessage(null);
  };

  const requestTPwrc = async () => {
    if (!connected || !publicKey) return setMessage("Connect a wallet first.");
    if (!authenticated) return setMessage("Verify your wallet signature first.");
    if (!configured) return setMessage("The tPWRC devnet mint is TBA. Faucet distribution is disabled.");
    setMessage("Faucet request is ready for the secured server endpoint.");
  };

  const requestNativeSol = async () => {
    if (!normalizedRecipient) {
      setSolMessage("Enter a valid Solana-compatible wallet address.");
      return;
    }
    if (requestingSol) return;

    setRequestingSol(true);
    setSolMessage(`Requesting ${NATIVE_SOL_FAUCET_AMOUNT_SOL} SOL from Solana devnet…`);
    try {
      const response = await fetch("/api/faucets/native-sol", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          recipient: normalizedRecipient,
          proof: authenticated && proof?.wallet === normalizedRecipient ? proof : undefined,
        }),
      });
      const result = (await response.json()) as {
        explorerUrl?: string;
        signature?: string;
        error?: string;
      };
      if (!response.ok || !result.explorerUrl) {
        throw new Error(result.error || "Native SOL faucet request failed.");
      }
      setSolMessage(`${NATIVE_SOL_FAUCET_AMOUNT_SOL} SOL sent successfully. View transaction: ${result.explorerUrl}`);
    } catch (error) {
      setSolMessage(error instanceof Error ? error.message : "The devnet SOL faucet is unavailable or rate limited.");
    } finally {
      setRequestingSol(false);
    }
  };

  return (
    <section className="section faucet-section" id="faucet">
      <div className="section-heading faucet-section-heading">
        <span className="eyebrow">Devnet utility</span>
        <h2>PowerChain faucets</h2>
        <p>Fund any Solana-compatible devnet address with native SOL for transaction fees, or use a connected wallet for tPWRC testing.</p>
      </div>

      <div className="faucet-grid">
        <Card className="faucet-card">
          <CardHeader>
            <div className="faucet-title"><span className="faucet-icon-stack" aria-hidden="true"><Logo iconOnly size={32} /><Web3Icon type="network" name="solana" size={32} /></span><span className="status-pill pending">Solana devnet</span><h3>Native SOL faucet</h3></div>
            <span className="status-pill verified">{NATIVE_SOL_FAUCET_AMOUNT_SOL} SOL</span>
          </CardHeader>
          <CardContent className="faucet-card-content">
            <p className="card-copy">Enter any valid Solana wallet address. The faucet requests exactly {NATIVE_SOL_FAUCET_AMOUNT_SOL} native SOL through the configured Solana devnet RPC endpoint.</p>

            <div className="faucet-address-field">
              <label className="field-label" htmlFor="sol-recipient">Recipient address</label>
              <div className={`address-input-shell ${recipient && !normalizedRecipient ? "invalid" : normalizedRecipient ? "valid" : ""}`}>
                <input
                  id="sol-recipient"
                  inputMode="text"
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="Enter a Solana devnet wallet address"
                  value={recipient}
                  onChange={(event) => {
                    setRecipient(event.target.value);
                    setSolMessage(null);
                  }}
                />
                {normalizedRecipient ? <CheckCircledIcon aria-label="Valid address" /> : null}
              </div>
              <button className="address-wallet-button" type="button" onClick={useConnectedWallet}>
                Use connected wallet
              </button>
            </div>

            <div className="quote-grid">
              <div><span>Amount</span><strong>{NATIVE_SOL_FAUCET_AMOUNT_SOL} SOL</strong></div>
              <div><span>Network</span><strong>Devnet only</strong></div>
            </div>
            <button
              className="primary-button full faucet-card-action"
              type="button"
              disabled={requestingSol || !normalizedRecipient}
              onClick={() => void requestNativeSol()}
            >
              <PaperPlaneIcon aria-hidden="true" />
              {requestingSol ? "Sending…" : `Send ${NATIVE_SOL_FAUCET_AMOUNT_SOL} SOL`}
            </button>
            {solMessage ? <p className="notice break-word" aria-live="polite">{solMessage}</p> : null}
          </CardContent>
        </Card>

        <Card className="faucet-card">
          <CardHeader>
            <div className="faucet-title"><span className="faucet-icon-stack" aria-hidden="true"><Logo iconOnly size={32} /><Web3Icon type="token" name="sol" size={32} /></span><span className="status-pill pending">Solana devnet</span><h3>tPWRC faucet</h3></div>
            <span className={`status-pill ${configured ? "verified" : "pending"}`}>{configured ? "Mint configured" : "Mint TBA"}</span>
          </CardHeader>
          <CardContent className="faucet-card-content">
            <p className="card-copy">Request test-only Token-2022 assets for PowerChain integration, fee, and transfer validation.</p>
            <label className="field-label" htmlFor="amount">Amount</label>
            <div className="amount-field"><input id="amount" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} /><span>tPWRC</span></div>
            <div className="quote-grid">
              <div><span>Transfer fee</span><strong>{fee.toLocaleString(undefined, { maximumFractionDigits: 9 })} tPWRC</strong></div>
              <div><span>Estimated received</span><strong>{Math.max(0, Number(amount || 0) - fee).toLocaleString(undefined, { maximumFractionDigits: 9 })} tPWRC</strong></div>
            </div>
            <button className="primary-button full faucet-card-action" type="button" disabled={!configured} onClick={() => void requestTPwrc()}>
              {configured ? "Request tPWRC" : "Available after mint creation"}
            </button>
            {message ? <p className="notice" aria-live="polite">{message}</p> : null}
          </CardContent>
        </Card>
      </div>

      <div className="faucet-security-notice">
        <p>Both faucets are devnet-only. They never request a seed phrase or private key.</p>
        <p>Wallet signatures authenticate the session but do not authorize hidden transfers.</p>
      </div>
    </section>
  );
}
