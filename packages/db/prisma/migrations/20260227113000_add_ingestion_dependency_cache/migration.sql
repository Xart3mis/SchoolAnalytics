CREATE TABLE "ingestion_dependency_cache" (
  "source" TEXT NOT NULL,
  "payload" JSONB NOT NULL,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ingestion_dependency_cache_pkey" PRIMARY KEY ("source")
);
