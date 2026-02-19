# Redis Plan

  We will implement Redis capabilities in apps/web as a staged hardening effort, not a big-bang rewrite: first establish a safe Redis foundation, then add organization-scoped caching
  and global auth limits, then layer in session read-through indexing, lock/idempotency controls, and admin counters. The key design constraints are fixed: organization-only key
  isolation, fail-open behavior for rate limiting per route, optional/best-effort idempotency, and Postgres as the source of truth for sessions. Each stage includes explicit rollback
  flags, failure-mode behavior, and validation so we can ship incrementally without auth regressions or data leakage.

  ## Scope

  - In: Redis client foundation in apps/web; organization-scoped caching for search/report endpoints; Redis-backed auth rate limiting with fail-open fallback; Redis read-through session
    index only; Redis locks for login-link approval race control; optional idempotency keyed by Idempotency-Key; Redis-backed admin pending counters with DB reconciliation; targeted
    onboarding/auth temporary state only where proven necessary; tests, metrics, and staged rollout.
  - Out: Full Redis session authority; BullMQ/scheduler changes; broad UI redesign; replacing existing DB transaction correctness checks with Redis-only guarantees.

  ## Action items

  [ ] Define Redis architecture contract and failure policy by introducing apps/web/lib/redis.ts plus key namespace helpers (apps/web/lib/redis-keys.ts) and feature flags (apps/web/lib/
  redis-flags.ts), including strict connect/read timeouts, safe JSON serialization helpers, and standardized fail-open wrappers so route handlers do not duplicate error handling.
  [ ] Pin organization identity source for keying by adding a single resolver utility (apps/web/lib/auth/org-context.ts or equivalent) that extracts organizationId from session/user
  context and is reused by caching, rate limiting, session index, counters, and idempotency storage to avoid inconsistent key dimensions and cross-org contamination.
  [ ] Implement cache module with guarded semantics (apps/web/lib/cache.ts) supporting getOrSet, per-route TTL config, jittered expiry, and “cache only 200/success deterministic
  payloads”; explicitly avoid caching unauthorized/error responses and add bounded key cardinality rules (query normalization, capped limits, and route-specific key params).
  [ ] Apply caching to expensive GET APIs first in apps/web/app/api/search/route.ts, apps/web/app/api/reports/classes/[id]/route.ts, and apps/web/app/api/reports/grades/[grade]/
  route.ts, with organization-only keys plus required query dimensions (term, year, grade, id, limit, normalized query), and add invalidation hooks or short TTL fallback where write-
  side invalidation is non-trivial.
  [ ] Replace process-local limiter with Redis limiter by refactoring apps/web/lib/auth/rate-limit.ts into a Redis implementation (fixed/sliding window), then wiring limits into apps/
  web/app/api/auth/login/route.ts, apps/web/app/api/auth/magic/request/route.ts, apps/web/app/api/auth/onboarding/route.ts, and login-link request endpoints; enforce endpoint-specific
  thresholds and maintain fail-open behavior if Redis is slow/down.
  [ ] Introduce session read-through index (not authority) in apps/web/lib/auth/session.ts: on successful DB lookup, cache compact session payload keyed by token and org with TTL
  min(dbExpiry-now, cap); on createSession/deleteSession/logout/expiry cleanup, invalidate Redis index keys; on cache hit, still honor expiry checks and fallback to DB if payload is
  malformed/stale.
  [ ] Add distributed locking for sensitive admin mutation paths by creating apps/web/lib/redis-lock.ts (SET NX PX acquire + token-safe Lua release) and wrapping approve/reject logic in
  apps/web/app/api/admin/login-link-requests/route.ts with lock key per request ID; keep existing Prisma transaction status checks as final correctness guard and return deterministic
  conflict responses on lock contention.
  [ ] Add optional/best-effort idempotency for admin POSTs via apps/web/lib/idempotency.ts: if Idempotency-Key is present, bind to endpoint + organization + request hash, store in-
  progress/result records with TTL, replay prior successful response for duplicates; if header missing or Redis unavailable, continue normal processing without failure.
  [ ] Add Redis-backed admin pending counters by publishing count updates on login-link request create/approve/reject and exposing a lightweight counter API for apps/web/features/admin/
  components/login-link-requests-panel.tsx; include DB fallback and reconciliation path (cache miss/drift triggers DB recount + counter reset) to keep UX real-time without sacrificing
  correctness.
  [ ] Harden with validation and staged rollout gates: add route-level tests for key isolation, stale-cache behavior, limiter fail-open semantics, session index invalidation, lock/
  idempotency race cases; run npm run lint --workspace @school-analytics/web; roll out by flag sequence (redis_cache → redis_rate_limit → redis_session_index → redis_locking →  redis_idempotency → redis_counters) with dashboards for hit-rate, deny-rate, lock contention, Redis error rate, and rollback criteria per flag.

# DADA
[ ] implement "Bell Curve" visualizations for cohorts.
[ ] Proper DB schema
[ ] Toddle data ingestion pipeline
[ ] IXL data ingestion pipeline
[ ] Validate statistical validity of calculated analytics
