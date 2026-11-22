import { QuestionForm } from "@/components/admin/question-form";

export default function NewQuestionPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">Create question</h1>
      <QuestionForm mode="create" />
    </div>
  );
}
