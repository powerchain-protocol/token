use crate::{PowerPayError, BPS_DENOMINATOR, MAX_SERVICE_FEE_BASIS_POINTS, MAX_SETTLEMENT_WINDOW_SECONDS, PWRC_MAINNET_MINT, SYSTEM_PROGRAM_ID, TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID, USDC_MAINNET_MINT};

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
#[repr(u8)]
pub enum PaymentAsset { Sol = 0, Usdc = 1, Pwrc = 2 }
impl TryFrom<u8> for PaymentAsset {
    type Error = PowerPayError;
    fn try_from(value: u8) -> Result<Self, Self::Error> { match value { 0 => Ok(Self::Sol), 1 => Ok(Self::Usdc), 2 => Ok(Self::Pwrc), _ => Err(PowerPayError::UnsupportedAsset) } }
}
impl PaymentAsset {
    pub const fn decimals(self) -> u8 { match self { Self::Sol | Self::Pwrc => 9, Self::Usdc => 6 } }
    pub const fn mint(self) -> Option<&'static str> { match self { Self::Sol => None, Self::Usdc => Some(USDC_MAINNET_MINT), Self::Pwrc => Some(PWRC_MAINNET_MINT) } }
    pub const fn program_id(self) -> &'static str { match self { Self::Sol => SYSTEM_PROGRAM_ID, Self::Usdc => TOKEN_PROGRAM_ID, Self::Pwrc => TOKEN_2022_PROGRAM_ID } }
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
#[repr(u8)]
pub enum PaymentStatus { Empty = 0, Created = 1, Authorized = 2, Settled = 3, Cancelled = 4, PartiallyRefunded = 5, Refunded = 6 }

#[derive(Clone, Debug, PartialEq, Eq)]
pub struct PaymentRecord {
    pub payment_id: [u8; 32],
    pub payer: [u8; 32],
    pub merchant: [u8; 32],
    pub asset: PaymentAsset,
    pub status: PaymentStatus,
    pub gross_amount: u64,
    pub fee_amount: u64,
    pub net_amount: u64,
    pub refunded_amount: u64,
    pub expires_at: i64,
    pub nonce: u64,
}
impl PaymentRecord {
    pub const fn empty() -> Self { Self { payment_id:[0;32], payer:[0;32], merchant:[0;32], asset:PaymentAsset::Sol, status:PaymentStatus::Empty, gross_amount:0, fee_amount:0, net_amount:0, refunded_amount:0, expires_at:0, nonce:0 } }
    pub fn is_empty(&self) -> bool { self.status == PaymentStatus::Empty }
    pub fn refundable_amount(&self) -> Result<u64, PowerPayError> { self.net_amount.checked_sub(self.refunded_amount).ok_or(PowerPayError::ArithmeticOverflow) }
    fn assert_id(&self, id: &[u8;32]) -> Result<(),PowerPayError>{ if &self.payment_id==id {Ok(())} else {Err(PowerPayError::PaymentIdMismatch)} }
    fn assert_nonce(&self, nonce:u64)->Result<(),PowerPayError>{if nonce>self.nonce{Ok(())}else{Err(PowerPayError::ReplayDetected)}}
    pub fn authorize(&mut self,id:&[u8;32],now:i64,nonce:u64)->Result<(),PowerPayError>{self.assert_id(id)?;self.assert_nonce(nonce)?;if self.status!=PaymentStatus::Created{return Err(PowerPayError::InvalidStatusTransition)};if now>self.expires_at{return Err(PowerPayError::SettlementExpired)};self.status=PaymentStatus::Authorized;self.nonce=nonce;Ok(())}
    pub fn settle(&mut self,id:&[u8;32],now:i64,nonce:u64)->Result<(),PowerPayError>{self.assert_id(id)?;self.assert_nonce(nonce)?;if self.status!=PaymentStatus::Authorized{return Err(PowerPayError::InvalidStatusTransition)};if now>self.expires_at{return Err(PowerPayError::SettlementExpired)};self.status=PaymentStatus::Settled;self.nonce=nonce;Ok(())}
    pub fn cancel(&mut self,id:&[u8;32],nonce:u64)->Result<(),PowerPayError>{self.assert_id(id)?;self.assert_nonce(nonce)?;if !matches!(self.status,PaymentStatus::Created|PaymentStatus::Authorized){return Err(PowerPayError::InvalidStatusTransition)};self.status=PaymentStatus::Cancelled;self.nonce=nonce;Ok(())}
    pub fn refund(&mut self,id:&[u8;32],amount:u64,nonce:u64)->Result<(),PowerPayError>{self.assert_id(id)?;self.assert_nonce(nonce)?;if !matches!(self.status,PaymentStatus::Settled|PaymentStatus::PartiallyRefunded){return Err(PowerPayError::InvalidStatusTransition)};if amount==0{return Err(PowerPayError::InvalidAmount)};let available=self.refundable_amount()?;if amount>available{return Err(PowerPayError::RefundExceedsSettledAmount)};self.refunded_amount=self.refunded_amount.checked_add(amount).ok_or(PowerPayError::ArithmeticOverflow)?;self.status=if self.refunded_amount==self.net_amount{PaymentStatus::Refunded}else{PaymentStatus::PartiallyRefunded};self.nonce=nonce;Ok(())}
}

#[derive(Clone, Debug, PartialEq, Eq)]
pub struct PowerPayState { pub authority:[u8;32], pub treasury:[u8;32], pub initialized:bool, pub paused:bool, pub service_fee_bps:u16, pub nonce:u64 }
impl PowerPayState {
    pub const fn new(authority:[u8;32])->Self{Self{authority,treasury:[0;32],initialized:false,paused:false,service_fee_bps:0,nonce:0}}
    pub fn initialize(&mut self,signer:&[u8;32],treasury:[u8;32],service_fee_bps:u16,nonce:u64)->Result<(),PowerPayError>{self.assert_authority(signer)?;self.assert_nonce(nonce)?;if self.initialized{return Err(PowerPayError::AlreadyInitialized)};if treasury==[0;32]{return Err(PowerPayError::InvalidTreasury)};if service_fee_bps>MAX_SERVICE_FEE_BASIS_POINTS{return Err(PowerPayError::InvalidFee)};self.treasury=treasury;self.service_fee_bps=service_fee_bps;self.initialized=true;self.nonce=nonce;Ok(())}
    pub fn fee_for(&self,amount:u64)->Result<u64,PowerPayError>{if amount==0{return Err(PowerPayError::InvalidAmount)};let n=u128::from(amount).checked_mul(u128::from(self.service_fee_bps)).ok_or(PowerPayError::ArithmeticOverflow)?;let fee=n.checked_add(u128::from(BPS_DENOMINATOR-1)).ok_or(PowerPayError::ArithmeticOverflow)?/u128::from(BPS_DENOMINATOR);u64::try_from(fee).map_err(|_|PowerPayError::ArithmeticOverflow)}
    pub fn create_payment(&self,payment_id:[u8;32],payer:[u8;32],merchant:[u8;32],asset:PaymentAsset,amount:u64,expires_at:i64,now:i64,nonce:u64)->Result<PaymentRecord,PowerPayError>{self.assert_ready()?;if payment_id==[0;32]||payer==[0;32]||merchant==[0;32]||payer==merchant{return Err(PowerPayError::InvalidAccount)};if expires_at<=now{return Err(PowerPayError::SettlementExpired)};if expires_at.checked_sub(now).ok_or(PowerPayError::ArithmeticOverflow)?>MAX_SETTLEMENT_WINDOW_SECONDS{return Err(PowerPayError::InvalidTimestamp)};if nonce==0{return Err(PowerPayError::ReplayDetected)};let fee=self.fee_for(amount)?;let net=amount.checked_sub(fee).ok_or(PowerPayError::InvalidFee)?;if net==0{return Err(PowerPayError::InvalidFee)};Ok(PaymentRecord{payment_id,payer,merchant,asset,status:PaymentStatus::Created,gross_amount:amount,fee_amount:fee,net_amount:net,refunded_amount:0,expires_at,nonce})}
    pub fn validate_payment(&self,asset:PaymentAsset,amount:u64,mint:Option<&str>,token_program:&str)->Result<(),PowerPayError>{self.assert_ready()?;if amount==0{return Err(PowerPayError::InvalidAmount)};if asset.mint()!=mint{return Err(PowerPayError::InvalidMint)};if asset.program_id()!=token_program{return Err(PowerPayError::InvalidTokenProgram)};Ok(())}
    pub fn pause(&mut self,signer:&[u8;32],nonce:u64)->Result<(),PowerPayError>{self.assert_authority(signer)?;self.assert_initialized()?;self.assert_nonce(nonce)?;if self.paused{return Err(PowerPayError::InvalidStatusTransition)};self.paused=true;self.nonce=nonce;Ok(())}
    pub fn resume(&mut self,signer:&[u8;32],nonce:u64)->Result<(),PowerPayError>{self.assert_authority(signer)?;self.assert_initialized()?;self.assert_nonce(nonce)?;if !self.paused{return Err(PowerPayError::InvalidStatusTransition)};self.paused=false;self.nonce=nonce;Ok(())}
    pub fn transfer_authority(&mut self,signer:&[u8;32],new_authority:[u8;32],nonce:u64)->Result<(),PowerPayError>{self.assert_authority(signer)?;self.assert_initialized()?;self.assert_nonce(nonce)?;if new_authority==[0;32]||new_authority==self.authority{return Err(PowerPayError::InvalidAuthority)};self.authority=new_authority;self.nonce=nonce;Ok(())}
    fn assert_ready(&self)->Result<(),PowerPayError>{self.assert_initialized()?;if self.paused{Err(PowerPayError::ProgramPaused)}else{Ok(())}}
    fn assert_initialized(&self)->Result<(),PowerPayError>{if self.initialized{Ok(())}else{Err(PowerPayError::NotInitialized)}}
    fn assert_authority(&self,s:&[u8;32])->Result<(),PowerPayError>{if s==&self.authority{Ok(())}else{Err(PowerPayError::Unauthorized)}}
    fn assert_nonce(&self,n:u64)->Result<(),PowerPayError>{if n>self.nonce{Ok(())}else{Err(PowerPayError::ReplayDetected)}}
}
