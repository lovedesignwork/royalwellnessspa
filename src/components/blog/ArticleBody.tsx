import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { BlogAsset } from "@/lib/blog/types";
import BlogImage from "./BlogImage";
export function headingId(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}
export default function ArticleBody({
  body,
  assets,
}: {
  body: string;
  assets: BlogAsset[];
}) {
  const parts = body.split(/(\{\{image:\d+\}\})/g);
  return (
    <div className="article-body">
      {parts.map((part, i) => {
        const match = part.match(/^\{\{image:(\d+)\}\}$/);
        if (match) {
          const asset = assets.find((a) => a.position === Number(match[1]));
          return asset ? <BlogImage key={i} asset={asset} /> : null;
        }
        return (
          <ReactMarkdown
            key={i}
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => <h2>{children}</h2>,
              h2: ({ children }) => (
                <h2 id={headingId(String(children))}>{children}</h2>
              ),
              h3: ({ children }) => <h3>{children}</h3>,
              img: () => null,
              table: ({ children }) => (
                <div className="blog-table">
                  <table>{children}</table>
                </div>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  rel={
                    href?.startsWith("https:")
                      ? "noopener noreferrer"
                      : undefined
                  }
                >
                  {children}
                </a>
              ),
            }}
          >
            {part}
          </ReactMarkdown>
        );
      })}
    </div>
  );
}
