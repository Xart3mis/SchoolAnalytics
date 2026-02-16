# Docker Compose

## Development (hot reload)

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --watch --build
# or
npm run docker:dev
```

What runs in dev:
- `postgres` on `localhost:5432`
- `redis` on `localhost:6379`
- `pgbouncer` on `localhost:6432`
- `web` with `next dev` on `localhost:3000`
- `worker` with `node --watch`
- `scheduler` with `node --watch`

`docker-compose.dev.yml` uses Compose `develop.watch`:
- source changes are synced into dev containers
- dependency file changes trigger image rebuilds

## Production-like runtime

```bash
docker compose up -d --build
# or
npm run docker:prod
```

What runs in production mode:
- `web` in `NODE_ENV=production` (build runs at container startup after healthy DB/pool/redis dependencies)
- `web` runs the standalone server entrypoint (`node .next/standalone/.../server.js`) and copies `public` + `.next/static` into standalone output before boot
- `worker` and `scheduler` in production mode
- shared `postgres`, `redis`, and `pgbouncer`

## Database migrations

```bash
docker compose --profile tools run --rm migrate
# or
npm run docker:migrate
```

## Seed database (includes admin user)

Set these in `.env`:
- `SEED_ADMIN_EMAIL`
- `SEED_ADMIN_PASSWORD`

Then run:

```bash
docker compose --profile tools run --rm seed
# or
npm run docker:seed
```

## Stop containers

```bash
docker compose down
# or
npm run docker:down
```

Delete database/redis persistent data:

```bash
docker compose down -v
```

## Self-hosted Infisical (secrets management)

This repo supports a self-hosted Infisical stack and app runtime injection via
`infisical run`.

1) Prepare variables:

```bash
cp docker/infisical/.env.example .env.infisical
# copy required entries from .env.infisical into your .env (or export them in shell)
```

2) Start the base app stack + Infisical:

```bash
docker compose -f docker-compose.yml -f docker-compose.infisical.yml up -d --build
# or
npm run docker:infisical:up
```

3) Run app services with Infisical-injected secrets:

```bash
docker compose \
  -f docker-compose.yml \
  -f docker-compose.infisical.yml \
  -f docker-compose.infisical.runtime.yml \
  up -d --build
# or
npm run docker:infisical:runtime
```

Notes:
- `INFISICAL_PROJECT_ID` and `INFISICAL_TOKEN` are required for `web`, `worker`, `scheduler`, `migrate`, and `seed` when using `docker-compose.infisical.runtime.yml`.
- Set `INFISICAL_API_URL` for self-hosted mode (default in overlay is `http://infisical:8080`).
- The runtime overlay uses `npx infisical@latest run ...` inside containers.

Run tools profile commands against Infisical-injected runtime:

```bash
npm run docker:infisical:migrate
npm run docker:infisical:seed
```
