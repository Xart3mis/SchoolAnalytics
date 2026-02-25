CREATE TYPE "IngestionRunStatus" AS ENUM ('QUEUED', 'RUNNING', 'SUCCESS', 'FAILED');

CREATE TABLE "ingestion_runs" (
  "id" TEXT NOT NULL,
  "source" TEXT NOT NULL,
  "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "finished_at" TIMESTAMP(3),
  "status" "IngestionRunStatus" NOT NULL DEFAULT 'QUEUED',
  "records_fetched" INTEGER NOT NULL DEFAULT 0,
  "records_processed" INTEGER NOT NULL DEFAULT 0,
  "records_failed" INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "ingestion_runs_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ingestion_cursors" (
  "source" TEXT NOT NULL,
  "cursor_value" TEXT,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ingestion_cursors_pkey" PRIMARY KEY ("source")
);

CREATE TABLE "ingestion_errors" (
  "id" TEXT NOT NULL,
  "source" TEXT NOT NULL,
  "external_id" TEXT,
  "error_message" TEXT NOT NULL,
  "payload" JSONB,
  "run_id" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ingestion_errors_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ingestion_runs_source_started_at_idx"
ON "ingestion_runs"("source", "started_at");

CREATE INDEX "ingestion_runs_status_started_at_idx"
ON "ingestion_runs"("status", "started_at");

CREATE INDEX "ingestion_errors_source_created_at_idx"
ON "ingestion_errors"("source", "created_at");

CREATE INDEX "ingestion_errors_run_id_idx"
ON "ingestion_errors"("run_id");

ALTER TABLE "ingestion_errors" ADD CONSTRAINT "ingestion_errors_run_id_fkey"
FOREIGN KEY ("run_id") REFERENCES "ingestion_runs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
