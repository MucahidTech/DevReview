import { render, screen } from "@testing-library/react";
import { CodeBlock } from "./code-block";

vi.mock("@/lib/shiki", () => ({
  highlightCode: vi.fn(async (code: string) => `<pre><code>${code}</code></pre>`),
}));

describe("CodeBlock", () => {
  it("renders highlighted HTML", async () => {
    const element = await CodeBlock({ code: "const a = 1;" });
    render(element);
    expect(screen.getByText("const a = 1;")).toBeInTheDocument();
  });

  it("uses JavaScript as default language", async () => {
    const { highlightCode } = await import("@/lib/shiki");
    const element = await CodeBlock({ code: "const a = 1;" });
    render(element);
    expect(highlightCode).toHaveBeenCalledWith("const a = 1;", "javascript");
  });
});
