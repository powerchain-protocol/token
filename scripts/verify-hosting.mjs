import { createHash } from "node:crypto";
import { readFile, mkdir, writeFile } from "node:fs/promises";
const root = new URL("../", import.meta.url);
const metadataPath = new URL("public/metadata/metaplex.json", root);
const logoPath = new URL("public/assets/token/pwrc.png", root);
const metadata = JSON.parse(await readFile(metadataPath, "utf8"));
const logo = await readFile(logoPath);
const expectedLogoHash = createHash("sha256").update(logo).digest("hex");
const metadataUrl = process.env.PWRC_METADATA_URI ?? "https://powerchain.energy/metadata/metaplex.json";
const logoUrl = process.env.PWRC_LOGO_URI ?? metadata.image;
const checks=[];
async function verify(url, expectedType, expectedHash) {
  const response = await fetch(url, { redirect:"error", signal:AbortSignal.timeout(10000), headers:{"user-agent":"PowerChain-Release-Validator/1.0"} });
  const bytes=Buffer.from(await response.arrayBuffer());
  const type=response.headers.get("content-type")?.split(";")[0]?.trim() ?? "";
  const hash=createHash("sha256").update(bytes).digest("hex");
  const result={url,status:response.status,contentType:type,sha256:hash,cacheControl:response.headers.get("cache-control"),ok:response.ok && type===expectedType && (!expectedHash || hash===expectedHash)};
  checks.push(result); if(!result.ok) throw new Error(`Hosting verification failed for ${url}: ${JSON.stringify(result)}`);
}
await verify(metadataUrl,"application/json",null);
await verify(logoUrl,"image/png",expectedLogoHash);
await mkdir(new URL("target/hosting/",root),{recursive:true});
await writeFile(new URL("target/hosting/verification.json",root),JSON.stringify({verifiedAt:new Date().toISOString(),localMetadata:metadata,checks},null,2)+"\n");
console.log("Metadata and logo hosting verified.");
