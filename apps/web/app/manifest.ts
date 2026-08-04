import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PowerChain",
    short_name: "PowerChain",
    description: "Programmable energy settlement, PWRC Token-2022, PowerPay, and Solana developer infrastructure.",
    start_url: "/",
    display: "standalone",
    background_color: "#07110d",
    theme_color: "#0a8f5a",
    icons: [
      { src: "/favicon.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
