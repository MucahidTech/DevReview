"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { questionService } from "@/server/services/question.service";
import { createQuestionSchema, updateQuestionSchema } from "@/lib/validations/question";

type ActionResult = { success: true } | { success: false; error: string };

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    return null;
  }
  return session;
}

export async function createQuestionAction(input: unknown): Promise<ActionResult> {
  const session = await requireAdmin();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  const parsed = createQuestionSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues.map((i) => i.message).join(", "),
    };
  }

  try {
    await questionService.create(parsed.data);
    revalidatePath("/admin/questions");
    revalidatePath("/admin");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to create question" };
  }
}

export async function updateQuestionAction(id: string, input: unknown): Promise<ActionResult> {
  const session = await requireAdmin();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  if (!id || typeof id !== "string") {
    return { success: false, error: "Invalid question ID" };
  }

  const parsed = updateQuestionSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues.map((i) => i.message).join(", "),
    };
  }

  try {
    await questionService.update(id, parsed.data);
    revalidatePath("/admin/questions");
    revalidatePath("/admin");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update question" };
  }
}

export async function deleteQuestionAction(id: string): Promise<ActionResult> {
  const session = await requireAdmin();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  if (!id || typeof id !== "string") {
    return { success: false, error: "Invalid question ID" };
  }

  try {
    await questionService.delete(id);
    revalidatePath("/admin/questions");
    revalidatePath("/admin");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete question" };
  }
}
