import { resolve } from "node:path";
import { readJson } from "./lib/fs.mjs";
import { ValidationReport } from "./lib/validation.mjs";

const root = resolve(import.meta.dirname, "..");
const faucet = await readJson(resolve(root, "apps/faucet/config/tpwrc-faucet.json"));
const token = await readJson(resolve(root, "config/devnet-token.json"));
const programs = await readJson(resolve(root, "config/programs.json"));
const report = new ValidationReport();

report.assert(faucet.cluster === "devnet", "FAUCET_CLUSTER", "faucet must be devnet-only");
report.assert(faucet.asset?.symbol === "tPWRC", "FAUCET_SYMBOL", "faucet symbol must be tPWRC");
report.assert(faucet.asset?.decimals === 9, "FAUCET_DECIMALS", "faucet decimals must be 9");
report.assert(faucet.tokenProgram === programs.programs?.token2022, "TOKEN_PROGRAM", "faucet must use canonical Token-2022 program");
report.assert(faucet.security?.allowProductionCluster === false, "FAUCET_PRODUCTION", "production faucet must remain disabled");
report.assert(faucet.security?.allowCanonicalPwrcMint === false, "CANONICAL_MINT", "faucet must reject canonical PWRC mint");
report.assert(token.symbol === "tPWRC", "TOKEN_PROFILE", "devnet token profile must be tPWRC");
report.assert(token.tokenProgramId === faucet.tokenProgram, "PROFILE_PROGRAM", "faucet and tPWRC profile token programs must match");
report.assert(token.decimals === faucet.asset?.decimals, "PROFILE_DECIMALS", "faucet and tPWRC profile decimals must match");
report.assert(token.transferFeeBasisPoints === 250, "PROFILE_FEE", "tPWRC fee must be 250 basis points");

const limits = faucet.limits ?? {};
const defaultAmount = Number(limits.defaultPerRequest);
const maximumAmount = Number(limits.maximumPerRequest);
const dailyLimit = Number(limits.maximumPerWalletPerDay);
const reserve = Number(limits.minimumTreasuryReserve);
report.assert(Number.isFinite(defaultAmount) && defaultAmount > 0, "DEFAULT_AMOUNT", "default faucet amount must be positive");
report.assert(Number.isFinite(maximumAmount) && maximumAmount >= defaultAmount, "MAX_AMOUNT", "maximum amount must cover default amount");
report.assert(Number.isFinite(dailyLimit) && dailyLimit >= maximumAmount, "DAILY_LIMIT", "daily wallet limit must cover one maximum request");
report.assert(Number.isInteger(limits.maximumRequestsPerHour) && limits.maximumRequestsPerHour > 0, "RATE_LIMIT", "hourly request limit must be a positive integer");
report.assert(Number.isFinite(reserve) && reserve > dailyLimit, "TREASURY_RESERVE", "treasury reserve must exceed one daily wallet allowance");
report.finish("faucet configuration validation");
