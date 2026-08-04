import { API_V1 } from "../config/api";

export const APP_ROUTES = Object.freeze({
  home: "/",
  token: "/token",
  payments: "/payments",
  faucet: "/faucet",
  standard: "/standard",
  programs: "/programs",
  terminal: "/tools/terminal",
  developers: "/developers",
  status: "/status",
  legal: "/legals",
  privacy: "/legals/privacy",
  cookies: "/legals/cookies",
} as const);

export const EXTERNAL_ROUTES = Object.freeze({
  docs: "https://docs.powerchain.energy",
  api: "https://api.powerchain.energy/api/v1",
  payments: "https://payments.powerchain.energy",
  faucet: "https://faucet.powerchain.energy",
} as const);

export const API_ROUTES = API_V1;

export const LEGACY_REDIRECTS = Object.freeze([
  { source: "/powerpay", destination: APP_ROUTES.payments },
  { source: "/faucets", destination: APP_ROUTES.faucet },
  { source: "/wallet", destination: APP_ROUTES.token },
  { source: "/tools", destination: APP_ROUTES.terminal },
  { source: "/legal", destination: APP_ROUTES.legal },
  { source: "/docs/standards", destination: APP_ROUTES.standard },
  { source: "/api", destination: API_V1.basePath },
  { source: "/swagger.yaml", destination: API_V1.swagger },
] as const);

export const PRIMARY_NAVIGATION = Object.freeze([
  { href: APP_ROUTES.token, label: "PWRC" },
  { href: APP_ROUTES.payments, label: "PowerPay" },
  { href: APP_ROUTES.faucet, label: "Faucets" },
  { href: APP_ROUTES.standard, label: "Standards" },
  { href: APP_ROUTES.programs, label: "Programs" },
  { href: APP_ROUTES.developers, label: "Developers" },
] as const);
