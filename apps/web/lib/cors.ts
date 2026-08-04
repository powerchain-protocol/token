import { NextResponse, type NextRequest } from "next/server";

const DEFAULT_ALLOWED_ORIGINS = [
  "https://powerchain.energy",
  "https://docs.powerchain.energy",
  "https://api.powerchain.energy",
  "https://payments.powerchain.energy",
];

function allowedOrigins():Set<string>{return new Set((process.env.POWERPAY_ALLOWED_ORIGINS?.split(",")??DEFAULT_ALLOWED_ORIGINS).map(v=>v.trim()).filter(Boolean));}
export function corsHeaders(request:NextRequest):HeadersInit {
  const origin=request.headers.get("origin"); const allowed=origin&&allowedOrigins().has(origin)?origin:null;
  return {"Access-Control-Allow-Origin":allowed??"null","Access-Control-Allow-Methods":"GET,POST,OPTIONS","Access-Control-Allow-Headers":"Content-Type,Authorization,X-Request-Id","Access-Control-Max-Age":"86400","Vary":"Origin","Cache-Control":"no-store"};
}
export function corsJson(request:NextRequest,body:unknown,init:ResponseInit={}){const headers=new Headers(init.headers);for(const [k,v] of Object.entries(corsHeaders(request)))headers.set(k,String(v));return NextResponse.json(body,{...init,headers});}
export function corsOptions(request:NextRequest){return new NextResponse(null,{status:204,headers:corsHeaders(request)});}
