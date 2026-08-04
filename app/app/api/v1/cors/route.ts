import type { NextRequest } from "next/server";
import { corsJson, corsOptions } from "../../../../lib/cors";
export const runtime="nodejs"; export const dynamic="force-dynamic";
export function OPTIONS(request:NextRequest){return corsOptions(request);}
export function GET(request:NextRequest){return corsJson(request,{ok:true,api:"PowerPay",version:"v1",cors:"restricted-origin-allowlist"});}
