import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;
const DEFAULT_ADMIN_EMAIL = "admin@devreview.local";
const DEFAULT_ADMIN_PASSWORD = "Admin123!";

const questions = [
  {
    text: "What is the result of `typeof null` in JavaScript?",
    codeSnippet: null,
    options: ['"null"', '"object"', '"undefined"', '"boolean"'],
    correctAnswer: 1,
    explanation:
      '`typeof null` returns `"object"` due to a historical bug in JavaScript that has never been fixed for backward compatibility. `null` is a primitive, but its type tag in the original implementation was 0, which corresponded to objects.',
    category: "JS Quirks",
    difficulty: "easy",
  },
  {
    text: "What will be logged to the console?",
    codeSnippet: `console.log(0.1 + 0.2 === 0.3);\nconsole.log(0.1 + 0.2);`,
    options: [
      "true and 0.3",
      "false and 0.30000000000000004",
      "true and 0.30000000000000004",
      "false and 0.3",
    ],
    correctAnswer: 1,
    explanation:
      "Floating-point arithmetic in IEEE 754 cannot represent 0.1 and 0.2 exactly. Their sum is 0.30000000000000004, which is not strictly equal to 0.3. This is not a JavaScript bug; it is a fundamental limitation of binary floating-point representation.",
    category: "JS Quirks",
    difficulty: "medium",
  },
  {
    text: "In a microservices architecture, what is the primary purpose of an API Gateway?",
    codeSnippet: null,
    options: [
      "To store user credentials securely",
      "To act as a single entry point for clients and handle cross-cutting concerns like authentication and rate limiting",
      "To replace the need for service discovery",
      "To encrypt all internal service-to-service communication",
    ],
    correctAnswer: 1,
    explanation:
      "An API Gateway sits between clients and backend services, providing a unified entry point. It typically handles routing, authentication, rate limiting, and response aggregation. It does not store credentials, replace service discovery (though it may use it), or encrypt internal traffic by itself.",
    category: "Web Architecture",
    difficulty: "medium",
  },
  {
    text: 'What is the main accessibility issue with using `<div onclick="...">Click me</div>` instead of a `<button>`?',
    codeSnippet: null,
    options: [
      "It is slower to render",
      "It lacks keyboard accessibility and semantic meaning for screen readers",
      "It cannot receive CSS styling",
      "It does not support event delegation",
    ],
    correctAnswer: 1,
    explanation:
      'A `<div>` with a click handler is not focusable by keyboard, does not respond to Enter or Space, and has no implicit ARIA role. Screen readers will not announce it as an interactive element. Always use `<button>` for actions, or add `role="button"`, `tabIndex={0}`, and keyboard event handlers if you must use a non-button element.',
    category: "Accessibility",
    difficulty: "easy",
  },
  {
    text: "What is the difference between `aria-label` and `aria-labelledby`?",
    codeSnippet: null,
    options: [
      "They are interchangeable",
      "`aria-label` provides a string directly, while `aria-labelledby` references the ID of another element whose text becomes the label",
      "`aria-labelledby` is deprecated in favor of `aria-label`",
      "`aria-label` only works on form inputs",
    ],
    correctAnswer: 1,
    explanation:
      "`aria-label` takes a literal string as the accessible name. `aria-labelledby` takes one or more IDs of elements in the DOM and concatenates their text content. Use `aria-labelledby` when a visible label already exists elsewhere, and `aria-label` when no visible label is present (e.g., icon buttons).",
    category: "Accessibility",
    difficulty: "medium",
  },
  {
    text: "In HTTP/2, what is the primary benefit of multiplexing?",
    codeSnippet: null,
    options: [
      "It encrypts all requests by default",
      "It allows multiple requests and responses to be interleaved over a single TCP connection",
      "It compresses headers using Huffman encoding",
      "It replaces the need for DNS resolution",
    ],
    correctAnswer: 1,
    explanation:
      "HTTP/2 multiplexing allows multiple request/response streams to share a single TCP connection concurrently, eliminating head-of-line blocking at the HTTP level. Header compression (HPACK) is a separate feature, and encryption (TLS) is not inherent to HTTP/2 itself.",
    category: "Networking",
    difficulty: "hard",
  },
];

async function seedAdminUser(): Promise<void> {
  const passwordHash = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, SALT_ROUNDS);

  await prisma.adminUser.upsert({
    where: { email: DEFAULT_ADMIN_EMAIL },
    update: {},
    create: {
      email: DEFAULT_ADMIN_EMAIL,
      name: "DevReview Admin",
      passwordHash,
      role: "admin",
    },
  });

  console.log(`✅ Admin user seeded: ${DEFAULT_ADMIN_EMAIL}`);
}

async function seedQuestions(): Promise<void> {
  let created = 0;
  let skipped = 0;

  for (const question of questions) {
    const existing = await prisma.question.findFirst({
      where: { text: question.text },
    });

    if (existing) {
      skipped++;
      continue;
    }

    await prisma.question.create({ data: question });
    created++;
  }

  console.log(`✅ Questions seeded: ${created} created, ${skipped} skipped (already exist)`);
}

async function main(): Promise<void> {
  console.log("🌱 Starting database seed...");

  await seedAdminUser();
  await seedQuestions();

  console.log("🎉 Seed completed successfully.");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
