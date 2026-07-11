# Territorial Intelligence Platform API

Minimal technical README for the backend scaffold.

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

## Scripts

- `npm run dev` starts the TypeScript development server.
- `npm run build` compiles the API.
- `npm run start` runs the compiled server.
- `npm run lint` validates code quality.
- `npm run prisma:migrate` creates development migrations.
- `npm run prisma:seed` loads seed data.

## Environment Variables

See `.env.example`. All ports, database credentials, URLs, rate limits, and provider settings are environment-driven.

## Project Structure

- `src/config` typed environment configuration.
- `src/core` contracts, errors, constants, and utilities.
- `src/modules` independent platform modules.
- `src/shared` middleware, logging, database client, routes, and docs.
- `prisma` database schema and seed.

## Run

```bash
npm run dev
```

Swagger is available at `/api/v1/docs`.
