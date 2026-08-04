import * as envModule from "./env.mjs";

export async function loadDeploymentEnv(file, profile) {
  const parser = envModule.parseEnvFile ?? envModule.readEnvFile;
  if (typeof parser !== "function") throw new Error("Environment parser is unavailable");
  const env = await parser(file);
  envModule.validateDeploymentEnv(env, profile);
  return env;
}
