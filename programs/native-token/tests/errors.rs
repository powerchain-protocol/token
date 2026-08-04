use powerchain_native_token::{
    ErrorCategory, NativeTokenError, UnknownNativeTokenError,
};

#[test]
fn published_error_codes_are_stable() {
    assert_eq!(NativeTokenError::Unauthorized.code(), 1);
    assert_eq!(NativeTokenError::AuthorityNotRevoked.code(), 25);
    assert_eq!(NativeTokenError::NotEnoughAccounts.code(), 26);
    assert_eq!(NativeTokenError::ConfigurationMismatch.code(), 39);
}

#[test]
fn every_published_code_round_trips() {
    for code in 1..=39 {
        let error = NativeTokenError::try_from(code).expect("published code");
        assert_eq!(error.code(), code);
        assert!(!error.message().is_empty());
    }
}

#[test]
fn unknown_codes_fail_closed() {
    assert_eq!(
        NativeTokenError::try_from(0),
        Err(UnknownNativeTokenError(0)),
    );
    assert_eq!(
        NativeTokenError::try_from(40),
        Err(UnknownNativeTokenError(40)),
    );
    assert_eq!(
        NativeTokenError::try_from(u32::MAX),
        Err(UnknownNativeTokenError(u32::MAX)),
    );
}

#[test]
fn categories_support_client_and_telemetry_routing() {
    assert_eq!(
        NativeTokenError::MissingRequiredSignature.category(),
        ErrorCategory::Authorization,
    );
    assert_eq!(
        NativeTokenError::SupplyInvariantViolation.category(),
        ErrorCategory::Supply,
    );
    assert_eq!(
        NativeTokenError::FeeCalculationMismatch.category(),
        ErrorCategory::Token2022,
    );
}

#[test]
fn retry_policy_is_conservative() {
    assert!(NativeTokenError::TransactionExpired.is_retryable());
    assert!(!NativeTokenError::ReplayDetected.is_retryable());
    assert!(!NativeTokenError::ArithmeticOverflow.is_retryable());
}

#[test]
fn security_relevant_errors_are_marked() {
    assert!(NativeTokenError::Unauthorized.is_security_relevant());
    assert!(NativeTokenError::DuplicateAccount.is_security_relevant());
    assert!(NativeTokenError::FeeCalculationMismatch.is_security_relevant());
    assert!(!NativeTokenError::InvalidAmount.is_security_relevant());
}

#[test]
fn display_includes_specification_and_numeric_code() {
    let rendered = NativeTokenError::InvalidMint.to_string();
    assert!(rendered.contains("PTK-001"));
    assert!(rendered.contains("30"));
    assert!(rendered.contains("mint"));
}
