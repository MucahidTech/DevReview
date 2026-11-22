"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { z } from "zod";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export interface SignInState {
  error?: string;
  fieldErrors?: {
    email?: string[];
    password?: string[];
  };
}

export type ParseSignInResult =
  | { success: true; email: string; password: string; callbackUrl: string }
  | { success: false; fieldErrors: NonNullable<SignInState["fieldErrors"]> };

export function parseSignInForm(formData: FormData): ParseSignInResult {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = signInSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: {
        email: parsed.error.flatten().fieldErrors.email,
        password: parsed.error.flatten().fieldErrors.password,
      },
    };
  }

  const callbackUrl = (formData.get("callbackUrl") as string) || "/admin";
  return {
    success: true,
    email: parsed.data.email,
    password: parsed.data.password,
    callbackUrl,
  };
}

export async function signInAction(
  _prevState: SignInState | undefined,
  formData: FormData,
): Promise<SignInState> {
  const parsed = parseSignInForm(formData);
  if (!parsed.success) {
    return { fieldErrors: parsed.fieldErrors };
  }

  try {
    await signIn("credentials", {
      email: parsed.email,
      password: parsed.password,
      redirectTo: parsed.callbackUrl,
    });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return { error: "Invalid email or password" };
      }
      return { error: "Authentication failed. Please try again." };
    }
    throw error;
  }
}
