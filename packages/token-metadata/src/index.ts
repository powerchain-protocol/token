export const PWRC_METADATA = Object.freeze({
  name: "PowerChain", symbol: "PWRC", decimals: 9, specification: "PTK-001", version: "1.0.0-rc.0",
  mint: "PWRCRXXZxbg6FdQZfK3PMD7KP8xfxs9acvifJiG46wc",
  image: "https://powerchain.energy/assets/token/pwrc.png", imageSvg: "https://powerchain.energy/assets/token/pwrc.svg",
  metadataUri: "https://powerchain.energy/metadata/metaplex.json", website: "https://powerchain.energy",
  documentation: "https://docs.powerchain.energy", transferFeeBasisPoints: 250,
  assetClass: "fungible", transferable: true, tradeable: true,
});
export type PwrcMetadata = typeof PWRC_METADATA;
export type PwrcLogoFormat = "png" | "svg";
export function resolvePwrcLogo(format: PwrcLogoFormat = "png"): string { return format === "svg" ? PWRC_METADATA.imageSvg : PWRC_METADATA.image; }
export function createPwrcTokenMetadata(overrides: Partial<PwrcMetadata> = {}): PwrcMetadata { return Object.freeze({...PWRC_METADATA,...overrides}); }
export function assertPwrcMetadata(value: unknown): asserts value is PwrcMetadata { if(!value||typeof value!=="object")throw new TypeError("PWRC metadata must be an object"); const m=value as Record<string,unknown>; if(m.name!=="PowerChain"||m.symbol!=="PWRC"||m.decimals!==9)throw new Error("Invalid canonical PWRC metadata"); if(m.transferFeeBasisPoints!==250)throw new Error("Invalid PWRC transfer fee metadata"); }
export function getPwrcMetadataLinks(){ return Object.freeze({metadata:PWRC_METADATA.metadataUri,documentation:PWRC_METADATA.documentation,website:PWRC_METADATA.website,png:PWRC_METADATA.image,svg:PWRC_METADATA.imageSvg}); }
