"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { QuestionService } from "@/server/services/question.service";
import { QUESTION_CATEGORIES } from "@/lib/validations/question";

const questionService = new QuestionService(prisma);

const fetchQuizQuestionsSchema = z.object({
  count: z.number().int().min(1).max(100),
  category: z.enum(QUESTION_CATEGORIES).optional(),
});

export type FetchQuizQuestionsInput = z.infer<typeof fetchQuizQuestionsSchema>;

export async function fetchQuizQuestions(input: FetchQuizQuestionsInput) {
  const parsed = fetchQuizQuestionsSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false as const,
      error: "Invalid input: " + parsed.error.issues.map((i) => i.message).join(", "),
    };
  }

  try {
    const questions = await questionService.findRandom(parsed.data.count, parsed.data.category);
    return { success: true as const, data: questions };
  } catch (error) {
    console.error("fetchQuizQuestions failed:", error);
    return { success: false as const, error: "Failed to load quiz questions" };
  }
}

export async function fetchCategories() {
  try {
    const allCategories = await Promise.all(
      QUESTION_CATEGORIES.map(async (category) => ({
        category,
        count: await questionService.count({ category }),
      })),
    );
    return { success: true as const, data: allCategories };
  } catch (error) {
    console.error("fetchCategories failed:", error);
    return { success: false as const, error: "Failed to load categories" };
  }
}

const fetchQuestionByIdSchema = z.object({
  id: z.string().min(1),
});

export async function fetchQuestionById(input: z.infer<typeof fetchQuestionByIdSchema>) {
  const parsed = fetchQuestionByIdSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false as const, error: "Invalid question ID" };
  }

  try {
    const question = await questionService.findById(parsed.data.id);
    if (!question) {
      return { success: false as const, error: "Question not found" };
    }
    return { success: true as const, data: question };
  } catch (error) {
    console.error("fetchQuestionById failed:", error);
    return { success: false as const, error: "Failed to load question" };
  }
}
