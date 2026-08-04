//! Stable persisted state layout for PTK-001.

use crate::{NativeTokenError, NativeTokenState, NativeTokenStatus};

pub const STATE_DISCRIMINATOR: [u8; 8] = *b"PWRCST01";
pub const STATE_VERSION: u8 = 1;
pub const STATE_LEN: usize = 8 + 1 + 32 + 1 + 16 + 16 + 1 + 8;

impl NativeTokenState {
    pub fn pack_into_slice(&self, output: &mut [u8]) -> Result<(), NativeTokenError> {
        if output.len() != STATE_LEN { return Err(NativeTokenError::InvalidAccountData); }
        self.validate()?;
        output[..8].copy_from_slice(&STATE_DISCRIMINATOR);
        output[8] = STATE_VERSION;
        output[9..41].copy_from_slice(&self.authority);
        output[41] = self.status as u8;
        output[42..58].copy_from_slice(&self.total_supply_base_units.to_le_bytes());
        output[58..74].copy_from_slice(&self.burned_supply_base_units.to_le_bytes());
        output[74] = u8::from(self.genesis_complete);
        output[75..83].copy_from_slice(&self.nonce.to_le_bytes());
        Ok(())
    }

    pub fn unpack_from_slice(input: &[u8]) -> Result<Self, NativeTokenError> {
        if input.len() != STATE_LEN || input[..8] != STATE_DISCRIMINATOR { return Err(NativeTokenError::InvalidAccountData); }
        if input[8] != STATE_VERSION { return Err(NativeTokenError::UnsupportedStateVersion); }
        let mut authority = [0u8; 32]; authority.copy_from_slice(&input[9..41]);
        if authority == [0u8; 32] { return Err(NativeTokenError::InvalidAuthority); }
        let status = match input[41] {
            0 => NativeTokenStatus::GenesisPending,
            1 => NativeTokenStatus::Active,
            2 => NativeTokenStatus::Paused,
            3 => NativeTokenStatus::Deprecated,
            _ => return Err(NativeTokenError::InvalidAccountData),
        };
        let genesis_complete = match input[74] { 0 => false, 1 => true, _ => return Err(NativeTokenError::InvalidAccountData) };
        let state = Self {
            authority,
            status,
            total_supply_base_units: u128::from_le_bytes(input[42..58].try_into().map_err(|_| NativeTokenError::InvalidAccountData)?),
            burned_supply_base_units: u128::from_le_bytes(input[58..74].try_into().map_err(|_| NativeTokenError::InvalidAccountData)?),
            genesis_complete,
            nonce: u64::from_le_bytes(input[75..83].try_into().map_err(|_| NativeTokenError::InvalidAccountData)?),
        };
        state.validate()?;
        Ok(state)
    }
}
