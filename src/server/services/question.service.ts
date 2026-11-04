import "server-only";
import type { PrismaClient, Question } from "@prisma/client";

export interface CreateQuestionData {
  text: string;
  codeSnippet?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  difficulty: string;
}

export interface UpdateQuestionData {
  text?: string;
  codeSnippet?: string;
  options?: string[];
  correctAnswer?: number;
  explanation?: string;
  category?: string;
  difficulty?: string;
}

export class QuestionService {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Question | null> {
    return this.prisma.question.findUnique({ where: { id } });
  }

  async findMany(filters?: { category?: string; difficulty?: string }): Promise<Question[]> {
    const where: { category?: string; difficulty?: string } = {};
    if (filters?.category) where.category = filters.category;
    if (filters?.difficulty) where.difficulty = filters.difficulty;

    return this.prisma.question.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      orderBy: { createdAt: "desc" },
    });
  }

  async findRandom(count: number, category?: string): Promise<Question[]> {
    const where = category ? { category } : undefined;
    const all = await this.prisma.question.findMany({ where });

    const shuffled = [...all].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  async create(data: CreateQuestionData): Promise<Question> {
    return this.prisma.question.create({ data });
  }

  async update(id: string, data: UpdateQuestionData): Promise<Question> {
    return this.prisma.question.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Question> {
    return this.prisma.question.delete({ where: { id } });
  }

  async count(filters?: { category?: string; difficulty?: string }): Promise<number> {
    const where: { category?: string; difficulty?: string } = {};
    if (filters?.category) where.category = filters.category;
    if (filters?.difficulty) where.difficulty = filters.difficulty;

    return this.prisma.question.count({
      where: Object.keys(where).length > 0 ? where : undefined,
    });
  }
}
