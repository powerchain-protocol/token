use powerchain_native_token::{
    NativeTokenError, NativeTokenState, GENESIS_SUPPLY_BASE_UNITS,
};
use proptest::prelude::*;

const AUTHORITY: [u8; 32] = [7; 32];

fn active_state() -> NativeTokenState {
    let mut state = NativeTokenState::new(AUTHORITY);
    state.initialize_genesis(&AUTHORITY, 1).unwrap();
    state
}

proptest! {
    #[test]
    fn every_valid_burn_preserves_supply(amount in 1u128..=GENESIS_SUPPLY_BASE_UNITS) {
        let mut state = active_state();
        state.burn(&AUTHORITY, amount, 2).unwrap();
        prop_assert_eq!(
            state.total_supply_base_units.checked_add(state.burned_supply_base_units),
            Some(GENESIS_SUPPLY_BASE_UNITS)
        );
        prop_assert_eq!(state.validate(), Ok(()));
    }

    #[test]
    fn any_overburn_fails_without_mutation(extra in 1u64..=u64::MAX) {
        let mut state = active_state();
        let before = state.clone();
        let amount = GENESIS_SUPPLY_BASE_UNITS + u128::from(extra);
        prop_assert_eq!(
            state.burn(&AUTHORITY, amount, 2),
            Err(NativeTokenError::InsufficientSupply)
        );
        prop_assert_eq!(state, before);
    }
}
