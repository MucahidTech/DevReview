import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QuestionCard } from "./question-card";

const baseQuestion = {
  id: "q1",
  text: "What is typeof null?",
  codeSnippet: null,
  options: ['"null"', '"object"', '"undefined"', '"boolean"'],
  correctAnswer: 1,
  explanation: "typeof null returns object due to a historical bug.",
  category: "JS Quirks",
  difficulty: "easy",
};

describe("QuestionCard", () => {
  it("renders the question text and all options", () => {
    render(<QuestionCard question={baseQuestion} />);
    expect(screen.getByText("What is typeof null?")).toBeInTheDocument();
    expect(screen.getByText('"null"')).toBeInTheDocument();
    expect(screen.getByText('"object"')).toBeInTheDocument();
  });

  it("does not show explanation before answering", () => {
    render(<QuestionCard question={baseQuestion} />);
    expect(screen.queryByText(/historical bug/i)).not.toBeInTheDocument();
  });

  it("shows correct feedback when the correct option is selected", async () => {
    const user = userEvent.setup();
    render(<QuestionCard question={baseQuestion} />);

    await user.click(screen.getByText('"object"'));
    expect(screen.getByText("Correct!")).toBeInTheDocument();
    expect(screen.getByText(/historical bug/i)).toBeInTheDocument();
  });

  it("shows incorrect feedback when a wrong option is selected", async () => {
    const user = userEvent.setup();
    render(<QuestionCard question={baseQuestion} />);

    await user.click(screen.getByText('"undefined"'));
    expect(screen.getByText("Incorrect")).toBeInTheDocument();
    expect(screen.getByText(/historical bug/i)).toBeInTheDocument();
  });

  it("disables options after answering", async () => {
    const user = userEvent.setup();
    render(<QuestionCard question={baseQuestion} />);

    await user.click(screen.getByText('"object"'));
    const radio = screen.getByRole("radio", { name: /undefined/i });
    expect(radio).toHaveAttribute("aria-disabled", "true");
  });

  it("renders highlighted code when provided", () => {
    render(
      <QuestionCard
        question={{ ...baseQuestion, codeSnippet: "console.log(1);" }}
        highlightedCodeHtml="<pre><code>console.log(1);</code></pre>"
      />,
    );
    expect(screen.getByText("console.log(1);")).toBeInTheDocument();
  });
});
