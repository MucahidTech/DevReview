import { updateHighScore, getScoreKey } from "./persistence";

describe("getScoreKey", () => {
  it("returns the category when provided", () => {
    expect(getScoreKey("JS Quirks")).toBe("JS Quirks");
  });

  it("returns 'mixed' when category is undefined", () => {
    expect(getScoreKey(undefined)).toBe("mixed");
  });
});

describe("updateHighScore", () => {
  it("adds a new score for a new category", () => {
    const result = updateHighScore({}, "JS Quirks", 75);
    expect(result).toEqual({ "JS Quirks": 75 });
  });

  it("updates when the new score is higher", () => {
    const result = updateHighScore({ "JS Quirks": 60 }, "JS Quirks", 80);
    expect(result).toEqual({ "JS Quirks": 80 });
  });

  it("does not update when the new score is lower", () => {
    const current = { "JS Quirks": 80 };
    const result = updateHighScore(current, "JS Quirks", 60);
    expect(result).toBe(current);
  });

  it("does not update when the new score is equal", () => {
    const current = { "JS Quirks": 80 };
    const result = updateHighScore(current, "JS Quirks", 80);
    expect(result).toBe(current);
  });

  it("preserves other categories", () => {
    const result = updateHighScore({ "JS Quirks": 80 }, "Networking", 70);
    expect(result).toEqual({ "JS Quirks": 80, Networking: 70 });
  });
});
