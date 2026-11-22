import Link from "next/link";
import { questionService } from "@/server/services/question.service";
import { QuestionTable } from "@/components/admin/question-table";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function AdminQuestionsPage() {
  const questions = await questionService.findAll();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Questions</h1>
        <Link href="/admin/questions/new" className={cn(buttonVariants())}>
          New question
        </Link>
      </div>
      <QuestionTable questions={questions} />
    </div>
  );
}
