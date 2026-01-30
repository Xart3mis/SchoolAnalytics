import { Prisma } from "@prisma/client";

import { CRITERIA_WEIGHTS } from "@/lib/analytics/config";

export function weightedScoreSql() {
  const totalWeight =
    CRITERIA_WEIGHTS.A +
    CRITERIA_WEIGHTS.B +
    CRITERIA_WEIGHTS.C +
    CRITERIA_WEIGHTS.D;

  return Prisma.sql`("criterionA" * ${CRITERIA_WEIGHTS.A}
    + "criterionB" * ${CRITERIA_WEIGHTS.B}
    + "criterionC" * ${CRITERIA_WEIGHTS.C}
    + "criterionD" * ${CRITERIA_WEIGHTS.D}) / ${totalWeight}::float`;
}
