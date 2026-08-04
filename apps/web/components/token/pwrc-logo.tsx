import type { CSSProperties, ImgHTMLAttributes } from "react";

export const PWRC_LOGO_PNG = "/assets/token/pwrc.png" as const;
export const PWRC_LOGO_SVG = "/assets/token/pwrc.svg" as const;
export const PWRC_METADATA_URI = "/metadata/metaplex.json" as const;

export type PwrcLogoFormat = "png" | "svg";

export function getPwrcLogoUrl(format: PwrcLogoFormat = "svg"): string {
  return format === "png" ? PWRC_LOGO_PNG : PWRC_LOGO_SVG;
}

export interface PwrcLogoProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt"> {
  size?: number;
  format?: PwrcLogoFormat;
  alt?: string;
}

export function PwrcLogo({
  size = 32,
  format = "svg",
  alt = "PowerChain PWRC",
  style,
  ...props
}: PwrcLogoProps) {
  const dimensions: CSSProperties = {
    width: size,
    height: size,
    objectFit: "contain",
    ...style,
  };

  return (
    <img
      {...props}
      src={getPwrcLogoUrl(format)}
      alt={alt}
      width={size}
      height={size}
      style={dimensions}
    />
  );
}
