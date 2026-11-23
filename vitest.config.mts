import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    projects: [
      {
        test: {
          name: "unit",
          environment: "happy-dom",
          globals: true,
          setupFiles: ["./vitest.setup.ts"],
          include: ["src/**/*.{test,spec}.{ts,tsx}"],
          exclude: ["src/server/**/*.integration.test.{ts,tsx}"],
          alias: {
            "server-only": "/vitest.stubs/server-only.ts",
          },
        },
      },
      {
        test: {
          name: "integration",
          environment: "node",
          globals: true,
          setupFiles: ["./vitest.setup.ts", "./vitest.integration.setup.ts"],
          include: ["src/server/**/*.integration.test.{ts,tsx}"],
          testTimeout: 60000,
          alias: {
            "server-only": "/vitest.stubs/server-only.ts",
          },
        },
      },
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.{test,spec}.{ts,tsx}",
        "src/**/*.d.ts",
        "src/app/**/layout.tsx",
        "src/app/**/page.tsx",
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70,
      },
    },
  },
});
