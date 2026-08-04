//! Frozen PPAY-001 asset and fee boundaries.

use crate::{
    PWRC_DECIMALS, PWRC_MAINNET_MINT, SERVICE_FEE_BASIS_POINTS, SOL_DECIMALS,
    USDC_DECIMALS, USDC_MAINNET_MINT, VERSION,
};

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct SettlementAssetProfile {
    pub symbol: &'static str,
    pub decimals: u8,
    pub mint: Option<&'static str>,
}

pub const SOL_PROFILE: SettlementAssetProfile = SettlementAssetProfile {
    symbol: "SOL",
    decimals: SOL_DECIMALS,
    mint: None,
};

pub const USDC_PROFILE: SettlementAssetProfile = SettlementAssetProfile {
    symbol: "USDC",
    decimals: USDC_DECIMALS,
    mint: Some(USDC_MAINNET_MINT),
};

pub const PWRC_PROFILE: SettlementAssetProfile = SettlementAssetProfile {
    symbol: "PWRC",
    decimals: PWRC_DECIMALS,
    mint: Some(PWRC_MAINNET_MINT),
};

pub const PPAY_STANDARD_VERSION: &str = VERSION;
pub const PPAY_SERVICE_FEE_BASIS_POINTS: u16 = SERVICE_FEE_BASIS_POINTS;

const _: () = assert!(SOL_PROFILE.decimals == 9);
const _: () = assert!(USDC_PROFILE.decimals == 6);
const _: () = assert!(PWRC_PROFILE.decimals == 9);
const _: () = assert!(PPAY_SERVICE_FEE_BASIS_POINTS == 200);
