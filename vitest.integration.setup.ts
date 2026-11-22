import { beforeAll, afterAll, afterEach } from "vitest";
import { MongoMemoryReplSet } from "mongodb-memory-server";
import { PrismaClient } from "@prisma/client";

let mongoReplSet: MongoMemoryReplSet;
let testPrismaInstance: PrismaClient;

export function getTestPrisma(): PrismaClient {
  return testPrismaInstance;
}

export let testPrisma: PrismaClient;

beforeAll(async () => {
  mongoReplSet = await MongoMemoryReplSet.create({
    replSet: { count: 1, storageEngine: "wiredTiger" },
  });
  const uri = mongoReplSet.getUri("devreview_test");

  process.env["DATABASE_URL"] = uri;

  testPrismaInstance = new PrismaClient({
    datasources: { db: { url: uri } },
  });

  testPrisma = testPrismaInstance;

  await testPrisma.$connect();
});

afterEach(async () => {
  await testPrisma.question.deleteMany({});
  await testPrisma.user.deleteMany({});
});

afterAll(async () => {
  await testPrisma.$disconnect();
  await mongoReplSet.stop();
});
