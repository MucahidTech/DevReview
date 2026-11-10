export interface QuizHighScore {
  category: string;
  percentage: number;
  achievedAt: string;
}

const HIGH_SCORES_KEY = "devreview:high-scores";
const LAST_RESULT_KEY = "devreview:last-result";

export { HIGH_SCORES_KEY, LAST_RESULT_KEY };

export function getScoreKey(category: string | undefined): string {
  return category ?? "mixed";
}

export function updateHighScore(
  current: Record<string, number>,
  category: string | undefined,
  percentage: number,
): Record<string, number> {
  const key = getScoreKey(category);
  const existing = current[key] ?? 0;
  if (percentage > existing) {
    return { ...current, [key]: percentage };
  }
  return current;
}
