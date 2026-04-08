import {
  Bold,
  ChevronRight,
  Code,
  GripVertical,
  Italic,
  Link as LinkIcon,
  Strikethrough,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Block } from "../../types";
import type { BlockType } from "../../types";

// ── Helpers ────────────────────────────────────────────────────────────────

function makeId() {
  return `blk-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function makeBlock(type: BlockType, order: number): Block {
  return {
    id: makeId(),
    blockType: type,
    content: "",
    metadata: "",
    order: BigInt(order),
  };
}

// ── Markdown Shortcuts ──────────────────────────────────────────────────────

function applyMarkdownShortcut(
  value: string,
): { type: BlockType; content: string } | null {
  if (value === "* " || value === "- ")
    return { type: "bulletList", content: "" };
  if (value === "## ") return { type: "heading2", content: "" };
  if (value === "### ") return { type: "heading3", content: "" };
  if (value === "# ") return { type: "heading1", content: "" };
  if (value === "> ") return { type: "quote", content: "" };
  if (value === "``` ") return { type: "code", content: "" };
  return null;
}

// ── Floating Formatting Toolbar ────────────────────────────────────────────

interface FormattingToolbarProps {
  position: { top: number; left: number };
  onFormat: (
    format: "bold" | "italic" | "strikethrough" | "code" | "link",
  ) => void;
}

function FormattingToolbar({ position, onFormat }: FormattingToolbarProps) {
  return (
    <div
      className="fixed z-50 flex items-center gap-0.5 rounded-lg border border-border bg-popover shadow-xl px-1 py-1"
      style={{ top: position.top - 44, left: Math.max(8, position.left) }}
      onMouseDown={(e) => e.preventDefault()}
    >
      {[
        {
          key: "bold" as const,
          icon: <Bold className="h-3.5 w-3.5" />,
          label: "Bold",
        },
        {
          key: "italic" as const,
          icon: <Italic className="h-3.5 w-3.5" />,
          label: "Italic",
        },
        {
          key: "strikethrough" as const,
          icon: <Strikethrough className="h-3.5 w-3.5" />,
          label: "Strikethrough",
        },
        {
          key: "code" as const,
          icon: <Code className="h-3.5 w-3.5" />,
          label: "Inline code",
        },
        {
          key: "link" as const,
          icon: <LinkIcon className="h-3.5 w-3.5" />,
          label: "Link",
        },
      ].map(({ key, icon, label }) => (
        <button
          key={key}
          type="button"
          aria-label={label}
          title={label}
          onClick={() => onFormat(key)}
          className="h-7 w-7 flex items-center justify-center rounded-md text-foreground hover:bg-primary/10 hover:text-primary transition-colors duration-150"
        >
          {icon}
        </button>
      ))}
    </div>
  );
}

// ── Slash Menu ──────────────────────────────────────────────────────────────

const BLOCK_OPTIONS: {
  type: BlockType;
  label: string;
  icon: string;
  description: string;
}[] = [
  {
    type: "paragraph",
    label: "Text",
    icon: "T",
    description: "Plain paragraph text",
  },
  {
    type: "heading1",
    label: "Heading 1",
    icon: "H1",
    description: "Large section header",
  },
  {
    type: "heading2",
    label: "Heading 2",
    icon: "H2",
    description: "Medium section header",
  },
  {
    type: "heading3",
    label: "Heading 3",
    icon: "H3",
    description: "Small section header",
  },
  {
    type: "bulletList",
    label: "Bullet List",
    icon: "•",
    description: "Unordered list item",
  },
  {
    type: "numberedList",
    label: "Numbered List",
    icon: "1.",
    description: "Ordered list item",
  },
  {
    type: "toggle",
    label: "Toggle",
    icon: "▶",
    description: "Collapsible section",
  },
  {
    type: "callout",
    label: "Callout",
    icon: "💡",
    description: "Highlighted callout box",
  },
  {
    type: "code",
    label: "Code",
    icon: "</>",
    description: "Code block with syntax",
  },
  {
    type: "divider",
    label: "Divider",
    icon: "—",
    description: "Horizontal separator",
  },
  { type: "quote", label: "Quote", icon: "''", description: "Block quotation" },
  { type: "table", label: "Table", icon: "⊞", description: "Simple table" },
  { type: "image", label: "Image", icon: "🖼", description: "Embed an image" },
];

function SlashCommandMenu({
  query,
  onSelect,
  onClose,
  position,
}: {
  query: string;
  onSelect: (type: BlockType) => void;
  onClose: () => void;
  position: { top: number; left: number };
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const filtered = BLOCK_OPTIONS.filter(
    (o) => !query || o.label.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    setActiveIdx(0);
  }, []);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, filtered.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[activeIdx]) onSelect(filtered[activeIdx].type);
      }
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handler, true);
    return () => document.removeEventListener("keydown", handler, true);
  }, [filtered, activeIdx, onSelect, onClose]);

  if (filtered.length === 0) return null;

  return (
    <div
      className="fixed z-50 w-72 rounded-xl border border-border bg-popover shadow-xl overflow-hidden"
      style={{ top: position.top, left: position.left }}
    >
      <div className="px-3 py-2 border-b border-border">
        <p className="text-xs text-muted-foreground font-medium">
          BASIC BLOCKS
        </p>
      </div>
      <div className="max-h-64 overflow-y-auto py-1">
        {filtered.map((opt, idx) => (
          <button
            key={opt.type}
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              onSelect(opt.type);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors duration-150 ${idx === activeIdx ? "bg-primary/10 text-primary" : "hover:bg-muted text-foreground"}`}
          >
            <span className="w-8 h-8 rounded-md bg-muted flex items-center justify-center text-sm font-mono shrink-0 text-foreground">
              {opt.icon}
            </span>
            <div>
              <p className="text-sm font-medium leading-none mb-0.5">
                {opt.label}
              </p>
              <p className="text-xs text-muted-foreground">{opt.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Single Block ─────────────────────────────────────────────────────────────

const TYPE_TO_CLASS: Record<BlockType, string> = {
  paragraph: "text-base text-foreground leading-relaxed",
  heading1: "text-3xl font-bold text-foreground mt-4 mb-1 font-display",
  heading2: "text-2xl font-semibold text-foreground mt-3 mb-0.5 font-display",
  heading3: "text-xl font-medium text-foreground mt-2 font-display",
  bulletList:
    "text-base text-foreground before:content-['•'] before:mr-2 before:text-primary pl-5",
  numberedList: "text-base text-foreground pl-5 list-decimal",
  toggle: "text-base font-medium text-foreground",
  callout: "text-sm text-foreground",
  code: "text-sm font-mono text-foreground",
  divider: "",
  quote: "italic text-muted-foreground text-base",
  table: "text-sm text-foreground",
  image: "text-sm text-muted-foreground",
};

function renderFormattedContent(raw: string): string {
  return raw
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/~~(.+?)~~/g, "<s>$1</s>")
    .replace(
      /`(.+?)`/g,
      '<code class="bg-muted px-1 rounded text-xs font-mono">$1</code>',
    )
    .replace(
      /\[(.+?)\]\((.+?)\)/g,
      '<a href="$2" class="text-primary underline underline-offset-2 hover:text-primary/80" target="_blank" rel="noopener noreferrer">$1</a>',
    );
}

function BlockRow({
  block,
  index,
  isActive,
  readOnly,
  onFocus,
  onContentChange,
  onKeyDown,
  onTypeChange: _onTypeChange,
  onApplyFormat: _onApplyFormat,
}: {
  block: Block;
  index: number;
  isActive: boolean;
  readOnly: boolean;
  onFocus: () => void;
  onContentChange: (id: string, value: string) => void;
  onKeyDown: (
    e: React.KeyboardEvent<HTMLDivElement>,
    id: string,
    index: number,
  ) => void;
  onTypeChange: (id: string, type: BlockType) => void;
  onApplyFormat: (
    id: string,
    format: "bold" | "italic" | "strikethrough" | "code" | "link",
  ) => void;
}) {
  const [open, setOpen] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);
  const renderedRef = useRef<HTMLDivElement>(null);

  // Sync contenteditable with external content
  useEffect(() => {
    const el = divRef.current;
    if (!el || document.activeElement === el) return;
    if (el.textContent !== block.content) el.textContent = block.content;
  }, [block.content]);

  // Sync read-only rendered content
  useEffect(() => {
    if (readOnly && renderedRef.current) {
      renderedRef.current.innerHTML = renderFormattedContent(block.content);
    }
  }, [readOnly, block.content]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    onContentChange(block.id, e.currentTarget.textContent ?? "");
  };

  const baseProps = {
    ref: divRef,
    contentEditable: !readOnly,
    suppressContentEditableWarning: true,
    onFocus,
    onInput: handleInput,
    onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) =>
      onKeyDown(e, block.id, index),
    "data-placeholder": "Type '/' for commands…",
    className: "outline-none min-h-[1.5em] break-words",
  };

  const wrapClass = `group relative flex items-start gap-1 rounded-sm px-2 py-0.5 transition-colors ${isActive ? "bg-primary/5" : "hover:bg-muted/50"}`;
  const DragHandle = () => (
    <span
      className="opacity-0 group-hover:opacity-40 cursor-grab active:cursor-grabbing shrink-0 mt-1 text-muted-foreground transition-opacity duration-150"
      aria-hidden
    >
      <GripVertical className="h-4 w-4" />
    </span>
  );

  const typeClass = TYPE_TO_CLASS[block.blockType];

  if (block.blockType === "divider") {
    return (
      <div className={wrapClass}>
        <DragHandle />
        <hr className="flex-1 my-2 border-border" />
      </div>
    );
  }

  if (block.blockType === "toggle") {
    return (
      <div className={wrapClass}>
        <DragHandle />
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={open ? "Collapse" : "Expand"}
            >
              <ChevronRight
                className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
              />
            </button>
            <div
              {...baseProps}
              className={`${baseProps.className} text-base font-medium text-foreground flex-1`}
            />
          </div>
          {open && (
            <div className="ml-6 mt-1 pl-3 border-l-2 border-border text-sm text-muted-foreground">
              <span className="italic text-xs">
                Toggle content — click to expand
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (block.blockType === "callout") {
    return (
      <div className={wrapClass}>
        <DragHandle />
        <div className="flex-1 flex items-start gap-3 rounded-lg bg-primary/8 border border-primary/20 px-4 py-3 my-0.5">
          <span className="text-xl shrink-0">{block.metadata || "💡"}</span>
          <div
            {...baseProps}
            className={`${baseProps.className} text-sm text-foreground flex-1`}
          />
        </div>
      </div>
    );
  }

  if (block.blockType === "code") {
    const lang = block.metadata || "code";
    return (
      <div className={wrapClass}>
        <DragHandle />
        <div className="flex-1 relative rounded-lg bg-muted/80 border border-border my-0.5 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-1.5 border-b border-border/60">
            <span className="text-xs text-muted-foreground font-mono">
              {lang}
            </span>
          </div>
          <div
            {...baseProps}
            className={`${baseProps.className} px-4 py-3 text-sm font-mono text-foreground whitespace-pre`}
          />
        </div>
      </div>
    );
  }

  if (block.blockType === "quote") {
    return (
      <div className={wrapClass}>
        <DragHandle />
        <div className="flex-1 border-l-4 border-primary pl-4 py-1 my-0.5">
          <div
            {...baseProps}
            className={`${baseProps.className} italic text-muted-foreground text-base`}
          />
        </div>
      </div>
    );
  }

  if (block.blockType === "image") {
    const src = block.metadata || "";
    return (
      <div className={wrapClass}>
        <DragHandle />
        <div className="flex-1 my-0.5">
          {src ? (
            <figure>
              <img
                src={src}
                alt={block.content || "Page image"}
                className="rounded-lg max-w-full object-cover"
              />
              {block.content && (
                <figcaption className="text-xs text-muted-foreground mt-1.5 text-center">
                  {block.content}
                </figcaption>
              )}
            </figure>
          ) : (
            <div className="rounded-lg border-2 border-dashed border-border p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Paste an image URL in the caption field
              </p>
              <div
                {...baseProps}
                className={`${baseProps.className} text-sm text-muted-foreground mt-2 text-center`}
                data-placeholder="Image URL or caption…"
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  if (readOnly && block.content) {
    return (
      <div className={wrapClass}>
        <DragHandle />
        <div
          ref={renderedRef}
          className={`flex-1 ${typeClass} min-h-[1.5em] break-words`}
        />
      </div>
    );
  }

  return (
    <div className={wrapClass}>
      <DragHandle />
      <div
        {...baseProps}
        className={`flex-1 ${typeClass} ${baseProps.className} empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/50 empty:before:pointer-events-none`}
      />
    </div>
  );
}

// ── Table of Contents ─────────────────────────────────────────────────────────

interface TocEntry {
  id: string;
  level: 1 | 2 | 3;
  text: string;
}

function TableOfContents({
  entries,
  onNavigate,
}: { entries: TocEntry[]; onNavigate: (id: string) => void }) {
  if (entries.length < 3) return null;
  return (
    <div className="hidden lg:block w-48 xl:w-56 shrink-0">
      <div className="sticky top-4 rounded-xl border border-border/60 bg-card/60 p-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          On this page
        </p>
        <nav className="space-y-0.5">
          {entries.map((e) => (
            <button
              key={e.id}
              type="button"
              onClick={() => onNavigate(e.id)}
              className={`w-full text-left text-xs py-0.5 hover:text-primary transition-colors duration-150 truncate ${e.level === 1 ? "text-foreground font-medium" : e.level === 2 ? "pl-3 text-muted-foreground" : "pl-5 text-muted-foreground/80"}`}
            >
              {e.text || `Heading ${e.level}`}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

// ── Main BlockEditor ─────────────────────────────────────────────────────────

interface BlockEditorProps {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
  readOnly?: boolean;
}

export function BlockEditor({
  blocks: initialBlocks,
  onChange,
  readOnly = false,
}: BlockEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>(() =>
    initialBlocks.length > 0 ? initialBlocks : [makeBlock("paragraph", 0)],
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const [slashMenu, setSlashMenu] = useState<{
    blockId: string;
    query: string;
    position: { top: number; left: number };
  } | null>(null);
  const [formattingToolbar, setFormattingToolbar] = useState<{
    position: { top: number; left: number };
    blockId: string;
  } | null>(null);

  useEffect(() => {
    if (initialBlocks.length > 0) setBlocks(initialBlocks);
  }, [initialBlocks]);

  const update = (next: Block[]) => {
    setBlocks(next);
    onChange(next);
  };

  // Table of contents derived from heading blocks
  const tocEntries: TocEntry[] = blocks
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

  const navigateToBlock = useCallback((blockId: string) => {
    const el = document.querySelector(
      `[data-block-id="${blockId}"]`,
    ) as HTMLElement | null;
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  const handleContentChange = (id: string, value: string) => {
    const next = blocks.map((b) =>
      b.id === id ? { ...b, content: value } : b,
    );

    // Markdown shortcut detection
    const shortcut = applyMarkdownShortcut(value);
    if (shortcut) {
      const converted = next.map((b) =>
        b.id === id
          ? { ...b, blockType: shortcut.type, content: shortcut.content }
          : b,
      );
      setSlashMenu(null);
      update(converted);
      setTimeout(() => {
        const el = document.querySelector(
          `[data-block-id="${id}"]`,
        ) as HTMLElement | null;
        if (el) {
          el.textContent = "";
          el.focus();
        }
      }, 0);
      return;
    }

    // Slash command detection
    if (value.startsWith("/")) {
      const query = value.slice(1);
      const el = document.querySelector(
        `[data-block-id="${id}"]`,
      ) as HTMLElement | null;
      if (el) {
        const rect = el.getBoundingClientRect();
        setSlashMenu({
          blockId: id,
          query,
          position: { top: rect.bottom + 4, left: rect.left },
        });
      }
    } else {
      setSlashMenu(null);
    }
    update(next);
  };

  const handleTypeChange = (id: string, type: BlockType) => {
    const next = blocks.map((b) =>
      b.id === id ? { ...b, blockType: type, content: "" } : b,
    );
    setSlashMenu(null);
    update(next);
  };

  const insertSlashBlock = (type: BlockType) => {
    if (!slashMenu) return;
    handleTypeChange(slashMenu.blockId, type);
  };

  // Text selection → formatting toolbar
  const handleSelectionChange = useCallback(() => {
    if (readOnly) return;
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.toString().trim()) {
      setFormattingToolbar(null);
      return;
    }
    // Only show if selection is inside a block
    const range = sel.getRangeAt(0);
    const container = range.commonAncestorContainer;
    const blockEl = (
      container instanceof Element ? container : container.parentElement
    )?.closest("[data-block-id]");
    if (!blockEl) {
      setFormattingToolbar(null);
      return;
    }
    const blockId = blockEl.getAttribute("data-block-id") ?? "";
    const rect = range.getBoundingClientRect();
    setFormattingToolbar({
      position: {
        top: rect.top + window.scrollY,
        left: rect.left + rect.width / 2 - 100,
      },
      blockId,
    });
  }, [readOnly]);

  useEffect(() => {
    document.addEventListener("selectionchange", handleSelectionChange);
    return () =>
      document.removeEventListener("selectionchange", handleSelectionChange);
  }, [handleSelectionChange]);

  const applyFormat = (
    blockId: string,
    format: "bold" | "italic" | "strikethrough" | "code" | "link",
  ) => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return;
    const selectedText = sel.toString();
    if (!selectedText) return;

    let wrapped = "";
    if (format === "bold") wrapped = `**${selectedText}**`;
    else if (format === "italic") wrapped = `*${selectedText}*`;
    else if (format === "strikethrough") wrapped = `~~${selectedText}~~`;
    else if (format === "code") wrapped = `\`${selectedText}\``;
    else if (format === "link") {
      const url = prompt("Enter URL:", "https://");
      if (!url) return;
      wrapped = `[${selectedText}](${url})`;
    }

    const block = blocks.find((b) => b.id === blockId);
    if (!block) return;
    const newContent = block.content.replace(selectedText, wrapped);
    const next = blocks.map((b) =>
      b.id === blockId ? { ...b, content: newContent } : b,
    );
    update(next);
    setFormattingToolbar(null);

    // Sync the DOM element
    setTimeout(() => {
      const el = document.querySelector(
        `[data-block-id="${blockId}"]`,
      ) as HTMLElement | null;
      if (el && document.activeElement !== el) el.textContent = newContent;
    }, 0);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    id: string,
    index: number,
  ) => {
    if (slashMenu) return;

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const newBlock = makeBlock("paragraph", index + 1);
      const next = [
        ...blocks.slice(0, index + 1),
        newBlock,
        ...blocks
          .slice(index + 1)
          .map((b) => ({ ...b, order: b.order + BigInt(1) })),
      ];
      update(next);
      setTimeout(() => {
        const el = document.querySelector(
          `[data-block-id="${newBlock.id}"]`,
        ) as HTMLElement | null;
        el?.focus();
      }, 0);
    }

    if (
      e.key === "Backspace" &&
      blocks[index]?.content === "" &&
      blocks.length > 1
    ) {
      e.preventDefault();
      const next = blocks.filter((b) => b.id !== id);
      update(next);
      setTimeout(() => {
        if (index > 0) {
          const prevId = blocks[index - 1]?.id;
          const el = document.querySelector(
            `[data-block-id="${prevId}"]`,
          ) as HTMLElement | null;
          el?.focus();
          const range = document.createRange();
          const sel = window.getSelection();
          if (el && sel) {
            range.selectNodeContents(el);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
          }
        }
      }, 0);
    }
  };

  return (
    <div className="flex gap-6 w-full">
      <div className="flex-1 min-w-0 relative">
        <div className="space-y-0.5">
          {blocks.map((block, index) => (
            <div key={block.id} data-block-id={block.id}>
              <BlockRow
                block={block}
                index={index}
                isActive={activeId === block.id}
                readOnly={readOnly}
                onFocus={() => setActiveId(block.id)}
                onContentChange={handleContentChange}
                onKeyDown={handleKeyDown}
                onTypeChange={handleTypeChange}
                onApplyFormat={applyFormat}
              />
            </div>
          ))}
        </div>

        {slashMenu && !readOnly && (
          <SlashCommandMenu
            query={slashMenu.query}
            position={slashMenu.position}
            onSelect={insertSlashBlock}
            onClose={() => setSlashMenu(null)}
          />
        )}

        {formattingToolbar && !readOnly && (
          <FormattingToolbar
            position={formattingToolbar.position}
            onFormat={(fmt) => applyFormat(formattingToolbar.blockId, fmt)}
          />
        )}
      </div>

      <TableOfContents entries={tocEntries} onNavigate={navigateToBlock} />
    </div>
  );
}
