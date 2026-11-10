export interface QuizAnswer {
  questionId: string;
  selectedIndex: number;
  correctIndex: number;
}

export interface QuizResult {
  total: number;
  correct: number;
  incorrect: number;
  percentage: number;
  answers: QuizAnswer[];
}
