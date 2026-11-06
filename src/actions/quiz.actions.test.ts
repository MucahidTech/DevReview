import { fetchQuizQuestions, fetchCategories, fetchQuestionById } from "./quiz.actions";

vi.mock("@/lib/prisma", () => ({
  default: {},
}));

// const mockQuestion = (overrides: Record<string, unknown> = {}) => ({
//   id: "507f1f77bcf86cd799439011",
//   text: "What is typeof null?",
//   codeSnippet: null,
//   options: ['"null"', '"object"', '"undefined"', '"boolean"'],
//   correctAnswer: 1,
//   explanation: "typeof null returns object due to a historical bug.",
//   category: "JS Quirks",
//   difficulty: "easy",
//   createdAt: new Date(),
//   updatedAt: new Date(),
//   ...overrides,
// });

describe("fetchQuizQuestions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects a count of 0", async () => {
    const result = await fetchQuizQuestions({ count: 0 });
    expect(result.success).toBe(false);
  });

  it("rejects a count greater than 100", async () => {
    const result = await fetchQuizQuestions({ count: 101 });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid category", async () => {
    const result = await fetchQuizQuestions({
      count: 5,
      category: "Invalid" as never,
    });
    expect(result.success).toBe(false);
  });
});

describe("fetchCategories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns success structure", async () => {
    const result = await fetchCategories();
    expect(result).toHaveProperty("success");
  });
});

describe("fetchQuestionById", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects an empty id", async () => {
    const result = await fetchQuestionById({ id: "" });
    expect(result.success).toBe(false);
  });
});
