import { questionSchema, createQuestionSchema, updateQuestionSchema } from "./question";

describe("questionSchema", () => {
  const validQuestion = {
    text: "What is the result of typeof null?",
    options: ['"null"', '"object"', '"undefined"', '"boolean"'],
    correctAnswer: 1,
    explanation: "typeof null returns 'object' due to a historical bug.",
    category: "JS Quirks" as const,
    difficulty: "easy" as const,
  };

  describe("valid inputs", () => {
    it("accepts a valid question without code snippet", () => {
      const result = questionSchema.safeParse(validQuestion);
      expect(result.success).toBe(true);
    });

    it("accepts a valid question with code snippet", () => {
      const result = questionSchema.safeParse({
        ...validQuestion,
        codeSnippet: "console.log(typeof null);",
      });
      expect(result.success).toBe(true);
    });

    it("accepts all valid categories", () => {
      for (const category of ["JS Quirks", "Web Architecture", "Accessibility", "Networking"]) {
        const result = questionSchema.safeParse({ ...validQuestion, category });
        expect(result.success).toBe(true);
      }
    });

    it("accepts all valid difficulties", () => {
      for (const difficulty of ["easy", "medium", "hard"]) {
        const result = questionSchema.safeParse({ ...validQuestion, difficulty });
        expect(result.success).toBe(true);
      }
    });
  });

  describe("invalid inputs", () => {
    it("rejects text shorter than 10 characters", () => {
      const result = questionSchema.safeParse({ ...validQuestion, text: "Short" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toEqual(["text"]);
      }
    });

    it("rejects empty options array", () => {
      const result = questionSchema.safeParse({ ...validQuestion, options: [] });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toEqual(["options"]);
      }
    });

    it("rejects options array with wrong length", () => {
      const result = questionSchema.safeParse({
        ...validQuestion,
        options: ["a", "b", "c"],
      });
      expect(result.success).toBe(false);
    });

    it("rejects empty option strings", () => {
      const result = questionSchema.safeParse({
        ...validQuestion,
        options: ["a", "", "c", "d"],
      });
      expect(result.success).toBe(false);
    });

    it("rejects negative correctAnswer", () => {
      const result = questionSchema.safeParse({ ...validQuestion, correctAnswer: -1 });
      expect(result.success).toBe(false);
    });

    it("rejects non-integer correctAnswer", () => {
      const result = questionSchema.safeParse({ ...validQuestion, correctAnswer: 1.5 });
      expect(result.success).toBe(false);
    });

    it("rejects correctAnswer >= options.length", () => {
      const result = questionSchema.safeParse({ ...validQuestion, correctAnswer: 4 });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some((i) => i.path.includes("correctAnswer"))).toBe(true);
      }
    });

    it("rejects explanation shorter than 10 characters", () => {
      const result = questionSchema.safeParse({ ...validQuestion, explanation: "Short" });
      expect(result.success).toBe(false);
    });

    it("rejects invalid category", () => {
      const result = questionSchema.safeParse({ ...validQuestion, category: "Invalid" });
      expect(result.success).toBe(false);
    });

    it("rejects invalid difficulty", () => {
      const result = questionSchema.safeParse({ ...validQuestion, difficulty: "impossible" });
      expect(result.success).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("accepts correctAnswer equal to 0", () => {
      const result = questionSchema.safeParse({ ...validQuestion, correctAnswer: 0 });
      expect(result.success).toBe(true);
    });

    it("accepts correctAnswer equal to options.length - 1", () => {
      const result = questionSchema.safeParse({ ...validQuestion, correctAnswer: 3 });
      expect(result.success).toBe(true);
    });

    it("accepts undefined codeSnippet", () => {
      const result = questionSchema.safeParse({ ...validQuestion, codeSnippet: undefined });
      expect(result.success).toBe(true);
    });

    it("accepts text with exactly 10 characters", () => {
      const result = questionSchema.safeParse({
        ...validQuestion,
        text: "1234567890",
      });
      expect(result.success).toBe(true);
    });

    it("rejects text with 9 characters", () => {
      const result = questionSchema.safeParse({
        ...validQuestion,
        text: "123456789",
      });
      expect(result.success).toBe(false);
    });
  });
});

describe("createQuestionSchema", () => {
  it("is identical to questionSchema", () => {
    expect(createQuestionSchema).toBe(questionSchema);
  });
});

describe("updateQuestionSchema", () => {
  it("accepts an empty object", () => {
    const result = updateQuestionSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("accepts a partial update with only text", () => {
    const result = updateQuestionSchema.safeParse({ text: "Updated question text here" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid field values even in partial updates", () => {
    const result = updateQuestionSchema.safeParse({ text: "Short" });
    expect(result.success).toBe(false);
  });

  it("rejects a partial update with correctAnswer out of range when options are provided", () => {
    const result = updateQuestionSchema.safeParse({
      options: ["a", "b", "c", "d"],
      correctAnswer: 4,
    });
    expect(result.success).toBe(false);
  });
});
