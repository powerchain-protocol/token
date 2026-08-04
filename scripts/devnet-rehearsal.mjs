import { mkdir, writeFile } from "node:fs/promises";
const root=new URL("../",import.meta.url);
const required=["POWERCHAIN_PROGRAM_ID","PWRC_MINT_ADDRESS","TRANSFER_FEE_CONFIG_AUTHORITY","WITHDRAW_WITHHELD_AUTHORITY","TREASURY_OWNER"];
const missing=required.filter(k=>!process.env[k] || process.env[k].startsWith("REQUIRED_") || process.env[k]==="11111111111111111111111111111111");
const checks=[
 "Create Token-2022 mint with TransferFeeConfig, MetadataPointer, TokenMetadata",
 "Configure fee at exactly 250 basis points and approved maximum fee",
 "Mint exact test genesis supply and revoke mint authority",
 "Verify freeze authority is null",
 "Create Token-2022 associated token accounts",
 "Execute TransferCheckedWithFee and verify gross/fee/net",
 "Burn checked units and verify supply reduction",
 "Harvest withheld fees to mint",
 "Withdraw withheld fees to governance treasury ATA",
 "Verify Solscan token, account and transaction links",
 "Run wallet/custodian/exchange/marketplace compatibility matrix"
];
const report={status:missing.length?"blocked-configuration-required":"ready-for-live-execution",cluster:"devnet",generatedAt:new Date().toISOString(),missing,checks:checks.map(name=>({name,status:"pending-live-transaction"}))};
await mkdir(new URL("target/rehearsal/",root),{recursive:true});
await writeFile(new URL("target/rehearsal/devnet-report.json",root),JSON.stringify(report,null,2)+"\n");
if(missing.length){console.error(`Devnet rehearsal blocked: ${missing.join(", ")}`);process.exitCode=2}else console.log("Devnet rehearsal plan generated; live transaction execution is required.");
