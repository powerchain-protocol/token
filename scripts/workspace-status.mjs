import fs from "node:fs";
import net from "node:net";
import path from "node:path";
import { REPO_ROOT, assertRepositoryRoot } from "./lib/repo-root.mjs";
import { inspectWorkspaceDependencies } from "./lib/workspace-dependencies.mjs";
import { resolveEnvironmentFile } from "./lib/env-file.mjs";

assertRepositoryRoot();
const jsonMode = process.argv.includes("--json");
const manifest = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, "config/workspace.json"), "utf8"));
const packageJson = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, "package.json"), "utf8"));

function canListen(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.unref();
    server.once("error", () => resolve(false));
    server.listen({ host: "127.0.0.1", port }, () => server.close(() => resolve(true)));
  });
}

const dependencies = inspectWorkspaceDependencies();
const devnet = await resolveEnvironmentFile(".env.devnet", "devnet");
const production = await resolveEnvironmentFile(".env.production", "production");
const applications = {};
for (const [name, app] of Object.entries(manifest.applications)) {
  applications[name] = {
    ...app,
    exists: fs.existsSync(path.join(REPO_ROOT, app.path, "package.json")),
    portAvailable: await canListen(app.port),
  };
}
const legacyPaths = manifest.legacyPathsForbidden.filter((entry) => fs.existsSync(path.join(REPO_ROOT, entry)));

const nodeCompatible = process.version === `v${manifest.nodeVersion}`;
const status = {
  ok: nodeCompatible && dependencies.installed && Object.values(applications).every((app) => app.exists) && legacyPaths.length === 0,
  repository: REPO_ROOT,
  node: process.version,
  expectedNode: manifest.nodeVersion,
  nodeCompatible,
  packageManager: packageJson.packageManager,
  dependencies,
  environments: {
    devnet: { path: path.relative(REPO_ROOT, devnet.path), source: devnet.source },
    production: { path: path.relative(REPO_ROOT, production.path), source: production.source },
  },
  applications,
  legacyPaths,
};

if (jsonMode) {
  console.log(JSON.stringify(status, null, 2));
} else {
  console.log(`Workspace: ${status.ok ? "ready" : "attention required"}`);
  console.log(`Repository: ${status.repository}`);
  console.log(`Node: ${status.node} (expected ${status.expectedNode}) ${nodeCompatible ? "✓" : "✗"}`);
  console.log(`Package manager: ${status.packageManager}`);
  console.log(`Dependencies: ${dependencies.installed ? "installed" : "not installed"}`);
  for (const [name, app] of Object.entries(applications)) {
    console.log(`${name}: ${app.exists ? "present" : "missing"}, port ${app.port} ${app.portAvailable ? "available" : "in use"}`);
  }
  console.log(`Devnet profile: ${status.environments.devnet.path} (${status.environments.devnet.source})`);
  console.log(`Production profile: ${status.environments.production.path} (${status.environments.production.source})`);
  if (legacyPaths.length) console.log(`Forbidden legacy paths: ${legacyPaths.join(", ")}`);
}

if (!status.ok) process.exitCode = 1;
