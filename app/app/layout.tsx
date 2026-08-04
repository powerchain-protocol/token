import type { Metadata } from "next";
import "./globals.css";
import { WalletProvider } from "../components/provider/wallet-provider";

export const metadata: Metadata = {
  title: "PowerChain PWRC",
  description: "Secure PWRC Token-2022 wallet and faucet interface",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><WalletProvider>{children}</WalletProvider></body></html>;
}
