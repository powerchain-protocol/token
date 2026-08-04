import fs from "node:fs";
import path from "node:path";
import { REPO_ROOT } from "./lib/repo-root.mjs";

const requiredRoutes = [
  "apps/web/app/page.tsx",
  "apps/web/app/token/page.tsx",
  "apps/web/app/payments/page.tsx",
  "apps/web/app/faucet/page.tsx",
  "apps/web/app/developers/page.tsx",
  "apps/web/app/status/page.tsx",
  "apps/web/app/legals/page.tsx",
  "apps/web/app/api/v1/health/route.ts",
  "apps/web/app/api/v1/cors/route.ts",
  "apps/web/app/api/v1/rates/route.ts",
  "apps/web/app/api/v1/quotes/route.ts",
  "apps/web/app/api/faucets/native-sol/route.ts",
  "apps/web/app/error.tsx",
  "apps/web/app/global-error.tsx",
  "apps/web/app/loading.tsx",
  "apps/web/app/not-found.tsx",
];

for (const relative of requiredRoutes) {
  if (!fs.existsSync(path.join(REPO_ROOT, relative))) {
    throw new Error(`Missing required application route: ${relative}`);
  }
}

const apiFiles = requiredRoutes.filter((entry) => entry.includes("/api/") && entry.endsWith("route.ts"));
for (const relative of apiFiles) {
  const source = fs.readFileSync(path.join(REPO_ROOT, relative), "utf8");
  if (/from\s+["']\.\.\/\.\.\/\.\.\/lib\//.test(source)) {
    throw new Error(`API route has an under-resolved lib import: ${relative}`);
  }
}

const header = fs.readFileSync(path.join(REPO_ROOT, "apps/web/components/header.tsx"), "utf8");
const routeRegistry = fs.readFileSync(path.join(REPO_ROOT, "apps/web/lib/routes.ts"), "utf8");
if (!header.includes("PRIMARY_NAVIGATION.map")) throw new Error("Header must render the typed primary navigation registry.");
for (const route of ["/token", "/payments", "/faucet", "/developers", "/status"]) {
  if (!routeRegistry.includes(`"${route}"`)) throw new Error(`Route registry is missing ${route}`);
}

console.log("Application routing validation passed.");
