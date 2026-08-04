use powerchain_powerpay::*;
fn ctx(signer:[u8;32],now:i64)->ProcessorContext{ProcessorContext{signer,signer_is_signer:true,state_is_writable:true,payment_is_writable:true,state_owner_is_program:true,now_unix:now}}
#[test] fn instruction_roundtrips(){let variants=[PowerPayInstruction::Pause{nonce:1},PowerPayInstruction::Resume{nonce:2},PowerPayInstruction::TransferAuthority{new_authority:[9;32],nonce:3}];for ix in variants{assert_eq!(PowerPayInstruction::unpack(&ix.pack()).unwrap(),ix)}}
#[test] fn full_payment_lifecycle_and_refund(){let a=[1;32];let mut s=PowerPayState::new(a);let mut p=PaymentRecord::empty();process(&mut s,&mut p,ctx(a,100),&PowerPayInstruction::Initialize{treasury:[2;32],service_fee_bps:200,nonce:1}.pack()).unwrap();process(&mut s,&mut p,ctx([5;32],100),&PowerPayInstruction::CreatePayment{payment_id:[3;32],payer:[4;32],merchant:[5;32],asset:PaymentAsset::Usdc,amount:1_000_000,expires_at:200,nonce:1}.pack()).unwrap();assert_eq!(p.fee_amount,20_000);assert_eq!(p.net_amount,980_000);process(&mut s,&mut p,ctx([4;32],110),&PowerPayInstruction::Authorize{payment_id:[3;32],nonce:2}.pack()).unwrap();process(&mut s,&mut p,ctx([5;32],120),&PowerPayInstruction::Settle{payment_id:[3;32],nonce:3}.pack()).unwrap();process(&mut s,&mut p,ctx([5;32],130),&PowerPayInstruction::Refund{payment_id:[3;32],amount:80_000,nonce:4}.pack()).unwrap();assert_eq!(p.status,PaymentStatus::PartiallyRefunded);assert_eq!(p.refunded_amount,80_000)}
#[test] fn failures_are_atomic(){let a=[1;32];let mut s=PowerPayState::new(a);let mut p=PaymentRecord::empty();let before=(s.clone(),p.clone());let bad=ProcessorContext{signer:a,signer_is_signer:false,state_is_writable:true,payment_is_writable:true,state_owner_is_program:true,now_unix:1};assert_eq!(process(&mut s,&mut p,bad,&PowerPayInstruction::Pause{nonce:1}.pack()),Err(PowerPayError::MissingSignature));assert_eq!((s,p),before)}
#[test] fn refund_cannot_exceed_net(){let mut p=PaymentRecord{payment_id:[1;32],payer:[2;32],merchant:[3;32],asset:PaymentAsset::Sol,status:PaymentStatus::Settled,gross_amount:100,fee_amount:2,net_amount:98,refunded_amount:0,expires_at:100,nonce:1};assert_eq!(p.refund(&[1;32],99,2),Err(PowerPayError::RefundExceedsSettledAmount))}
#[test] fn trailing_bytes_and_versions_are_rejected(){let mut d=PowerPayInstruction::Pause{nonce:1}.pack();d.push(0);assert_eq!(PowerPayInstruction::unpack(&d),Err(PowerPayError::TrailingInstructionData));let mut d=PowerPayInstruction::Pause{nonce:1}.pack();d[0]=2;assert_eq!(PowerPayInstruction::unpack(&d),Err(PowerPayError::UnsupportedInstructionVersion))}

#[test]
fn payment_roles_are_enforced() {
    let authority = [1; 32];
    let mut state = PowerPayState::new(authority);
    let mut payment = PaymentRecord::empty();
    process(&mut state, &mut payment, ctx(authority, 100), &PowerPayInstruction::Initialize { treasury: [2;32], service_fee_bps: 200, nonce: 1 }.pack()).unwrap();
    let create = PowerPayInstruction::CreatePayment { payment_id:[3;32], payer:[4;32], merchant:[5;32], asset:PaymentAsset::Sol, amount:1_000_000_000, expires_at:200, nonce:1 };
    assert_eq!(process(&mut state, &mut payment, ctx([9;32],100), &create.pack()), Err(PowerPayError::Unauthorized));
    assert!(payment.is_empty());
    process(&mut state, &mut payment, ctx([5;32],100), &create.pack()).unwrap();
    assert_eq!(process(&mut state, &mut payment, ctx([9;32],110), &PowerPayInstruction::Authorize { payment_id:[3;32], nonce:2 }.pack()), Err(PowerPayError::Unauthorized));
    assert_eq!(payment.status, PaymentStatus::Created);
}
