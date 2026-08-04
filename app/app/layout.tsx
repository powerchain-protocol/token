import type { Metadata } from "next";
import "../styles/index.css";
import { WalletProvider } from "../components/provider/wallet-provider";
import { Cookies } from "../components/cookies";

export const metadata: Metadata = { title:{default:"PowerChain — Programmable Energy Settlement",template:"%s | PowerChain"},description:"PWRC Token-2022, PowerPay settlement, wallet authentication and energy-market infrastructure.",metadataBase:new URL("https://powerchain.energy") };
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body><WalletProvider>{children}<Cookies/></WalletProvider></body></html>}
