import { render, screen } from "@testing-library/react";
import { QuestionCardContainer } from "./question-card-container";

vi.mock("@/lib/shiki", () => ({
  highlightCode: vi.fn(async (code: string) => `<pre><code>${code}</code></pre>`),
}));

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

describe("QuestionCardContainer", () => {
  it("renders QuestionCard without highlighted HTML when codeSnippet is null", async () => {
    const element = await QuestionCardContainer({ question: baseQuestion });
    render(element);

    expect(screen.getByText("What is typeof null?")).toBeInTheDocument();
    expect(screen.queryByText("console.log")).not.toBeInTheDocument();
  });

  it("passes highlighted HTML to QuestionCard when codeSnippet exists", async () => {
    const questionWithCode = { ...baseQuestion, codeSnippet: "console.log(1);" };
    const element = await QuestionCardContainer({ question: questionWithCode });
    render(element);

    expect(screen.getByText("console.log(1);")).toBeInTheDocument();
  });

  it("forwards all question fields to QuestionCard", async () => {
    const element = await QuestionCardContainer({ question: baseQuestion });
    render(element);

    expect(screen.getByText("JS Quirks")).toBeInTheDocument();
    expect(screen.getByText('"object"')).toBeInTheDocument();
  });
});
