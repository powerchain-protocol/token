//! Stable PTK-001 instruction wire format.

use crate::NativeTokenError;

pub const INSTRUCTION_VERSION: u8 = 1;
pub const MAX_INSTRUCTION_DATA_LEN: usize = 64;

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
#[repr(u8)]
pub enum NativeTokenInstruction {
    InitializeGenesis { nonce: u64 } = 0,
    Burn { amount: u128, nonce: u64 } = 1,
    Pause { nonce: u64 } = 2,
    Resume { nonce: u64 } = 3,
    TransferAuthority { new_authority: [u8; 32], nonce: u64 } = 4,
    Deprecate { nonce: u64 } = 5,
}

impl NativeTokenInstruction {
    pub fn unpack(input: &[u8]) -> Result<Self, NativeTokenError> {
        if input.len() < 2 || input.len() > MAX_INSTRUCTION_DATA_LEN {
            return Err(NativeTokenError::InvalidInstructionData);
        }
        if input[0] != INSTRUCTION_VERSION {
            return Err(NativeTokenError::UnsupportedInstructionVersion);
        }
        let tag = input[1];
        let body = &input[2..];
        match tag {
            0 => Ok(Self::InitializeGenesis { nonce: read_u64_exact(body)? }),
            1 => {
                if body.len() != 24 { return Err(NativeTokenError::InvalidInstructionData); }
                Ok(Self::Burn {
                    amount: u128::from_le_bytes(body[0..16].try_into().map_err(|_| NativeTokenError::InvalidInstructionData)?),
                    nonce: u64::from_le_bytes(body[16..24].try_into().map_err(|_| NativeTokenError::InvalidInstructionData)?),
                })
            }
            2 => Ok(Self::Pause { nonce: read_u64_exact(body)? }),
            3 => Ok(Self::Resume { nonce: read_u64_exact(body)? }),
            4 => {
                if body.len() != 40 { return Err(NativeTokenError::InvalidInstructionData); }
                let mut new_authority = [0u8; 32];
                new_authority.copy_from_slice(&body[..32]);
                Ok(Self::TransferAuthority {
                    new_authority,
                    nonce: u64::from_le_bytes(body[32..40].try_into().map_err(|_| NativeTokenError::InvalidInstructionData)?),
                })
            }
            5 => Ok(Self::Deprecate { nonce: read_u64_exact(body)? }),
            _ => Err(NativeTokenError::UnknownInstruction),
        }
    }

    #[must_use]
    pub fn pack(self) -> Vec<u8> {
        let mut out = Vec::with_capacity(MAX_INSTRUCTION_DATA_LEN);
        out.push(INSTRUCTION_VERSION);
        match self {
            Self::InitializeGenesis { nonce } => { out.push(0); out.extend_from_slice(&nonce.to_le_bytes()); }
            Self::Burn { amount, nonce } => { out.push(1); out.extend_from_slice(&amount.to_le_bytes()); out.extend_from_slice(&nonce.to_le_bytes()); }
            Self::Pause { nonce } => { out.push(2); out.extend_from_slice(&nonce.to_le_bytes()); }
            Self::Resume { nonce } => { out.push(3); out.extend_from_slice(&nonce.to_le_bytes()); }
            Self::TransferAuthority { new_authority, nonce } => { out.push(4); out.extend_from_slice(&new_authority); out.extend_from_slice(&nonce.to_le_bytes()); }
            Self::Deprecate { nonce } => { out.push(5); out.extend_from_slice(&nonce.to_le_bytes()); }
        }
        out
    }
}

fn read_u64_exact(input: &[u8]) -> Result<u64, NativeTokenError> {
    if input.len() != 8 { return Err(NativeTokenError::InvalidInstructionData); }
    Ok(u64::from_le_bytes(input.try_into().map_err(|_| NativeTokenError::InvalidInstructionData)?))
}
