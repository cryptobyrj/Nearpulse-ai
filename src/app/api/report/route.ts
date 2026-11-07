import { buildReport, toMarkdown } from "@/lib/report";

export function GET() {
  const markdown = toMarkdown(buildReport());
  return new Response(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition":
        'attachment; filename="nearpulse-research-report.md"',
    },
  });
}