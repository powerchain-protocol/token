use powerchain_native_token::profile::{
    validate_program_id, MAINNET_PROGRAM_PROFILE, PROGRAM_ID_TBA,
};
use powerchain_native_token::token2022::{PWRC_MINT, TOKEN_2022_PROGRAM_ID};

#[test]
fn mainnet_profile_is_fail_closed_until_deployment() {
    assert_eq!(MAINNET_PROGRAM_PROFILE.program_id, PROGRAM_ID_TBA);
    assert!(!MAINNET_PROGRAM_PROFILE.production_deployment);
    assert_eq!(MAINNET_PROGRAM_PROFILE.mint, PWRC_MINT);
    assert_eq!(MAINNET_PROGRAM_PROFILE.token_program, TOKEN_2022_PROGRAM_ID);
}

#[test]
fn program_id_validator_rejects_placeholders_and_mint() {
    assert!(!validate_program_id(PROGRAM_ID_TBA));
    assert!(!validate_program_id("11111111111111111111111111111111"));
    assert!(!validate_program_id(PWRC_MINT));
    assert!(validate_program_id("PwrChn11111111111111111111111111111111111"));
}
