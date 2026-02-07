CREATE INDEX IF NOT EXISTS "Session_expiresAt_idx" ON "Session"("expiresAt");

CREATE INDEX IF NOT EXISTS "Assignment_classSectionId_dueDate_idx" ON "Assignment"("classSectionId", "dueDate");

CREATE INDEX IF NOT EXISTS "GradeEntry_studentId_idx" ON "GradeEntry"("studentId");

CREATE INDEX IF NOT EXISTS "GradeEntry_assignmentId_idx" ON "GradeEntry"("assignmentId");
