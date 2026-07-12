# Territorial Intelligence Platform API

Production backend for a public Territorial Intelligence Platform for El Salvador. The API uses Express, TypeScript, Prisma, PostgreSQL, Swagger, Docker, repository/service/controller modules, and public read-first endpoints.

## Installation

```bash
npm install
cp .env.example .env
npm run prisma:generate
```

## Docker

```bash
docker compose up --build
```

Docker Compose runs PostgreSQL 16, applies Prisma migrations with `prisma migrate deploy`, seeds baseline public data, and starts the compiled API.

## Scripts

- `npm run dev` starts the TypeScript development server.
- `npm run build` compiles the API.
- `npm run start` runs the compiled server.
- `npm run lint` validates code quality.
- `npm run prisma:migrate` creates development migrations.
- `npm run prisma:deploy` applies production migrations.
- `npm run prisma:seed` loads seed data.

## Environment Variables

See `.env.example`. All ports, PostgreSQL URLs, rate limits, provider settings, and optional write protection are environment-driven.

- `DATABASE_URL` must be a PostgreSQL URL. Render managed PostgreSQL URLs are supported.
- `API_KEY` is optional. When set, only `POST`, `PUT`, `PATCH`, and `DELETE` require `x-api-key`; all `GET` endpoints remain public.
- `AI_PROVIDER` defaults to `mock`. Supported values: `mock`, `ollama`, `lmstudio`, `gemini`, `openrouter`, `local`, `openai`.
- `OLLAMA_BASE_URL`, `OLLAMA_MODEL`, `LMSTUDIO_BASE_URL`, and `LMSTUDIO_MODEL` configure local no-paid-API providers.
- `GEMINI_API_KEY`/`GEMINI_MODEL` and `OPENROUTER_API_KEY`/`OPENROUTER_MODEL` are optional provider settings.

## Project Structure

- `src/config` typed environment configuration.
- `src/core` contracts, errors, constants, and utilities.
- `src/modules` independent platform modules.
- `src/shared` middleware, logging, database client, routes, and docs.
- `prisma` database schema and seed.

## Public Platform Endpoints

- `/health`, `/status`, `/metrics`, `/version`
- `/api/v1/platform`, `/api/v1/platform/config`
- `/api/v1/search`, `/api/v1/search/autocomplete`
- `/api/v1/analytics/dashboard`, `/api/v1/analytics/indicators`, `/api/v1/analytics/heatmap`, `/api/v1/analytics/insights`
- `/api/v1/dashboard/overview`
- `/api/v1/insights`
- `/api/v1/maps/config`, `/api/v1/maps/heatmap`
- `/api/v1/reports/tourism-places?format=json|csv|excel|pdf|geojson`
- `/api/v1/exports/formats`, `/api/v1/exports/tourism-places?format=json|csv|excel|pdf|geojson`
- `/api/v1/datasets`, `/api/v1/datasets/import-capabilities`, `/api/v1/datasets/validate-import`, `/api/v1/datasets/:slug/export?format=json|geojson|csv`
- `/api/v1/ai/generate`

Swagger is available at `/api/v1/docs`.

Search supports text, department, municipality, category, tags, coordinates, radius, sorting, pagination, facets, and autocomplete suggestions.

Reports and exports generate actual CSV, Excel, PDF, JSON, and GeoJSON responses. Dataset exports generate JSON, GeoJSON, and CSV from public dataset metadata.

## Render Deployment

1. Create a Render PostgreSQL database.
2. Set `DATABASE_URL` to the managed PostgreSQL connection string.
3. Use Docker deployment or run:

```bash
npm ci
npm run prisma:generate
npm run build
npm run prisma:deploy
npm run prisma:seed
npm run start
```

For Docker on Render, set `DATABASE_URL`, `NODE_ENV=production`, `PORT`, optional `API_KEY`, and any AI provider variables in the Render environment. The image builds with Prisma generation and runs as a non-root user.

## Run

```bash
npm run dev
```

The compiled server entrypoint is `dist/src/server.js`.
