import { CRITERION_SCORE_SCALE } from "@/lib/analytics/config";

export function normalizeScore(
  score: number | null | undefined,
  maxScore?: number | null
) {
  if (score == null) return 0;
  if (!maxScore) return score;
  return (score / maxScore) * CRITERION_SCORE_SCALE.max;
}
