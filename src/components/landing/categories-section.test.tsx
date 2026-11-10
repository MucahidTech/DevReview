import { render, screen } from "@testing-library/react";
import { CategoriesSection } from "./categories-section";
import { fetchCategories } from "@/server/actions/quiz.actions";

vi.mock("@/server/actions/quiz.actions", () => ({
  fetchCategories: vi.fn(),
}));

const mockFetchCategories = vi.mocked(fetchCategories);

describe("CategoriesSection", () => {
  it("renders a card for each category", async () => {
    mockFetchCategories.mockResolvedValue({
      success: true,
      data: [
        { category: "JS Quirks", count: 3 },
        { category: "Networking", count: 2 },
      ],
    });

    const element = await CategoriesSection();
    render(element);

    expect(screen.getByText("JS Quirks")).toBeInTheDocument();
    expect(screen.getByText("Networking")).toBeInTheDocument();
  });

  it("renders an error message when fetching fails", async () => {
    mockFetchCategories.mockResolvedValue({ success: false, error: "Failed" });

    const element = await CategoriesSection();
    render(element);

    expect(screen.getByText(/failed to load categories/i)).toBeInTheDocument();
  });
});
