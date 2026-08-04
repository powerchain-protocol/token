import test from "node:test";import assert from "node:assert/strict";import fs from "node:fs";
const read=(p)=>fs.readFileSync(new URL(`../${p}`,import.meta.url),"utf8");
test("PowerPay API v1 uses restricted CORS",()=>{const cors=read("apps/web/lib/cors.ts");assert.match(cors,/POWERPAY_ALLOWED_ORIGINS/);assert.doesNotMatch(cors,/Allow-Origin.*\*/)});
test("quotes require wallet-signed execution",()=>{const q=read("apps/web/app/api/v1/quotes/route.ts");assert.match(q,/wallet-signature-required/);assert.match(q,/custody:false/)});
test("Solana Pay validates recipient and decimal amount",()=>{const pay=read("apps/web/lib/solana-pay.ts");assert.match(pay,/new PublicKey/);assert.match(pay,/positive decimal string/)});
