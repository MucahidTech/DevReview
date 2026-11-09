import { Suspense } from "react";
import { fetchQuizQuestions } from "@/server/actions/quiz.actions";
import { highlightCode } from "@/lib/shiki";
import { QuizClient } from "@/components/quiz/quiz-client";

interface QuizPageProps {
  searchParams: Promise<{ category?: string }>;
}

async function QuizContent({ searchParams }: QuizPageProps) {
  const params = await searchParams;
  const category = params.category;

  const result = await fetchQuizQuestions({
    count: 40,
    category: category as never,
  });

  if (!result.success) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <p className="text-center text-destructive">Failed to load questions. Please try again.</p>
      </div>
    );
  }

  const highlightedCodeMap: Record<string, string> = {};
  await Promise.all(
    result.data
      .filter((q) => q.codeSnippet)
      .map(async (q) => {
        if (q.codeSnippet) {
          highlightedCodeMap[q.id] = await highlightCode(q.codeSnippet);
        }
      }),
  );

  return <QuizClient questions={result.data} highlightedCodeMap={highlightedCodeMap} />;
}

function QuizSkeleton() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <div className="h-48 animate-pulse rounded-lg bg-muted" />
    </div>
  );
}

export default function QuizPage({ searchParams }: QuizPageProps) {
  return (
    <Suspense fallback={<QuizSkeleton />}>
      <QuizContent searchParams={searchParams} />
    </Suspense>
  );
}
