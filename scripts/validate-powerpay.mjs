import fs from "node:fs";
import { REPO_ROOT } from "./lib/repo-root.mjs";
import path from "node:path";
const root=REPO_ROOT;
const config=JSON.parse(fs.readFileSync(path.join(root,"config/powerpay.json"),"utf8"));
const read=(p)=>fs.readFileSync(path.join(root,p),"utf8");
const fail=(m)=>{throw new Error(m)};
if(config.assets.SOL.decimals!==9)fail("SOL decimals must be 9");
if(config.assets.USDC.decimals!==6)fail("USDC decimals must be 6");
if(config.assets.USDC.program!=="TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")fail("USDC must use the canonical SPL Token Program");
if(config.assets.PWRC.program!=="TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb")fail("PWRC must use Token-2022");
if(config.assets.PWRC.decimals!==9)fail("PWRC decimals must be 9");
if(config.assets.PWRC.initialReferencePriceUsd!=="0.000002")fail("PWRC reference price drift");
if(config.dex.default!=="jupiter")fail("Jupiter must be default router");
if(config.productionDeployment!==false)fail("PowerPay remains gated");
if(config.domains.web!=="https://payments.powerchain.energy")fail("PowerPay web domain drift");
if(config.domains.api!=="https://api.powerchain.energy/api/v1")fail("PowerPay API domain drift");
for(const origin of ["https://api.powerchain.energy","https://payments.powerchain.energy"]){if(!config.domains.allowedOrigins.includes(origin))fail(`missing PowerPay CORS origin: ${origin}`)}
if(config.program.programId!=="TBA"||config.program.productionDeployment!==false)fail("PowerPay deployment must remain gated until verified");
const lib=read("programs/powerpay/src/lib.rs");
const processor=read("programs/powerpay/src/processor.rs");
const instruction=read("programs/powerpay/src/instruction.rs");
if(!lib.includes('VERSION: &str = "1.0.0-rc.0"'))fail("PowerPay Rust version must be rc.1");
if(!lib.includes("pub use instruction::{PowerPayInstruction"))fail("PowerPayInstruction must be exported");
if(!instruction.includes("INSTRUCTION_VERSION: u8 = 1"))fail("PowerPay instruction ABI must be versioned");
if(!instruction.includes("MAX_INSTRUCTION_DATA_LEN: usize = 128"))fail("PowerPay instruction data must be bounded");
for(const roleCheck of ["context.signer != merchant","context.signer != payment.payer","context.signer != payment.merchant"]){if(!processor.includes(roleCheck))fail(`missing role check: ${roleCheck}`)}

const cors=read("apps/web/lib/cors.ts");
for(const origin of ["https://api.powerchain.energy","https://payments.powerchain.energy"]){if(!cors.includes(origin))fail(`CORS source missing ${origin}`)}
for(const constant of ["POWERPAY_PUBLIC_URL","POWERPAY_API_URL"]){if(!lib.includes(constant))fail(`PowerPay Rust constant missing: ${constant}`)}
console.log("✓ PowerPay policy and Rust program validated");
