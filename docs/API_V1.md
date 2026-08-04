# PowerChain API v1

The canonical API boundary is `/api/v1`. All routes are versioned and return explicit unavailable or non-deployed states rather than fabricated data.

## Discovery

- `GET /api/v1`
- `GET /api/v1/health`
- `GET /api/v1/routes`
- `GET /api/v1/openapi`
- `GET /api/v1/swagger.yaml`

## Domain routes

- `GET /api/v1/standard`
- `GET /api/v1/programs`
- `GET /api/v1/rates`
- `POST /api/v1/quotes`
- `GET /api/v1/tools/terminal`

The OpenAPI source is maintained at `docs/api/v1/swagger.yaml` and synchronized to `apps/web/public/api/v1/swagger.yaml`.
