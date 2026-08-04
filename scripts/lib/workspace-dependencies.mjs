import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { REPO_ROOT } from "./repo-root.mjs";

export const WEB_PACKAGE_JSON = path.join(REPO_ROOT, "apps", "web", "package.json");
export const ROOT_PACKAGE_JSON = path.join(REPO_ROOT, "package.json");

function tryResolve(requireFn, specifier) {
  try { return requireFn.resolve(specifier); } catch { return undefined; }
}

export function findInPnpmStore(specifier) {
  const store = path.join(REPO_ROOT, "node_modules", ".pnpm");
  if (!fs.existsSync(store)) return undefined;
  const packagePath = specifier.split("/").slice(0, specifier.startsWith("@") ? 2 : 1).join("/");
  for (const entry of fs.readdirSync(store)) {
    const candidate = path.join(store, entry, "node_modules", packagePath);
    if (fs.existsSync(candidate)) return candidate;
  }
  return undefined;
}

export function resolveFromWeb(specifier) {
  const fromWeb = createRequire(WEB_PACKAGE_JSON);
  const fromRoot = createRequire(ROOT_PACKAGE_JSON);
  return tryResolve(fromWeb, specifier) ?? tryResolve(fromRoot, specifier) ?? findInPnpmStore(specifier);
}

export function inspectWorkspaceDependencies() {
  const nextPackage = resolveFromWeb("next/package.json");
  const nextCli = resolveFromWeb("next/dist/bin/next");
  return {
    lockfilePresent: fs.existsSync(path.join(REPO_ROOT, "pnpm-lock.yaml")),
    modulesManifestPresent: fs.existsSync(path.join(REPO_ROOT, "node_modules", ".modules.yaml")),
    webNodeModulesPresent: fs.existsSync(path.join(REPO_ROOT, "apps", "web", "node_modules")),
    nextPackage,
    nextCli,
    installed: Boolean(nextPackage && nextCli),
  };
}

export function assertWorkspaceDependencies() {
  const status = inspectWorkspaceDependencies();
  if (status.installed) return status;
  throw new Error([
    "Workspace dependencies are incomplete for @powerchain/web.",
    `lockfile=${status.lockfilePresent ? "present" : "missing"}, root modules=${status.modulesManifestPresent ? "present" : "missing"}, web modules=${status.webNodeModulesPresent ? "present" : "missing"}, next=${status.nextPackage ? "resolved" : "unresolved"}`,
    `Run from the repository root: cd ${REPO_ROOT} && pnpm install:repair`,
    "If the shell reports uv_cwd, open a new terminal before running the command.",
  ].join("\n"));
}
