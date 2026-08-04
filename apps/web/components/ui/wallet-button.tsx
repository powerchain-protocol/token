"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useRef, useState } from "react";
import { useWalletSecurity } from "../provider/wallet-context";
import { Card } from "./card";

function shorten(value: string): string {
  return `${value.slice(0, 4)}…${value.slice(-4)}`;
}

export function WalletButton() {
  const { wallets, wallet, publicKey, connected, connecting, select, connect, disconnect } = useWallet();
  const { authenticated, authenticating, authenticate, clearAuthentication, error, proof } = useWalletSecurity();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  useEffect(() => {
    if (wallet && !connected && !connecting) {
      void connect().catch(() => undefined);
    }
  }, [wallet, connected, connecting, connect]);

  return (
    <div className="wallet-control" ref={rootRef}>
      <button className="wallet-trigger" type="button" onClick={() => setOpen((value) => !value)}>
        <span className={`status-dot ${connected ? "online" : ""}`} />
        {publicKey ? shorten(publicKey.toBase58()) : "Connect wallet"}
      </button>

      {open ? (
        <Card className="wallet-popup" role="dialog" aria-label="Wallet provider">
          <div className="popup-heading">
            <div>
              <span className="eyebrow">Wallet provider</span>
              <h3>{connected ? "Wallet connected" : "Choose a wallet"}</h3>
            </div>
            <button className="icon-button" type="button" aria-label="Close" onClick={() => setOpen(false)}>×</button>
          </div>

          {!connected ? (
            <div className="wallet-list">
              {wallets.map((item) => (
                <button
                  className="wallet-option"
                  key={item.adapter.name}
                  type="button"
                  onClick={() => {
                    select(item.adapter.name);
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.adapter.icon} alt="" />
                  <span>{item.adapter.name}</span>
                  <small>{item.readyState}</small>
                </button>
              ))}
              {wallet ? <p className="muted">Selected: {wallet.adapter.name}</p> : null}
              {connecting ? <p className="muted">Waiting for wallet approval…</p> : null}
            </div>
          ) : (
            <div className="wallet-session">
              <code>{publicKey?.toBase58()}</code>
              <div className="security-row">
                <span className={`status-pill ${authenticated ? "verified" : "pending"}`}>
                  {authenticated ? "Session verified" : "Signature required"}
                </span>
              </div>
              {authenticated && proof ? <p className="muted">Valid until {new Date(proof.challenge.expiresAt).toLocaleTimeString()}</p> : null}
              {!authenticated ? (
                <button className="primary-button full" type="button" disabled={authenticating} onClick={() => void authenticate()}>
                  {authenticating ? "Signing…" : "Verify wallet signature"}
                </button>
              ) : null}
              <button
                className="secondary-button full"
                type="button"
                onClick={async () => {
                  clearAuthentication();
                  await disconnect();
                  setOpen(false);
                }}
              >
                Disconnect
              </button>
              {error ? <p className="error-text">{error}</p> : null}
            </div>
          )}
        </Card>
      ) : null}
    </div>
  );
}
