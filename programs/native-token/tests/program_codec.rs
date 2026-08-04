use powerchain_native_token::{
    instruction::{NativeTokenInstruction, INSTRUCTION_VERSION},
    processor::{process_instruction, ProcessorContext},
    state::{STATE_LEN, STATE_VERSION},
    token2022::{calculate_transfer_fee, validate_mint_profile, CANONICAL_TRANSFER_FEE_PROFILE, TOKEN_2022_PROGRAM_ID},
    NativeTokenError, NativeTokenState, GENESIS_SUPPLY_BASE_UNITS, MAX_TRANSFER_FEE_BASE_UNITS,
};

const AUTHORITY: [u8; 32] = [7; 32];

fn context() -> ProcessorContext {
    ProcessorContext { signer: AUTHORITY, state_is_writable: true, signer_is_signer: true, state_owner_is_program: true }
}

#[test]
fn instruction_codec_is_stable_and_rejects_trailing_data() {
    let ix = NativeTokenInstruction::Burn { amount: 42, nonce: 9 };
    let bytes = ix.pack();
    assert_eq!(bytes[0], INSTRUCTION_VERSION);
    assert_eq!(NativeTokenInstruction::unpack(&bytes), Ok(ix));
    let mut malformed = bytes; malformed.push(0);
    assert_eq!(NativeTokenInstruction::unpack(&malformed), Err(NativeTokenError::InvalidInstructionData));
}

#[test]
fn state_codec_round_trips_exactly() {
    let mut state = NativeTokenState::new(AUTHORITY);
    state.initialize_genesis(&AUTHORITY, 1).unwrap();
    state.burn(&AUTHORITY, 100, 2).unwrap();
    let mut bytes = vec![0u8; STATE_LEN];
    state.pack_into_slice(&mut bytes).unwrap();
    assert_eq!(bytes[8], STATE_VERSION);
    assert_eq!(NativeTokenState::unpack_from_slice(&bytes), Ok(state));
}

#[test]
fn state_codec_rejects_corruption_and_unknown_versions() {
    let state = NativeTokenState::new(AUTHORITY);
    let mut bytes = vec![0u8; STATE_LEN];
    state.pack_into_slice(&mut bytes).unwrap();
    bytes[8] = 99;
    assert_eq!(NativeTokenState::unpack_from_slice(&bytes), Err(NativeTokenError::UnsupportedStateVersion));
}

#[test]
fn processor_fails_closed_on_account_flags() {
    let mut state = NativeTokenState::new(AUTHORITY);
    let ix = NativeTokenInstruction::InitializeGenesis { nonce: 1 }.pack();
    let mut bad = context(); bad.signer_is_signer = false;
    assert_eq!(process_instruction(&mut state, bad, &ix), Err(NativeTokenError::MissingRequiredSignature));
    assert_eq!(state.total_supply_base_units, 0);
}

#[test]
fn processor_executes_versioned_transitions() {
    let mut state = NativeTokenState::new(AUTHORITY);
    process_instruction(&mut state, context(), &NativeTokenInstruction::InitializeGenesis { nonce: 1 }.pack()).unwrap();
    process_instruction(&mut state, context(), &NativeTokenInstruction::Burn { amount: 10, nonce: 2 }.pack()).unwrap();
    assert_eq!(state.total_supply_base_units + state.burned_supply_base_units, GENESIS_SUPPLY_BASE_UNITS);
}

#[test]
fn canonical_token_2022_profile_is_enforced() {
    assert_eq!(validate_mint_profile(TOKEN_2022_PROGRAM_ID, 9, CANONICAL_TRANSFER_FEE_PROFILE, true, true, true, true, true), Ok(()));
    assert_eq!(validate_mint_profile("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA", 9, CANONICAL_TRANSFER_FEE_PROFILE, true, true, true, true, true), Err(NativeTokenError::InvalidTokenProgram));
}

#[test]
fn transfer_fee_rounds_up_and_respects_cap() {
    assert_eq!(calculate_transfer_fee(1), Ok(1));
    assert_eq!(calculate_transfer_fee(10_000), Ok(250));
    assert_eq!(calculate_transfer_fee(u128::MAX / 1000), Ok(MAX_TRANSFER_FEE_BASE_UNITS));
}
