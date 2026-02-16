CREATE TYPE "LoginLinkRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

CREATE TABLE "LoginLinkRequest" (
  "id" TEXT NOT NULL,
  "requesterId" TEXT NOT NULL,
  "status" "LoginLinkRequestStatus" NOT NULL DEFAULT 'PENDING',
  "reviewerUserId" TEXT,
  "reviewedAt" TIMESTAMP(3),
  "reviewReason" TEXT,
  "magicLinkId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "LoginLinkRequest_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "LoginLinkRequest_magicLinkId_key" ON "LoginLinkRequest"("magicLinkId");
CREATE INDEX "LoginLinkRequest_status_createdAt_idx" ON "LoginLinkRequest"("status", "createdAt");
CREATE INDEX "LoginLinkRequest_requesterId_status_createdAt_idx" ON "LoginLinkRequest"("requesterId", "status", "createdAt");

ALTER TABLE "LoginLinkRequest" ADD CONSTRAINT "LoginLinkRequest_requesterId_fkey"
FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "LoginLinkRequest" ADD CONSTRAINT "LoginLinkRequest_reviewerUserId_fkey"
FOREIGN KEY ("reviewerUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "LoginLinkRequest" ADD CONSTRAINT "LoginLinkRequest_magicLinkId_fkey"
FOREIGN KEY ("magicLinkId") REFERENCES "MagicLink"("id") ON DELETE SET NULL ON UPDATE CASCADE;
