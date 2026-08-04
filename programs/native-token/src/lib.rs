//! PTK-001 PowerChain native PWRC reference program.
//! Experimental RC reference implementation; no production deployment is implied.

#![forbid(unsafe_code)]

pub mod errors;
pub mod extensions;
pub mod instruction;
pub mod metadata;
pub mod processor;
pub mod profile;
pub mod state;
pub mod token2022;

pub const SPECIFICATION_ID: &str = "PTK-001";
pub const SPECIFICATION_VERSION: &str = "1.0.0-rc.0";
pub const TOKEN_NAME: &str = "PowerChain";
pub const TOKEN_SYMBOL: &str = "PWRC";
pub const DECIMALS: u8 = 9;
pub const WHOLE_GENESIS_SUPPLY: u64 = 18_446_000_000;
pub const BASE_UNITS_PER_TOKEN: u64 = 1_000_000_000;
pub const GENESIS_SUPPLY_BASE_UNITS: u128 = WHOLE_GENESIS_SUPPLY as u128 * BASE_UNITS_PER_TOKEN as u128;
pub const MAX_SUPPLY_BASE_UNITS: u128 = GENESIS_SUPPLY_BASE_UNITS;
pub const TRANSFER_FEE_BASIS_POINTS: u16 = 250;
pub const TRANSFER_FEE_PERCENT_HUNDREDTHS: u16 = 250;
pub const MAX_TRANSFER_FEE_TOKENS: u64 = 1_000_000;
pub const MAX_TRANSFER_FEE_BASE_UNITS: u128 =
    MAX_TRANSFER_FEE_TOKENS as u128 * BASE_UNITS_PER_TOKEN as u128;
pub const REQUIRED_TOKEN_2022_EXTENSIONS: [&str; 3] = [
    "TransferFeeConfig",
    "MetadataPointer",
    "TokenMetadata",
];

const _: () = assert!(DECIMALS == 9);
const _: () = assert!(GENESIS_SUPPLY_BASE_UNITS == 18_446_000_000_000_000_000);
const _: () = assert!(TRANSFER_FEE_BASIS_POINTS == 250);
const _: () = assert!(MAX_TRANSFER_FEE_BASE_UNITS == 1_000_000_000_000_000);
pub const PLACEHOLDER_PROGRAM_ADDRESS: &str = "11111111111111111111111111111111";

#[derive(Clone, Copy, Debug, Default, PartialEq, Eq)]
#[repr(u8)]
pub enum NativeTokenStatus { #[default] GenesisPending = 0, Active = 1, Paused = 2, Deprecated = 3 }

#[derive(Clone, Debug, PartialEq, Eq)]
pub struct NativeTokenState {
    pub authority: [u8; 32],
    pub status: NativeTokenStatus,
    pub total_supply_base_units: u128,
    pub burned_supply_base_units: u128,
    pub genesis_complete: bool,
    pub nonce: u64,
}

pub use errors::{ErrorCategory, NativeTokenError, UnknownNativeTokenError};

impl NativeTokenState {
    pub const fn new(authority: [u8; 32]) -> Self {
        Self { authority, status: NativeTokenStatus::GenesisPending, total_supply_base_units: 0, burned_supply_base_units: 0, genesis_complete: false, nonce: 0 }
    }

    pub fn initialize_genesis(&mut self, signer: &[u8; 32], nonce: u64) -> Result<(), NativeTokenError> {
        self.assert_authority(signer)?;
        self.assert_nonce(nonce)?;
        if self.genesis_complete { return Err(NativeTokenError::GenesisAlreadyCompleted); }
        if self.status != NativeTokenStatus::GenesisPending { return Err(NativeTokenError::InvalidStatusTransition); }
        if self.total_supply_base_units != 0 || self.burned_supply_base_units != 0 { return Err(NativeTokenError::SupplyInvariantViolation); }
        self.total_supply_base_units = GENESIS_SUPPLY_BASE_UNITS;
        self.genesis_complete = true;
        self.status = NativeTokenStatus::Active;
        self.nonce = nonce;
        Ok(())
    }

    pub const fn mint_after_genesis(&mut self, _amount: u128) -> Result<(), NativeTokenError> {
        Err(NativeTokenError::PostGenesisMintProhibited)
    }

    pub fn burn(&mut self, signer: &[u8; 32], amount: u128, nonce: u64) -> Result<(), NativeTokenError> {
        self.assert_authority(signer)?;
        if !self.genesis_complete { return Err(NativeTokenError::GenesisNotCompleted); }
        if self.status != NativeTokenStatus::Active { return Err(NativeTokenError::ProgramNotActive); }
        self.assert_nonce(nonce)?;
        if amount == 0 { return Err(NativeTokenError::InvalidAmount); }
        let total = self.total_supply_base_units.checked_sub(amount).ok_or(NativeTokenError::InsufficientSupply)?;
        let burned = self.burned_supply_base_units.checked_add(amount).ok_or(NativeTokenError::ArithmeticOverflow)?;
        if total.checked_add(burned) != Some(GENESIS_SUPPLY_BASE_UNITS) { return Err(NativeTokenError::SupplyInvariantViolation); }
        self.total_supply_base_units = total;
        self.burned_supply_base_units = burned;
        self.nonce = nonce;
        Ok(())
    }

    pub fn pause(&mut self, signer: &[u8; 32], nonce: u64) -> Result<(), NativeTokenError> {
        self.assert_authority(signer)?;
        self.assert_genesis_complete()?;
        self.assert_nonce(nonce)?;
        if self.status != NativeTokenStatus::Active { return Err(NativeTokenError::InvalidStatusTransition); }
        self.status = NativeTokenStatus::Paused; self.nonce = nonce; Ok(())
    }

    pub fn resume(&mut self, signer: &[u8; 32], nonce: u64) -> Result<(), NativeTokenError> {
        self.assert_authority(signer)?;
        self.assert_genesis_complete()?;
        self.assert_nonce(nonce)?;
        if self.status != NativeTokenStatus::Paused { return Err(NativeTokenError::InvalidStatusTransition); }
        self.status = NativeTokenStatus::Active; self.nonce = nonce; Ok(())
    }


    pub fn transfer_authority(&mut self, signer: &[u8; 32], new_authority: [u8; 32], nonce: u64) -> Result<(), NativeTokenError> {
        self.assert_authority(signer)?;
        self.assert_nonce(nonce)?;
        if new_authority == [0u8; 32] || new_authority == self.authority { return Err(NativeTokenError::InvalidAuthority); }
        self.authority = new_authority;
        self.nonce = nonce;
        Ok(())
    }

    pub fn deprecate(&mut self, signer: &[u8; 32], nonce: u64) -> Result<(), NativeTokenError> {
        self.assert_authority(signer)?;
        self.assert_nonce(nonce)?;
        if !self.genesis_complete { return Err(NativeTokenError::GenesisNotCompleted); }
        if self.status == NativeTokenStatus::Deprecated { return Err(NativeTokenError::InvalidStatusTransition); }
        self.status = NativeTokenStatus::Deprecated;
        self.nonce = nonce;
        Ok(())
    }

    pub fn validate(&self) -> Result<(), NativeTokenError> {
        if self.authority == [0u8; 32] { return Err(NativeTokenError::InvalidAuthority); }
        if !self.genesis_complete {
            return if self.status == NativeTokenStatus::GenesisPending && self.total_supply_base_units == 0 && self.burned_supply_base_units == 0 { Ok(()) } else { Err(NativeTokenError::SupplyInvariantViolation) };
        }
        if self.status == NativeTokenStatus::GenesisPending { return Err(NativeTokenError::InvalidStatusTransition); }
        if self.total_supply_base_units.checked_add(self.burned_supply_base_units) == Some(GENESIS_SUPPLY_BASE_UNITS) { Ok(()) } else { Err(NativeTokenError::SupplyInvariantViolation) }
    }

    fn assert_genesis_complete(&self) -> Result<(), NativeTokenError> {
        if self.genesis_complete { Ok(()) } else { Err(NativeTokenError::GenesisNotCompleted) }
    }

    fn assert_authority(&self, signer: &[u8; 32]) -> Result<(), NativeTokenError> { if signer == &self.authority { Ok(()) } else { Err(NativeTokenError::Unauthorized) } }
    fn assert_nonce(&self, nonce: u64) -> Result<(), NativeTokenError> { if nonce > self.nonce { Ok(()) } else { Err(NativeTokenError::ReplayDetected) } }
}
