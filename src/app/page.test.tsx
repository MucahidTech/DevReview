import { render, screen } from "@testing-library/react";
import HomePage from "./page";

vi.mock("@/components/landing/categories-section", () => ({
  CategoriesSection: () => <div>Categories loaded</div>,
}));

describe("HomePage", () => {
  it("renders the hero heading", () => {
    render(<HomePage />);
    expect(
      screen.getByRole("heading", { level: 1, name: /master the depths/i }),
    ).toBeInTheDocument();
  });

  it("renders the start a quiz button", () => {
    render(<HomePage />);
    expect(screen.getByRole("link", { name: /start a quiz/i })).toBeInTheDocument();
  });
});
