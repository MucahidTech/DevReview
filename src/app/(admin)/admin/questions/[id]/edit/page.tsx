import { notFound } from "next/navigation";
import { questionService } from "@/server/services/question.service";
import { QuestionForm } from "@/components/admin/question-form";

interface EditQuestionPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditQuestionPage({ params }: EditQuestionPageProps) {
  const { id } = await params;
  const question = await questionService.findById(id);

  if (!question) {
    notFound();
  }

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">Edit question</h1>
      <QuestionForm
        mode="edit"
        questionId={question.id}
        defaultValues={{
          text: question.text,
          codeSnippet: question.codeSnippet ?? "",
          options: question.options,
          correctAnswer: question.correctAnswer,
          explanation: question.explanation,
          category: question.category as never,
          difficulty: question.difficulty as never,
        }}
      />
    </div>
  );
}
