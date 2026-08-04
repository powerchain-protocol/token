import { PublicKey } from "@solana/web3.js";

export interface SolanaPayRequest { recipient:string; amount:string; splToken?:string; reference?:string; label?:string; message?:string; memo?:string; }
export function createSolanaPayUrl(request:SolanaPayRequest):string {
  new PublicKey(request.recipient); if(request.splToken)new PublicKey(request.splToken); if(request.reference)new PublicKey(request.reference);
  if(!/^\d+(\.\d+)?$/.test(request.amount)||Number(request.amount)<=0)throw new TypeError("amount must be a positive decimal string");
  const params=new URLSearchParams({amount:request.amount});
  if(request.splToken)params.set("spl-token",request.splToken); if(request.reference)params.append("reference",request.reference);
  if(request.label)params.set("label",request.label); if(request.message)params.set("message",request.message); if(request.memo)params.set("memo",request.memo);
  return `solana:${request.recipient}?${params.toString()}`;
}
