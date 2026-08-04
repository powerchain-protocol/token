use powerchain_native_token::{NativeTokenError, NativeTokenState, NativeTokenStatus, GENESIS_SUPPLY_BASE_UNITS};

const AUTHORITY: [u8; 32] = [7; 32];

#[test]
fn genesis_and_burn_preserve_supply() {
    let mut state = NativeTokenState::new(AUTHORITY);
    state.initialize_genesis(&AUTHORITY, 1).unwrap();
    state.burn(&AUTHORITY, 1_000_000_000, 2).unwrap();
    assert_eq!(state.total_supply_base_units + state.burned_supply_base_units, GENESIS_SUPPLY_BASE_UNITS);
    assert_eq!(state.validate(), Ok(()));
}

#[test]
fn replay_and_over_burn_are_rejected_without_mutation() {
    let mut state = NativeTokenState::new(AUTHORITY);
    state.initialize_genesis(&AUTHORITY, 1).unwrap();
    let snapshot = state.clone();
    assert_eq!(state.burn(&AUTHORITY, 1, 1), Err(NativeTokenError::ReplayDetected));
    assert_eq!(state, snapshot);
    assert_eq!(state.burn(&AUTHORITY, GENESIS_SUPPLY_BASE_UNITS + 1, 2), Err(NativeTokenError::InsufficientSupply));
    assert_eq!(state, snapshot);
}

#[test]
fn pause_blocks_burn_until_resume() {
    let mut state = NativeTokenState::new(AUTHORITY);
    state.initialize_genesis(&AUTHORITY, 1).unwrap();
    state.pause(&AUTHORITY, 2).unwrap();
    assert_eq!(state.status, NativeTokenStatus::Paused);
    assert_eq!(state.burn(&AUTHORITY, 1, 3), Err(NativeTokenError::ProgramNotActive));
    state.resume(&AUTHORITY, 3).unwrap();
    state.burn(&AUTHORITY, 1, 4).unwrap();
}
