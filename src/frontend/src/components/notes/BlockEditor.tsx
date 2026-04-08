import { ChevronRight, GripVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
      if (e.key === "Escape") {
        onClose();
      }
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
            className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors duration-150 ${
              idx === activeIdx
                ? "bg-primary/10 text-primary"
                : "hover:bg-muted text-foreground"
            }`}
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

function BlockRow({
  block,
  index,
  isActive,
  readOnly,
  onFocus,
  onContentChange,
  onKeyDown,
  onTypeChange: _onTypeChange,
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
}) {
  const [open, setOpen] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);

  // Sync content from external changes
  useEffect(() => {
    const el = divRef.current;
    if (!el || document.activeElement === el) return;
    if (el.textContent !== block.content) {
      el.textContent = block.content;
    }
  }, [block.content]);

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

  const wrapClass = `group relative flex items-start gap-1 rounded-sm px-2 py-0.5 transition-colors ${
    isActive ? "bg-primary/5" : "hover:bg-muted/50"
  }`;

  const DragHandle = () => (
    <span
      className="opacity-0 group-hover:opacity-40 cursor-grab active:cursor-grabbing shrink-0 mt-1 text-muted-foreground transition-opacity duration-150"
      aria-hidden
    >
      <GripVertical className="h-4 w-4" />
    </span>
  );

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
            <button
              type="button"
              onClick={() => {
                const newLang = prompt(
                  "Language (e.g. javascript, python):",
                  lang,
                );
                if (newLang !== null) {
                  // metadata update via onTypeChange hack — store in block
                }
              }}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Change language
            </button>
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

  const typeToClass: Record<BlockType, string> = {
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

  return (
    <div className={wrapClass}>
      <DragHandle />
      <div
        {...baseProps}
        className={`flex-1 ${typeToClass[block.blockType]} ${baseProps.className} empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/50 empty:before:pointer-events-none`}
      />
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

  // Sync incoming blocks from parent (e.g., after load)
  useEffect(() => {
    if (initialBlocks.length > 0) {
      setBlocks(initialBlocks);
    }
  }, [initialBlocks]);

  const update = (next: Block[]) => {
    setBlocks(next);
    onChange(next);
  };

  const handleContentChange = (id: string, value: string) => {
    const next = blocks.map((b) =>
      b.id === id ? { ...b, content: value } : b,
    );
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

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    id: string,
    index: number,
  ) => {
    if (slashMenu) return; // let slash menu handle keys

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
      // Focus new block after render
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
      // Focus previous
      setTimeout(() => {
        if (index > 0) {
          const prevId = blocks[index - 1]?.id;
          const el = document.querySelector(
            `[data-block-id="${prevId}"]`,
          ) as HTMLElement | null;
          el?.focus();
          // move cursor to end
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
    <div className="relative w-full">
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
    </div>
  );
}
