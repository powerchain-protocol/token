//! PowerPay settlement reference primitives.
//!
//! PPAY-001 models deterministic SOL, USDC, and PWRC payment accounting.
//! External quote providers and DEX routers are observational/off-chain inputs;
//! they cannot mutate settlement state without a signed program instruction.
//! No production deployment is implied.

#![forbid(unsafe_code)]

pub mod errors;
pub mod instruction;
pub mod processor;
pub mod rates;
pub mod state;

pub use errors::PowerPayError;
pub use instruction::{PowerPayInstruction, INSTRUCTION_VERSION, MAX_INSTRUCTION_DATA_LEN};
pub use processor::{process, ProcessorContext};
pub use rates::{PriceQuote, RateSource};
pub use state::{PaymentAsset, PaymentRecord, PaymentStatus, PowerPayState};

pub const SPECIFICATION_ID: &str = "PPAY-001";
pub const POWERPAY_PUBLIC_URL: &str = "https://payments.powerchain.energy";
pub const POWERPAY_API_URL: &str = "https://api.powerchain.energy/api/v1";
pub const POWERCHAIN_DOCS_URL: &str = "https://docs.powerchain.energy";
pub const VERSION: &str = "1.0.0-rc.1";
pub const TOKEN_PROGRAM_ID: &str = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
pub const TOKEN_2022_PROGRAM_ID: &str = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
pub const ASSOCIATED_TOKEN_PROGRAM_ID: &str = "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
pub const SYSTEM_PROGRAM_ID: &str = "11111111111111111111111111111111";
pub const USDC_MAINNET_MINT: &str = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
pub const PWRC_MAINNET_MINT: &str = "PWRCRXXZxbg6FdQZfK3PMD7KP8xfxs9acvifJiG46wc";
pub const SOL_DECIMALS: u8 = 9;
pub const USDC_DECIMALS: u8 = 6;
pub const PWRC_DECIMALS: u8 = 9;
pub const LAMPORTS_PER_SOL: u64 = 1_000_000_000;
pub const USDC_BASE_UNITS_PER_TOKEN: u64 = 1_000_000;
pub const PWRC_BASE_UNITS_PER_TOKEN: u64 = 1_000_000_000;
pub const PWRC_INITIAL_REFERENCE_PRICE_MICRO_USD: u64 = 2; // $0.000002
pub const SERVICE_FEE_BASIS_POINTS: u16 = 200;
pub const MAX_SERVICE_FEE_BASIS_POINTS: u16 = 1_000;
pub const BPS_DENOMINATOR: u64 = 10_000;
pub const MAX_SETTLEMENT_WINDOW_SECONDS: i64 = 86_400;

const _: () = assert!(SOL_DECIMALS == 9);
const _: () = assert!(USDC_DECIMALS == 6);
const _: () = assert!(PWRC_DECIMALS == 9);
const _: () = assert!(LAMPORTS_PER_SOL == 1_000_000_000);
const _: () = assert!(SERVICE_FEE_BASIS_POINTS <= MAX_SERVICE_FEE_BASIS_POINTS);
