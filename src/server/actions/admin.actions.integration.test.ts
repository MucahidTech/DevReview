import { describe, it, expect, vi, beforeEach } from "vitest";
import { createQuestionAction, updateQuestionAction, deleteQuestionAction } from "./admin.actions";
import { auth } from "@/auth";
import { testPrisma } from "../../../vitest.integration.setup";
import { QuestionService } from "@/server/services/question.service";

vi.mock("@/lib/prisma", async () => {
  const { testPrisma } = await import("../../../vitest.integration.setup");
  return { default: testPrisma };
});

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

const { mockQuestionService } = vi.hoisted(() => {
  return {
    mockQuestionService: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findById: vi.fn(),
      findMany: vi.fn(),
      findRandom: vi.fn(),
      count: vi.fn(),
      findAll: vi.fn(),
    },
  };
});

vi.mock("@/server/services/question.service", async () => {
  const actual = await vi.importActual<typeof import("@/server/services/question.service")>(
    "@/server/services/question.service",
  );
  return {
    ...actual,
    questionService: mockQuestionService,
  };
});

const validQuestion = {
  text: "What is the output of typeof null?",
  codeSnippet: "typeof null",
  options: ["null", "object", "undefined", "boolean"],
  correctAnswer: 1,
  explanation: "typeof null returns 'object' due to a historical bug in JavaScript.",
  category: "JS Quirks" as const,
  difficulty: "easy" as const,
};

const NON_EXISTENT_ID = "000000000000000000000000";

describe("admin actions integration", () => {
  let realService: QuestionService;

  beforeEach(async () => {
    vi.clearAllMocks();
    await testPrisma.question.deleteMany({});

    realService = new QuestionService(testPrisma);
    mockQuestionService.create.mockImplementation(realService.create.bind(realService));
    mockQuestionService.update.mockImplementation(realService.update.bind(realService));
    mockQuestionService.delete.mockImplementation(realService.delete.bind(realService));

    vi.mocked(auth).mockResolvedValue({ user: { id: "admin1" } } as never);
  });

  describe("createQuestionAction", () => {
    it("persists question to database and returns success", async () => {
      const result = await createQuestionAction(validQuestion);

      expect(result).toEqual({ success: true });

      const saved = await testPrisma.question.findFirst({
        where: { text: validQuestion.text },
      });

      expect(saved).not.toBeNull();
      expect(saved?.options).toEqual(validQuestion.options);
      expect(saved?.correctAnswer).toBe(1);
      expect(saved?.category).toBe("JS Quirks");
    });

    it("does not persist when validation fails", async () => {
      const result = await createQuestionAction({ text: "short" });

      expect(result.success).toBe(false);
      const count = await testPrisma.question.count();
      expect(count).toBe(0);
    });

    it("does not persist when unauthorized", async () => {
      vi.mocked(auth).mockResolvedValue(null as never);

      const result = await createQuestionAction(validQuestion);

      expect(result).toEqual({ success: false, error: "Unauthorized" });
      const count = await testPrisma.question.count();
      expect(count).toBe(0);
    });
  });

  describe("updateQuestionAction", () => {
    it("updates existing question in database", async () => {
      const created = await realService.create(validQuestion);

      const result = await updateQuestionAction(created.id, {
        text: "Updated question text that is long enough",
        difficulty: "hard" as const,
      });

      expect(result).toEqual({ success: true });

      const updated = await testPrisma.question.findUnique({
        where: { id: created.id },
      });

      expect(updated?.text).toBe("Updated question text that is long enough");
      expect(updated?.difficulty).toBe("hard");
      expect(updated?.category).toBe("JS Quirks");
    });

    it("returns error when question does not exist", async () => {
      const result = await updateQuestionAction(NON_EXISTENT_ID, {
        text: "Some valid updated text here",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("deleteQuestionAction", () => {
    it("removes question from database", async () => {
      const created = await realService.create(validQuestion);

      const result = await deleteQuestionAction(created.id);

      expect(result).toEqual({ success: true });

      const found = await testPrisma.question.findUnique({
        where: { id: created.id },
      });

      expect(found).toBeNull();
    });

    it("returns error when question does not exist", async () => {
      const result = await deleteQuestionAction(NON_EXISTENT_ID);

      expect(result.success).toBe(false);
    });
  });
});
