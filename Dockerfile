# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS base
WORKDIR /workspace
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS deps
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/package.json
COPY apps/worker/package.json apps/worker/package.json
COPY apps/scheduler/package.json apps/scheduler/package.json
COPY packages/db/package.json packages/db/package.json
RUN npm ci --ignore-scripts

FROM deps AS build-web
COPY . .
RUN npm run prisma:generate
RUN npm run build --workspace @school-analytics/web

FROM deps AS dev-web
COPY . .
CMD ["npm", "run", "dev", "--workspace", "@school-analytics/web"]

FROM deps AS dev-worker
COPY . .
CMD ["npm", "run", "dev", "--workspace", "@school-analytics/worker"]

FROM deps AS dev-scheduler
COPY . .
CMD ["npm", "run", "dev", "--workspace", "@school-analytics/scheduler"]

FROM deps AS web
WORKDIR /workspace
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
COPY . .
RUN npm run prisma:generate
EXPOSE 3000
CMD ["sh", "-lc", "npm run build --workspace @school-analytics/web && if [ -f apps/web/.next/standalone/server.js ]; then [ -d apps/web/public ] && cp -r apps/web/public apps/web/.next/standalone/ || true; mkdir -p apps/web/.next/standalone/.next; [ -d apps/web/.next/static ] && cp -r apps/web/.next/static apps/web/.next/standalone/.next/ || true; exec node apps/web/.next/standalone/server.js; elif [ -f apps/web/.next/standalone/apps/web/server.js ]; then [ -d apps/web/public ] && cp -r apps/web/public apps/web/.next/standalone/apps/web/ || true; mkdir -p apps/web/.next/standalone/apps/web/.next; [ -d apps/web/.next/static ] && cp -r apps/web/.next/static apps/web/.next/standalone/apps/web/.next/ || true; exec node apps/web/.next/standalone/apps/web/server.js; else echo 'standalone server.js not found' >&2; exit 1; fi"]

FROM deps AS runtime-prep
COPY . .
RUN npm run prisma:generate
RUN npm prune --omit=dev

FROM node:22-alpine AS worker
WORKDIR /app
ENV NODE_ENV=production
COPY --from=runtime-prep /workspace/package.json /workspace/package-lock.json ./
COPY --from=runtime-prep /workspace/node_modules ./node_modules
COPY --from=runtime-prep /workspace/apps/worker ./apps/worker
COPY --from=runtime-prep /workspace/packages/db ./packages/db
CMD ["node", "apps/worker/src/index.js"]

FROM node:22-alpine AS scheduler
WORKDIR /app
ENV NODE_ENV=production
COPY --from=runtime-prep /workspace/package.json /workspace/package-lock.json ./
COPY --from=runtime-prep /workspace/node_modules ./node_modules
COPY --from=runtime-prep /workspace/apps/scheduler ./apps/scheduler
COPY --from=runtime-prep /workspace/packages/db ./packages/db
CMD ["node", "apps/scheduler/src/index.js"]
