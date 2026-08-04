"use client";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider as AdapterWalletProvider } from "@solana/wallet-adapter-react";
import { CoinbaseWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { useMemo, type ReactNode } from "react";
import { getMainnetRpcUrl } from "../../lib/constants";
import { WalletSecurityProvider } from "./wallet-context";

export function WalletProvider({ children }: { children: ReactNode }) {
  const wallets = useMemo(
    () => [
      new SolflareWalletAdapter({ network: WalletAdapterNetwork.Mainnet }),
      new CoinbaseWalletAdapter(),
    ],
    [],
  );

  return (
    <ConnectionProvider endpoint={getMainnetRpcUrl()} config={{ commitment: "confirmed" }}>
      <AdapterWalletProvider wallets={wallets} autoConnect={false}>
        <WalletSecurityProvider>{children}</WalletSecurityProvider>
      </AdapterWalletProvider>
    </ConnectionProvider>
  );
}
