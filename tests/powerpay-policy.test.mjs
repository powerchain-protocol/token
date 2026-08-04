import test from "node:test";import assert from "node:assert/strict";import fs from "node:fs";
const c=JSON.parse(fs.readFileSync(new URL("../config/powerpay.json",import.meta.url),"utf8"));
test("PowerPay uses exact decimals",()=>{assert.equal(c.assets.SOL.decimals,9);assert.equal(c.assets.USDC.decimals,6);assert.equal(c.assets.PWRC.decimals,9)});
test("PowerPay reference price is informational and exact",()=>assert.equal(c.assets.PWRC.initialReferencePriceUsd,"0.000002"));
test("DEX execution remains wallet signed",()=>assert.match(c.dex.execution,/wallet-signed/));

test("USDC and PWRC use distinct canonical token programs",()=>{assert.equal(c.assets.USDC.program,"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");assert.equal(c.assets.PWRC.program,"TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb")});
