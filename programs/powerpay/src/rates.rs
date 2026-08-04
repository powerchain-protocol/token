use crate::{PowerPayError, BPS_DENOMINATOR};

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum RateSource { GovernanceReference, Pyth, Jupiter, Birdeye }

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct PriceQuote { pub source:RateSource, pub price_micro_usd:u64, pub observed_at_unix:i64, pub valid_until_unix:i64, pub maximum_slippage_bps:u16 }
impl PriceQuote {
    pub fn validate(&self,now_unix:i64)->Result<(),PowerPayError>{if self.price_micro_usd==0||self.maximum_slippage_bps>5_000{return Err(PowerPayError::InvalidRate)};if self.observed_at_unix<=0||self.valid_until_unix<self.observed_at_unix{return Err(PowerPayError::InvalidTimestamp)};if now_unix>self.valid_until_unix||self.observed_at_unix>now_unix{return Err(PowerPayError::StaleRate)};Ok(())}
    pub fn quote_base_units(&self,usd_micro:u64,token_decimals_factor:u64)->Result<u64,PowerPayError>{if usd_micro==0||token_decimals_factor==0{return Err(PowerPayError::InvalidAmount)};let n=u128::from(usd_micro).checked_mul(u128::from(token_decimals_factor)).ok_or(PowerPayError::ArithmeticOverflow)?;let v=n.checked_add(u128::from(self.price_micro_usd-1)).ok_or(PowerPayError::ArithmeticOverflow)?/u128::from(self.price_micro_usd);u64::try_from(v).map_err(|_|PowerPayError::ArithmeticOverflow)}
    pub fn minimum_received(&self,quoted:u64)->Result<u64,PowerPayError>{let kept=BPS_DENOMINATOR.checked_sub(u64::from(self.maximum_slippage_bps)).ok_or(PowerPayError::InvalidRate)?;let v=u128::from(quoted).checked_mul(u128::from(kept)).ok_or(PowerPayError::ArithmeticOverflow)?/u128::from(BPS_DENOMINATOR);u64::try_from(v).map_err(|_|PowerPayError::ArithmeticOverflow)}
}
