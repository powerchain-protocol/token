import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const readJson = async (path) => JSON.parse(await readFile(new URL(`../${path}`, import.meta.url), "utf8"));
const [token, extensions, authorities, explorers, links, idl] = await Promise.all([
  readJson("config/token.json"),
  readJson("config/extensions.json"),
  readJson("config/authorities.json"),
  readJson("config/explorers.json"),
  readJson("config/links.json"),
  readJson("idl/powerchain.json"),
]);

assert.equal(token.specification, "PTK-001");
assert.equal(token.symbol, "PWRC");
assert.equal(token.decimals, 9);
assert.equal(String(token.genesisSupply), "18446000000");
assert.equal(String(token.maximumSupply), "18446000000");
assert.equal(token.transferFeeBasisPoints, 250);
assert.equal(token.transferFeePercent, "2.50");
assert.equal(token.transferFeePolicy.basisPoints, 250);
assert.equal(token.transferFeePolicy.percent, "2.50");
assert.equal(extensions.transferFee.basisPoints, 250);
assert.equal(extensions.transferFee.percent, "2.50");
assert.equal(token.maximumTransferFeeTokens, extensions.transferFee.maximumFeeTokens);
assert.ok(extensions.required.includes("TransferFeeConfig"));
assert.ok(extensions.required.includes("MetadataPointer"));
assert.ok(extensions.required.includes("TokenMetadata"));
assert.ok(extensions.prohibited.includes("NonTransferable"));
assert.equal(authorities.recommendedProductionControl.hotWalletAllowed, false);
assert.equal(explorers.default, "solscan");
assert.equal(links.documentation, "https://docs.powerchain.energy");
assert.equal(idl.metadata.spec, "PTK-001");
assert.equal(idl.address, "11111111111111111111111111111111");
assert.match(idl.metadata.description, /placeholder/i);

for (const [name, value] of Object.entries(links)) {
  if (typeof value !== "string") continue;
  const url = new URL(value);
  assert.equal(url.protocol, "https:", `${name} must use HTTPS`);
}

console.log("Configuration validation passed.");
