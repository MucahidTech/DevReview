import { PrismaClient } from "@prisma/client";
import prisma from "@/lib/prisma";

export interface DashboardStats {
  totalQuestions: number;
  categoryCounts: { category: string; count: number }[];
  difficultyCounts: { difficulty: string; count: number }[];
}

export class StatsService {
  constructor(private readonly db: PrismaClient) {}

  async getDashboardStats(): Promise<DashboardStats> {
    const [totalQuestions, categoryGroups, difficultyGroups] = await Promise.all([
      this.db.question.count(),
      this.db.question.groupBy({
        by: ["category"],
        _count: { _all: true },
      }),
      this.db.question.groupBy({
        by: ["difficulty"],
        _count: { _all: true },
      }),
    ]);

    return {
      totalQuestions,
      categoryCounts: categoryGroups.map((g) => ({
        category: g.category,
        count: g._count._all,
      })),
      difficultyCounts: difficultyGroups.map((g) => ({
        difficulty: g.difficulty,
        count: g._count._all,
      })),
    };
  }
}

export const statsService = new StatsService(prisma);
