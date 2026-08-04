use crate::{PaymentRecord, PowerPayError, PowerPayInstruction, PowerPayState};

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct ProcessorContext {
    pub signer: [u8; 32],
    pub signer_is_signer: bool,
    pub state_is_writable: bool,
    pub payment_is_writable: bool,
    pub state_owner_is_program: bool,
    pub now_unix: i64,
}

pub fn process(
    state: &mut PowerPayState,
    payment: &mut PaymentRecord,
    context: ProcessorContext,
    instruction_data: &[u8],
) -> Result<(), PowerPayError> {
    if !context.signer_is_signer { return Err(PowerPayError::MissingSignature); }
    if !context.state_is_writable { return Err(PowerPayError::AccountNotWritable); }
    if !context.state_owner_is_program { return Err(PowerPayError::InvalidAccountOwner); }

    let instruction = PowerPayInstruction::unpack(instruction_data)?;
    match instruction {
        PowerPayInstruction::Initialize { treasury, service_fee_bps, nonce } =>
            state.initialize(&context.signer, treasury, service_fee_bps, nonce),
        PowerPayInstruction::CreatePayment { payment_id, payer, merchant, asset, amount, expires_at, nonce } => {
            require_payment_writable(context)?;
            if context.signer != merchant { return Err(PowerPayError::Unauthorized); }
            if !payment.is_empty() { return Err(PowerPayError::PaymentAlreadyExists); }
            *payment = state.create_payment(payment_id, payer, merchant, asset, amount, expires_at, context.now_unix, nonce)?;
            Ok(())
        }
        PowerPayInstruction::Authorize { payment_id, nonce } => {
            require_payment_writable(context)?;
            if context.signer != payment.payer { return Err(PowerPayError::Unauthorized); }
            payment.authorize(&payment_id, context.now_unix, nonce)
        }
        PowerPayInstruction::Settle { payment_id, nonce } => {
            require_payment_writable(context)?;
            if context.signer != payment.merchant { return Err(PowerPayError::Unauthorized); }
            payment.settle(&payment_id, context.now_unix, nonce)
        }
        PowerPayInstruction::Cancel { payment_id, nonce } => {
            require_payment_writable(context)?;
            if context.signer != payment.payer && context.signer != payment.merchant { return Err(PowerPayError::Unauthorized); }
            payment.cancel(&payment_id, nonce)
        }
        PowerPayInstruction::Refund { payment_id, amount, nonce } => {
            require_payment_writable(context)?;
            if context.signer != payment.merchant && context.signer != state.authority { return Err(PowerPayError::Unauthorized); }
            payment.refund(&payment_id, amount, nonce)
        }
        PowerPayInstruction::Pause { nonce } => state.pause(&context.signer, nonce),
        PowerPayInstruction::Resume { nonce } => state.resume(&context.signer, nonce),
        PowerPayInstruction::TransferAuthority { new_authority, nonce } =>
            state.transfer_authority(&context.signer, new_authority, nonce),
    }
}

fn require_payment_writable(context: ProcessorContext) -> Result<(), PowerPayError> {
    if context.payment_is_writable { Ok(()) } else { Err(PowerPayError::AccountNotWritable) }
}
