"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import nacl from "tweetnacl";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  createSignInMessage,
  createWalletAuthenticationChallenge,
  isAuthenticationChallengeCurrent,
  type WalletAuthenticationChallenge,
} from "../../lib/security";

export type WalletAuthProof = {
  wallet: string;
  message: string;
  signature: string;
  challenge: WalletAuthenticationChallenge;
};

export type WalletAuthState = {
  authenticated: boolean;
  authenticating: boolean;
  proof: WalletAuthProof | null;
  error: string | null;
};

type WalletSecurityContextValue = WalletAuthState & {
  authenticate: () => Promise<void>;
  clearAuthentication: () => void;
};

const WalletSecurityContext = createContext<WalletSecurityContextValue | null>(null);

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

export function WalletSecurityProvider({ children }: { children: ReactNode }) {
  const { connected, publicKey, signMessage } = useWallet();
  const walletAddress = publicKey?.toBase58() ?? null;
  const [state, setState] = useState<WalletAuthState>({
    authenticated: false,
    authenticating: false,
    proof: null,
    error: null,
  });

  const clearAuthentication = useCallback(() => {
    setState({ authenticated: false, authenticating: false, proof: null, error: null });
  }, []);

  useEffect(() => {
    if (!connected || !walletAddress || state.proof?.wallet !== walletAddress) {
      clearAuthentication();
    }
  }, [connected, walletAddress, state.proof?.wallet, clearAuthentication]);

  useEffect(() => {
    if (!state.proof) return;
    const expiresAt = Date.parse(state.proof.challenge.expiresAt);
    const delay = Math.max(0, expiresAt - Date.now());
    const timer = window.setTimeout(clearAuthentication, delay);
    return () => window.clearTimeout(timer);
  }, [state.proof, clearAuthentication]);

  const authenticate = useCallback(async () => {
    if (!connected || !publicKey) throw new Error("Connect a wallet first.");
    if (!signMessage) throw new Error("This wallet does not support message signing.");

    setState((current) => ({ ...current, authenticating: true, error: null }));
    try {
      const challenge = createWalletAuthenticationChallenge({
        wallet: publicKey.toBase58(),
        origin: window.location.origin,
      });
      const message = createSignInMessage(challenge);
      const signature = await signMessage(message);
      const verified = nacl.sign.detached.verify(message, signature, publicKey.toBytes());
      if (!verified || !isAuthenticationChallengeCurrent(challenge, publicKey.toBase58())) {
        throw new Error("The wallet authentication proof is invalid or expired.");
      }

      setState({
        authenticated: true,
        authenticating: false,
        proof: {
          wallet: publicKey.toBase58(),
          message: new TextDecoder().decode(message),
          signature: bytesToBase64(signature),
          challenge,
        },
        error: null,
      });
    } catch (error) {
      setState({
        authenticated: false,
        authenticating: false,
        proof: null,
        error: error instanceof Error ? error.message : "Wallet authentication failed.",
      });
      throw error;
    }
  }, [connected, publicKey, signMessage]);

  const value = useMemo(
    () => ({ ...state, authenticate, clearAuthentication }),
    [state, authenticate, clearAuthentication],
  );

  return <WalletSecurityContext.Provider value={value}>{children}</WalletSecurityContext.Provider>;
}

export function useWalletSecurity(): WalletSecurityContextValue {
  const value = useContext(WalletSecurityContext);
  if (!value) throw new Error("useWalletSecurity must be used inside WalletSecurityProvider.");
  return value;
}
