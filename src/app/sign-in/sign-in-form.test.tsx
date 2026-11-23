vi.mock("./actions", () => ({
  signInAction: vi.fn(),
}));

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignInForm } from "./sign-in-form";
import { signInAction } from "./actions";

const mockSignInAction = vi.mocked(signInAction);

describe("SignInForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders email, password, and submit button", () => {
    render(<SignInForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("passes callbackUrl as hidden input", () => {
    render(<SignInForm callbackUrl="/admin/questions" />);
    const hidden = document.querySelector('input[name="callbackUrl"]') as HTMLInputElement;
    expect(hidden?.value).toBe("/admin/questions");
  });

  it("submits the form with user input", async () => {
    const user = userEvent.setup();
    mockSignInAction.mockResolvedValue({});
    render(<SignInForm />);

    await user.type(screen.getByLabelText(/email/i), "admin@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(mockSignInAction).toHaveBeenCalled();
  });
});
