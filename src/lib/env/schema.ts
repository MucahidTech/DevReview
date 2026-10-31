import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
});

export type Env = z.infer<typeof envSchema>;

export function parseEnv(input: Record<string, string | undefined>): Env {
  const result = envSchema.safeParse(input);

  if (!result.success) {
    const formatted = result.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`❌ Invalid environment variables:\n${formatted}`);
  }

  return result.data;
}
