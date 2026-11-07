import { calculateScore } from "./scoring";
import type { QuizAnswer } from "./types";

const answer = (overrides: Partial<QuizAnswer> = {}): QuizAnswer => ({
  questionId: "q1",
  selectedIndex: 0,
  correctIndex: 0,
  ...overrides,
});

describe("calculateScore", () => {
  it("returns zero for empty answers", () => {
    const result = calculateScore([]);
    expect(result).toEqual({
      total: 0,
      correct: 0,
      incorrect: 0,
      percentage: 0,
      answers: [],
    });
  });

  it("calculates a perfect score", () => {
    const answers = [
      answer({ questionId: "q1", selectedIndex: 1, correctIndex: 1 }),
      answer({ questionId: "q2", selectedIndex: 2, correctIndex: 2 }),
    ];
    const result = calculateScore(answers);
    expect(result.correct).toBe(2);
    expect(result.incorrect).toBe(0);
    expect(result.percentage).toBe(100);
  });

  it("calculates a zero score", () => {
    const answers = [
      answer({ questionId: "q1", selectedIndex: 0, correctIndex: 1 }),
      answer({ questionId: "q2", selectedIndex: 0, correctIndex: 3 }),
    ];
    const result = calculateScore(answers);
    expect(result.correct).toBe(0);
    expect(result.incorrect).toBe(2);
    expect(result.percentage).toBe(0);
  });

  it("rounds the percentage to the nearest integer", () => {
    // 2 correct out of 3 = 66.666... → 67
    const answers = [
      answer({ questionId: "q1", selectedIndex: 0, correctIndex: 0 }),
      answer({ questionId: "q2", selectedIndex: 0, correctIndex: 0 }),
      answer({ questionId: "q3", selectedIndex: 1, correctIndex: 0 }),
    ];
    const result = calculateScore(answers);
    expect(result.percentage).toBe(67);
  });

  it("preserves the input answers in the result", () => {
    const answers = [answer()];
    const result = calculateScore(answers);
    expect(result.answers).toEqual(answers);
  });

  it("does not mutate the input array", () => {
    const answers = [answer()];
    const copy = [...answers];
    calculateScore(answers);
    expect(answers).toEqual(copy);
  });
});
