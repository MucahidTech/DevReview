import "server-only";
import { codeToHtml } from "shiki";

const SUPPORTED_LANGS = ["javascript", "typescript", "tsx", "jsx", "html", "css", "json"] as const;
type SupportedLang = (typeof SUPPORTED_LANGS)[number];

export async function highlightCode(code: string, lang: string = "javascript"): Promise<string> {
  const normalized = lang.toLowerCase();
  const safeLang: SupportedLang = SUPPORTED_LANGS.includes(normalized as SupportedLang)
    ? (normalized as SupportedLang)
    : "javascript";

  return codeToHtml(code, {
    lang: safeLang,
    theme: "github-dark",
  });
}
