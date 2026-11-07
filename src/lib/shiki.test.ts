import { highlightCode } from "./shiki";

vi.mock("shiki", () => ({
  codeToHtml: vi.fn(async (code: string) => `<pre><code>${code}</code></pre>`),
}));

describe("highlightCode", () => {
  it("returns HTML for valid JavaScript code", async () => {
    const html = await highlightCode("const a = 1;", "javascript");
    expect(html).toContain("<pre");
    expect(html).toContain("const a = 1;");
  });

  it("falls back to JavaScript for unsupported languages", async () => {
    const html = await highlightCode("const a = 1;", "unknown-lang");
    expect(html).toContain("<pre");
  });

  it("passes the code through to the highlighter", async () => {
    const code = "const html = '<div>';";
    const html = await highlightCode(code, "javascript");
    expect(html).toContain(code);
  });
});
