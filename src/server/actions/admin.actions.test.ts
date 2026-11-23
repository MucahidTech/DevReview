import { describe, it, expect, vi, beforeEach } from "vitest";
import { createQuestionAction, updateQuestionAction, deleteQuestionAction } from "./admin.actions";
import { auth } from "@/auth";
import { questionService } from "@/server/services/question.service";

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/server/services/question.service", () => ({
  questionService: {
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

const validQuestion = {
  text: "What is the output of typeof null?",
  codeSnippet: "typeof null",
  options: ["null", "object", "undefined", "boolean"],
  correctAnswer: 1,
  explanation: "typeof null returns 'object' due to a historical bug in JavaScript.",
  category: "JS Quirks" as const,
  difficulty: "easy" as const,
};

describe("admin actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createQuestionAction", () => {
    it("returns Unauthorized when no session exists", async () => {
      vi.mocked(auth).mockResolvedValue(null as never);

      const result = await createQuestionAction(validQuestion);

      expect(result).toEqual({ success: false, error: "Unauthorized" });
      expect(questionService.create).not.toHaveBeenCalled();
    });

    it("returns validation error for invalid input", async () => {
      vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as never);

      const result = await createQuestionAction({ text: "short" });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("Question text must be at least 10 characters");
      }
      expect(questionService.create).not.toHaveBeenCalled();
    });

    it("creates question and revalidates paths on success", async () => {
      vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as never);
      vi.mocked(questionService.create).mockResolvedValue({} as never);

      const result = await createQuestionAction(validQuestion);

      expect(result).toEqual({ success: true });
      expect(questionService.create).toHaveBeenCalledWith(validQuestion);
    });
  });

  describe("updateQuestionAction", () => {
    it("returns Unauthorized when no session exists", async () => {
      vi.mocked(auth).mockResolvedValue(null as never);

      const result = await updateQuestionAction("id1", validQuestion);

      expect(result).toEqual({ success: false, error: "Unauthorized" });
      expect(questionService.update).not.toHaveBeenCalled();
    });

    it("returns validation error for invalid partial input", async () => {
      vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as never);

      const result = await updateQuestionAction("id1", { text: "short" });

      expect(result.success).toBe(false);
      expect(questionService.update).not.toHaveBeenCalled();
    });

    it("updates question on success", async () => {
      vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as never);
      vi.mocked(questionService.update).mockResolvedValue({} as never);

      const result = await updateQuestionAction("id1", { text: "A valid updated question text" });

      expect(result).toEqual({ success: true });
      expect(questionService.update).toHaveBeenCalledWith("id1", {
        text: "A valid updated question text",
      });
    });
  });

  describe("deleteQuestionAction", () => {
    it("returns Unauthorized when no session exists", async () => {
      vi.mocked(auth).mockResolvedValue(null as never);

      const result = await deleteQuestionAction("id1");

      expect(result).toEqual({ success: false, error: "Unauthorized" });
      expect(questionService.delete).not.toHaveBeenCalled();
    });

    it("deletes question on success", async () => {
      vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as never);
      vi.mocked(questionService.delete).mockResolvedValue({} as never);

      const result = await deleteQuestionAction("id1");

      expect(result).toEqual({ success: true });
      expect(questionService.delete).toHaveBeenCalledWith("id1");
    });
  });
});
