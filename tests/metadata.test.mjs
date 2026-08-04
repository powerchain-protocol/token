import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
const root=path.resolve(import.meta.dirname,"..");
const readJson=async p=>JSON.parse(await readFile(path.join(root,p),"utf8"));

test("canonical PWRC metadata includes official links", async()=>{
 const m=await readJson("public/metadata/metadata.json");
 assert.equal(m.website,"https://powerchain.energy");
 assert.equal(m.whitepaper,"https://whitepaper.powerchain.energy");
 assert.equal(m.socials.x,"https://x.com/powerchain_ai");
 assert.equal(m.socials.telegram,"https://t.me/powerchain_official");
});

test("Metaplex and Token-2022 metadata preserve PWRC identity", async()=>{
 const metaplex=await readJson("public/metadata/metaplex.json");
 const token2022=await readJson("programs/native-token/metadata/token-2022.json");
 assert.equal(metaplex.symbol,"PWRC");
 assert.equal(token2022.symbol,"PWRC");
 const entries=Object.fromEntries(token2022.additionalMetadata);
 assert.equal(entries.specification,"PTK-001");
 assert.equal(entries.x,"https://x.com/powerchain_ai");
});

test("IDL remains explicitly non-deployed", async()=>{
 const idl=await readJson("idl/powerchain.json");
 assert.equal(idl.address,"11111111111111111111111111111111");
 assert.match(idl.metadata.description,/placeholder address is not a deployment/i);
});
