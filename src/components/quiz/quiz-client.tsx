"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { QuestionCard } from "./question-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateScore } from "@/lib/quiz/scoring";
import type { QuizAnswer } from "@/lib/quiz/types";
import { useLocalStorage } from "@/hooks/use-local-storage";
import {
  HIGH_SCORES_KEY,
  LAST_RESULT_KEY,
  getScoreKey,
  updateHighScore,
  type QuizHighScore,
} from "@/lib/quiz/persistence";

interface Question {
  id: string;
  text: string;
  codeSnippet: string | null;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  difficulty: string;
}

interface QuizClientProps {
  questions: Question[];
  highlightedCodeMap: Record<string, string>;
}

type Phase = "selecting" | "active" | "results";

const QUESTION_COUNTS = [10, 20, 40] as const;

export function QuizClient({ questions, highlightedCodeMap }: QuizClientProps) {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") ?? undefined;

  const [phase, setPhase] = useState<Phase>("selecting");
  const [selectedCount, setSelectedCount] = useState<number>(10);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const answersRef = useRef<QuizAnswer[]>([]);

  const [highScores, setHighScores] = useLocalStorage<Record<string, number>>(HIGH_SCORES_KEY, {});
  const [lastResult, setLastResult] = useLocalStorage<QuizHighScore | null>(LAST_RESULT_KEY, null);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const startQuiz = () => {
    const subset = questions.slice(0, Math.min(selectedCount, questions.length));
    setActiveQuestions(subset);
    setCurrentIndex(0);
    setAnswers([]);
    setPhase("active");
  };

  const handleAnswer = (selectedIndex: number) => {
    const current = activeQuestions[currentIndex];
    if (!current) return;

    setAnswers((prev) => [
      ...prev,
      {
        questionId: current.id,
        selectedIndex,
        correctIndex: current.correctAnswer,
      },
    ]);
  };

  const handleNext = () => {
    if (currentIndex + 1 < activeQuestions.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      const result = calculateScore(answersRef.current);
      setLastResult({
        category: getScoreKey(category),
        percentage: result.percentage,
        achievedAt: new Date().toISOString(),
      });
      setHighScores((prev) => updateHighScore(prev, category, result.percentage));
      setPhase("results");
    }
  };

  const restart = () => {
    setPhase("selecting");
    setActiveQuestions([]);
    setCurrentIndex(0);
    setAnswers([]);
  };

  const scoreKey = getScoreKey(category);
  const bestScore = highScores[scoreKey] ?? 0;

  if (phase === "selecting") {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>{category ? `Quiz: ${category}` : "Mixed Quiz"}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            {bestScore > 0 && (
              <p className="text-sm text-muted-foreground">
                Your best score: <span className="font-semibold text-foreground">{bestScore}%</span>
              </p>
            )}
            {lastResult && (
              <p className="text-sm text-muted-foreground">
                Last attempt:{" "}
                <span className="font-semibold text-foreground">{lastResult.percentage}%</span>
              </p>
            )}
            <div>
              <p className="mb-3 text-sm font-medium">Number of questions</p>
              <div className="flex gap-2">
                {QUESTION_COUNTS.map((count) => (
                  <Button
                    key={count}
                    variant={selectedCount === count ? "default" : "outline"}
                    onClick={() => setSelectedCount(count)}
                  >
                    {count}
                  </Button>
                ))}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {questions.length} question{questions.length === 1 ? "" : "s"} available
              </p>
            </div>
            <Button size="lg" onClick={startQuiz} disabled={questions.length === 0}>
              Start Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (phase === "active") {
    const current = activeQuestions[currentIndex];
    if (!current) return null;

    const progress = ((currentIndex + 1) / activeQuestions.length) * 100;
    const isLast = currentIndex + 1 === activeQuestions.length;
    const hasAnswered = answers.length > currentIndex;

    return (
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Question {currentIndex + 1} of {activeQuestions.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <QuestionCard
          key={current.id}
          question={current}
          highlightedCodeHtml={highlightedCodeMap[current.id]}
          onAnswer={handleAnswer}
        />

        {hasAnswered && (
          <div className="mt-6 flex justify-end">
            <Button onClick={handleNext}>{isLast ? "See Results" : "Next Question"}</Button>
          </div>
        )}
      </div>
    );
  }

  const result = calculateScore(answers);

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>Quiz Complete</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="text-center">
            <p className="text-5xl font-bold">{result.percentage}%</p>
            <p className="mt-2 text-muted-foreground">
              {result.correct} correct out of {result.total}
            </p>
            {bestScore > 0 && (
              <p className="mt-2 text-sm text-muted-foreground">
                Your best: <span className="font-semibold text-foreground">{bestScore}%</span>
              </p>
            )}
          </div>
          <Button size="lg" onClick={restart}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
