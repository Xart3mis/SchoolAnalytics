-- CreateEnum
CREATE TYPE "MypCriterion" AS ENUM ('A', 'B', 'C', 'D');

-- CreateTable
CREATE TABLE "GradeEntryCriterion" (
    "id" TEXT NOT NULL,
    "gradeEntryId" TEXT NOT NULL,
    "criterion" "MypCriterion" NOT NULL,
    "score" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GradeEntryCriterion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GradeEntryCriterion_gradeEntryId_idx" ON "GradeEntryCriterion"("gradeEntryId");

-- CreateIndex
CREATE UNIQUE INDEX "GradeEntryCriterion_gradeEntryId_criterion_key" ON "GradeEntryCriterion"("gradeEntryId", "criterion");

-- AddForeignKey
ALTER TABLE "GradeEntryCriterion" ADD CONSTRAINT "GradeEntryCriterion_gradeEntryId_fkey" FOREIGN KEY ("gradeEntryId") REFERENCES "GradeEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
