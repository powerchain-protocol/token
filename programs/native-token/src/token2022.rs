//! Auditable Token-2022 integration contract.
//!
//! Runtime-specific CPI construction lives behind the `program` feature. The
//! pure validation functions are always available and are covered by tests.

use crate::{NativeTokenError, DECIMALS, MAX_TRANSFER_FEE_BASE_UNITS, TRANSFER_FEE_BASIS_POINTS};

pub const TOKEN_PROGRAM_ID: &str = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
pub const TOKEN_2022_PROGRAM_ID: &str = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
pub const ASSOCIATED_TOKEN_PROGRAM_ID: &str = "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
pub const MEMO_PROGRAM_ID: &str = "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr";
pub const PWRC_MINT: &str = "PWRCRXXZxbg6FdQZfK3PMD7KP8xfxs9acvifJiG46wc";

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct TransferFeeProfile {
    pub basis_points: u16,
    pub maximum_fee_base_units: u128,
}

pub const CANONICAL_TRANSFER_FEE_PROFILE: TransferFeeProfile = TransferFeeProfile {
    basis_points: TRANSFER_FEE_BASIS_POINTS,
    maximum_fee_base_units: MAX_TRANSFER_FEE_BASE_UNITS,
};

pub fn validate_mint_profile(
    owner_program: &str,
    decimals: u8,
    fee: TransferFeeProfile,
    has_transfer_fee_config: bool,
    has_metadata_pointer: bool,
    has_token_metadata: bool,
    mint_authority_revoked: bool,
    freeze_authority_revoked: bool,
) -> Result<(), NativeTokenError> {
    if owner_program != TOKEN_2022_PROGRAM_ID { return Err(NativeTokenError::InvalidTokenProgram); }
    if decimals != DECIMALS { return Err(NativeTokenError::InvalidDecimals); }
    if fee != CANONICAL_TRANSFER_FEE_PROFILE { return Err(NativeTokenError::InvalidTransferFeeProfile); }
    if !(has_transfer_fee_config && has_metadata_pointer && has_token_metadata) { return Err(NativeTokenError::MissingRequiredExtension); }
    if !mint_authority_revoked || !freeze_authority_revoked { return Err(NativeTokenError::AuthorityNotRevoked); }
    Ok(())
}

pub fn calculate_transfer_fee(amount: u128) -> Result<u128, NativeTokenError> {
    if amount == 0 { return Err(NativeTokenError::InvalidAmount); }
    let numerator = amount.checked_mul(u128::from(TRANSFER_FEE_BASIS_POINTS)).ok_or(NativeTokenError::ArithmeticOverflow)?;
    let rounded_up = numerator.checked_add(9_999).ok_or(NativeTokenError::ArithmeticOverflow)? / 10_000;
    Ok(rounded_up.min(MAX_TRANSFER_FEE_BASE_UNITS))
}
