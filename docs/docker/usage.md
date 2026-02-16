### How to run
  - Development (hot reload):
    docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
    npm run docker:dev

  - Production-like:
    docker compose up -d --build
    npm run docker:prod

  - Run migrations:
    docker compose --profile tools run --rm migrate
    npm run docker:migrate

  - Self-host Infisical and inject secrets into app services:
    docker compose -f docker-compose.yml -f docker-compose.infisical.yml up -d --build
    docker compose -f docker-compose.yml -f docker-compose.infisical.yml -f docker-compose.infisical.runtime.yml up -d --build
    npm run docker:infisical:up
    npm run docker:infisical:runtime

  - Infisical migrations and seed:
    npm run docker:infisical:migrate
    npm run docker:infisical:seed

  ### Validation
  - docker compose -f docker-compose.yml -f docker-compose.dev.yml config passes.
  - docker compose -f docker-compose.yml config passes.
