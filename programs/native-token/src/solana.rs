//! Stable Solana native-unit constants used by clients, tests, and devnet tooling.
//!
//! Native SOL is not PWRC supply and is never accounted for by PTK-001 state.

use crate::NativeTokenError;

pub const SOL_DECIMALS: u8 = 9;
pub const LAMPORTS_PER_SOL: u64 = 1_000_000_000;
pub const DEVNET_FAUCET_AMOUNT_SOL: u64 = 2;
pub const DEVNET_FAUCET_AMOUNT_LAMPORTS: u64 = 2_000_000_000;

const _: () = assert!(DEVNET_FAUCET_AMOUNT_LAMPORTS == DEVNET_FAUCET_AMOUNT_SOL * LAMPORTS_PER_SOL);

pub fn sol_to_lamports(whole_sol: u64) -> Result<u64, NativeTokenError> {
    whole_sol
        .checked_mul(LAMPORTS_PER_SOL)
        .ok_or(NativeTokenError::ArithmeticOverflow)
}

pub fn split_lamports(lamports: u64) -> (u64, u64) {
    (lamports / LAMPORTS_PER_SOL, lamports % LAMPORTS_PER_SOL)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn two_sol_is_exactly_two_billion_lamports() {
        assert_eq!(sol_to_lamports(2), Ok(2_000_000_000));
        assert_eq!(split_lamports(2_000_000_001), (2, 1));
    }

    #[test]
    fn conversion_fails_on_overflow() {
        assert_eq!(sol_to_lamports(u64::MAX), Err(NativeTokenError::ArithmeticOverflow));
    }
}
