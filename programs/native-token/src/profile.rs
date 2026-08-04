//! Frozen deployment-independent PTK-001 program profile.

use crate::{
    token2022::{PWRC_MINT, TOKEN_2022_PROGRAM_ID},
    DECIMALS, MAX_TRANSFER_FEE_BASE_UNITS, SPECIFICATION_ID,
    SPECIFICATION_VERSION, TRANSFER_FEE_BASIS_POINTS,
};

pub const PROFILE_ID: &str = "PTK-PROGRAM-001";
pub const MAINNET_CLUSTER: &str = "mainnet-beta";
pub const PROGRAM_ID_TBA: &str = "TBA";
pub const AUTHORITY_MODEL: &str = "governance-multisig-timelock";
pub const USER_AUTHENTICATION: &str = "wallet-signature";

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct ProgramProfile {
    pub profile_id: &'static str,
    pub specification_id: &'static str,
    pub specification_version: &'static str,
    pub cluster: &'static str,
    pub program_id: &'static str,
    pub mint: &'static str,
    pub token_program: &'static str,
    pub decimals: u8,
    pub transfer_fee_basis_points: u16,
    pub maximum_fee_base_units: u128,
    pub production_deployment: bool,
}

pub const MAINNET_PROGRAM_PROFILE: ProgramProfile = ProgramProfile {
    profile_id: PROFILE_ID,
    specification_id: SPECIFICATION_ID,
    specification_version: SPECIFICATION_VERSION,
    cluster: MAINNET_CLUSTER,
    program_id: PROGRAM_ID_TBA,
    mint: PWRC_MINT,
    token_program: TOKEN_2022_PROGRAM_ID,
    decimals: DECIMALS,
    transfer_fee_basis_points: TRANSFER_FEE_BASIS_POINTS,
    maximum_fee_base_units: MAX_TRANSFER_FEE_BASE_UNITS,
    production_deployment: false,
};

pub fn validate_program_id(program_id: &str) -> bool {
    program_id != PROGRAM_ID_TBA
        && program_id != "11111111111111111111111111111111"
        && program_id != PWRC_MINT
        && (32..=44).contains(&program_id.len())
        && program_id.bytes().all(|byte| {
            matches!(byte,
                b'1'..=b'9' | b'A'..=b'H' | b'J'..=b'N' | b'P'..=b'Z'
                | b'a'..=b'k' | b'm'..=b'z')
        })
}
