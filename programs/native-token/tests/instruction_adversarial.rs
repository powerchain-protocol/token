use powerchain_native_token::{instruction::NativeTokenInstruction, NativeTokenError};

#[test]
fn arbitrary_short_and_unknown_instruction_data_is_rejected() {
    for input in [vec![], vec![1], vec![1, 255], vec![2, 0, 0, 0, 0, 0, 0, 0, 0, 0]] {
        assert!(NativeTokenInstruction::unpack(&input).is_err());
    }
}

#[test]
fn oversized_instruction_is_rejected_before_parsing() {
    let input = vec![0u8; 65];
    assert_eq!(NativeTokenInstruction::unpack(&input), Err(NativeTokenError::InvalidInstructionData));
}
