import { bootstrapEnvironment } from "./lib/env-file.mjs";
import { assertRepositoryRoot } from "./lib/repo-root.mjs";

assertRepositoryRoot();
const profile = process.argv[2] ?? "devnet";
const overwrite = process.argv.includes("--force");
const result = await bootstrapEnvironment(profile, { overwrite });

if (result.created) {
  console.log(`Created ${result.destination} from ${result.source}`);
} else {
  console.log(`Environment file already exists: ${result.destination}`);
}
