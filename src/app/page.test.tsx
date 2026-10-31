import { render, screen } from "@testing-library/react";
import HomePage from "./page";

describe("HomePage", () => {
  it("renders the DevReview heading", () => {
    render(<HomePage />);
    expect(screen.getByRole("heading", { level: 1, name: "DevReview" })).toBeInTheDocument();
  });
});
