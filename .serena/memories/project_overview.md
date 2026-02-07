SchoolAnalytics is an npm workspaces monorepo for school analytics with a Next.js web app, a BullMQ worker, a scheduler service, and a shared Prisma database package.

Top-level structure:
- apps/web: Next.js + React + TypeScript frontend/API routes
- apps/worker: Node worker consuming BullMQ jobs
- apps/scheduler: Node scheduler for recurring queue setup
- packages/db: Prisma schema, generated client export, seeding and db utilities
- docker/, docker-compose*.yml: local infra and deployment helpers

Tech stack:
- Next.js 16, React 19, TypeScript
- Prisma + PostgreSQL (with pg driver and Prisma adapter)
- BullMQ + Redis for async jobs
- ESLint for linting