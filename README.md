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
- `AI_PROVIDER` defaults to `mock`; external AI providers are interface-ready but not integrated with secrets yet.

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
- `/api/v1/analytics/dashboard`
- `/api/v1/reports/tourism-places?format=json|csv|excel|pdf|geojson`

Swagger is available at `/api/v1/docs`.

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

## Run

```bash
npm run dev
```

The compiled server entrypoint is `dist/src/server.js`.
