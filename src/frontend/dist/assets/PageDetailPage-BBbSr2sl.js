import { t as createLucideIcon, r as reactExports, f as useWorkspace, h as useQuery, j as jsxRuntimeExports, ac as ChevronDown, i as Link$1, B as Button, d as useNavigate, F as FileText, P as Plus, m as useParams, n as useQueryClient } from "./index-CQ7TXF2a.js";
import { S as Skeleton } from "./skeleton-CzZABium.js";
import { u as useMutation } from "./useMutation-fGi-GboX.js";
import { u as ue } from "./index-BGFcG_k-.js";
import { u as useBackend } from "./index--h8TKSCt.js";
import { L as Link2 } from "./link-2-Vn75IhwF.js";
import { C as ChevronRight } from "./chevron-right-XUDdRA1-.js";
import { B as Bold, I as Italic, C as Code } from "./italic-B5o8gq_t.js";
import { G as GripVertical } from "./grip-vertical-QphBxXRv.js";
import { I as Input } from "./input-Dkit6sfw.js";
import { A as ArrowLeft } from "./arrow-left-D6cz-lXM.js";
import { S as Save } from "./save-DJl3ZDfM.js";
import { C as Copy } from "./copy-D2FV6GwB.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71", key: "1cjeqo" }],
  ["path", { d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71", key: "19qd67" }]
];
const Link = createLucideIcon("link", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M9 3v18", key: "fh3hqa" }],
  ["path", { d: "m16 15-3-3 3-3", key: "14y99z" }]
];
const PanelLeftClose = createLucideIcon("panel-left-close", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M9 3v18", key: "fh3hqa" }],
  ["path", { d: "m14 9 3 3-3 3", key: "8010ee" }]
];
const PanelLeftOpen = createLucideIcon("panel-left-open", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 4H9a3 3 0 0 0-2.83 4", key: "43sutm" }],
  ["path", { d: "M14 12a4 4 0 0 1 0 8H6", key: "nlfj13" }],
  ["line", { x1: "4", x2: "20", y1: "12", y2: "12", key: "1e0a9i" }]
];
const Strikethrough = createLucideIcon("strikethrough", __iconNode);
function BacklinksPanel({ pageId, tenantId }) {
  const [open, setOpen] = reactExports.useState(true);
  const { actor, isFetching } = useBackend();
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const { data: backlinks = [], isLoading } = useQuery({
    queryKey: ["backlinks", tenantId, workspaceId, pageId],
    queryFn: async () => {
      if (!actor) return [];
      const pages = await actor.listPages(tenantId, workspaceId, null);
      return pages.filter(
        (p) => p.blocks.some(
          (b) => b.content.includes(pageId) || b.metadata.includes(pageId)
        )
      );
    },
    enabled: !!actor && !isFetching && !!pageId && !!workspaceId
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border mt-8 pt-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => setOpen((o) => !o),
        className: "flex items-center gap-2 w-full text-left group",
        "data-ocid": "backlinks-toggle",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "h-4 w-4 text-muted-foreground shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground flex-1", children: backlinks.length > 0 ? `${backlinks.length} Backlink${backlinks.length !== 1 ? "s" : ""}` : "Backlinks" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ChevronDown,
            {
              className: `h-4 w-4 text-muted-foreground transition-transform duration-200 ${open ? "" : "-rotate-90"}`
            }
          )
        ]
      }
    ),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 space-y-1", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground px-1", children: "Loading…" }) : backlinks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground px-1 italic", children: "No pages link to this page yet" }) : backlinks.map((page) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link$1,
      {
        to: "/app/$workspaceId/pages/$pageId",
        params: { workspaceId, pageId: page.id },
        className: "flex items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-muted transition-colors duration-150 group",
        "data-ocid": `backlink-${page.id}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: page.icon || "📄" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground truncate group-hover:text-primary transition-colors duration-150", children: page.title || "Untitled" })
        ]
      },
      page.id
    )) })
  ] });
}
function makeId() {
  return `blk-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
function makeBlock(type, order) {
  return {
    id: makeId(),
    blockType: type,
    content: "",
    metadata: "",
    order: BigInt(order)
  };
}
function applyMarkdownShortcut(value) {
  if (value === "* " || value === "- ")
    return { type: "bulletList", content: "" };
  if (value === "## ") return { type: "heading2", content: "" };
  if (value === "### ") return { type: "heading3", content: "" };
  if (value === "# ") return { type: "heading1", content: "" };
  if (value === "> ") return { type: "quote", content: "" };
  if (value === "``` ") return { type: "code", content: "" };
  return null;
}
function FormattingToolbar({ position, onFormat }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed z-50 flex items-center gap-0.5 rounded-lg border border-border bg-popover shadow-xl px-1 py-1",
      style: { top: position.top - 44, left: Math.max(8, position.left) },
      onMouseDown: (e) => e.preventDefault(),
      children: [
        {
          key: "bold",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Bold, { className: "h-3.5 w-3.5" }),
          label: "Bold"
        },
        {
          key: "italic",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Italic, { className: "h-3.5 w-3.5" }),
          label: "Italic"
        },
        {
          key: "strikethrough",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Strikethrough, { className: "h-3.5 w-3.5" }),
          label: "Strikethrough"
        },
        {
          key: "code",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Code, { className: "h-3.5 w-3.5" }),
          label: "Inline code"
        },
        {
          key: "link",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { className: "h-3.5 w-3.5" }),
          label: "Link"
        }
      ].map(({ key, icon, label }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          "aria-label": label,
          title: label,
          onClick: () => onFormat(key),
          className: "h-7 w-7 flex items-center justify-center rounded-md text-foreground hover:bg-primary/10 hover:text-primary transition-colors duration-150",
          children: icon
        },
        key
      ))
    }
  );
}
const BLOCK_OPTIONS = [
  {
    type: "paragraph",
    label: "Text",
    icon: "T",
    description: "Plain paragraph text"
  },
  {
    type: "heading1",
    label: "Heading 1",
    icon: "H1",
    description: "Large section header"
  },
  {
    type: "heading2",
    label: "Heading 2",
    icon: "H2",
    description: "Medium section header"
  },
  {
    type: "heading3",
    label: "Heading 3",
    icon: "H3",
    description: "Small section header"
  },
  {
    type: "bulletList",
    label: "Bullet List",
    icon: "•",
    description: "Unordered list item"
  },
  {
    type: "numberedList",
    label: "Numbered List",
    icon: "1.",
    description: "Ordered list item"
  },
  {
    type: "toggle",
    label: "Toggle",
    icon: "▶",
    description: "Collapsible section"
  },
  {
    type: "callout",
    label: "Callout",
    icon: "💡",
    description: "Highlighted callout box"
  },
  {
    type: "code",
    label: "Code",
    icon: "</>",
    description: "Code block with syntax"
  },
  {
    type: "divider",
    label: "Divider",
    icon: "—",
    description: "Horizontal separator"
  },
  { type: "quote", label: "Quote", icon: "''", description: "Block quotation" },
  { type: "table", label: "Table", icon: "⊞", description: "Simple table" },
  { type: "image", label: "Image", icon: "🖼", description: "Embed an image" }
];
function SlashCommandMenu({
  query,
  onSelect,
  onClose,
  position
}) {
  const [activeIdx, setActiveIdx] = reactExports.useState(0);
  const filtered = BLOCK_OPTIONS.filter(
    (o) => !query || o.label.toLowerCase().includes(query.toLowerCase())
  );
  reactExports.useEffect(() => {
    setActiveIdx(0);
  }, []);
  reactExports.useEffect(() => {
    function handler(e) {
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "fixed z-50 w-72 rounded-xl border border-border bg-popover shadow-xl overflow-hidden",
      style: { top: position.top, left: position.left },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-2 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium", children: "BASIC BLOCKS" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-64 overflow-y-auto py-1", children: filtered.map((opt, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onMouseDown: (e) => {
              e.preventDefault();
              onSelect(opt.type);
            },
            className: `w-full flex items-center gap-3 px-3 py-2 text-left transition-colors duration-150 ${idx === activeIdx ? "bg-primary/10 text-primary" : "hover:bg-muted text-foreground"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-8 h-8 rounded-md bg-muted flex items-center justify-center text-sm font-mono shrink-0 text-foreground", children: opt.icon }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium leading-none mb-0.5", children: opt.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: opt.description })
              ] })
            ]
          },
          opt.type
        )) })
      ]
    }
  );
}
const TYPE_TO_CLASS = {
  paragraph: "text-base text-foreground leading-relaxed",
  heading1: "text-3xl font-bold text-foreground mt-4 mb-1 font-display",
  heading2: "text-2xl font-semibold text-foreground mt-3 mb-0.5 font-display",
  heading3: "text-xl font-medium text-foreground mt-2 font-display",
  bulletList: "text-base text-foreground before:content-['•'] before:mr-2 before:text-primary pl-5",
  numberedList: "text-base text-foreground pl-5 list-decimal",
  toggle: "text-base font-medium text-foreground",
  callout: "text-sm text-foreground",
  code: "text-sm font-mono text-foreground",
  divider: "",
  quote: "italic text-muted-foreground text-base",
  table: "text-sm text-foreground",
  image: "text-sm text-muted-foreground"
};
function renderFormattedContent(raw) {
  return raw.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>").replace(/~~(.+?)~~/g, "<s>$1</s>").replace(
    /`(.+?)`/g,
    '<code class="bg-muted px-1 rounded text-xs font-mono">$1</code>'
  ).replace(
    /\[(.+?)\]\((.+?)\)/g,
    '<a href="$2" class="text-primary underline underline-offset-2 hover:text-primary/80" target="_blank" rel="noopener noreferrer">$1</a>'
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
  onApplyFormat: _onApplyFormat
}) {
  const [open, setOpen] = reactExports.useState(false);
  const divRef = reactExports.useRef(null);
  const renderedRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const el = divRef.current;
    if (!el || document.activeElement === el) return;
    if (el.textContent !== block.content) el.textContent = block.content;
  }, [block.content]);
  reactExports.useEffect(() => {
    if (readOnly && renderedRef.current) {
      renderedRef.current.innerHTML = renderFormattedContent(block.content);
    }
  }, [readOnly, block.content]);
  const handleInput = (e) => {
    onContentChange(block.id, e.currentTarget.textContent ?? "");
  };
  const baseProps = {
    ref: divRef,
    contentEditable: !readOnly,
    suppressContentEditableWarning: true,
    onFocus,
    onInput: handleInput,
    onKeyDown: (e) => onKeyDown(e, block.id, index),
    "data-placeholder": "Type '/' for commands…",
    className: "outline-none min-h-[1.5em] break-words"
  };
  const wrapClass = `group relative flex items-start gap-1 rounded-sm px-2 py-0.5 transition-colors ${isActive ? "bg-primary/5" : "hover:bg-muted/50"}`;
  const DragHandle = () => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: "opacity-0 group-hover:opacity-40 cursor-grab active:cursor-grabbing shrink-0 mt-1 text-muted-foreground transition-opacity duration-150",
      "aria-hidden": true,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { className: "h-4 w-4" })
    }
  );
  const typeClass = TYPE_TO_CLASS[block.blockType];
  if (block.blockType === "divider") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: wrapClass, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DragHandle, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("hr", { className: "flex-1 my-2 border-border" })
    ] });
  }
  if (block.blockType === "toggle") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: wrapClass, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DragHandle, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setOpen((o) => !o),
              className: "shrink-0 text-muted-foreground hover:text-foreground transition-colors",
              "aria-label": open ? "Collapse" : "Expand",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                ChevronRight,
                {
                  className: `h-4 w-4 transition-transform duration-200 ${open ? "rotate-90" : ""}`
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              ...baseProps,
              className: `${baseProps.className} text-base font-medium text-foreground flex-1`
            }
          )
        ] }),
        open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-6 mt-1 pl-3 border-l-2 border-border text-sm text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "italic text-xs", children: "Toggle content — click to expand" }) })
      ] })
    ] });
  }
  if (block.blockType === "callout") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: wrapClass, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DragHandle, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex items-start gap-3 rounded-lg bg-primary/8 border border-primary/20 px-4 py-3 my-0.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl shrink-0", children: block.metadata || "💡" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            ...baseProps,
            className: `${baseProps.className} text-sm text-foreground flex-1`
          }
        )
      ] })
    ] });
  }
  if (block.blockType === "code") {
    const lang = block.metadata || "code";
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: wrapClass, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DragHandle, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 relative rounded-lg bg-muted/80 border border-border my-0.5 overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between px-4 py-1.5 border-b border-border/60", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-mono", children: lang }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            ...baseProps,
            className: `${baseProps.className} px-4 py-3 text-sm font-mono text-foreground whitespace-pre`
          }
        )
      ] })
    ] });
  }
  if (block.blockType === "quote") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: wrapClass, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DragHandle, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 border-l-4 border-primary pl-4 py-1 my-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          ...baseProps,
          className: `${baseProps.className} italic text-muted-foreground text-base`
        }
      ) })
    ] });
  }
  if (block.blockType === "image") {
    const src = block.metadata || "";
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: wrapClass, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DragHandle, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 my-0.5", children: src ? /* @__PURE__ */ jsxRuntimeExports.jsxs("figure", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src,
            alt: block.content || "Page image",
            className: "rounded-lg max-w-full object-cover"
          }
        ),
        block.content && /* @__PURE__ */ jsxRuntimeExports.jsx("figcaption", { className: "text-xs text-muted-foreground mt-1.5 text-center", children: block.content })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border-2 border-dashed border-border p-8 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Paste an image URL in the caption field" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            ...baseProps,
            className: `${baseProps.className} text-sm text-muted-foreground mt-2 text-center`,
            "data-placeholder": "Image URL or caption…"
          }
        )
      ] }) })
    ] });
  }
  if (readOnly && block.content) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: wrapClass, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DragHandle, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          ref: renderedRef,
          className: `flex-1 ${typeClass} min-h-[1.5em] break-words`
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: wrapClass, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DragHandle, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        ...baseProps,
        className: `flex-1 ${typeClass} ${baseProps.className} empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/50 empty:before:pointer-events-none`
      }
    )
  ] });
}
function TableOfContents$1({
  entries,
  onNavigate
}) {
  if (entries.length < 3) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden lg:block w-48 xl:w-56 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-4 rounded-xl border border-border/60 bg-card/60 p-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2", children: "On this page" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "space-y-0.5", children: entries.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => onNavigate(e.id),
        className: `w-full text-left text-xs py-0.5 hover:text-primary transition-colors duration-150 truncate ${e.level === 1 ? "text-foreground font-medium" : e.level === 2 ? "pl-3 text-muted-foreground" : "pl-5 text-muted-foreground/80"}`,
        children: e.text || `Heading ${e.level}`
      },
      e.id
    )) })
  ] }) });
}
function BlockEditor({
  blocks: initialBlocks,
  onChange,
  readOnly = false
}) {
  const [blocks, setBlocks] = reactExports.useState(
    () => initialBlocks.length > 0 ? initialBlocks : [makeBlock("paragraph", 0)]
  );
  const [activeId, setActiveId] = reactExports.useState(null);
  const [slashMenu, setSlashMenu] = reactExports.useState(null);
  const [formattingToolbar, setFormattingToolbar] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (initialBlocks.length > 0) setBlocks(initialBlocks);
  }, [initialBlocks]);
  const update = (next) => {
    setBlocks(next);
    onChange(next);
  };
  const tocEntries = blocks.filter(
    (b) => b.blockType === "heading1" || b.blockType === "heading2" || b.blockType === "heading3"
  ).map((b) => ({
    id: b.id,
    level: b.blockType === "heading1" ? 1 : b.blockType === "heading2" ? 2 : 3,
    text: b.content
  }));
  const navigateToBlock = reactExports.useCallback((blockId) => {
    const el = document.querySelector(
      `[data-block-id="${blockId}"]`
    );
    el == null ? void 0 : el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);
  const handleContentChange = (id, value) => {
    const next = blocks.map(
      (b) => b.id === id ? { ...b, content: value } : b
    );
    const shortcut = applyMarkdownShortcut(value);
    if (shortcut) {
      const converted = next.map(
        (b) => b.id === id ? { ...b, blockType: shortcut.type, content: shortcut.content } : b
      );
      setSlashMenu(null);
      update(converted);
      setTimeout(() => {
        const el = document.querySelector(
          `[data-block-id="${id}"]`
        );
        if (el) {
          el.textContent = "";
          el.focus();
        }
      }, 0);
      return;
    }
    if (value.startsWith("/")) {
      const query = value.slice(1);
      const el = document.querySelector(
        `[data-block-id="${id}"]`
      );
      if (el) {
        const rect = el.getBoundingClientRect();
        setSlashMenu({
          blockId: id,
          query,
          position: { top: rect.bottom + 4, left: rect.left }
        });
      }
    } else {
      setSlashMenu(null);
    }
    update(next);
  };
  const handleTypeChange = (id, type) => {
    const next = blocks.map(
      (b) => b.id === id ? { ...b, blockType: type, content: "" } : b
    );
    setSlashMenu(null);
    update(next);
  };
  const insertSlashBlock = (type) => {
    if (!slashMenu) return;
    handleTypeChange(slashMenu.blockId, type);
  };
  const handleSelectionChange = reactExports.useCallback(() => {
    var _a;
    if (readOnly) return;
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.toString().trim()) {
      setFormattingToolbar(null);
      return;
    }
    const range = sel.getRangeAt(0);
    const container = range.commonAncestorContainer;
    const blockEl = (_a = container instanceof Element ? container : container.parentElement) == null ? void 0 : _a.closest("[data-block-id]");
    if (!blockEl) {
      setFormattingToolbar(null);
      return;
    }
    const blockId = blockEl.getAttribute("data-block-id") ?? "";
    const rect = range.getBoundingClientRect();
    setFormattingToolbar({
      position: {
        top: rect.top + window.scrollY,
        left: rect.left + rect.width / 2 - 100
      },
      blockId
    });
  }, [readOnly]);
  reactExports.useEffect(() => {
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, [handleSelectionChange]);
  const applyFormat = (blockId, format) => {
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
    const next = blocks.map(
      (b) => b.id === blockId ? { ...b, content: newContent } : b
    );
    update(next);
    setFormattingToolbar(null);
    setTimeout(() => {
      const el = document.querySelector(
        `[data-block-id="${blockId}"]`
      );
      if (el && document.activeElement !== el) el.textContent = newContent;
    }, 0);
  };
  const handleKeyDown = (e, id, index) => {
    var _a;
    if (slashMenu) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const newBlock = makeBlock("paragraph", index + 1);
      const next = [
        ...blocks.slice(0, index + 1),
        newBlock,
        ...blocks.slice(index + 1).map((b) => ({ ...b, order: b.order + BigInt(1) }))
      ];
      update(next);
      setTimeout(() => {
        const el = document.querySelector(
          `[data-block-id="${newBlock.id}"]`
        );
        el == null ? void 0 : el.focus();
      }, 0);
    }
    if (e.key === "Backspace" && ((_a = blocks[index]) == null ? void 0 : _a.content) === "" && blocks.length > 1) {
      e.preventDefault();
      const next = blocks.filter((b) => b.id !== id);
      update(next);
      setTimeout(() => {
        var _a2;
        if (index > 0) {
          const prevId = (_a2 = blocks[index - 1]) == null ? void 0 : _a2.id;
          const el = document.querySelector(
            `[data-block-id="${prevId}"]`
          );
          el == null ? void 0 : el.focus();
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-6 w-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-0.5", children: blocks.map((block, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-block-id": block.id, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        BlockRow,
        {
          block,
          index,
          isActive: activeId === block.id,
          readOnly,
          onFocus: () => setActiveId(block.id),
          onContentChange: handleContentChange,
          onKeyDown: handleKeyDown,
          onTypeChange: handleTypeChange,
          onApplyFormat: applyFormat
        }
      ) }, block.id)) }),
      slashMenu && !readOnly && /* @__PURE__ */ jsxRuntimeExports.jsx(
        SlashCommandMenu,
        {
          query: slashMenu.query,
          position: slashMenu.position,
          onSelect: insertSlashBlock,
          onClose: () => setSlashMenu(null)
        }
      ),
      formattingToolbar && !readOnly && /* @__PURE__ */ jsxRuntimeExports.jsx(
        FormattingToolbar,
        {
          position: formattingToolbar.position,
          onFormat: (fmt) => applyFormat(formattingToolbar.blockId, fmt)
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableOfContents$1, { entries: tocEntries, onNavigate: navigateToBlock })
  ] });
}
const EMOJI_OPTIONS = [
  "📄",
  "📝",
  "🗒️",
  "📋",
  "🗓️",
  "💡",
  "🎯",
  "🔖",
  "🏠",
  "⭐",
  "📌",
  "🚀",
  "💼",
  "🔍",
  "📊",
  "🎨",
  "⚙️",
  "💬",
  "🌟",
  "🔥",
  "✅",
  "📚",
  "🧠",
  "🎉",
  "🏆",
  "📈",
  "🌐",
  "🔐",
  "💡",
  "🎵"
];
function CoverImagePicker({
  coverUrl,
  icon,
  onIconChange,
  onCoverChange
}) {
  const [showIconPicker, setShowIconPicker] = reactExports.useState(false);
  const [showCoverInput, setShowCoverInput] = reactExports.useState(false);
  const [coverInput, setCoverInput] = reactExports.useState(coverUrl ?? "");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
    coverUrl ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group relative h-48 w-full overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: coverUrl,
          alt: "Page cover",
          className: "h-full w-full object-cover"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-200 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "secondary",
            size: "sm",
            onClick: () => setShowCoverInput(true),
            className: "text-xs",
            children: "Change cover"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "secondary",
            size: "sm",
            onClick: () => onCoverChange(""),
            className: "text-xs",
            children: "Remove cover"
          }
        )
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-full" }),
    showCoverInput && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-2 px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          value: coverInput,
          onChange: (e) => setCoverInput(e.target.value),
          placeholder: "Paste image URL…",
          className: "text-sm",
          "data-ocid": "cover-url-input"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          size: "sm",
          onClick: () => {
            onCoverChange(coverInput);
            setShowCoverInput(false);
          },
          children: "Apply"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          type: "button",
          size: "sm",
          variant: "ghost",
          onClick: () => setShowCoverInput(false),
          children: "Cancel"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-end gap-4 px-6 mt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setShowIconPicker((s) => !s),
            className: "text-5xl leading-none p-1 rounded-xl hover:bg-muted transition-colors duration-150",
            "aria-label": "Change page icon",
            "data-ocid": "page-icon-btn",
            children: icon || "📄"
          }
        ),
        showIconPicker && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-full left-0 mt-1 z-20 rounded-xl border border-border bg-popover shadow-xl p-3 w-64", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-medium mb-2 uppercase tracking-wide", children: "Choose icon" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-8 gap-1", children: EMOJI_OPTIONS.map((em) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                onIconChange(em);
                setShowIconPicker(false);
              },
              className: "text-xl p-1 rounded hover:bg-muted transition-colors duration-150",
              children: em
            },
            em
          )) })
        ] })
      ] }),
      !coverUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setShowCoverInput(true),
          className: "text-xs text-muted-foreground hover:text-foreground transition-colors duration-150 pb-2",
          "data-ocid": "add-cover-btn",
          children: "+ Add cover"
        }
      )
    ] })
  ] });
}
function buildTree(pages) {
  const map = /* @__PURE__ */ new Map();
  for (const p of pages) {
    map.set(p.id, { ...p, children: [] });
  }
  const roots = [];
  for (const [, node] of map) {
    if (node.parentPageId) {
      const parent = map.get(node.parentPageId);
      if (parent) parent.children.push(node);
      else roots.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}
function TreeItem({
  node,
  depth,
  currentPageId,
  workspaceId
}) {
  const [expanded, setExpanded] = reactExports.useState(false);
  const isActive = node.id === currentPageId;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `group flex items-center gap-1.5 rounded-md px-2 py-1.5 cursor-pointer transition-colors duration-150 ${isActive ? "bg-primary/15 text-primary font-medium" : "text-foreground hover:bg-muted"}`,
        style: { paddingLeft: `${(depth + 1) * 12}px` },
        children: [
          node.children.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setExpanded((e) => !e),
              className: "shrink-0 text-muted-foreground hover:text-foreground",
              "aria-label": expanded ? "Collapse" : "Expand",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                ChevronRight,
                {
                  className: `h-3.5 w-3.5 transition-transform duration-200 ${expanded ? "rotate-90" : ""}`
                }
              )
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3.5 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link$1,
            {
              to: "/app/$workspaceId/pages/$pageId",
              params: { workspaceId, pageId: node.id },
              className: "flex items-center gap-2 flex-1 min-w-0",
              "data-ocid": `sidebar-page-${node.id}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 text-sm", children: node.icon || "📄" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm truncate", children: node.title || "Untitled" })
              ]
            }
          )
        ]
      }
    ),
    expanded && node.children.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { children: node.children.sort((a, b) => Number(b.updatedAt - a.updatedAt)).map((child) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      TreeItem,
      {
        node: child,
        depth: depth + 1,
        currentPageId,
        workspaceId
      },
      child.id
    )) })
  ] });
}
function PageSidebar({
  pages,
  currentPageId,
  tenantId: _tenantId,
  workspaceId
}) {
  const navigate = useNavigate();
  const tree = buildTree(pages);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "flex flex-col h-full overflow-hidden bg-sidebar border-r border-sidebar-border", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-3 py-3 border-b border-sidebar-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-sidebar-foreground", children: "Pages" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => navigate({
            to: "/app/$workspaceId/pages/new",
            params: { workspaceId }
          }),
          className: "rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150",
          "aria-label": "New page",
          "data-ocid": "sidebar-new-page-btn",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto py-2 px-1", children: tree.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-4 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No pages yet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => navigate({
            to: "/app/$workspaceId/pages/new",
            params: { workspaceId }
          }),
          className: "mt-2 text-xs text-primary hover:underline",
          children: "Create first page"
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-0.5", children: tree.map((node) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      TreeItem,
      {
        node,
        depth: 0,
        currentPageId,
        workspaceId
      },
      node.id
    )) }) })
  ] });
}
function TableOfContents({ blocks }) {
  const [activeId, setActiveId] = reactExports.useState(null);
  const headings = blocks.filter(
    (b) => b.blockType === "heading1" || b.blockType === "heading2" || b.blockType === "heading3"
  ).map((b) => ({
    id: b.id,
    level: b.blockType === "heading1" ? 1 : b.blockType === "heading2" ? 2 : 3,
    text: b.content
  }));
  reactExports.useEffect(() => {
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "0px 0px -60% 0px" }
    );
    for (const h of headings) {
      const el = document.getElementById(`heading-${h.id}`);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [headings]);
  if (headings.length === 0) return null;
  const scrollTo = (id) => {
    const el = document.getElementById(`heading-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden xl:block w-52 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1", children: "On this page" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { "aria-label": "Table of contents", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1", children: headings.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => scrollTo(h.id),
        className: `block w-full text-left text-xs transition-colors duration-150 rounded px-2 py-1 truncate ${activeId === h.id ? "text-primary font-medium bg-primary/8" : "text-muted-foreground hover:text-foreground"} ${h.level === 2 ? "pl-4" : h.level === 3 ? "pl-6" : ""}`,
        title: h.text,
        children: h.text || "(untitled)"
      }
    ) }, h.id)) }) })
  ] }) });
}
function BreadcrumbNav({
  page,
  pages,
  workspaceId
}) {
  const crumbs = [];
  let cur = page;
  while (cur) {
    crumbs.unshift(cur);
    const parentId = cur.parentPageId;
    cur = parentId ? pages.find((p) => p.id === parentId) : void 0;
  }
  if (crumbs.length <= 1) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "nav",
    {
      "aria-label": "Breadcrumb",
      className: "flex items-center gap-1 text-xs text-muted-foreground flex-wrap",
      children: crumbs.map((crumb, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
        i > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3 w-3" }),
        i === crumbs.length - 1 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium truncate max-w-[140px]", children: crumb.title || "Untitled" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link$1,
          {
            to: "/app/$workspaceId/pages/$pageId",
            params: { workspaceId, pageId: crumb.id },
            className: "hover:text-foreground transition-colors truncate max-w-[120px]",
            children: crumb.title || "Untitled"
          }
        )
      ] }, crumb.id))
    }
  );
}
function PageDetailPage() {
  const { workspaceId, pageId } = useParams({
    from: "/app/$workspaceId/pages/$pageId"
  });
  const { actor, isFetching } = useBackend();
  const { tenantId } = useWorkspace();
  const queryClient = useQueryClient();
  const [title, setTitle] = reactExports.useState("");
  const [icon, setIcon] = reactExports.useState("📄");
  const [coverUrl, setCoverUrl] = reactExports.useState();
  const [blocks, setBlocks] = reactExports.useState([]);
  const [sidebarOpen, setSidebarOpen] = reactExports.useState(true);
  const [dirty, setDirty] = reactExports.useState(false);
  const saveTimer = reactExports.useRef(null);
  const { data: page, isLoading } = useQuery({
    queryKey: ["page", tenantId, workspaceId, pageId],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getPage(tenantId, workspaceId, pageId);
      if (result.__kind__ === "err") return null;
      return result.ok;
    },
    enabled: !!actor && !isFetching
  });
  const { data: allPages = [] } = useQuery({
    queryKey: ["pages", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listPages(tenantId, workspaceId, null);
    },
    enabled: !!actor && !isFetching
  });
  reactExports.useEffect(() => {
    if (page) {
      setTitle(page.title);
      setIcon(page.icon || "📄");
      setCoverUrl(page.coverUrl ?? void 0);
      setBlocks(page.blocks ?? []);
      setDirty(false);
    }
  }, [page]);
  const { mutate: savePage, isPending: isSaving } = useMutation({
    mutationFn: async (args) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.updatePage(
        tenantId,
        workspaceId,
        pageId,
        args.title,
        args.icon,
        args.coverUrl ?? null,
        args.blocks
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(
        ["page", tenantId, workspaceId, pageId],
        updated
      );
      queryClient.invalidateQueries({
        queryKey: ["pages", tenantId, workspaceId]
      });
      setDirty(false);
    },
    onError: (err) => {
      ue.error("Auto-save failed", { description: err.message });
    }
  });
  const triggerSave = reactExports.useCallback(
    (t, ic, cover, bks) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        savePage({ title: t, icon: ic, coverUrl: cover, blocks: bks });
      }, 1e3);
    },
    [savePage]
  );
  const handleTitleChange = (val) => {
    setTitle(val);
    setDirty(true);
    triggerSave(val, icon, coverUrl, blocks);
  };
  const handleBlocksChange = (next) => {
    setBlocks(next);
    setDirty(true);
    triggerSave(title, icon, coverUrl, next);
  };
  const handleIconChange = (ic) => {
    setIcon(ic);
    setDirty(true);
    triggerSave(title, ic, coverUrl, blocks);
  };
  const handleCoverChange = (url) => {
    const val = url || void 0;
    setCoverUrl(val);
    setDirty(true);
    triggerSave(title, icon, val, blocks);
  };
  const saveRef = reactExports.useRef(() => void 0);
  const handleManualSave = reactExports.useCallback(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    savePage({ title, icon, coverUrl, blocks });
  }, [savePage, title, icon, coverUrl, blocks]);
  reactExports.useEffect(() => {
    saveRef.current = handleManualSave;
  }, [handleManualSave]);
  reactExports.useEffect(() => {
    function handler(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        saveRef.current();
      }
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 max-w-4xl mx-auto p-8 space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 w-full rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-2/3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-5/6" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-4/6" })
      ] })
    ] }) });
  }
  if (!page) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 flex flex-col items-center justify-center py-24 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-medium text-foreground mb-2", children: "Page not found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-6", children: "This page may have been deleted or you don't have access to it." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link$1, { to: "/app/$workspaceId/pages", params: { workspaceId }, children: "Back to Pages" }) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full overflow-hidden", children: [
    sidebarOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block w-56 shrink-0 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageSidebar,
      {
        pages: allPages,
        currentPageId: pageId,
        tenantId,
        workspaceId
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-0 z-10 flex items-center gap-2 px-4 py-2 border-b border-border/60 bg-card/90 backdrop-blur-subtle shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setSidebarOpen((o) => !o),
            className: "rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth hidden md:flex",
            "aria-label": "Toggle sidebar",
            children: sidebarOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(PanelLeftClose, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(PanelLeftOpen, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            asChild: true,
            className: "shrink-0 h-8 w-8",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link$1,
              {
                to: "/app/$workspaceId/pages",
                params: { workspaceId },
                "aria-label": "Back to pages",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" })
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          BreadcrumbNav,
          {
            page,
            pages: allPages,
            workspaceId
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [
          dirty && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground hidden sm:block", children: "Unsaved" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "sm",
              onClick: handleManualSave,
              disabled: isSaving,
              className: "gap-1.5 text-xs h-8",
              "data-ocid": "page-save-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "h-3.5 w-3.5" }),
                isSaving ? "Saving…" : "Save"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "sm",
              className: "gap-1.5 text-xs h-8 hidden sm:flex",
              title: "Duplicate page",
              "aria-label": "Duplicate page",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-3.5 w-3.5" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        CoverImagePicker,
        {
          coverUrl,
          icon,
          onIconChange: handleIconChange,
          onCoverChange: handleCoverChange
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-6 px-6 lg:px-12 pb-24 pt-4 max-w-5xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              contentEditable: true,
              suppressContentEditableWarning: true,
              onInput: (e) => handleTitleChange(e.currentTarget.textContent ?? ""),
              className: "text-4xl font-bold font-display text-foreground outline-none mb-6 empty:before:content-['Untitled'] empty:before:text-muted-foreground/40 empty:before:pointer-events-none break-words",
              "data-ocid": "page-title-input",
              children: title
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(BlockEditor, { blocks, onChange: handleBlocksChange }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(BacklinksPanel, { pageId, tenantId })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableOfContents, { blocks })
      ] })
    ] })
  ] });
}
export {
  PageDetailPage as default
};
