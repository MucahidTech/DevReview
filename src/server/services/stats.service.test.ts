import { describe, it, expect, vi, beforeEach } from "vitest";
import { StatsService } from "./stats.service";
import type { PrismaClient } from "@prisma/client";

const mockPrisma = {
  question: {
    count: vi.fn(),
    groupBy: vi.fn(),
  },
} as unknown as PrismaClient;

describe("StatsService", () => {
  let service: StatsService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new StatsService(mockPrisma);
  });

  it("returns aggregated dashboard statistics", async () => {
    vi.mocked(mockPrisma.question.count).mockResolvedValue(42);
    vi.mocked(mockPrisma.question.groupBy)
      .mockResolvedValueOnce([
        { category: "JS Quirks", _count: { _all: 15 } },
        { category: "Web Architecture", _count: { _all: 27 } },
      ] as never)
      .mockResolvedValueOnce([
        { difficulty: "easy", _count: { _all: 10 } },
        { difficulty: "medium", _count: { _all: 20 } },
        { difficulty: "hard", _count: { _all: 12 } },
      ] as never);

    const result = await service.getDashboardStats();

    expect(result.totalQuestions).toBe(42);
    expect(result.categoryCounts).toEqual([
      { category: "JS Quirks", count: 15 },
      { category: "Web Architecture", count: 27 },
    ]);
    expect(result.difficultyCounts).toEqual([
      { difficulty: "easy", count: 10 },
      { difficulty: "medium", count: 20 },
      { difficulty: "hard", count: 12 },
    ]);
  });

  it("returns zero counts when database is empty", async () => {
    vi.mocked(mockPrisma.question.count).mockResolvedValue(0);
    vi.mocked(mockPrisma.question.groupBy).mockResolvedValue([] as never);

    const result = await service.getDashboardStats();

    expect(result.totalQuestions).toBe(0);
    expect(result.categoryCounts).toEqual([]);
    expect(result.difficultyCounts).toEqual([]);
  });
});
