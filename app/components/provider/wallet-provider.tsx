"use client";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider as AdapterWalletProvider } from "@solana/wallet-adapter-react";
import { CoinbaseWalletAdapter, PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets";
import { useMemo } from "react";
import { getMainnetRpcUrl } from "../../lib/constants";
import { WalletSecurityProvider } from "./wallet-context";

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
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
