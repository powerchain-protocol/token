use crate::{PaymentAsset, PowerPayError};

pub const INSTRUCTION_VERSION: u8 = 1;
pub const MAX_INSTRUCTION_DATA_LEN: usize = 128;

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum PowerPayInstruction {
    Initialize { treasury: [u8; 32], service_fee_bps: u16, nonce: u64 },
    CreatePayment {
        payment_id: [u8; 32],
        payer: [u8; 32],
        merchant: [u8; 32],
        asset: PaymentAsset,
        amount: u64,
        expires_at: i64,
        nonce: u64,
    },
    Authorize { payment_id: [u8; 32], nonce: u64 },
    Settle { payment_id: [u8; 32], nonce: u64 },
    Cancel { payment_id: [u8; 32], nonce: u64 },
    Refund { payment_id: [u8; 32], amount: u64, nonce: u64 },
    Pause { nonce: u64 },
    Resume { nonce: u64 },
    TransferAuthority { new_authority: [u8; 32], nonce: u64 },
}

impl PowerPayInstruction {
    pub fn validate(self) -> Result<Self, PowerPayError> {
        match self {
            Self::Initialize { treasury, service_fee_bps, .. } => {
                if treasury == [0; 32] { return Err(PowerPayError::InvalidTreasury); }
                if service_fee_bps > crate::MAX_SERVICE_FEE_BASIS_POINTS { return Err(PowerPayError::InvalidFee); }
            }
            Self::CreatePayment { payment_id, payer, merchant, amount, expires_at, .. } => {
                if payment_id == [0; 32] || payer == [0; 32] || merchant == [0; 32] { return Err(PowerPayError::InvalidAccount); }
                if payer == merchant { return Err(PowerPayError::InvalidAccount); }
                if amount == 0 { return Err(PowerPayError::InvalidAmount); }
                if expires_at <= 0 { return Err(PowerPayError::InvalidTimestamp); }
            }
            Self::Refund { amount: 0, .. } => return Err(PowerPayError::InvalidAmount),
            Self::TransferAuthority { new_authority, .. } if new_authority == [0; 32] => return Err(PowerPayError::InvalidAuthority),
            _ => {}
        }
        Ok(self)
    }

    pub fn pack(self) -> Vec<u8> {
        let mut out = Vec::with_capacity(MAX_INSTRUCTION_DATA_LEN);
        out.push(INSTRUCTION_VERSION);
        match self {
            Self::Initialize { treasury, service_fee_bps, nonce } => { out.push(0); out.extend_from_slice(&treasury); out.extend_from_slice(&service_fee_bps.to_le_bytes()); out.extend_from_slice(&nonce.to_le_bytes()); }
            Self::CreatePayment { payment_id, payer, merchant, asset, amount, expires_at, nonce } => { out.push(1); out.extend_from_slice(&payment_id); out.extend_from_slice(&payer); out.extend_from_slice(&merchant); out.push(asset as u8); out.extend_from_slice(&amount.to_le_bytes()); out.extend_from_slice(&expires_at.to_le_bytes()); out.extend_from_slice(&nonce.to_le_bytes()); }
            Self::Authorize { payment_id, nonce } => { out.push(2); out.extend_from_slice(&payment_id); out.extend_from_slice(&nonce.to_le_bytes()); }
            Self::Settle { payment_id, nonce } => { out.push(3); out.extend_from_slice(&payment_id); out.extend_from_slice(&nonce.to_le_bytes()); }
            Self::Cancel { payment_id, nonce } => { out.push(4); out.extend_from_slice(&payment_id); out.extend_from_slice(&nonce.to_le_bytes()); }
            Self::Refund { payment_id, amount, nonce } => { out.push(5); out.extend_from_slice(&payment_id); out.extend_from_slice(&amount.to_le_bytes()); out.extend_from_slice(&nonce.to_le_bytes()); }
            Self::Pause { nonce } => { out.push(6); out.extend_from_slice(&nonce.to_le_bytes()); }
            Self::Resume { nonce } => { out.push(7); out.extend_from_slice(&nonce.to_le_bytes()); }
            Self::TransferAuthority { new_authority, nonce } => { out.push(8); out.extend_from_slice(&new_authority); out.extend_from_slice(&nonce.to_le_bytes()); }
        }
        out
    }

    pub fn unpack(input: &[u8]) -> Result<Self, PowerPayError> {
        if input.len() > MAX_INSTRUCTION_DATA_LEN { return Err(PowerPayError::InstructionTooLarge); }
        if input.len() < 2 { return Err(PowerPayError::InvalidInstruction); }
        if input[0] != INSTRUCTION_VERSION { return Err(PowerPayError::UnsupportedInstructionVersion); }
        let tag = input[1];
        let body = &input[2..];
        let ix = match tag {
            0 => { exact(body, 42)?; Self::Initialize { treasury: array32(&body[0..32]), service_fee_bps: u16::from_le_bytes(body[32..34].try_into().unwrap()), nonce: u64::from_le_bytes(body[34..42].try_into().unwrap()) } }
            1 => { exact(body, 121)?; Self::CreatePayment { payment_id: array32(&body[0..32]), payer: array32(&body[32..64]), merchant: array32(&body[64..96]), asset: PaymentAsset::try_from(body[96])?, amount: u64::from_le_bytes(body[97..105].try_into().unwrap()), expires_at: i64::from_le_bytes(body[105..113].try_into().unwrap()), nonce: u64::from_le_bytes(body[113..121].try_into().unwrap()) } }
            2 => { exact(body, 40)?; Self::Authorize { payment_id: array32(&body[0..32]), nonce: u64::from_le_bytes(body[32..40].try_into().unwrap()) } }
            3 => { exact(body, 40)?; Self::Settle { payment_id: array32(&body[0..32]), nonce: u64::from_le_bytes(body[32..40].try_into().unwrap()) } }
            4 => { exact(body, 40)?; Self::Cancel { payment_id: array32(&body[0..32]), nonce: u64::from_le_bytes(body[32..40].try_into().unwrap()) } }
            5 => { exact(body, 48)?; Self::Refund { payment_id: array32(&body[0..32]), amount: u64::from_le_bytes(body[32..40].try_into().unwrap()), nonce: u64::from_le_bytes(body[40..48].try_into().unwrap()) } }
            6 => { exact(body, 8)?; Self::Pause { nonce: u64::from_le_bytes(body.try_into().unwrap()) } }
            7 => { exact(body, 8)?; Self::Resume { nonce: u64::from_le_bytes(body.try_into().unwrap()) } }
            8 => { exact(body, 40)?; Self::TransferAuthority { new_authority: array32(&body[0..32]), nonce: u64::from_le_bytes(body[32..40].try_into().unwrap()) } }
            _ => return Err(PowerPayError::InvalidInstruction),
        };
        ix.validate()
    }
}

fn exact(input: &[u8], expected: usize) -> Result<(), PowerPayError> {
    if input.len() < expected { Err(PowerPayError::InvalidInstruction) }
    else if input.len() > expected { Err(PowerPayError::TrailingInstructionData) }
    else { Ok(()) }
}
fn array32(input: &[u8]) -> [u8; 32] { input.try_into().expect("validated fixed slice") }
