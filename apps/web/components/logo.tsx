import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

export const POWERCHAIN_LOGO_PNG = "/assets/token/pwrc.png" as const;
export const POWERCHAIN_LOGO_SVG = "/assets/token/pwrc.svg" as const;

export type PowerChainLogoProps = {
  className?: string;
  href?: string;
  iconOnly?: boolean;
  priority?: boolean;
  size?: number;
  subtitle?: string;
  theme?: "light" | "dark";
};

function LogoContent({
  className,
  iconOnly = false,
  priority = false,
  size = 38,
  subtitle,
  theme = "light",
}: Omit<PowerChainLogoProps, "href">) {
  const style = { "--logo-size": `${size}px` } as CSSProperties;

  return (
    <span
      className={["powerchain-logo", `powerchain-logo--${theme}`, className]
        .filter(Boolean)
        .join(" ")}
      style={style}
    >
      <span className="powerchain-logo__mark">
        <Image
          src={POWERCHAIN_LOGO_PNG}
          width={size}
          height={size}
          alt=""
          priority={priority}
        />
      </span>
      {!iconOnly && (
        <span className="powerchain-logo__copy">
          <strong aria-label="PowerChain"><span>Power</span><b>Chain</b></strong>
          {subtitle ? <small>{subtitle}</small> : null}
        </span>
      )}
    </span>
  );
}

export function Logo({ href, ...props }: PowerChainLogoProps) {
  if (!href) return <LogoContent {...props} />;

  return (
    <Link className="powerchain-logo-link" href={href} aria-label="PowerChain home">
      <LogoContent {...props} />
    </Link>
  );
}
