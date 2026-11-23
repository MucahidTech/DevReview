import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QuestionForm } from "./question-form";

const mockPush = vi.fn();
const mockRefresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

vi.mock("@/server/actions/admin.actions", () => ({
  createQuestionAction: vi.fn(),
  updateQuestionAction: vi.fn(),
}));

import { createQuestionAction, updateQuestionAction } from "@/server/actions/admin.actions";

const validDefaults = {
  text: "What is the output of typeof null?",
  codeSnippet: "typeof null",
  options: ["null", "object", "undefined", "boolean"] as [string, string, string, string],
  correctAnswer: 1,
  explanation: "typeof null returns 'object' due to a historical bug in JavaScript.",
  category: "JS Quirks" as const,
  difficulty: "easy" as const,
};

describe("QuestionForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all form fields in create mode", () => {
    render(<QuestionForm mode="create" />);

    expect(screen.getByLabelText(/question text/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/code snippet/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/explanation/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/difficulty/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create question/i })).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty form", async () => {
    const user = userEvent.setup();
    render(<QuestionForm mode="create" />);

    await user.click(screen.getByRole("button", { name: /create question/i }));

    await waitFor(() => {
      expect(screen.getByText(/question text must be at least 10 characters/i)).toBeInTheDocument();
    });
    expect(createQuestionAction).not.toHaveBeenCalled();
  });

  it("calls createQuestionAction with valid data and redirects", async () => {
    vi.mocked(createQuestionAction).mockResolvedValue({ success: true });
    const user = userEvent.setup();
    render(<QuestionForm mode="create" defaultValues={validDefaults} />);

    await user.click(screen.getByRole("button", { name: /create question/i }));

    await waitFor(() => {
      expect(createQuestionAction).toHaveBeenCalledWith(validDefaults);
    });
    expect(mockPush).toHaveBeenCalledWith("/admin/questions");
    expect(mockRefresh).toHaveBeenCalled();
  });

  it("displays server error when create action fails", async () => {
    vi.mocked(createQuestionAction).mockResolvedValue({
      success: false,
      error: "Database connection failed",
    });
    const user = userEvent.setup();
    render(<QuestionForm mode="create" defaultValues={validDefaults} />);

    await user.click(screen.getByRole("button", { name: /create question/i }));

    await waitFor(() => {
      expect(screen.getByText(/database connection failed/i)).toBeInTheDocument();
    });
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("calls updateQuestionAction in edit mode", async () => {
    vi.mocked(updateQuestionAction).mockResolvedValue({ success: true });
    const user = userEvent.setup();
    render(<QuestionForm mode="edit" questionId="q1" defaultValues={validDefaults} />);

    await user.click(screen.getByRole("button", { name: /save changes/i }));

    await waitFor(() => {
      expect(updateQuestionAction).toHaveBeenCalledWith("q1", validDefaults);
    });
    expect(mockPush).toHaveBeenCalledWith("/admin/questions");
  });

  it("disables submit button while pending", async () => {
    vi.mocked(createQuestionAction).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 100)),
    );
    const user = userEvent.setup();
    render(<QuestionForm mode="create" defaultValues={validDefaults} />);

    const button = screen.getByRole("button", { name: /create question/i });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /saving/i })).toBeDisabled();
    });
  });
});
