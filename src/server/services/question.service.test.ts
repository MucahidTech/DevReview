import { QuestionService } from "./question.service";
import type { PrismaClient, Question } from "@prisma/client";

const mockQuestion = (overrides: Partial<Question> = {}): Question => ({
  id: "507f1f77bcf86cd799439011",
  text: "What is typeof null?",
  codeSnippet: null,
  options: ['"null"', '"object"', '"undefined"', '"boolean"'],
  correctAnswer: 1,
  explanation: "typeof null returns object due to a historical bug.",
  category: "JS Quirks",
  difficulty: "easy",
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

const createMockPrisma = () => ({
  question: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    count: vi.fn(),
  },
});

describe("QuestionService", () => {
  let service: QuestionService;
  let prisma: ReturnType<typeof createMockPrisma>;

  beforeEach(() => {
    prisma = createMockPrisma();
    service = new QuestionService(prisma as unknown as PrismaClient);
  });

  describe("findById", () => {
    it("returns a question when found", async () => {
      const question = mockQuestion();
      prisma.question.findUnique.mockResolvedValue(question);

      const result = await service.findById(question.id);

      expect(result).toEqual(question);
      expect(prisma.question.findUnique).toHaveBeenCalledWith({ where: { id: question.id } });
    });

    it("returns null when not found", async () => {
      prisma.question.findUnique.mockResolvedValue(null);

      const result = await service.findById("nonexistent");

      expect(result).toBeNull();
    });
  });

  describe("findMany", () => {
    it("returns all questions without filters", async () => {
      const questions = [mockQuestion(), mockQuestion({ id: "2" })];
      prisma.question.findMany.mockResolvedValue(questions);

      const result = await service.findMany();

      expect(result).toEqual(questions);
      expect(prisma.question.findMany).toHaveBeenCalledWith({
        where: undefined,
        orderBy: { createdAt: "desc" },
      });
    });

    it("filters by category", async () => {
      prisma.question.findMany.mockResolvedValue([]);

      await service.findMany({ category: "JS Quirks" });

      expect(prisma.question.findMany).toHaveBeenCalledWith({
        where: { category: "JS Quirks" },
        orderBy: { createdAt: "desc" },
      });
    });

    it("filters by category and difficulty", async () => {
      prisma.question.findMany.mockResolvedValue([]);

      await service.findMany({ category: "JS Quirks", difficulty: "easy" });

      expect(prisma.question.findMany).toHaveBeenCalledWith({
        where: { category: "JS Quirks", difficulty: "easy" },
        orderBy: { createdAt: "desc" },
      });
    });
  });

  describe("findRandom", () => {
    it("returns at most the requested count", async () => {
      const questions = Array.from({ length: 10 }, (_, i) => mockQuestion({ id: String(i) }));
      prisma.question.findMany.mockResolvedValue(questions);

      const result = await service.findRandom(3);

      expect(result).toHaveLength(3);
    });

    it("returns all questions when count exceeds available", async () => {
      const questions = [mockQuestion(), mockQuestion({ id: "2" })];
      prisma.question.findMany.mockResolvedValue(questions);

      const result = await service.findRandom(10);

      expect(result).toHaveLength(2);
    });

    it("filters by category before shuffling", async () => {
      prisma.question.findMany.mockResolvedValue([]);

      await service.findRandom(5, "Networking");

      expect(prisma.question.findMany).toHaveBeenCalledWith({
        where: { category: "Networking" },
      });
    });
  });

  describe("create", () => {
    it("creates and returns the new question", async () => {
      const data = {
        text: "New question text",
        options: ["a", "b", "c", "d"],
        correctAnswer: 0,
        explanation: "Explanation here.",
        category: "Networking",
        difficulty: "hard",
      };
      const created = mockQuestion(data);
      prisma.question.create.mockResolvedValue(created);

      const result = await service.create(data);

      expect(result).toEqual(created);
      expect(prisma.question.create).toHaveBeenCalledWith({ data });
    });
  });

  describe("update", () => {
    it("updates and returns the question", async () => {
      const updated = mockQuestion({ text: "Updated text" });
      prisma.question.update.mockResolvedValue(updated);

      const result = await service.update("1", { text: "Updated text" });

      expect(result).toEqual(updated);
      expect(prisma.question.update).toHaveBeenCalledWith({
        where: { id: "1" },
        data: { text: "Updated text" },
      });
    });
  });

  describe("delete", () => {
    it("deletes and returns the question", async () => {
      const deleted = mockQuestion();
      prisma.question.delete.mockResolvedValue(deleted);

      const result = await service.delete(deleted.id);

      expect(result).toEqual(deleted);
      expect(prisma.question.delete).toHaveBeenCalledWith({ where: { id: deleted.id } });
    });
  });

  describe("count", () => {
    it("returns count without filters", async () => {
      prisma.question.count.mockResolvedValue(6);

      const result = await service.count();

      expect(result).toBe(6);
      expect(prisma.question.count).toHaveBeenCalledWith({ where: undefined });
    });

    it("filters by category", async () => {
      prisma.question.count.mockResolvedValue(2);

      await service.count({ category: "Accessibility" });

      expect(prisma.question.count).toHaveBeenCalledWith({
        where: { category: "Accessibility" },
      });
    });
  });
});
