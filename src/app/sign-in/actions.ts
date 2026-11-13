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

export async function signInAction(
  _prevState: SignInState | undefined,
  formData: FormData,
): Promise<SignInState> {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = signInSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      fieldErrors: {
        email: parsed.error.flatten().fieldErrors.email,
        password: parsed.error.flatten().fieldErrors.password,
      },
    };
  }

  const callbackUrl = (formData.get("callbackUrl") as string) || "/admin";

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: callbackUrl,
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
