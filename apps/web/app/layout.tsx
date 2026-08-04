import type { Metadata, Viewport } from "next";
import "../styles/index.css";
import { WalletProvider } from "../components/provider/wallet-provider";
import { Cookies } from "../components/cookies";

export const metadata: Metadata = {
  title: {
    default: "PowerChain — Programmable Energy Settlement",
    template: "%s | PowerChain",
  },
  description:
    "PWRC Token-2022, PowerPay settlement, wallet authentication, and programmable energy-market infrastructure.",
  metadataBase: new URL("https://powerchain.energy"),
  applicationName: "PowerChain",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    shortcut: [{ url: "/favicon.png", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    url: "https://powerchain.energy",
    siteName: "PowerChain",
    title: "PowerChain — Programmable Energy Settlement",
    description:
      "PWRC Token-2022, PowerPay settlement, and Solana-native energy-market infrastructure.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PowerChain",
    description: "Programmable energy settlement on Solana.",
  },
};

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7faf8" },
    { media: "(prefers-color-scheme: dark)", color: "#07110d" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <WalletProvider>
          {children}
          <Cookies />
        </WalletProvider>
      </body>
    </html>
  );
}
