#!/usr/bin/env node
import { createRequire } from "node:module";
import { existsSync, mkdirSync, openSync, closeSync, rmSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { REPO_ROOT, assertRepositoryRoot } from "./lib/repo-root.mjs";
assertRepositoryRoot();
const args=process.argv.slice(2); const install=args.includes("--install"); const filtered=args.filter(a=>a!=="--install"); const packagePath=filtered.shift(); const modules=filtered;
if(!packagePath||modules.length===0) throw new Error("Usage: ensure-package-dependencies.mjs [--install] <workspace-path> <module> [...module]");
const workspaceDir=path.resolve(REPO_ROOT,packagePath); const packageJson=path.join(workspaceDir,"package.json"); if(!existsSync(packageJson)) throw new Error(`Workspace package not found: ${packagePath}`);
function workspacePackageExists(name){for(const base of ["apps","packages"]){const dir=path.join(REPO_ROOT,base);if(!existsSync(dir))continue;for(const entry of readdirSync(dir,{withFileTypes:true})){if(!entry.isDirectory())continue;const mf=path.join(dir,entry.name,"package.json");if(existsSync(mf)&&JSON.parse(readFileSync(mf,"utf8")).name===name)return true;}}const util=path.join(REPO_ROOT,"utils/package.json");return existsSync(util)&&JSON.parse(readFileSync(util,"utf8")).name===name;}
function unresolved(){const req=createRequire(packageJson);return modules.filter(name=>{if(name.startsWith("@powerchain/")&&workspacePackageExists(name))return false;try{req.resolve(name);return false;}catch{return true;}})}
let missing=unresolved(); if(!missing.length){console.log(`Dependencies ready: ${packagePath}`);process.exit(0)}
if(install){if(process.env.POWERCHAIN_DEPENDENCY_REPAIR_ACTIVE==="1"){console.error("Recursive dependency repair blocked.");process.exit(1)}const lockDir=path.join(REPO_ROOT,"target/.locks");mkdirSync(lockDir,{recursive:true});const lock=path.join(lockDir,"pnpm-install.lock");let fd;try{fd=openSync(lock,"wx")}catch{console.error("Another dependency repair is already running.");process.exit(1)}try{const result=spawnSync("pnpm",["install","--prefer-offline"],{cwd:REPO_ROOT,stdio:"inherit",env:{...process.env,POWERCHAIN_DEPENDENCY_REPAIR_ACTIVE:"1"}});if(result.status!==0)process.exit(result.status??1)}finally{if(fd!==undefined)closeSync(fd);rmSync(lock,{force:true})}missing=unresolved()}
if(missing.length){console.error(`Unresolved dependencies for ${packagePath}: ${missing.join(", ")}`);console.error(`Run: cd ${REPO_ROOT} && pnpm install:repair`);process.exit(1)}
console.log(`Dependencies repaired: ${packagePath}`);
