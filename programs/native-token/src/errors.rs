//! Stable PTK-001 program error contract.
//!
//! Error discriminants are part of the public ABI. Existing numeric codes MUST
//! NOT be reordered or reused. New errors are appended only.

use core::fmt;

/// First PTK-001 custom error code.
pub const FIRST_CUSTOM_ERROR_CODE: u32 = 1;
/// Last error code defined by this release.
pub const LAST_CUSTOM_ERROR_CODE: u32 = 39;

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
#[repr(u8)]
pub enum ErrorCategory {
    Authorization = 1,
    Lifecycle = 2,
    Supply = 3,
    Instruction = 4,
    Account = 5,
    Token2022 = 6,
    Transaction = 7,
    Configuration = 8,
}

/// Stable custom errors returned by the PTK-001 native-token program.
///
/// Codes 1–25 are frozen for backwards compatibility. Codes 26+ extend the
/// contract without changing any previously published discriminant.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
#[repr(u32)]
pub enum NativeTokenError {
    Unauthorized = 1,
    GenesisAlreadyCompleted = 2,
    GenesisNotCompleted = 3,
    PostGenesisMintProhibited = 4,
    InvalidAmount = 5,
    SupplyInvariantViolation = 6,
    ArithmeticOverflow = 7,
    ReplayDetected = 8,
    ProgramNotActive = 9,
    InsufficientSupply = 10,
    InvalidStatusTransition = 11,
    InvalidInstructionData = 12,
    UnsupportedInstructionVersion = 13,
    UnknownInstruction = 14,
    InvalidAccountData = 15,
    UnsupportedStateVersion = 16,
    InvalidAuthority = 17,
    MissingRequiredSignature = 18,
    AccountNotWritable = 19,
    InvalidAccountOwner = 20,
    InvalidTokenProgram = 21,
    InvalidDecimals = 22,
    InvalidTransferFeeProfile = 23,
    MissingRequiredExtension = 24,
    AuthorityNotRevoked = 25,

    // Appended RC hardening errors. Do not insert variants above this line.
    NotEnoughAccounts = 26,
    UnexpectedAccount = 27,
    DuplicateAccount = 28,
    SourceEqualsDestination = 29,
    InvalidMint = 30,
    InvalidAssociatedTokenAccount = 31,
    TransferFeeExceeded = 32,
    FeeCalculationMismatch = 33,
    InvalidMaximumFee = 34,
    InvalidMetadataPointer = 35,
    InvalidMetadata = 36,
    InvalidProgramAddress = 37,
    TransactionExpired = 38,
    ConfigurationMismatch = 39,
}

impl NativeTokenError {
    #[must_use]
    pub const fn code(self) -> u32 {
        self as u32
    }

    #[must_use]
    pub const fn category(self) -> ErrorCategory {
        match self {
            Self::Unauthorized
            | Self::InvalidAuthority
            | Self::MissingRequiredSignature
            | Self::AuthorityNotRevoked => ErrorCategory::Authorization,

            Self::GenesisAlreadyCompleted
            | Self::GenesisNotCompleted
            | Self::ReplayDetected
            | Self::ProgramNotActive
            | Self::InvalidStatusTransition
            | Self::TransactionExpired => ErrorCategory::Lifecycle,

            Self::PostGenesisMintProhibited
            | Self::InvalidAmount
            | Self::SupplyInvariantViolation
            | Self::ArithmeticOverflow
            | Self::InsufficientSupply => ErrorCategory::Supply,

            Self::InvalidInstructionData
            | Self::UnsupportedInstructionVersion
            | Self::UnknownInstruction => ErrorCategory::Instruction,

            Self::InvalidAccountData
            | Self::UnsupportedStateVersion
            | Self::AccountNotWritable
            | Self::InvalidAccountOwner
            | Self::NotEnoughAccounts
            | Self::UnexpectedAccount
            | Self::DuplicateAccount
            | Self::SourceEqualsDestination
            | Self::InvalidAssociatedTokenAccount => ErrorCategory::Account,

            Self::InvalidTokenProgram
            | Self::InvalidDecimals
            | Self::InvalidTransferFeeProfile
            | Self::MissingRequiredExtension
            | Self::InvalidMint
            | Self::TransferFeeExceeded
            | Self::FeeCalculationMismatch
            | Self::InvalidMaximumFee
            | Self::InvalidMetadataPointer
            | Self::InvalidMetadata => ErrorCategory::Token2022,

            Self::InvalidProgramAddress => ErrorCategory::Transaction,
            Self::ConfigurationMismatch => ErrorCategory::Configuration,
        }
    }

    #[must_use]
    pub const fn message(self) -> &'static str {
        match self {
            Self::Unauthorized => "the signer is not the configured authority",
            Self::GenesisAlreadyCompleted => "genesis has already been completed",
            Self::GenesisNotCompleted => "genesis has not been completed",
            Self::PostGenesisMintProhibited => "post-genesis minting is prohibited by PTK-001",
            Self::InvalidAmount => "the token amount is invalid",
            Self::SupplyInvariantViolation => "the PTK-001 supply invariant would be violated",
            Self::ArithmeticOverflow => "checked arithmetic overflowed",
            Self::ReplayDetected => "the nonce is not strictly greater than the stored nonce",
            Self::ProgramNotActive => "the native-token program is not active",
            Self::InsufficientSupply => "the requested amount exceeds available supply",
            Self::InvalidStatusTransition => "the requested lifecycle transition is invalid",
            Self::InvalidInstructionData => "instruction data is malformed or has an invalid length",
            Self::UnsupportedInstructionVersion => "instruction format version is unsupported",
            Self::UnknownInstruction => "instruction discriminator is unknown",
            Self::InvalidAccountData => "account data is malformed or violates state invariants",
            Self::UnsupportedStateVersion => "persisted state version is unsupported",
            Self::InvalidAuthority => "authority is missing, unchanged, or otherwise invalid",
            Self::MissingRequiredSignature => "a required account did not sign",
            Self::AccountNotWritable => "a required account is not writable",
            Self::InvalidAccountOwner => "account owner does not match the expected program",
            Self::InvalidTokenProgram => "PWRC must use the canonical SPL Token-2022 program",
            Self::InvalidDecimals => "token decimals do not match the frozen PTK-001 value",
            Self::InvalidTransferFeeProfile => "transfer-fee configuration does not match the frozen profile",
            Self::MissingRequiredExtension => "the mint is missing a required Token-2022 extension",
            Self::AuthorityNotRevoked => "mint or freeze authority has not been revoked",
            Self::NotEnoughAccounts => "the instruction did not provide enough accounts",
            Self::UnexpectedAccount => "an account is present in an unexpected position or role",
            Self::DuplicateAccount => "the same account was supplied more than once where uniqueness is required",
            Self::SourceEqualsDestination => "source and destination token accounts must be different",
            Self::InvalidMint => "the supplied mint is not the configured PWRC or tPWRC mint",
            Self::InvalidAssociatedTokenAccount => "associated token account does not match the canonical derivation",
            Self::TransferFeeExceeded => "calculated or supplied transfer fee exceeds the approved maximum",
            Self::FeeCalculationMismatch => "client-provided fee does not match the on-chain Token-2022 calculation",
            Self::InvalidMaximumFee => "maximum transfer fee does not match the approved profile",
            Self::InvalidMetadataPointer => "metadata pointer does not target the approved mint metadata",
            Self::InvalidMetadata => "token metadata is missing, malformed, or inconsistent",
            Self::InvalidProgramAddress => "program address is invalid or still set to a placeholder",
            Self::TransactionExpired => "transaction blockhash or validity window has expired",
            Self::ConfigurationMismatch => "runtime configuration does not match the frozen PTK-001 profile",
        }
    }

    /// Returns true only when retrying with the same signed payload may make
    /// sense after refreshing volatile transaction data.
    #[must_use]
    pub const fn is_retryable(self) -> bool {
        matches!(self, Self::TransactionExpired)
    }

    /// Returns true for failures that should be surfaced to security telemetry.
    #[must_use]
    pub const fn is_security_relevant(self) -> bool {
        matches!(
            self,
            Self::Unauthorized
                | Self::ReplayDetected
                | Self::InvalidAuthority
                | Self::MissingRequiredSignature
                | Self::InvalidAccountOwner
                | Self::InvalidTokenProgram
                | Self::AuthorityNotRevoked
                | Self::DuplicateAccount
                | Self::InvalidMint
                | Self::InvalidAssociatedTokenAccount
                | Self::FeeCalculationMismatch
                | Self::InvalidProgramAddress
                | Self::ConfigurationMismatch
        )
    }
}

impl TryFrom<u32> for NativeTokenError {
    type Error = UnknownNativeTokenError;

    fn try_from(code: u32) -> Result<Self, Self::Error> {
        let value = match code {
            1 => Self::Unauthorized,
            2 => Self::GenesisAlreadyCompleted,
            3 => Self::GenesisNotCompleted,
            4 => Self::PostGenesisMintProhibited,
            5 => Self::InvalidAmount,
            6 => Self::SupplyInvariantViolation,
            7 => Self::ArithmeticOverflow,
            8 => Self::ReplayDetected,
            9 => Self::ProgramNotActive,
            10 => Self::InsufficientSupply,
            11 => Self::InvalidStatusTransition,
            12 => Self::InvalidInstructionData,
            13 => Self::UnsupportedInstructionVersion,
            14 => Self::UnknownInstruction,
            15 => Self::InvalidAccountData,
            16 => Self::UnsupportedStateVersion,
            17 => Self::InvalidAuthority,
            18 => Self::MissingRequiredSignature,
            19 => Self::AccountNotWritable,
            20 => Self::InvalidAccountOwner,
            21 => Self::InvalidTokenProgram,
            22 => Self::InvalidDecimals,
            23 => Self::InvalidTransferFeeProfile,
            24 => Self::MissingRequiredExtension,
            25 => Self::AuthorityNotRevoked,
            26 => Self::NotEnoughAccounts,
            27 => Self::UnexpectedAccount,
            28 => Self::DuplicateAccount,
            29 => Self::SourceEqualsDestination,
            30 => Self::InvalidMint,
            31 => Self::InvalidAssociatedTokenAccount,
            32 => Self::TransferFeeExceeded,
            33 => Self::FeeCalculationMismatch,
            34 => Self::InvalidMaximumFee,
            35 => Self::InvalidMetadataPointer,
            36 => Self::InvalidMetadata,
            37 => Self::InvalidProgramAddress,
            38 => Self::TransactionExpired,
            39 => Self::ConfigurationMismatch,
            _ => return Err(UnknownNativeTokenError(code)),
        };
        Ok(value)
    }
}

impl From<NativeTokenError> for u32 {
    fn from(error: NativeTokenError) -> Self {
        error.code()
    }
}

impl fmt::Display for NativeTokenError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(formatter, "PTK-001 error {}: {}", self.code(), self.message())
    }
}

#[cfg(feature = "std")]
impl std::error::Error for NativeTokenError {}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct UnknownNativeTokenError(pub u32);

impl fmt::Display for UnknownNativeTokenError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(formatter, "unknown PTK-001 error code {}", self.0)
    }
}

#[cfg(feature = "std")]
impl std::error::Error for UnknownNativeTokenError {}

#[cfg(feature = "program")]
impl From<NativeTokenError> for pinocchio::error::ProgramError {
    fn from(error: NativeTokenError) -> Self {
        Self::Custom(error.code())
    }
}
