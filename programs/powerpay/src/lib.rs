//! PowerPay settlement reference primitives.
//! No production deployment is implied.

#![forbid(unsafe_code)]

pub mod errors;
pub mod instruction;
pub mod processor;
pub mod rates;
pub mod state;

pub use errors::PowerPayError;
pub use instruction::{PowerPayInstruction};
pub use rates::{PriceQuote, RateSource};
pub use state::{PaymentAsset, PaymentStatus, PowerPayState};

pub const SPECIFICATION_ID: &str = "PPAY-001";
pub const VERSION: &str = "1.0.0-rc.0";
pub const POWERPAY_PUBLIC_URL: &str = "https://payments.powerchain.energy";
pub const POWERPAY_API_URL: &str = "https://api.powerchain.energy/api/v1";
pub const TOKEN_PROGRAM_ID: &str = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
pub const TOKEN_2022_PROGRAM_ID: &str = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
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
pub const BPS_DENOMINATOR: u64 = 10_000;

const _: () = assert!(SOL_DECIMALS == 9);
const _: () = assert!(USDC_DECIMALS == 6);
const _: () = assert!(PWRC_DECIMALS == 9);
const _: () = assert!(LAMPORTS_PER_SOL == 1_000_000_000);
