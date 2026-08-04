import { access, copyFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { REPO_ROOT } from "./repo-root.mjs";

const PROFILE_FILES = Object.freeze({
  devnet: ".env.devnet",
  production: ".env.production",
});

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

export function profileFileName(profile) {
  const file = PROFILE_FILES[profile];
  if (!file) throw new Error(`Unsupported environment profile: ${profile}`);
  return file;
}

export async function resolveEnvironmentFile(requestedFile, profile = "devnet") {
  const requested = path.resolve(REPO_ROOT, requestedFile || profileFileName(profile));
  if (await exists(requested)) return { path: requested, source: "requested" };

  const canonical = path.join(REPO_ROOT, "env", profileFileName(profile));
  if (await exists(canonical)) return { path: canonical, source: "canonical-profile" };

  const example = path.join(REPO_ROOT, "env", ".env.example");
  if (await exists(example)) return { path: example, source: "example" };

  throw new Error([
    `Environment file not found: ${requested}`,
    `Canonical profile not found: ${canonical}`,
    `Run \"pnpm env:bootstrap:${profile}\" from ${REPO_ROOT}.`,
  ].join("\n"));
}

export async function readEnvironmentFile(requestedFile, profile = "devnet") {
  const resolved = await resolveEnvironmentFile(requestedFile, profile);
  return { ...resolved, text: await readFile(resolved.path, "utf8") };
}

export async function bootstrapEnvironment(profile = "devnet", { overwrite = false } = {}) {
  const fileName = profileFileName(profile);
  const source = path.join(REPO_ROOT, "env", fileName);
  const destination = path.join(REPO_ROOT, fileName);

  if (!(await exists(source))) {
    throw new Error(`Canonical environment profile is missing: ${source}`);
  }
  if (!overwrite && await exists(destination)) {
    return { source, destination, created: false };
  }

  await mkdir(path.dirname(destination), { recursive: true });
  await copyFile(source, destination);
  return { source, destination, created: true };
}
