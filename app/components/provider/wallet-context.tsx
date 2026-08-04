"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import nacl from "tweetnacl";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { createSignInMessage } from "../../lib/security";

export type WalletAuthState = {
  authenticated: boolean;
  authenticating: boolean;
  signature: string | null;
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

export function WalletSecurityProvider({ children }: { children: React.ReactNode }) {
  const { connected, publicKey, signMessage } = useWallet();
  const [state, setState] = useState<WalletAuthState>({
    authenticated: false,
    authenticating: false,
    signature: null,
    error: null,
  });

  const clearAuthentication = useCallback(() => {
    setState({ authenticated: false, authenticating: false, signature: null, error: null });
  }, []);

  const authenticate = useCallback(async () => {
    if (!connected || !publicKey) throw new Error("Connect a wallet first.");
    if (!signMessage) throw new Error("This wallet does not support message signing.");

    setState((current) => ({ ...current, authenticating: true, error: null }));
    try {
      const message = createSignInMessage({
        wallet: publicKey.toBase58(),
        nonce: crypto.randomUUID(),
        issuedAt: new Date().toISOString(),
      });
      const signature = await signMessage(message);
      const verified = nacl.sign.detached.verify(message, signature, publicKey.toBytes());
      if (!verified) throw new Error("The wallet signature could not be verified.");

      setState({
        authenticated: true,
        authenticating: false,
        signature: bytesToBase64(signature),
        error: null,
      });
    } catch (error) {
      setState({
        authenticated: false,
        authenticating: false,
        signature: null,
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
