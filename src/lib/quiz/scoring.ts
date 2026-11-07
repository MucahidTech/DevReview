import type { QuizAnswer, QuizResult } from "./types";

export function calculateScore(answers: readonly QuizAnswer[]): QuizResult {
  const total = answers.length;
  const correct = answers.filter((a) => a.selectedIndex === a.correctIndex).length;
  const incorrect = total - correct;
  const percentage = total === 0 ? 0 : Math.round((correct / total) * 100);

  return { total, correct, incorrect, percentage, answers: [...answers] };
}
