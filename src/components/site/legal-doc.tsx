import type { ReactNode } from "react";

/** Strip YAML frontmatter from a markdown document. */
export function stripFrontmatter(md: string): string {
  if (!md.startsWith("---")) return md;
  const end = md.indexOf("\n---", 3);
  return end === -1 ? md : md.slice(end + 4).trimStart();
}

function inline(text: string): ReactNode {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const label = link[1]!;
      const href = link[2]!;
      const external = href.startsWith("http");
      return (
        <a
          key={i}
          href={href}
          className="text-foreground underline underline-offset-4 hover:text-primary"
          {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        >
          {label}
        </a>
      );
    }
    const bold = part.match(/^\*\*([^*]+)\*\*$/);
    if (bold) {
      return (
        <strong key={i} className="font-medium text-foreground">
          {bold[1]}
        </strong>
      );
    }
    return part;
  });
}

/** Minimal markdown renderer for the legal documents: headings, lists, paragraphs, links, bold. */
export function LegalDoc({ markdown }: { markdown: string }) {
  const body = stripFrontmatter(markdown);
  const blocks = body.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);

  return (
    <div className="legal-doc mx-auto max-w-2xl space-y-6">
      {blocks.map((block, i) => {
        if (block.startsWith("## ")) {
          return (
            <h2 key={i} className="h2 pt-4">
              {inline(block.slice(3))}
            </h2>
          );
        }
        if (block.startsWith("### ")) {
          return (
            <h3 key={i} className="h3 pt-2">
              {inline(block.slice(4))}
            </h3>
          );
        }
        if (block.startsWith("# ")) {
          return (
            <h1 key={i} className="h2">
              {inline(block.slice(2))}
            </h1>
          );
        }
        if (block.startsWith("- ")) {
          return (
            <ul key={i} className="space-y-2 pl-1">
              {block.split("\n").map((line, j) => (
                <li key={j} className="flex gap-3 text-[0.9375rem] leading-relaxed text-muted-foreground">
                  <span aria-hidden className="text-foreground">—</span>
                  <span>{inline(line.replace(/^-\s*/, ""))}</span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="text-[0.9375rem] leading-relaxed text-muted-foreground">
            {inline(block)}
          </p>
        );
      })}
    </div>
  );
}
