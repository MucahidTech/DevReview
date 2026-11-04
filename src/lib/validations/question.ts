import { z } from "zod";

export const QUESTION_CATEGORIES = [
  "JS Quirks",
  "Web Architecture",
  "Accessibility",
  "Networking",
] as const;

export const QUESTION_DIFFICULTIES = ["easy", "medium", "hard"] as const;

export type QuestionCategory = (typeof QUESTION_CATEGORIES)[number];
export type QuestionDifficulty = (typeof QUESTION_DIFFICULTIES)[number];

const baseQuestionSchema = z.object({
  text: z.string().min(10, "Question text must be at least 10 characters"),
  codeSnippet: z.string().optional(),
  options: z
    .array(z.string().min(1, "Option cannot be empty"))
    .length(4, "Each question must have exactly 4 options"),
  correctAnswer: z.number().int().min(0, "Correct answer index must be non-negative"),
  explanation: z.string().min(10, "Explanation must be at least 10 characters"),
  category: z.enum(QUESTION_CATEGORIES),
  difficulty: z.enum(QUESTION_DIFFICULTIES),
});

export const questionSchema = baseQuestionSchema.refine(
  (data) => data.correctAnswer < data.options.length,
  {
    message: "Correct answer index must be within the range of options",
    path: ["correctAnswer"],
  },
);

export const createQuestionSchema = questionSchema;

export const updateQuestionSchema = baseQuestionSchema.partial().refine(
  (data) => {
    if (data.correctAnswer === undefined || data.options === undefined) {
      return true;
    }
    return data.correctAnswer < data.options.length;
  },
  {
    message: "Correct answer index must be within the range of options",
    path: ["correctAnswer"],
  },
);

export type QuestionInput = z.infer<typeof questionSchema>;
export type CreateQuestionInput = z.infer<typeof createQuestionSchema>;
export type UpdateQuestionInput = z.infer<typeof updateQuestionSchema>;
