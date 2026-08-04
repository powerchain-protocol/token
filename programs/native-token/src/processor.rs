//! Deterministic processor boundary independent of a specific runtime adapter.

use crate::{instruction::NativeTokenInstruction, NativeTokenError, NativeTokenState};

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct ProcessorContext {
    pub signer: [u8; 32],
    pub state_is_writable: bool,
    pub signer_is_signer: bool,
    pub state_owner_is_program: bool,
}

pub fn process_instruction(
    state: &mut NativeTokenState,
    context: ProcessorContext,
    instruction_data: &[u8],
) -> Result<(), NativeTokenError> {
    if !context.signer_is_signer { return Err(NativeTokenError::MissingRequiredSignature); }
    if !context.state_is_writable { return Err(NativeTokenError::AccountNotWritable); }
    if !context.state_owner_is_program { return Err(NativeTokenError::InvalidAccountOwner); }

    let instruction = NativeTokenInstruction::unpack(instruction_data)?;
    match instruction {
        NativeTokenInstruction::InitializeGenesis { nonce } => state.initialize_genesis(&context.signer, nonce),
        NativeTokenInstruction::Burn { amount, nonce } => state.burn(&context.signer, amount, nonce),
        NativeTokenInstruction::Pause { nonce } => state.pause(&context.signer, nonce),
        NativeTokenInstruction::Resume { nonce } => state.resume(&context.signer, nonce),
        NativeTokenInstruction::TransferAuthority { new_authority, nonce } => state.transfer_authority(&context.signer, new_authority, nonce),
        NativeTokenInstruction::Deprecate { nonce } => state.deprecate(&context.signer, nonce),
    }
}
