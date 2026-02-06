import { Prisma } from "@prisma/client";

import { CRITERION_SCORE_SCALE } from "@/lib/analytics/config";

export function normalizedScoreSql() {
  return Prisma.sql`
    CASE
      WHEN "score" IS NULL THEN NULL
      WHEN "maxScore" IS NULL OR "maxScore" = 0 THEN "score"
      ELSE ("score" / "maxScore") * ${CRITERION_SCORE_SCALE.max}
    END
  `;
}

export function mypCriteriaTotalSql() {
  const criterionA = Prisma.sql`MAX(CASE WHEN gec."criterion" = 'A'::"MypCriterion" THEN gec."score" END)`;
  const criterionB = Prisma.sql`MAX(CASE WHEN gec."criterion" = 'B'::"MypCriterion" THEN gec."score" END)`;
  const criterionC = Prisma.sql`MAX(CASE WHEN gec."criterion" = 'C'::"MypCriterion" THEN gec."score" END)`;
  const criterionD = Prisma.sql`MAX(CASE WHEN gec."criterion" = 'D'::"MypCriterion" THEN gec."score" END)`;

  return Prisma.sql`
    COALESCE(${criterionA}, 0)
    + COALESCE(${criterionB}, 0)
    + COALESCE(${criterionC}, 0)
    + COALESCE(${criterionD}, 0)
  `;
}

export function mypFinalGradeSql(totalSql: Prisma.Sql) {
  return Prisma.sql`
    CASE
      WHEN ${totalSql} >= 28 THEN 7
      WHEN ${totalSql} >= 24 THEN 6
      WHEN ${totalSql} >= 19 THEN 5
      WHEN ${totalSql} >= 15 THEN 4
      WHEN ${totalSql} >= 10 THEN 3
      WHEN ${totalSql} >= 6 THEN 2
      WHEN ${totalSql} >= 1 THEN 1
      ELSE 0
    END
  `;
}
