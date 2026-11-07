import { highlightCode } from "@/lib/shiki";

interface CodeBlockProps {
  code: string;
  language?: string;
}

export async function CodeBlock({ code, language = "javascript" }: CodeBlockProps) {
  const html = await highlightCode(code, language);

  return (
    <div
      className="overflow-x-auto rounded-md border text-sm [&_pre]:m-0 [&_pre]:p-4"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
