import type { NextRequest } from "next/server";
import { corsJson, corsOptions } from "../../../../lib/cors";
export const runtime="nodejs"; export const dynamic="force-dynamic";
const INITIAL_PRICE="0.000002";
export function OPTIONS(request:NextRequest){return corsOptions(request);}
export function GET(request:NextRequest){return corsJson(request,{asset:"PWRC",currency:"USD",price:INITIAL_PRICE,source:"governance-reference",marketPrice:false,observedAt:new Date().toISOString(),disclaimer:"Reference input only; not a live market quote."});}
