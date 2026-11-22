vi.mock("@/auth", () => ({
  signIn: vi.fn(),
}));

vi.mock("next-auth", () => ({
  AuthError: class AuthError extends Error {
    type: string;
    constructor(type: string) {
      super(type);
      this.type = type;
    }
  },
}));

import { signInAction, parseSignInForm } from "./actions";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

const mockSignIn = vi.mocked(signIn);

const makeFormData = (data: Record<string, string>): FormData => {
  const fd = new FormData();
  for (const [key, value] of Object.entries(data)) {
    fd.set(key, value);
  }
  return fd;
};

describe("parseSignInForm (pure)", () => {
  it("rejects an invalid email", () => {
    const result = parseSignInForm(makeFormData({ email: "not-an-email", password: "12345678" }));
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors.email).toBeDefined();
    }
  });

  it("rejects a short password", () => {
    const result = parseSignInForm(makeFormData({ email: "a@b.com", password: "short" }));
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors.password).toBeDefined();
    }
  });

  it("rejects missing fields", () => {
    const result = parseSignInForm(makeFormData({}));
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.fieldErrors.email).toBeDefined();
      expect(result.fieldErrors.password).toBeDefined();
    }
  });

  it("returns the parsed values with the default callbackUrl", () => {
    const result = parseSignInForm(makeFormData({ email: "a@b.com", password: "password123" }));
    expect(result).toEqual({
      success: true,
      email: "a@b.com",
      password: "password123",
      callbackUrl: "/admin",
    });
  });

  it("uses the provided callbackUrl", () => {
    const result = parseSignInForm(
      makeFormData({
        email: "a@b.com",
        password: "password123",
        callbackUrl: "/admin/questions",
      }),
    );
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.callbackUrl).toBe("/admin/questions");
    }
  });
});

describe("signInAction (orchestration)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not call signIn when input is invalid", async () => {
    const result = await signInAction(
      undefined,
      makeFormData({ email: "not-an-email", password: "12345678" }),
    );
    expect(result.fieldErrors?.email).toBeDefined();
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it("returns a generic error when credentials are invalid", async () => {
    const authError = new AuthError("CredentialsSignin");
    mockSignIn.mockRejectedValueOnce(authError);

    const result = await signInAction(
      undefined,
      makeFormData({ email: "admin@example.com", password: "password123" }),
    );

    expect(result.error).toBe("Invalid email or password");
  });

  it("returns a generic error for other AuthError types", async () => {
    const authError = new AuthError("SomeError");
    mockSignIn.mockRejectedValueOnce(authError);

    const result = await signInAction(
      undefined,
      makeFormData({ email: "admin@example.com", password: "password123" }),
    );

    expect(result.error).toBe("Authentication failed. Please try again.");
  });

  it("calls signIn with /admin as default callbackUrl", async () => {
    mockSignIn.mockResolvedValueOnce({ ok: true, error: undefined } as never);

    await signInAction(
      undefined,
      makeFormData({ email: "admin@example.com", password: "password123" }),
    );

    expect(mockSignIn).toHaveBeenCalledWith(
      "credentials",
      expect.objectContaining({
        email: "admin@example.com",
        password: "password123",
        redirectTo: "/admin",
      }),
    );
  });

  it("calls signIn with the provided callbackUrl", async () => {
    mockSignIn.mockResolvedValueOnce({ ok: true, error: undefined } as never);

    await signInAction(
      undefined,
      makeFormData({
        email: "admin@example.com",
        password: "password123",
        callbackUrl: "/admin/questions",
      }),
    );

    expect(mockSignIn).toHaveBeenCalledWith(
      "credentials",
      expect.objectContaining({ redirectTo: "/admin/questions" }),
    );
  });
});
