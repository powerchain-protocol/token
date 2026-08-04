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
const SYSTEM_PROGRAM_ID: &str = "11111111111111111111111111111111";

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

/// Validates that a Base58 string decodes to exactly one Solana public key.
/// This avoids accepting strings that merely look like Base58 addresses.
#[must_use]
pub fn is_valid_solana_address(value: &str) -> bool {
    if !(32..=44).contains(&value.len()) {
        return false;
    }

    let mut bytes = [0u8; 32];
    let mut decoded_len = 0usize;
    let mut leading_zeroes = 0usize;

    for (index, character) in value.bytes().enumerate() {
        if index == leading_zeroes && character == b'1' {
            leading_zeroes += 1;
        }

        let digit = match base58_digit(character) {
            Some(value) => u32::from(value),
            None => return false,
        };

        let mut carry = digit;
        for byte in bytes[..decoded_len].iter_mut().rev() {
            let value = u32::from(*byte) * 58 + carry;
            *byte = (value & 0xff) as u8;
            carry = value >> 8;
        }

        while carry > 0 {
            if decoded_len == bytes.len() {
                return false;
            }
            for offset in (0..decoded_len).rev() {
                bytes[offset + 1] = bytes[offset];
            }
            bytes[0] = (carry & 0xff) as u8;
            decoded_len += 1;
            carry >>= 8;
        }
    }

    leading_zeroes.checked_add(decoded_len) == Some(32)
}

#[must_use]
pub fn validate_program_id(program_id: &str) -> bool {
    is_valid_solana_address(program_id)
        && program_id != SYSTEM_PROGRAM_ID
        && program_id != PWRC_MINT
        && program_id != TOKEN_2022_PROGRAM_ID
}

const fn base58_digit(character: u8) -> Option<u8> {
    match character {
        b'1'..=b'9' => Some(character - b'1'),
        b'A'..=b'H' => Some(character - b'A' + 9),
        b'J'..=b'N' => Some(character - b'J' + 17),
        b'P'..=b'Z' => Some(character - b'P' + 22),
        b'a'..=b'k' => Some(character - b'a' + 33),
        b'm'..=b'z' => Some(character - b'm' + 44),
        _ => None,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn canonical_addresses_decode_to_32_bytes() {
        assert!(is_valid_solana_address(PWRC_MINT));
        assert!(is_valid_solana_address(TOKEN_2022_PROGRAM_ID));
        assert!(is_valid_solana_address(SYSTEM_PROGRAM_ID));
    }

    #[test]
    fn program_id_rejects_reserved_addresses_and_lookalikes() {
        assert!(!validate_program_id(PROGRAM_ID_TBA));
        assert!(!validate_program_id(SYSTEM_PROGRAM_ID));
        assert!(!validate_program_id(PWRC_MINT));
        assert!(!validate_program_id(TOKEN_2022_PROGRAM_ID));
        assert!(!is_valid_solana_address("1111111111111111111111111111111O"));
        assert!(!is_valid_solana_address("abc"));
    }
}
