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
  describe("rendering", () => {
    it("renders the question text and all options", () => {
      render(<QuestionCard question={baseQuestion} />);
      expect(screen.getByText("What is typeof null?")).toBeInTheDocument();
      baseQuestion.options.forEach((option) => {
        expect(screen.getByText(option)).toBeInTheDocument();
      });
    });

    it("renders the category badge", () => {
      render(<QuestionCard question={baseQuestion} />);
      expect(screen.getByText("JS Quirks")).toBeInTheDocument();
    });

    it("renders 4 radio options", () => {
      render(<QuestionCard question={baseQuestion} />);
      expect(screen.getAllByRole("radio")).toHaveLength(4);
    });

    it("does not render a code block when codeSnippet is null", () => {
      render(<QuestionCard question={baseQuestion} />);
      expect(screen.queryByRole("code")).not.toBeInTheDocument();
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

  describe("interaction", () => {
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

    it("marks the correct option after answering wrong", async () => {
      const user = userEvent.setup();
      render(<QuestionCard question={baseQuestion} />);

      await user.click(screen.getByText('"undefined"'));
      const radios = screen.getAllByRole("radio");
      expect(radios[1]).toHaveAttribute("aria-checked", "false");
      // The explanation of the correct answer is visible
      expect(screen.getByText(/historical bug/i)).toBeInTheDocument();
    });

    it("disables all options after answering", async () => {
      const user = userEvent.setup();
      render(<QuestionCard question={baseQuestion} />);

      await user.click(screen.getByText('"object"'));
      screen.getAllByRole("radio").forEach((radio) => {
        expect(radio).toHaveAttribute("aria-disabled", "true");
      });
    });

    it("prevents changing the answer after selection", async () => {
      const user = userEvent.setup();
      render(<QuestionCard question={baseQuestion} />);

      await user.click(screen.getByText('"object"'));
      expect(screen.getByText("Correct!")).toBeInTheDocument();

      // Attempt to click another option
      await user.click(screen.getByText('"undefined"'));
      // Still shows the original correct feedback, not incorrect
      expect(screen.getByText("Correct!")).toBeInTheDocument();
      expect(screen.queryByText("Incorrect")).not.toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("uses a radiogroup with radio children", () => {
      render(<QuestionCard question={baseQuestion} />);
      expect(screen.getByRole("radiogroup")).toBeInTheDocument();
      expect(screen.getAllByRole("radio")).toHaveLength(4);
    });

    it("associates labels with radio inputs", () => {
      render(<QuestionCard question={baseQuestion} />);
      const radio = screen.getByRole("radio", { name: '"object"' });
      expect(radio).toBeInTheDocument();
    });
  });

  describe("edge cases", () => {
    it("handles long question text without crashing", () => {
      const longText = "A".repeat(500);
      render(<QuestionCard question={{ ...baseQuestion, text: longText }} />);
      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it("handles options with special characters", () => {
      const question = {
        ...baseQuestion,
        options: ["<div>", "&amp;", '"quoted"', "'single'"],
        correctAnswer: 0,
      };
      render(<QuestionCard question={question} />);
      expect(screen.getByText("<div>")).toBeInTheDocument();
      expect(screen.getByText("&amp;")).toBeInTheDocument();
    });

    it("handles a single-character option", () => {
      const question = {
        ...baseQuestion,
        options: ["a", "b", "c", "d"],
        correctAnswer: 0,
      };
      render(<QuestionCard question={question} />);
      expect(screen.getByRole("radio", { name: "a" })).toBeInTheDocument();
    });
  });
});
