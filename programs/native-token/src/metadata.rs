//! Canonical metadata and logo references for PWRC.

pub const TOKEN_NAME: &str = "PowerChain";
pub const TOKEN_SYMBOL: &str = "PWRC";
pub const TOKEN_DESCRIPTION: &str = "PWRC is the fixed-supply native economic asset defined by PTK-001.";
pub const TOKEN_URI: &str = "https://powerchain.energy/metadata/metadata.json";
pub const METAPLEX_METADATA_URI: &str = "https://powerchain.energy/metadata/metaplex.json";
pub const LOGO_PNG_URI: &str = "https://powerchain.energy/assets/token/pwrc.png";
pub const LOGO_SVG_URI: &str = "https://powerchain.energy/assets/token/pwrc.svg";
pub const WEBSITE_URI: &str = "https://powerchain.energy";
pub const DOCUMENTATION_URI: &str = "https://docs.powerchain.energy";

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum LogoFormat { Png, Svg }

pub const fn logo_uri(format: LogoFormat) -> &'static str {
    match format {
        LogoFormat::Png => LOGO_PNG_URI,
        LogoFormat::Svg => LOGO_SVG_URI,
    }
}
