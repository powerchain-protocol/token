use powerchain_native_token::{NativeTokenError, NativeTokenState, NativeTokenStatus};

const AUTHORITY: [u8; 32] = [7; 32];
const ATTACKER: [u8; 32] = [9; 32];

#[test]
fn unauthorized_genesis_and_burn_fail_closed() {
    let mut state = NativeTokenState::new(AUTHORITY);
    assert_eq!(state.initialize_genesis(&ATTACKER, 1), Err(NativeTokenError::Unauthorized));
    assert_eq!(state.total_supply_base_units, 0);
    state.initialize_genesis(&AUTHORITY, 1).unwrap();
    let snapshot = state.clone();
    assert_eq!(state.burn(&ATTACKER, 1, 2), Err(NativeTokenError::Unauthorized));
    assert_eq!(state, snapshot);
}

#[test]
fn failed_operations_do_not_consume_nonce_or_mutate_state() {
    let mut state = NativeTokenState::new(AUTHORITY);
    state.initialize_genesis(&AUTHORITY, 1).unwrap();
    state.pause(&AUTHORITY, 2).unwrap();
    let snapshot = state.clone();
    assert_eq!(state.burn(&AUTHORITY, 1, 3), Err(NativeTokenError::ProgramNotActive));
    assert_eq!(state, snapshot);
    assert_eq!(state.status, NativeTokenStatus::Paused);
}
