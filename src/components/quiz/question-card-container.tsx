import { QuestionCard } from "./question-card";

interface QuestionCardContainerProps {
  question: {
    id: string;
    text: string;
    codeSnippet: string | null;
    options: string[];
    correctAnswer: number;
    explanation: string;
    category: string;
    difficulty: string;
  };
}

export async function QuestionCardContainer({ question }: QuestionCardContainerProps) {
  const highlightedCodeHtml = question.codeSnippet
    ? await import("@/lib/shiki").then((m) => m.highlightCode(question.codeSnippet!))
    : undefined;

  return <QuestionCard question={question} highlightedCodeHtml={highlightedCodeHtml} />;
}
