import { parseEnv } from "./schema";

describe("parseEnv", () => {
  it("accepts a valid environment", () => {
    const result = parseEnv({
      NODE_ENV: "development",
      NEXT_PUBLIC_APP_URL: "http://localhost:3000",
    });

    expect(result.NODE_ENV).toBe("development");
    expect(result.NEXT_PUBLIC_APP_URL).toBe("http://localhost:3000");
  });

  it("rejects an invalid NODE_ENV", () => {
    expect(() =>
      parseEnv({
        NODE_ENV: "staging",
        NEXT_PUBLIC_APP_URL: "http://localhost:3000",
      }),
    ).toThrow(/Invalid environment variables/);
  });

  it("rejects an invalid NEXT_PUBLIC_APP_URL", () => {
    expect(() =>
      parseEnv({
        NODE_ENV: "production",
        NEXT_PUBLIC_APP_URL: "not-a-url",
      }),
    ).toThrow(/NEXT_PUBLIC_APP_URL/);
  });

  it("applies defaults when optional values are missing", () => {
    const result = parseEnv({});
    expect(result.NODE_ENV).toBe("development");
    expect(result.NEXT_PUBLIC_APP_URL).toBe("http://localhost:3000");
    expect(result.DATABASE_URL).toBeUndefined();
  });
});
