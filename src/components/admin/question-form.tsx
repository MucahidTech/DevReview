"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createQuestionSchema,
  QUESTION_CATEGORIES,
  QUESTION_DIFFICULTIES,
  type CreateQuestionInput,
} from "@/lib/validations/question";
import { createQuestionAction, updateQuestionAction } from "@/server/actions/admin.actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface QuestionFormProps {
  mode: "create" | "edit";
  questionId?: string;
  defaultValues?: Partial<CreateQuestionInput>;
}

export function QuestionForm({ mode, questionId, defaultValues }: QuestionFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<CreateQuestionInput>({
    resolver: zodResolver(createQuestionSchema),
    defaultValues: {
      text: defaultValues?.text ?? "",
      codeSnippet: defaultValues?.codeSnippet ?? "",
      options: defaultValues?.options ?? ["", "", "", ""],
      correctAnswer: defaultValues?.correctAnswer ?? 0,
      explanation: defaultValues?.explanation ?? "",
      category: defaultValues?.category ?? "JS Quirks",
      difficulty: defaultValues?.difficulty ?? "easy",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  function onSubmit(values: CreateQuestionInput) {
    setServerError(null);
    startTransition(async () => {
      const result =
        mode === "create"
          ? await createQuestionAction(values)
          : await updateQuestionAction(questionId as string, values);

      if (result.success) {
        router.push("/admin/questions");
        router.refresh();
      } else {
        setServerError(result.error);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {serverError}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="text">Question text</Label>
        <Textarea id="text" {...register("text")} rows={3} />
        {errors.text && <p className="text-sm text-destructive">{errors.text.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="codeSnippet">Code snippet (optional)</Label>
        <Textarea id="codeSnippet" {...register("codeSnippet")} rows={4} className="font-mono" />
      </div>

      <div className="space-y-3">
        <Label>Options (exactly 4)</Label>
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className="flex items-center gap-3">
            <input
              type="radio"
              value={index}
              {...register("correctAnswer", { valueAsNumber: true })}
              aria-label={`Mark option ${index + 1} as correct`}
            />
            <Input {...register(`options.${index}` as const)} placeholder={`Option ${index + 1}`} />
          </div>
        ))}
        {errors.options && <p className="text-sm text-destructive">{errors.options.message}</p>}
        {errors.correctAnswer && (
          <p className="text-sm text-destructive">{errors.correctAnswer.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="explanation">Explanation</Label>
        <Textarea id="explanation" {...register("explanation")} rows={3} />
        {errors.explanation && (
          <p className="text-sm text-destructive">{errors.explanation.message}</p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            {...register("category")}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {QUESTION_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty</Label>
          <select
            id="difficulty"
            {...register("difficulty")}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {QUESTION_DIFFICULTIES.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficulty}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Saving..." : mode === "create" ? "Create question" : "Save changes"}
      </Button>
    </form>
  );
}
