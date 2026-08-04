import path from "node:path";
import { fileURLToPath } from "node:url";

const workspaceRoot = fileURLToPath(new URL("../../", import.meta.url));
const standardsSource = path.join(workspaceRoot, "packages/standards/src/index.ts");
const nativeTokenClientSource = path.join(workspaceRoot, "packages/native-token-client/src/index.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  transpilePackages: ["@powerchain/standards", "@powerchain/native-token-client"],
  turbopack: {
    root: workspaceRoot,
    resolveAlias: {
      "@powerchain/standards": standardsSource,
      "@powerchain/native-token-client": nativeTokenClientSource,
    },
  },
  webpack(config) {
    config.resolve.alias["@powerchain/standards"] = standardsSource;
    config.resolve.alias["@powerchain/native-token-client"] = nativeTokenClientSource;
    return config;
  },
  experimental: {
    useTypeScriptCli: true,
    optimizePackageImports: [
      "@solana/web3.js",
      "@solana/spl-token",
      "@solana/wallet-adapter-react",
      "@radix-ui/react-icons",
    ],
  },
  async redirects() {
    return [
      { source: "/powerpay", destination: "/payments", permanent: true },
      { source: "/faucets", destination: "/faucet", permanent: true },
      { source: "/wallet", destination: "/token", permanent: true },
      { source: "/tools", destination: "/tools/terminal", permanent: true },
      { source: "/legal", destination: "/legals", permanent: true },
      { source: "/docs/standards", destination: "/standard", permanent: true },
      { source: "/api", destination: "/api/v1", permanent: true },
      { source: "/swagger.yaml", destination: "/api/v1/swagger.yaml", permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
        ],
      },
      {
        source: "/api/faucets/:path*",
        headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }],
      },
    ];
  },
};

export default nextConfig;
