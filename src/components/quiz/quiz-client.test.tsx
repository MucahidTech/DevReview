import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QuizClient } from "./quiz-client";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
}));

const questions = [
  {
    id: "q1",
    text: "Question one?",
    codeSnippet: null,
    options: ["a", "b", "c", "d"],
    correctAnswer: 1,
    explanation: "Explanation one",
    category: "JS Quirks",
    difficulty: "easy",
  },
  {
    id: "q2",
    text: "Question two?",
    codeSnippet: null,
    options: ["a", "b", "c", "d"],
    correctAnswer: 0,
    explanation: "Explanation two",
    category: "JS Quirks",
    difficulty: "easy",
  },
];

describe("QuizClient", () => {
  it("renders the selection phase initially", () => {
    render(<QuizClient questions={questions} highlightedCodeMap={{}} />);
    expect(screen.getByText(/number of questions/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /start quiz/i })).toBeInTheDocument();
  });

  it("starts the quiz and shows the first question", async () => {
    const user = userEvent.setup();
    render(<QuizClient questions={questions} highlightedCodeMap={{}} />);

    await user.click(screen.getByRole("button", { name: /start quiz/i }));
    expect(screen.getByText("Question one?")).toBeInTheDocument();
    expect(screen.getByText(/question 1 of 2/i)).toBeInTheDocument();
  });

  it("advances to the next question after answering and clicking next", async () => {
    const user = userEvent.setup();
    render(<QuizClient questions={questions} highlightedCodeMap={{}} />);

    await user.click(screen.getByRole("button", { name: /start quiz/i }));
    await user.click(screen.getByText("b"));
    await user.click(screen.getByRole("button", { name: /next question/i }));

    expect(screen.getByText("Question two?")).toBeInTheDocument();
  });

  it("shows results after the last question", async () => {
    const user = userEvent.setup();
    render(<QuizClient questions={questions} highlightedCodeMap={{}} />);

    await user.click(screen.getByRole("button", { name: /start quiz/i }));
    await user.click(screen.getByText("b"));
    await user.click(screen.getByRole("button", { name: /next question/i }));
    await user.click(screen.getByText("a"));
    await user.click(screen.getByRole("button", { name: /see results/i }));

    expect(screen.getByText(/quiz complete/i)).toBeInTheDocument();
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("allows restarting after results", async () => {
    const user = userEvent.setup();
    render(<QuizClient questions={questions} highlightedCodeMap={{}} />);

    await user.click(screen.getByRole("button", { name: /start quiz/i }));
    await user.click(screen.getByText("b"));
    await user.click(screen.getByRole("button", { name: /next question/i }));
    await user.click(screen.getByText("a"));
    await user.click(screen.getByRole("button", { name: /see results/i }));
    await user.click(screen.getByRole("button", { name: /try again/i }));

    expect(screen.getByRole("button", { name: /start quiz/i })).toBeInTheDocument();
  });
});
