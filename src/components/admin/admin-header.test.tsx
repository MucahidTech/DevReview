import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AdminHeader } from "./admin-header";

vi.mock("./sign-out-button", () => ({
  SignOutButton: () => <button>Sign out</button>,
}));

describe("AdminHeader", () => {
  it("renders user name and email when provided", () => {
    render(<AdminHeader userName="Mucahid" userEmail="admin@devreview.com" />);

    expect(screen.getByText("Mucahid")).toBeInTheDocument();
    expect(screen.getByText("admin@devreview.com")).toBeInTheDocument();
  });

  it("falls back to 'Admin' when name is missing", () => {
    render(<AdminHeader userEmail="admin@devreview.com" />);
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  it("renders sign out button", () => {
    render(<AdminHeader />);
    expect(screen.getByRole("button", { name: /sign out/i })).toBeInTheDocument();
  });
});
