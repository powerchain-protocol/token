import fs from "node:fs";
import path from "node:path";
import { REPO_ROOT } from "./lib/repo-root.mjs";

const packagePaths = [
  "apps/web/package.json",
  "apps/faucet/package.json",
  "packages/native-token-client/package.json",
  "packages/standards/package.json",
  "packages/token-metadata/package.json",
  "apps/client/package.json",
  "utils/package.json",
];

const packages = packagePaths.map((relative) => {
  const absolute = path.join(REPO_ROOT, relative);
  if (!fs.existsSync(absolute)) throw new Error(`Missing workspace package: ${relative}`);
  return { relative, data: JSON.parse(fs.readFileSync(absolute, "utf8")) };
});

const names = new Set(packages.map(({ data }) => data.name));
for (const { relative, data } of packages) {
  if (!data.name || !data.scripts?.build || !data.scripts?.typecheck) {
    throw new Error(`${relative} must declare name, build, and typecheck.`);
  }

  const allDependencies = { ...data.dependencies, ...data.devDependencies, ...data.peerDependencies };
  for (const [dependency, version] of Object.entries(allDependencies)) {
    if (String(version).startsWith("workspace:") && !names.has(dependency)) {
      throw new Error(`${relative} references missing workspace dependency ${dependency}.`);
    }
  }
}

for (const relative of [
  "apps/web/tsconfig.json",
  "apps/faucet/tsconfig.json",
  "packages/native-token-client/tsconfig.json",
  "apps/client/tsconfig.json",
  "utils/tsconfig.json",
]) {
  const config = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, relative), "utf8"));
  const packagePath = path.join(path.dirname(path.join(REPO_ROOT, relative)), "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
  const usesNodeTypes = config.compilerOptions?.types?.includes("node");
  if (usesNodeTypes && !packageJson.devDependencies?.["@types/node"] && !packageJson.dependencies?.["@types/node"]) {
    throw new Error(`${relative} enables Node types without declaring @types/node locally.`);
  }
}

const rootPackage = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, "package.json"), "utf8"));
for (const command of ["dev", "build", "typecheck", "test", "validate:workspace", "doctor", "recover"]) {
  if (!rootPackage.scripts?.[command]) throw new Error(`Root package is missing required script: ${command}`);
}

console.log(`Workspace package graph validation passed (${packages.length} packages).`);
