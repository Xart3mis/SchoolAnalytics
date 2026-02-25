-- AlterTable
ALTER TABLE "Organization"
ADD COLUMN IF NOT EXISTS "abbreviation" TEXT;

-- Backfill existing rows before enforcing NOT NULL.
UPDATE "Organization"
SET "abbreviation" = "name"
WHERE "abbreviation" IS NULL;

-- Enforce required field to match schema.prisma
ALTER TABLE "Organization"
ALTER COLUMN "abbreviation" SET NOT NULL;
