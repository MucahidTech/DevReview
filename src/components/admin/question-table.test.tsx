import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QuestionTable } from "./question-table";
import type { Question } from "@prisma/client";

const mockRefresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: mockRefresh,
  }),
}));

vi.mock("@/server/actions/admin.actions", () => ({
  deleteQuestionAction: vi.fn(),
}));

import { deleteQuestionAction } from "@/server/actions/admin.actions";

const makeQuestion = (overrides: Partial<Question> = {}): Question => ({
  id: "q1",
  text: "What is the output of typeof null?",
  codeSnippet: "typeof null",
  options: ["null", "object", "undefined", "boolean"],
  correctAnswer: 1,
  explanation: "typeof null returns 'object'.",
  category: "JS Quirks",
  difficulty: "easy",
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe("QuestionTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("confirm", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders empty state when no questions", () => {
    render(<QuestionTable questions={[]} />);
    expect(screen.getByText(/no questions yet/i)).toBeInTheDocument();
  });

  it("renders questions with category and difficulty badges", () => {
    const questions = [
      makeQuestion(),
      makeQuestion({
        id: "q2",
        text: "Second question",
        category: "Accessibility",
        difficulty: "hard",
      }),
    ];
    render(<QuestionTable questions={questions} />);

    expect(screen.getByText(/what is the output of typeof null/i)).toBeInTheDocument();
    expect(screen.getByText(/second question/i)).toBeInTheDocument();
    expect(screen.getByText("JS Quirks")).toBeInTheDocument();
    expect(screen.getByText("Accessibility")).toBeInTheDocument();
    expect(screen.getByText("easy")).toBeInTheDocument();
    expect(screen.getByText("hard")).toBeInTheDocument();
  });

  it("renders edit links for each question", () => {
    render(<QuestionTable questions={[makeQuestion()]} />);
    const editLink = screen.getByRole("link", { name: /edit/i });
    expect(editLink).toHaveAttribute("href", "/admin/questions/q1/edit");
  });

  it("does not delete when user cancels confirmation", async () => {
    vi.mocked(window.confirm).mockReturnValue(false);
    const user = userEvent.setup();
    render(<QuestionTable questions={[makeQuestion()]} />);

    await user.click(screen.getByRole("button", { name: /delete/i }));

    expect(window.confirm).toHaveBeenCalled();
    expect(deleteQuestionAction).not.toHaveBeenCalled();
  });

  it("deletes question and refreshes on confirmation", async () => {
    vi.mocked(window.confirm).mockReturnValue(true);
    vi.mocked(deleteQuestionAction).mockResolvedValue({ success: true });
    const user = userEvent.setup();
    render(<QuestionTable questions={[makeQuestion()]} />);

    await user.click(screen.getByRole("button", { name: /delete/i }));

    await waitFor(() => {
      expect(deleteQuestionAction).toHaveBeenCalledWith("q1");
    });
    expect(mockRefresh).toHaveBeenCalled();
  });

  it("displays error when delete fails", async () => {
    vi.mocked(window.confirm).mockReturnValue(true);
    vi.mocked(deleteQuestionAction).mockResolvedValue({
      success: false,
      error: "Failed to delete question",
    });
    const user = userEvent.setup();
    render(<QuestionTable questions={[makeQuestion()]} />);

    await user.click(screen.getByRole("button", { name: /delete/i }));

    await waitFor(() => {
      expect(screen.getByText(/failed to delete question/i)).toBeInTheDocument();
    });
    expect(mockRefresh).not.toHaveBeenCalled();
  });
});
