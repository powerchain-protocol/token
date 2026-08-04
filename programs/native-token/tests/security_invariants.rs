use powerchain_native_token::{
    instruction::NativeTokenInstruction,
    processor::{process_instruction, ProcessorContext},
    NativeTokenError, NativeTokenState, NativeTokenStatus, GENESIS_SUPPLY_BASE_UNITS,
};

const AUTHORITY: [u8; 32] = [7; 32];
const ATTACKER: [u8; 32] = [9; 32];

fn active_state() -> NativeTokenState {
    let mut state = NativeTokenState::new(AUTHORITY);
    state.initialize_genesis(&AUTHORITY, 1).unwrap();
    state
}

#[test]
fn unauthorized_processor_call_is_atomic() {
    let mut state = active_state();
    let before = state.clone();
    let instruction = NativeTokenInstruction::Burn { amount: 1, nonce: 2 }.pack();
    let context = ProcessorContext {
        signer: ATTACKER,
        state_is_writable: true,
        signer_is_signer: true,
        state_owner_is_program: true,
    };

    assert_eq!(process_instruction(&mut state, context, &instruction), Err(NativeTokenError::Unauthorized));
    assert_eq!(state, before);
}

#[test]
fn invalid_account_preconditions_do_not_mutate_state() {
    let instruction = NativeTokenInstruction::Pause { nonce: 2 }.pack();
    for context in [
        ProcessorContext { signer: AUTHORITY, state_is_writable: false, signer_is_signer: true, state_owner_is_program: true },
        ProcessorContext { signer: AUTHORITY, state_is_writable: true, signer_is_signer: false, state_owner_is_program: true },
        ProcessorContext { signer: AUTHORITY, state_is_writable: true, signer_is_signer: true, state_owner_is_program: false },
    ] {
        let mut state = active_state();
        let before = state.clone();
        assert!(process_instruction(&mut state, context, &instruction).is_err());
        assert_eq!(state, before);
    }
}

#[test]
fn deprecation_is_terminal_and_preserves_supply() {
    let mut state = active_state();
    state.deprecate(&AUTHORITY, 2).unwrap();
    assert_eq!(state.status, NativeTokenStatus::Deprecated);
    assert_eq!(state.total_supply_base_units, GENESIS_SUPPLY_BASE_UNITS);
    assert_eq!(state.burned_supply_base_units, 0);
    assert_eq!(state.resume(&AUTHORITY, 3), Err(NativeTokenError::InvalidStatusTransition));
    assert_eq!(state.burn(&AUTHORITY, 1, 3), Err(NativeTokenError::ProgramNotActive));
}

#[test]
fn every_published_error_code_round_trips() {
    for code in 1..=39 {
        let error = NativeTokenError::try_from(code).expect("published error code");
        assert_eq!(error.code(), code);
        assert!(!error.message().is_empty());
    }
    assert!(NativeTokenError::try_from(40).is_err());
}
