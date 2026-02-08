-- User activation and magic-link auth flow
CREATE TYPE "UserStatus" AS ENUM ('INVITED', 'ACTIVE', 'DISABLED');
CREATE TYPE "MagicLinkPurpose" AS ENUM ('INVITE_ACTIVATE', 'LOGIN');
CREATE TYPE "AuthAuditEventType" AS ENUM ('MAGIC_LINK_REQUESTED', 'MAGIC_LINK_CONSUMED', 'MAGIC_LINK_CONSUME_FAILED', 'PASSWORD_SET');

ALTER TABLE "User"
ADD COLUMN "status" "UserStatus" NOT NULL DEFAULT 'INVITED';

-- Existing users are already onboarded
UPDATE "User" SET "status" = 'ACTIVE' WHERE "status" = 'INVITED';

CREATE TABLE "MagicLink" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "purpose" "MagicLinkPurpose" NOT NULL,
  "tokenHash" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "usedAt" TIMESTAMP(3),
  "invalidatedAt" TIMESTAMP(3),
  "requestedByIp" TEXT,
  "requestedUserAgent" TEXT,
  "consumedByIp" TEXT,
  "consumedUserAgent" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MagicLink_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AuthAuditEvent" (
  "id" TEXT NOT NULL,
  "userId" TEXT,
  "emailHash" TEXT,
  "eventType" "AuthAuditEventType" NOT NULL,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AuthAuditEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MagicLink_tokenHash_key" ON "MagicLink"("tokenHash");
CREATE INDEX "MagicLink_userId_purpose_expiresAt_idx" ON "MagicLink"("userId", "purpose", "expiresAt");
CREATE INDEX "AuthAuditEvent_createdAt_idx" ON "AuthAuditEvent"("createdAt");
CREATE INDEX "AuthAuditEvent_eventType_createdAt_idx" ON "AuthAuditEvent"("eventType", "createdAt");

ALTER TABLE "MagicLink" ADD CONSTRAINT "MagicLink_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AuthAuditEvent" ADD CONSTRAINT "AuthAuditEvent_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
