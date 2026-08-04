import fs from "node:fs";
import path from "node:path";
import { REPO_ROOT, assertRepositoryRoot } from "./lib/repo-root.mjs";

assertRepositoryRoot();

const manifestPath = path.join(REPO_ROOT, "config/workspace.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const changes = [];
const warnings = [];

const recoveryRoot = path.join(REPO_ROOT, "target/recovery");

function quarantineLegacyPath(legacyPath, absolutePath) {
  fs.mkdirSync(recoveryRoot, { recursive: true });
  const safeName = legacyPath.replaceAll("/", "__");
  let destination = path.join(recoveryRoot, safeName);
  let suffix = 1;
  while (fs.existsSync(destination)) destination = path.join(recoveryRoot, `${safeName}-${suffix++}`);
  fs.renameSync(absolutePath, destination);
  changes.push(`quarantined legacy ${legacyPath}/ to ${path.relative(REPO_ROOT, destination)}/`);
}

const nvmrcPath = path.join(REPO_ROOT, ".nvmrc");
const expectedNode = `${manifest.nodeVersion}\n`;
if (!fs.existsSync(nvmrcPath) || fs.readFileSync(nvmrcPath, "utf8") !== expectedNode) {
  fs.writeFileSync(nvmrcPath, expectedNode, "utf8");
  changes.push(`restored .nvmrc (${manifest.nodeVersion})`);
}

for (const legacyPath of manifest.legacyPathsForbidden ?? []) {
  const absolutePath = path.join(REPO_ROOT, legacyPath);
  if (!fs.existsSync(absolutePath)) continue;

  const stat = fs.lstatSync(absolutePath);
  if (stat.isSymbolicLink() || stat.isFile()) {
    fs.rmSync(absolutePath, { force: true });
    changes.push(`removed legacy ${legacyPath}`);
    continue;
  }

  const entries = fs.readdirSync(absolutePath);
  if (entries.length === 0) {
    fs.rmdirSync(absolutePath);
    changes.push(`removed empty legacy ${legacyPath}/`);
    continue;
  }

  quarantineLegacyPath(legacyPath, absolutePath);
}


const gitignorePath = path.join(REPO_ROOT, ".gitignore");
const requiredGitignoreEntries = [
  ".env.production",
  "env/.env.production",
  "keypairs/",
  "secrets/",
  "**/target/",
];
let gitignore = fs.existsSync(gitignorePath) ? fs.readFileSync(gitignorePath, "utf8") : "";
const gitignoreLines = new Set(gitignore.split(/\r?\n/).map((line) => line.trim()));
const missingGitignoreEntries = requiredGitignoreEntries.filter((entry) => !gitignoreLines.has(entry));
if (missingGitignoreEntries.length > 0) {
  if (gitignore.length > 0 && !gitignore.endsWith("\n")) gitignore += "\n";
  gitignore += `\n# Repaired security boundaries\n${missingGitignoreEntries.join("\n")}\n`;
  fs.writeFileSync(gitignorePath, gitignore, "utf8");
  changes.push(`restored ${missingGitignoreEntries.length} .gitignore security boundaries`);
}

for (const generatedPath of [
  "apps/web/next.config.ts",
  "apps/web/tsconfig.tsbuildinfo",
  "packages/native-token-client/tsconfig.tsbuildinfo",
  "utils/tsconfig.tsbuildinfo",
]) {
  const absolutePath = path.join(REPO_ROOT, generatedPath);
  if (fs.existsSync(absolutePath)) {
    fs.rmSync(absolutePath, { force: true });
    changes.push(`removed stale ${generatedPath}`);
  }
}


if (process.argv.includes("--dependencies")) {
  for (const dependencyPath of [
    "node_modules",
    "apps/web/node_modules",
    "apps/faucet/node_modules",
    "apps/client/node_modules",
    "packages/native-token-client/node_modules",
  ]) {
    const absolutePath = path.join(REPO_ROOT, dependencyPath);
    if (fs.existsSync(absolutePath)) {
      fs.rmSync(absolutePath, { recursive: true, force: true });
      changes.push(`removed stale dependency links at ${dependencyPath}`);
    }
  }
}

if (changes.length === 0) console.log("Workspace repair: no changes required.");
else for (const change of changes) console.log(`✓ ${change}`);
for (const warning of warnings) console.warn(`! ${warning}`);

if (warnings.length > 0 && process.argv.includes("--strict")) process.exit(1);
