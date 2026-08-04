"use client";

import { ExchangeIcon, NetworkIcon, TokenIcon, WalletIcon } from "@web3icons/react/dynamic";
import type { ReactNode } from "react";

type Web3IconProps = {
  type: "exchange" | "network" | "token" | "wallet";
  name: string;
  size?: number;
  className?: string;
  fallback?: ReactNode;
};

export function Web3Icon({
  type,
  name,
  size = 34,
  className,
  fallback = <span className="web3-icon-fallback" aria-hidden="true" />,
}: Web3IconProps) {
  const shared = { size, variant: "branded" as const, className, fallback };

  if (type === "exchange") return <ExchangeIcon name={name} {...shared} />;
  if (type === "network") return <NetworkIcon network={name} {...shared} />;
  if (type === "wallet") return <WalletIcon name={name} {...shared} />;
  return <TokenIcon symbol={name} {...shared} />;
}
