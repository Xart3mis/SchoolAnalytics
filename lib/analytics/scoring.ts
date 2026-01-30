import { CRITERIA_WEIGHTS } from "@/lib/analytics/config";

export type CriteriaScores = {
  criterionA: number;
  criterionB: number;
  criterionC: number;
  criterionD: number;
};

export function calculateWeightedScore(scores: CriteriaScores) {
  const totalWeight =
    CRITERIA_WEIGHTS.A +
    CRITERIA_WEIGHTS.B +
    CRITERIA_WEIGHTS.C +
    CRITERIA_WEIGHTS.D;

  return (
    (scores.criterionA * CRITERIA_WEIGHTS.A +
      scores.criterionB * CRITERIA_WEIGHTS.B +
      scores.criterionC * CRITERIA_WEIGHTS.C +
      scores.criterionD * CRITERIA_WEIGHTS.D) /
    totalWeight
  );
}
