### How to run
  - Development (hot reload):
    docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build

  - Production-like:
    docker compose up -d --build

  - Run migrations:
    docker compose --profile tools run --rm migrate

  ### Validation
  - docker compose -f docker-compose.yml -f docker-compose.dev.yml config passes.
  - docker compose -f docker-compose.yml config passes.
