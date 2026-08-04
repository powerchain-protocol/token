import { assertWorkspaceDependencies } from "./lib/workspace-dependencies.mjs";

try {
  const status = assertWorkspaceDependencies();
  console.log(`Workspace dependencies ready: ${status.nextPackage}`);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
