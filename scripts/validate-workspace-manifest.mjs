import fs from "node:fs";
import path from "node:path";
import { REPO_ROOT, assertRepositoryRoot } from "./lib/repo-root.mjs";
assertRepositoryRoot();
const readJson=(p)=>JSON.parse(fs.readFileSync(path.join(REPO_ROOT,p),"utf8"));
const manifest=readJson("config/workspace.json");
const errors=[];
const nvmrc=path.join(REPO_ROOT,".nvmrc");
if(!fs.existsSync(nvmrc)) errors.push("missing .nvmrc; run pnpm workspace:repair");
else if(manifest.nodeVersion!==fs.readFileSync(nvmrc,"utf8").trim()) errors.push("nodeVersion must match .nvmrc");
const rootPackage=readJson("package.json");
if(manifest.packageManager!==rootPackage.packageManager) errors.push("packageManager must match package.json");
for(const [name,app] of Object.entries(manifest.applications??{})){
 const packagePath=path.join(REPO_ROOT,app.path,"package.json");
 if(!fs.existsSync(packagePath)){errors.push(`${name}: missing ${app.path}/package.json`);continue;}
 const packageJson=JSON.parse(fs.readFileSync(packagePath,"utf8"));
 if(packageJson.name!==app.package) errors.push(`${name}: package name mismatch`);
 if(app.port!==0 && (!Number.isInteger(app.port)||app.port<1024||app.port>65535)) errors.push(`${name}: invalid port`);
 if(!String(app.publicUrl).startsWith("https://")) errors.push(`${name}: publicUrl must use HTTPS`);
}
const dirs=[...fs.readdirSync(path.join(REPO_ROOT,"apps")).map(n=>`apps/${n}`),...fs.readdirSync(path.join(REPO_ROOT,"packages")).map(n=>`packages/${n}`),"utils"];
for(const packageName of manifest.packages??[]){
 const found=dirs.some(directory=>{const file=path.join(REPO_ROOT,directory,"package.json");return fs.existsSync(file)&&JSON.parse(fs.readFileSync(file,"utf8")).name===packageName;});
 if(!found) errors.push(`missing workspace package ${packageName}`);
}
for(const directory of manifest.programs??[]) if(!fs.existsSync(path.join(REPO_ROOT,directory,"Cargo.toml"))) errors.push(`missing program ${directory}`);
for(const directory of manifest.legacyPathsForbidden??[]) if(fs.existsSync(path.join(REPO_ROOT,directory))) errors.push(`forbidden legacy path exists: ${directory}`);
for(const [name,url] of Object.entries(manifest.services??{})) if(!String(url).startsWith("https://")) errors.push(`service ${name} must use HTTPS`);
if(errors.length){console.error(errors.map(e=>`- ${e}`).join("\n"));process.exit(1);}
console.log("Workspace manifest validation passed.");
