# Docker Compose

## Development (hot reload)

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --watch --build
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
```

What runs in production mode:
- `web` in `NODE_ENV=production` with built Next.js output
- `worker` and `scheduler` in production mode
- shared `postgres`, `redis`, and `pgbouncer`

## Database migrations

```bash
docker compose --profile tools run --rm migrate
```

## Seed database (includes admin user)

Set these in `.env`:
- `SEED_ADMIN_EMAIL`
- `SEED_ADMIN_PASSWORD`

Then run:

```bash
docker compose --profile tools run --rm seed
```

## Stop containers

```bash
docker compose down
```

Delete database/redis persistent data:

```bash
docker compose down -v
```
