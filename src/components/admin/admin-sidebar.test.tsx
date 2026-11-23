import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AdminSidebar } from "./admin-sidebar";

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("AdminSidebar", () => {
  it("renders all navigation links", () => {
    render(<AdminSidebar />);

    expect(screen.getByRole("link", { name: /dashboard/i })).toHaveAttribute("href", "/admin");
    expect(screen.getByRole("link", { name: /questions/i })).toHaveAttribute(
      "href",
      "/admin/questions",
    );
    expect(screen.getByRole("link", { name: /categories/i })).toHaveAttribute(
      "href",
      "/admin/categories",
    );
  });

  it("renders brand link to admin root", () => {
    render(<AdminSidebar />);
    expect(screen.getByRole("link", { name: /devreview admin/i })).toHaveAttribute(
      "href",
      "/admin",
    );
  });
});
