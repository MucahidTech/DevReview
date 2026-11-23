"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Question } from "@prisma/client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { deleteQuestionAction } from "@/server/actions/admin.actions";

interface QuestionTableProps {
  questions: Question[];
}

export function QuestionTable({ questions }: QuestionTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this question?")) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await deleteQuestionAction(id);
      if (result.success) {
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  if (questions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No questions yet. Create your first question.</p>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
      )}
      <div className="overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Question</th>
              <th className="px-4 py-3 text-left font-medium">Category</th>
              <th className="px-4 py-3 text-left font-medium">Difficulty</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((question) => (
              <tr key={question.id} className="border-t">
                <td className="max-w-md truncate px-4 py-3">{question.text}</td>
                <td className="px-4 py-3">
                  <Badge variant="secondary">{question.category}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="outline">{question.difficulty}</Badge>
                </td>
                <td className="space-x-2 px-4 py-3 text-right">
                  <Link
                    href={`/admin/questions/${question.id}/edit`}
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                  >
                    Edit
                  </Link>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={isPending}
                    onClick={() => handleDelete(question.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
