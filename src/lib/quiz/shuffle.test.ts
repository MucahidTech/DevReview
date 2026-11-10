import { shuffle } from "./shuffle";

describe("shuffle", () => {
  it("returns an array of the same length", () => {
    const input = [1, 2, 3, 4, 5];
    expect(shuffle(input)).toHaveLength(5);
  });

  it("returns an array with the same elements", () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffle(input);
    expect([...result].sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5]);
  });

  it("does not mutate the input array", () => {
    const input = [1, 2, 3, 4, 5];
    const copy = [...input];
    shuffle(input);
    expect(input).toEqual(copy);
  });

  it("returns a new array reference", () => {
    const input = [1, 2, 3];
    expect(shuffle(input)).not.toBe(input);
  });

  it("handles an empty array", () => {
    expect(shuffle([])).toEqual([]);
  });

  it("handles a single-element array", () => {
    expect(shuffle([42])).toEqual([42]);
  });

  it("produces the same result for the same seed", () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const a = shuffle(input, 12345);
    const b = shuffle(input, 12345);
    expect(a).toEqual(b);
  });

  it("produces different results for different seeds", () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const a = shuffle(input, 1);
    const b = shuffle(input, 2);
    expect(a).not.toEqual(b);
  });

  it("produces a uniform distribution across many runs", () => {
    const input = [0, 1, 2, 3];
    const firstPositionCounts = [0, 0, 0, 0];
    const iterations = 10_000;

    for (let i = 0; i < iterations; i++) {
      const result = shuffle(input, i);
      firstPositionCounts[result[0]!]! += 1;
    }

    // Each element should appear first roughly 25% of the time.
    // Allow 20-30% range for statistical variation.
    for (const count of firstPositionCounts) {
      const ratio = count / iterations;
      expect(ratio).toBeGreaterThan(0.2);
      expect(ratio).toBeLessThan(0.3);
    }
  });
});
