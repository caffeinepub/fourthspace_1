import { useEffect, useState } from "react";
import type { Block } from "../../types";

interface Heading {
  id: string;
  level: 1 | 2 | 3;
  text: string;
}

interface TableOfContentsProps {
  blocks: Block[];
}

export function TableOfContents({ blocks }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const headings: Heading[] = blocks
    .filter(
      (b) =>
        b.blockType === "heading1" ||
        b.blockType === "heading2" ||
        b.blockType === "heading3",
    )
    .map((b) => ({
      id: b.id,
      level: (b.blockType === "heading1"
        ? 1
        : b.blockType === "heading2"
          ? 2
          : 3) as 1 | 2 | 3,
      text: b.content,
    }));

  useEffect(() => {
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "0px 0px -60% 0px" },
    );
    for (const h of headings) {
      const el = document.getElementById(`heading-${h.id}`);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  const scrollTo = (id: string) => {
    const el = document.getElementById(`heading-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
    }
  };

  return (
    <div className="hidden xl:block w-52 shrink-0">
      <div className="sticky top-24">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
          On this page
        </p>
        <nav aria-label="Table of contents">
          <ul className="space-y-1">
            {headings.map((h) => (
              <li key={h.id}>
                <button
                  type="button"
                  onClick={() => scrollTo(h.id)}
                  className={`block w-full text-left text-xs transition-colors duration-150 rounded px-2 py-1 truncate ${
                    activeId === h.id
                      ? "text-primary font-medium bg-primary/8"
                      : "text-muted-foreground hover:text-foreground"
                  } ${h.level === 2 ? "pl-4" : h.level === 3 ? "pl-6" : ""}`}
                  title={h.text}
                >
                  {h.text || "(untitled)"}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
