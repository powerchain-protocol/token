export const API_V1 = Object.freeze({
  basePath: "/api/v1",
  health: "/api/v1/health",
  routes: "/api/v1/routes",
  standards: "/api/v1/standard",
  programs: "/api/v1/programs",
  rates: "/api/v1/rates",
  quotes: "/api/v1/quotes",
  terminal: "/api/v1/tools/terminal",
  openapi: "/api/v1/openapi",
  swagger: "/api/v1/swagger.yaml",
} as const);

export type ApiV1Route = (typeof API_V1)[keyof typeof API_V1];
