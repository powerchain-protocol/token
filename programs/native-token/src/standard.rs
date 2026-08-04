//! Frozen PTK-001 conformance profile shared by runtime adapters and audits.

use crate::{
    DECIMALS, GENESIS_SUPPLY_BASE_UNITS, MAX_TRANSFER_FEE_BASE_UNITS,
    REQUIRED_TOKEN_2022_EXTENSIONS, SPECIFICATION_ID, SPECIFICATION_VERSION,
    TRANSFER_FEE_BASIS_POINTS,
};

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct NativeTokenStandardProfile {
    pub specification_id: &'static str,
    pub version: &'static str,
    pub decimals: u8,
    pub genesis_supply_base_units: u128,
    pub transfer_fee_basis_points: u16,
    pub maximum_transfer_fee_base_units: u128,
    pub required_extensions: [&'static str; 3],
}

pub const PTK_001_PROFILE: NativeTokenStandardProfile = NativeTokenStandardProfile {
    specification_id: SPECIFICATION_ID,
    version: SPECIFICATION_VERSION,
    decimals: DECIMALS,
    genesis_supply_base_units: GENESIS_SUPPLY_BASE_UNITS,
    transfer_fee_basis_points: TRANSFER_FEE_BASIS_POINTS,
    maximum_transfer_fee_base_units: MAX_TRANSFER_FEE_BASE_UNITS,
    required_extensions: REQUIRED_TOKEN_2022_EXTENSIONS,
};

pub const fn profile_is_frozen(profile: &NativeTokenStandardProfile) -> bool {
    profile.decimals == 9
        && profile.genesis_supply_base_units == 18_446_000_000_000_000_000
        && profile.transfer_fee_basis_points == 250
        && profile.maximum_transfer_fee_base_units == 1_000_000_000_000_000
}

const _: () = assert!(profile_is_frozen(&PTK_001_PROFILE));
