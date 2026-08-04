import fs from "node:fs/promises";

const file = new URL("../programs/mainnet-program/program.json", import.meta.url);
const profile = JSON.parse(await fs.readFile(file, "utf8"));
const expectedMint = "PWRCRXXZxbg6FdQZfK3PMD7KP8xfxs9acvifJiG46wc";
const token2022 = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
const base58 = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

function assertAddress(value, label) {
  if (typeof value !== "string" || !base58.test(value)) {
    throw new Error(`${label} must be a valid Solana Base58 address.`);
  }
}

if (profile.mint !== expectedMint) throw new Error("Mainnet program profile has an unexpected PWRC mint.");
if (profile.tokenProgram !== token2022) throw new Error("Mainnet program profile must use Token-2022.");
assertAddress(profile.mint, "PWRC mint");
assertAddress(profile.tokenProgram, "Token program");

if (profile.programId !== "TBA") {
  assertAddress(profile.programId, "Program ID");
  if (profile.programId === profile.mint) throw new Error("Program ID cannot equal the PWRC mint.");
  if (profile.programId === "11111111111111111111111111111111") throw new Error("System Program is not a valid PowerChain program ID.");
}


if (profile.specification?.id !== "PTK-001" || profile.specification?.version !== "1.0.0-rc.0") {
  throw new Error("Mainnet program profile specification metadata is invalid.");
}
if (profile.runtime !== "solana-sbf" || profile.framework !== "pinocchio") {
  throw new Error("Mainnet program profile runtime/framework mismatch.");
}
if (profile.decimals !== 9 || profile.transferFeeBasisPoints !== 250 || profile.maximumTransferFeeTokens !== "1000000") {
  throw new Error("Mainnet program token economics do not match frozen PTK-001 constants.");
}
const requiredExtensions = ["TransferFeeConfig", "MetadataPointer", "TokenMetadata"];
if (JSON.stringify(profile.requiredExtensions) !== JSON.stringify(requiredExtensions)) {
  throw new Error("Mainnet program required Token-2022 extensions are not canonical.");
}
if (profile.productionDeployment !== false || profile.auditRequired !== true || profile.reproducibleBuildRequired !== true) {
  throw new Error("Mainnet program release gates must remain enabled before deployment.");
}

if (profile.userAuthentication !== "wallet-signature") {
  throw new Error("Mainnet user authentication must use wallet signatures.");
}
if (profile.authorityModel !== "governance-multisig-timelock") {
  throw new Error("Mainnet authority model must use governance, multisig, and timelock controls.");
}

const authorityFields = ["upgradeAuthority", "treasuryAuthority", "withdrawWithheldAuthority"];
for (const field of authorityFields) {
  const value = profile[field];
  if (profile.productionDeployment === false && value !== "TBA") {
    assertAddress(value, field);
  }
  if (profile.productionDeployment === true && value === "TBA") {
    throw new Error(`${field} must be configured before production deployment.`);
  }
}
if (profile.programId === "TBA" && profile.status !== "configuration-required") {
  throw new Error("A TBA program ID requires configuration-required status.");
}
if (profile.programId !== "TBA" && profile.status === "configuration-required") {
  throw new Error("Configured program IDs must advance beyond configuration-required status.");
}

console.log("Mainnet program profile validation passed.");
