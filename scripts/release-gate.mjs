import { access, readFile } from "node:fs/promises";
const root=new URL("../",import.meta.url); const policy=JSON.parse(await readFile(new URL("config/release-policy.json",root),"utf8"));
const missing=[]; for(const file of policy.blockingArtifacts){try{await access(new URL(file,root))}catch{missing.push(file)}}
if(missing.length) throw new Error(`Production release blocked. Missing independently produced evidence: ${missing.join(", ")}`);
console.log("All production evidence artifacts are present. Manual governance approval is still required.");
