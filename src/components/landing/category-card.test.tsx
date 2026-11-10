import { render, screen } from "@testing-library/react";
import { CategoryCard } from "./category-card";

describe("CategoryCard", () => {
  it("renders the category name", () => {
    render(<CategoryCard category="JS Quirks" count={5} />);
    expect(screen.getByText("JS Quirks")).toBeInTheDocument();
  });

  it("renders the count badge", () => {
    render(<CategoryCard category="Networking" count={3} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("shows plural form for multiple questions", () => {
    render(<CategoryCard category="Accessibility" count={5} />);
    expect(screen.getByText("5 questions")).toBeInTheDocument();
  });

  it("shows singular form for one question", () => {
    render(<CategoryCard category="Accessibility" count={1} />);
    expect(screen.getByText("1 question")).toBeInTheDocument();
  });

  it("shows empty message when count is zero", () => {
    render(<CategoryCard category="Networking" count={0} />);
    expect(screen.getByText("No questions yet")).toBeInTheDocument();
  });

  it("links to the quiz page with encoded category", () => {
    render(<CategoryCard category="Web Architecture" count={2} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/quiz?category=Web%20Architecture");
  });
});
