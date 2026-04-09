import { s as createLucideIcon, m as useParams, f as useWorkspace, d as useNavigate, n as useQueryClient, r as reactExports, h as useQuery, j as jsxRuntimeExports, B as Button, i as Link, w as ChevronDown, X, C as Check, b as MessageSquare } from "./index-1XRv9GHr.js";
import { A as AlertDialog, a as AlertDialogTrigger, b as AlertDialogContent, c as AlertDialogHeader, d as AlertDialogTitle, e as AlertDialogDescription, f as AlertDialogFooter, g as AlertDialogCancel, h as AlertDialogAction } from "./alert-dialog-DfW6ZawE.js";
import { I as Input } from "./input-BOIU-9S_.js";
import { P as Popover, a as PopoverTrigger, b as PopoverContent } from "./popover-Cv78KGce.js";
import { S as Skeleton } from "./index-wZVP6u7e.js";
import { u as useMutation } from "./useMutation-X94w2CVk.js";
import { u as ue } from "./index-BOWFyaIB.js";
import { C as CrossLinkPicker } from "./CrossLinkPicker-HW0cGNv4.js";
import { u as useBackend } from "./useBackend-DyFxq-Jw.js";
import { A as ArrowLeft } from "./arrow-left-B-gbON0E.js";
import { I as Image } from "./image-CKd7UOc1.js";
import { T as Trash2 } from "./trash-2-DiWEnbCD.js";
import { L as LoaderCircle } from "./loader-circle-CtmMa9i8.js";
import { C as Calendar } from "./calendar-AxllVY2A.js";
import { L as Link2 } from "./link-2-sNukA1XD.js";
import { B as Bold, I as Italic, C as Code } from "./italic-C2mQ2iqL.js";
import { R as RefreshCw } from "./refresh-cw-J9WZ69Bg.js";
import { C as Copy } from "./copy-BH7dsCoj.js";
import { G as GripVertical } from "./grip-vertical-qlzW3MHo.js";
import { T as Type } from "./type-BCwFPRmC.js";
import { H as Hash } from "./hash-Djb3fa_z.js";
import { L as List } from "./list-C7QVOoGz.js";
import { S as SquareCheckBig } from "./square-check-big-Dl3l_FMk.js";
import { M as Minus } from "./minus-BrE88v8-.js";
import "./index-DaIQAH-5.js";
import "./badge-rX4oLW6l.js";
import "./search-CWnD_rod.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["circle", { cx: "12", cy: "12", r: "1", key: "41hilf" }],
  ["circle", { cx: "19", cy: "12", r: "1", key: "1wjl8i" }],
  ["circle", { cx: "5", cy: "12", r: "1", key: "1pcz8c" }]
];
const Ellipsis = createLucideIcon("ellipsis", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M10 12h11", key: "6m4ad9" }],
  ["path", { d: "M10 18h11", key: "11hvi2" }],
  ["path", { d: "M10 6h11", key: "c7qv1k" }],
  ["path", { d: "M4 10h2", key: "16xx2s" }],
  ["path", { d: "M4 6h1v4", key: "cnovpq" }],
  ["path", { d: "M6 18H4c0-1 2-2 2-3s-1-1.5-2-1", key: "m9a95d" }]
];
const ListOrdered = createLucideIcon("list-ordered", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z",
      key: "rib7q0"
    }
  ],
  [
    "path",
    {
      d: "M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z",
      key: "1ymkrd"
    }
  ]
];
const Quote = createLucideIcon("quote", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M6 4v6a6 6 0 0 0 12 0V4", key: "9kb039" }],
  ["line", { x1: "4", x2: "20", y1: "20", y2: "20", key: "nun2al" }]
];
const Underline = createLucideIcon("underline", __iconNode);
const COVER_GRADIENTS = [
  {
    id: "indigo-purple",
    label: "Indigo to Purple",
    value: "from-indigo-500 via-purple-500 to-pink-500"
  },
  {
    id: "ocean",
    label: "Ocean",
    value: "from-cyan-500 via-blue-500 to-indigo-600"
  },
  {
    id: "sunset",
    label: "Sunset",
    value: "from-orange-400 via-rose-500 to-pink-600"
  },
  {
    id: "forest",
    label: "Forest",
    value: "from-emerald-400 via-teal-500 to-cyan-600"
  },
  {
    id: "golden",
    label: "Golden",
    value: "from-yellow-400 via-orange-400 to-red-500"
  },
  {
    id: "midnight",
    label: "Midnight",
    value: "from-slate-700 via-purple-800 to-slate-900"
  }
];
const COMMON_EMOJIS = [
  "📝",
  "📋",
  "📚",
  "📌",
  "📎",
  "🔖",
  "💡",
  "🎯",
  "🚀",
  "⭐",
  "✅",
  "🔥",
  "💬",
  "🎨",
  "🔍",
  "📊",
  "🗓️",
  "📁",
  "🔑",
  "💻",
  "🌟",
  "🏆",
  "📧",
  "🔔",
  "⚡",
  "🎉",
  "🌈",
  "💎",
  "🎸",
  "🌿",
  "🦋",
  "🌺",
  "☕",
  "🍀",
  "🔮",
  "🎭",
  "🌙",
  "☀️",
  "🦁",
  "🐬"
];
const CODE_LANGUAGES = [
  "plaintext",
  "javascript",
  "typescript",
  "python",
  "motoko",
  "rust",
  "go",
  "java",
  "c",
  "cpp",
  "css",
  "html",
  "json",
  "bash",
  "sql",
  "markdown"
];
const BLOCK_TYPES = [
  {
    type: "paragraph",
    label: "Text",
    description: "Plain text paragraph",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Type, { className: "h-3.5 w-3.5" })
  },
  {
    type: "heading1",
    label: "Heading 1",
    description: "Large section heading",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { className: "h-3.5 w-3.5" }),
    shortcut: "# "
  },
  {
    type: "heading2",
    label: "Heading 2",
    description: "Medium section heading",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { className: "h-3 w-3" }),
    shortcut: "## "
  },
  {
    type: "heading3",
    label: "Heading 3",
    description: "Small heading",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { className: "h-2.5 w-2.5" }),
    shortcut: "### "
  },
  {
    type: "bulletList",
    label: "Bullet List",
    description: "Unordered list item",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(List, { className: "h-3.5 w-3.5" }),
    shortcut: "- "
  },
  {
    type: "numberedList",
    label: "Numbered List",
    description: "Ordered list item",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ListOrdered, { className: "h-3.5 w-3.5" }),
    shortcut: "1. "
  },
  {
    type: "todo",
    label: "To-do",
    description: "Checkbox item",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(SquareCheckBig, { className: "h-3.5 w-3.5" }),
    shortcut: "[] "
  },
  {
    type: "toggle",
    label: "Toggle",
    description: "Expandable section",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3.5 w-3.5" })
  },
  {
    type: "callout",
    label: "Callout",
    description: "Highlighted info box",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-3.5 w-3.5" })
  },
  {
    type: "code",
    label: "Code",
    description: "Code block with syntax",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Code, { className: "h-3.5 w-3.5" }),
    shortcut: "```"
  },
  {
    type: "quote",
    label: "Quote",
    description: "Block quotation",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Quote, { className: "h-3.5 w-3.5" })
  },
  {
    type: "divider",
    label: "Divider",
    description: "Horizontal separator",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-3.5 w-3.5" }),
    shortcut: "---"
  }
];
const BLOCK_TYPE_LABELS = {
  paragraph: "Text",
  heading1: "Heading 1",
  heading2: "Heading 2",
  heading3: "Heading 3",
  bulletList: "Bullet List",
  numberedList: "Numbered List",
  todo: "To-do",
  callout: "Callout",
  code: "Code",
  quote: "Quote"
};
function generateId() {
  return Math.random().toString(36).slice(2, 10);
}
function blocksToJson(blocks) {
  return JSON.stringify(blocks);
}
function jsonToBlocks(raw) {
  if (!raw || !raw.trim()) {
    return [{ id: generateId(), type: "paragraph", content: "" }];
  }
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {
  }
  return parseLegacyMarkdown(raw);
}
function parseLegacyMarkdown(content) {
  if (!content.trim())
    return [{ id: generateId(), type: "paragraph", content: "" }];
  const parts = content.split(/\n\n/);
  const blocks = [];
  let i = 0;
  while (i < parts.length) {
    const line = parts[i].trim();
    if (!line) {
      i++;
      continue;
    }
    if (line === "---") {
      blocks.push({ id: generateId(), type: "divider", content: "" });
    } else if (line.startsWith("### ")) {
      blocks.push({
        id: generateId(),
        type: "heading3",
        content: line.slice(4)
      });
    } else if (line.startsWith("## ")) {
      blocks.push({
        id: generateId(),
        type: "heading2",
        content: line.slice(3)
      });
    } else if (line.startsWith("# ")) {
      blocks.push({
        id: generateId(),
        type: "heading1",
        content: line.slice(2)
      });
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      blocks.push({
        id: generateId(),
        type: "bulletList",
        content: line.slice(2)
      });
    } else if (/^\d+\.\s/.test(line)) {
      blocks.push({
        id: generateId(),
        type: "numberedList",
        content: line.replace(/^\d+\.\s/, "")
      });
    } else if (line.startsWith("> toggle: ")) {
      blocks.push({
        id: generateId(),
        type: "toggle",
        content: line.slice(10),
        expanded: true
      });
    } else if (line.startsWith("> callout(")) {
      const m = line.match(/^> callout\((.+?)\): (.*)/);
      blocks.push({
        id: generateId(),
        type: "callout",
        content: m ? m[2] : line.slice(10),
        calloutIcon: m ? m[1] : "💡"
      });
    } else if (line.startsWith("```")) {
      const codeLines = [];
      const langLine = line.slice(3).trim();
      const language = langLine && langLine !== "" ? langLine : "plaintext";
      i++;
      while (i < parts.length && !parts[i].trim().startsWith("```")) {
        codeLines.push(parts[i]);
        i++;
      }
      blocks.push({
        id: generateId(),
        type: "code",
        content: codeLines.join("\n\n"),
        language
      });
    } else if (line.startsWith("> ")) {
      blocks.push({ id: generateId(), type: "quote", content: line.slice(2) });
    } else if (line.startsWith("- [ ] ") || line.startsWith("- [x] ") || line.startsWith("- [X] ")) {
      const checked = line.startsWith("- [x] ") || line.startsWith("- [X] ");
      blocks.push({
        id: generateId(),
        type: "todo",
        content: line.slice(6),
        checked
      });
    } else {
      blocks.push({ id: generateId(), type: "paragraph", content: line });
    }
    i++;
  }
  return blocks.length > 0 ? blocks : [{ id: generateId(), type: "paragraph", content: "" }];
}
function formatRelativeTime(nsTimestamp) {
  const ms = Number(nsTimestamp) / 1e6;
  const diff = Date.now() - ms;
  const secs = Math.floor(diff / 1e3);
  if (secs < 30) return "just now";
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
function getInitials(name) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}
function SaveIndicator({ status }) {
  if (status === "idle") return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `inline-flex items-center gap-1 text-xs transition-all duration-300 ${status === "saved" ? "text-accent" : "text-muted-foreground"}`,
      children: status === "saving" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3 w-3 animate-spin" }),
        " Saving…"
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3" }),
        " Saved"
      ] })
    }
  );
}
function PresenceBar({ editors }) {
  if (editors.length === 0) return null;
  const active = editors.filter((e) => e.isEditing);
  const shown = editors.slice(0, 3);
  const overflow = editors.length - 3;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 py-1", "data-ocid": "note-presence-bar", children: [
    active.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-accent animate-pulse" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-accent font-medium", children: active.length === 1 ? `${active[0].displayName} is editing` : `${active.length} people editing` })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex -space-x-1.5", children: [
      shown.map((ed) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          title: `${ed.displayName} is ${ed.isEditing ? "editing" : "viewing"}`,
          className: "relative h-6 w-6 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold text-primary leading-none", children: getInitials(ed.displayName) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-background ${ed.isEditing ? "bg-accent" : "bg-muted-foreground/40"}`
              }
            )
          ]
        },
        ed.userId.toString()
      )),
      overflow > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] font-bold text-muted-foreground", children: [
        "+",
        overflow
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: editors.length === 1 ? `${editors[0].displayName} is viewing` : `${editors.length} people viewing` })
  ] });
}
function SlashMenu({ query, position, onSelect, onClose }) {
  const [selected, setSelected] = reactExports.useState(0);
  const filtered = BLOCK_TYPES.filter(
    (bt) => bt.label.toLowerCase().includes(query.toLowerCase()) || bt.description.toLowerCase().includes(query.toLowerCase())
  );
  reactExports.useEffect(() => {
    function onKey(e) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((s) => Math.min(s + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((s) => Math.max(s - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[selected]) onSelect(filtered[selected].type);
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [filtered, selected, onSelect, onClose]);
  const prevQuery = reactExports.useRef(query);
  if (prevQuery.current !== query) {
    prevQuery.current = query;
    setSelected(0);
  }
  if (filtered.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed z-50 w-64 rounded-xl border border-border bg-popover shadow-xl overflow-hidden",
      style: { top: position.top, left: position.left },
      "data-ocid": "slash-menu",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-1.5 max-h-72 overflow-y-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Block types" }),
        filtered.map((bt, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => onSelect(bt.type),
            className: `flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${idx === selected ? "bg-primary/10 text-primary" : "hover:bg-muted text-foreground"}`,
            "data-ocid": `slash-option-${bt.type}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background shrink-0", children: bt.icon }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-xs leading-tight", children: bt.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-[10px] truncate", children: bt.description })
              ] }),
              bt.shortcut && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-[10px] text-muted-foreground/60 font-mono shrink-0", children: bt.shortcut })
            ]
          },
          bt.type
        ))
      ] })
    }
  );
}
function InlineToolbar({ position, onFormat }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed z-50 flex items-center gap-0.5 rounded-lg border border-border bg-popover px-1.5 py-1 shadow-xl",
      style: { top: position.top - 44, left: position.left },
      "data-ocid": "inline-toolbar",
      onMouseDown: (e) => e.preventDefault(),
      children: [
        {
          label: "Bold",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Bold, { className: "h-3 w-3" }),
          tag: "**",
          ocid: "fmt-bold"
        },
        {
          label: "Italic",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Italic, { className: "h-3 w-3" }),
          tag: "_",
          ocid: "fmt-italic"
        },
        {
          label: "Underline",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Underline, { className: "h-3 w-3" }),
          tag: "__",
          ocid: "fmt-underline"
        },
        {
          label: "Code",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Code, { className: "h-3 w-3" }),
          tag: "`",
          ocid: "fmt-code"
        },
        {
          label: "Link",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "h-3 w-3" }),
          tag: "link",
          ocid: "fmt-link"
        }
      ].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          title: t.label,
          "aria-label": t.label,
          onClick: () => onFormat(t.tag),
          className: "flex h-7 w-7 items-center justify-center rounded-md text-foreground hover:bg-muted transition-colors",
          "data-ocid": t.ocid,
          children: t.icon
        },
        t.tag
      ))
    }
  );
}
function BlockActionsMenu({
  blockId: _blockId,
  blockType,
  position,
  onTurnInto,
  onDuplicate,
  onDelete,
  onClose
}) {
  const [showTurnInto, setShowTurnInto] = reactExports.useState(false);
  const turnIntoTypes = [
    "paragraph",
    "heading1",
    "heading2",
    "heading3",
    "bulletList",
    "numberedList",
    "todo",
    "callout",
    "code",
    "quote"
  ];
  reactExports.useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed z-50 w-52 rounded-xl border border-border bg-popover shadow-xl overflow-hidden",
      style: { top: position.top, left: position.left },
      "data-ocid": "block-actions-menu",
      children: showTurnInto ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-1.5 max-h-64 overflow-y-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setShowTurnInto(false),
            className: "flex items-center gap-1.5 w-full px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted rounded-md mb-1",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-3 w-3" }),
              " Back"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: "Turn into" }),
        turnIntoTypes.filter((t) => t !== blockType).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => {
              onTurnInto(t);
              onClose();
            },
            className: "flex w-full items-center gap-2.5 px-2.5 py-2 text-sm hover:bg-muted rounded-lg text-foreground transition-colors",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium", children: BLOCK_TYPE_LABELS[t] ?? t })
          },
          t
        ))
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setShowTurnInto(true),
            className: "flex w-full items-center gap-2.5 px-2.5 py-2 text-sm hover:bg-muted rounded-lg text-foreground transition-colors",
            "data-ocid": "block-action-turn-into",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3.5 w-3.5 text-muted-foreground" }),
              " Turn into"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => {
              onDuplicate();
              onClose();
            },
            className: "flex w-full items-center gap-2.5 px-2.5 py-2 text-sm hover:bg-muted rounded-lg text-foreground transition-colors",
            "data-ocid": "block-action-duplicate",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-3.5 w-3.5 text-muted-foreground" }),
              " Duplicate"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("hr", { className: "my-1 border-border/60" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => {
              onDelete();
              onClose();
            },
            className: "flex w-full items-center gap-2.5 px-2.5 py-2 text-sm hover:bg-destructive/10 rounded-lg text-destructive transition-colors",
            "data-ocid": "block-action-delete",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }),
              " Delete block"
            ]
          }
        )
      ] })
    }
  );
}
function MentionPicker({
  query,
  position,
  members,
  onSelect,
  onClose
}) {
  const filtered = members.filter((m) => m.displayName.toLowerCase().includes(query.toLowerCase())).slice(0, 6);
  const [sel, setSel] = reactExports.useState(0);
  reactExports.useEffect(() => {
    function onKey(e) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSel((s) => Math.min(s + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSel((s) => Math.max(s - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[sel]) onSelect(filtered[sel].displayName);
      } else if (e.key === "Escape") {
        onClose();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [filtered, sel, onSelect, onClose]);
  if (filtered.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed z-50 w-52 rounded-xl border border-border bg-popover shadow-xl overflow-hidden",
      style: { top: position.top, left: position.left },
      "data-ocid": "mention-picker",
      children: filtered.map((m, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => onSelect(m.displayName),
          className: `flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors ${i === sel ? "bg-primary/10 text-primary" : "hover:bg-muted text-foreground"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0", children: m.displayName.slice(0, 2).toUpperCase() }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: m.displayName })
          ]
        },
        m.id
      ))
    }
  );
}
function BlockEditor({
  block,
  idx,
  isActive: _isActive,
  onChange,
  onKeyDown,
  onFocus,
  onDragStart,
  onDrop,
  onToggleExpand,
  onSelection,
  onToggleCheck,
  onOpenActions,
  onLanguageChange
}) {
  const textareaRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  });
  const typeStyles = {
    heading1: "text-2xl font-bold font-display tracking-tight",
    heading2: "text-xl font-bold font-display tracking-tight",
    heading3: "text-base font-semibold font-display",
    paragraph: "text-sm leading-relaxed",
    bulletList: "text-sm leading-relaxed pl-4",
    numberedList: "text-sm leading-relaxed pl-4",
    todo: "text-sm leading-relaxed",
    toggle: "text-sm leading-relaxed font-medium pl-5",
    callout: "text-sm leading-relaxed pl-8",
    code: "text-xs font-mono leading-relaxed",
    quote: "text-sm leading-relaxed italic"
  };
  if (block.type === "divider") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "group relative flex items-center gap-2 py-2 cursor-pointer",
        draggable: true,
        onDragStart: () => onDragStart(idx),
        onDrop: () => onDrop(idx),
        onDragOver: (e) => e.preventDefault(),
        "data-ocid": `block-divider-${block.id}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "absolute -left-6 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab text-muted-foreground",
              title: "Drag",
              "aria-label": "Drag block",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { className: "h-3.5 w-3.5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("hr", { className: "flex-1 border-border" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "absolute -right-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground",
              "aria-label": "Block options",
              onClick: (e) => {
                const r = e.currentTarget.getBoundingClientRect();
                onOpenActions(block.id, { top: r.bottom + 4, left: r.left });
              },
              "data-ocid": `block-menu-${block.id}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Ellipsis, { className: "h-3 w-3" })
            }
          )
        ]
      }
    );
  }
  const wrapperClass = block.type === "callout" ? "bg-primary/5 border border-primary/20 rounded-lg px-4 py-2.5 relative" : block.type === "code" ? "bg-muted/60 border border-border rounded-lg px-4 py-2 relative" : block.type === "quote" ? "border-l-4 border-primary/50 pl-4 py-0.5" : "";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "group relative",
      draggable: true,
      onDragStart: () => onDragStart(idx),
      onDrop: () => onDrop(idx),
      onDragOver: (e) => e.preventDefault(),
      "data-ocid": `block-${block.id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab text-muted-foreground z-10",
            title: "Drag",
            "aria-label": "Drag block",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { className: "h-3.5 w-3.5" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "absolute -right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground z-10 hover:text-foreground",
            "aria-label": "Block options",
            onClick: (e) => {
              const r = e.currentTarget.getBoundingClientRect();
              onOpenActions(block.id, { top: r.bottom + 4, left: r.left - 200 });
            },
            "data-ocid": `block-menu-${block.id}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Ellipsis, { className: "h-3.5 w-3.5" })
          }
        ),
        block.type === "toggle" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => onToggleExpand(block.id),
            className: "absolute left-0 top-1 text-muted-foreground hover:text-foreground transition-colors",
            "aria-label": block.expanded ? "Collapse" : "Expand",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              ChevronDown,
              {
                className: `h-3.5 w-3.5 transition-transform ${block.expanded ? "" : "-rotate-90"}`
              }
            )
          }
        ),
        block.type === "callout" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-3 text-base select-none", children: block.calloutIcon ?? "💡" }),
        block.type === "bulletList" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-1 top-2.5 h-1.5 w-1.5 rounded-full bg-foreground/50" }),
        block.type === "todo" && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => onToggleCheck(block.id),
            className: "absolute left-0 top-1 h-4 w-4 rounded border border-border/70 flex items-center justify-center hover:border-primary transition-colors bg-background",
            "aria-label": block.checked ? "Uncheck" : "Check",
            "data-ocid": `todo-check-${block.id}`,
            children: block.checked && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-2.5 w-2.5 text-primary" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: wrapperClass, children: [
          block.type === "code" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 right-2 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "select",
            {
              value: block.language ?? "plaintext",
              onChange: (e) => onLanguageChange(block.id, e.target.value),
              className: "text-[10px] font-mono text-muted-foreground bg-transparent border-0 outline-none cursor-pointer hover:text-foreground transition-colors",
              "data-ocid": `code-lang-${block.id}`,
              children: CODE_LANGUAGES.map((lang) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: lang, children: lang }, lang))
            }
          ) }),
          block.type === "toggle" && !block.expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: `${typeStyles.toggle} text-foreground/70 cursor-pointer w-full text-left`,
              onClick: () => onToggleExpand(block.id),
              children: block.content || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/50", children: "Toggle block…" })
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              ref: textareaRef,
              value: block.content,
              onChange: (e) => onChange(block.id, e.target.value),
              onKeyDown: (e) => onKeyDown(e, block.id),
              onFocus: (e) => onFocus(block.id, e.currentTarget),
              onSelect: (e) => onSelection(e.currentTarget),
              className: `w-full resize-none bg-transparent outline-none placeholder:text-muted-foreground/40 ${typeStyles[block.type] ?? "text-sm"} ${block.checked ? "line-through text-muted-foreground" : ""} ${block.type === "code" ? "pt-5" : ""}`,
              placeholder: block.type === "heading1" ? "Heading 1" : block.type === "heading2" ? "Heading 2" : block.type === "heading3" ? "Heading 3" : block.type === "callout" ? "Add a callout…" : block.type === "code" ? "// Write code here…" : block.type === "quote" ? "Quote…" : block.type === "toggle" ? "Toggle title…" : block.type === "todo" ? "To-do item" : "Type something, or press / for blocks",
              rows: 1,
              "data-block-id": block.id,
              "data-ocid": `block-input-${block.id}`,
              spellCheck: block.type !== "code"
            }
          )
        ] })
      ]
    }
  );
}
function NoteDetailPage() {
  var _a;
  const { workspaceId, noteId } = useParams({
    from: "/app/$workspaceId/notes/$noteId"
  });
  const { actor, isFetching } = useBackend();
  const { tenantId } = useWorkspace();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editTitle, setEditTitle] = reactExports.useState("");
  const [blocks, setBlocks] = reactExports.useState([
    { id: generateId(), type: "paragraph", content: "" }
  ]);
  const [editTags, setEditTags] = reactExports.useState([]);
  const [editTagInput, setEditTagInput] = reactExports.useState("");
  const [editCrossLinks, setEditCrossLinks] = reactExports.useState([]);
  const [cover, setCover] = reactExports.useState("");
  const [icon, setIcon] = reactExports.useState("");
  const [showCoverPicker, setShowCoverPicker] = reactExports.useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = reactExports.useState(false);
  const [saveStatus, setSaveStatus] = reactExports.useState("idle");
  const debounceRef = reactExports.useRef(null);
  const [activeEditors, setActiveEditors] = reactExports.useState([]);
  const [lastEdit, setLastEdit] = reactExports.useState(null);
  const [activeBlockId, setActiveBlockId] = reactExports.useState(null);
  const [dragIdx, setDragIdx] = reactExports.useState(null);
  const [slashMenu, setSlashMenu] = reactExports.useState(null);
  const [inlineToolbar, setInlineToolbar] = reactExports.useState(null);
  const [mentionMenu, setMentionMenu] = reactExports.useState(null);
  const [blockActions, setBlockActions] = reactExports.useState(null);
  const [members, setMembers] = reactExports.useState([]);
  const isEditingRef = reactExports.useRef(false);
  const {
    data: note,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["note", tenantId, workspaceId, noteId],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getNote(tenantId, workspaceId, noteId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    enabled: !!actor && !isFetching
  });
  reactExports.useEffect(() => {
    if (note) {
      setEditTitle(note.title);
      setBlocks(jsonToBlocks(note.content));
      setEditTags([...note.tags]);
      setEditCrossLinks([...note.crossLinks]);
      const n = note;
      if (n.coverGradient) setCover(n.coverGradient);
      if (n.iconEmoji) setIcon(n.iconEmoji);
    }
  }, [note]);
  reactExports.useEffect(() => {
    if (!actor || !noteId || isFetching) return;
    actor.getLastNoteEdit(tenantId, workspaceId, noteId).then((r) => {
      if (r)
        setLastEdit({ displayName: r.displayName, editedAt: r.editedAt });
    }).catch(() => {
    });
  }, [actor, tenantId, workspaceId, noteId, isFetching]);
  reactExports.useEffect(() => {
    if (!actor || isFetching) return;
    actor.listWorkspaceMembers(tenantId, workspaceId).then((ms) => {
      setMembers(
        ms.map((m) => ({
          id: m.userId.toString(),
          displayName: m.displayName || m.userId.toString().slice(0, 8)
        }))
      );
    }).catch(() => {
    });
  }, [actor, tenantId, workspaceId, isFetching]);
  reactExports.useEffect(() => {
    if (!actor || !noteId || isFetching) return;
    let cancelled = false;
    const getDisplayName = async () => {
      try {
        const profile = await actor.getMyProfile(tenantId);
        if (profile) {
          const p = profile;
          return `${p.firstName ?? ""} ${p.lastName ?? ""}`.trim() || "Anonymous";
        }
      } catch {
      }
      return "Anonymous";
    };
    const doUpdate = async () => {
      if (cancelled) return;
      try {
        const name = await getDisplayName();
        await actor.updateNotePresence(
          tenantId,
          workspaceId,
          noteId,
          name,
          isEditingRef.current
        );
      } catch {
      }
    };
    const doPoll = async () => {
      if (cancelled) return;
      try {
        const editors = await actor.getNoteActiveEditors(
          tenantId,
          workspaceId,
          noteId
        );
        if (!cancelled) setActiveEditors(editors);
      } catch {
      }
    };
    doUpdate();
    doPoll();
    const presenceInterval = setInterval(doUpdate, 5e3);
    const pollInterval = setInterval(doPoll, 5e3);
    return () => {
      cancelled = true;
      clearInterval(presenceInterval);
      clearInterval(pollInterval);
    };
  }, [actor, tenantId, workspaceId, noteId, isFetching]);
  const { mutate: updateNote } = useMutation({
    mutationFn: async (payload) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.updateNote(
        tenantId,
        workspaceId,
        noteId,
        payload
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onMutate: () => setSaveStatus("saving"),
    onSuccess: (updated) => {
      queryClient.setQueryData(
        ["note", tenantId, workspaceId, noteId],
        updated
      );
      queryClient.invalidateQueries({
        queryKey: ["notes", tenantId, workspaceId]
      });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3e3);
      if (actor) {
        actor.getLastNoteEdit(tenantId, workspaceId, noteId).then((r) => {
          if (r)
            setLastEdit({ displayName: r.displayName, editedAt: r.editedAt });
        }).catch(() => {
        });
      }
    },
    onError: (err) => {
      setSaveStatus("idle");
      ue.error("Failed to save note", { description: err.message });
    }
  });
  const { mutate: deleteNote, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.deleteNote(tenantId, workspaceId, noteId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes", tenantId, workspaceId]
      });
      ue.success("Note deleted");
      navigate({ to: "/app/$workspaceId/notes", params: { workspaceId } });
    },
    onError: (err) => ue.error("Failed to delete note", { description: err.message })
  });
  const handleSave = reactExports.useCallback(() => {
    if (!editTitle.trim()) return;
    const payload = {
      title: editTitle.trim(),
      content: blocksToJson(blocks),
      tags: editTags,
      crossLinks: editCrossLinks
    };
    if (cover)
      payload.coverGradient = cover;
    if (icon) payload.iconEmoji = icon;
    updateNote(payload);
  }, [editTitle, blocks, editTags, editCrossLinks, cover, icon, updateNote]);
  const handleSaveRef = reactExports.useRef(handleSave);
  reactExports.useEffect(() => {
    handleSaveRef.current = handleSave;
  }, [handleSave]);
  const triggerAutoSave = reactExports.useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (editTitle.trim()) handleSaveRef.current();
    }, 800);
  }, [editTitle]);
  reactExports.useEffect(() => {
    triggerAutoSave();
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [triggerAutoSave]);
  const blocksRef = reactExports.useRef(blocks);
  reactExports.useEffect(() => {
    if (blocksRef.current !== blocks) {
      blocksRef.current = blocks;
      triggerAutoSave();
    }
  }, [blocks, triggerAutoSave]);
  const editTagsRef = reactExports.useRef(editTags);
  reactExports.useEffect(() => {
    if (editTagsRef.current !== editTags) {
      editTagsRef.current = editTags;
      triggerAutoSave();
    }
  }, [editTags, triggerAutoSave]);
  function updateBlockContent(id, content) {
    setBlocks((prev) => prev.map((b) => b.id === id ? { ...b, content } : b));
  }
  function checkMarkdownShortcut(value, blockId) {
    const shortcuts = [
      { prefix: "# ", type: "heading1" },
      { prefix: "## ", type: "heading2" },
      { prefix: "### ", type: "heading3" },
      { prefix: "> ", type: "quote" },
      { prefix: "- ", type: "bulletList" },
      { prefix: "* ", type: "bulletList" },
      { prefix: "1. ", type: "numberedList" },
      { prefix: "[] ", type: "todo" },
      { prefix: "[ ] ", type: "todo" }
    ];
    for (const { prefix, type } of shortcuts) {
      if (value === prefix) {
        setBlocks(
          (prev) => prev.map((b) => b.id === blockId ? { ...b, type, content: "" } : b)
        );
        requestAnimationFrame(() => {
          const target = document.querySelector(
            `[data-block-id="${blockId}"]`
          );
          if (target) target.value = "";
        });
        return true;
      }
    }
    return false;
  }
  function handleBlockKeyDown(e, blockId) {
    const el = e.currentTarget;
    const { selectionStart, selectionEnd, value } = el;
    const blockIdx = blocks.findIndex((b) => b.id === blockId);
    if (e.key === " ") {
      const withSpace = `${value.slice(0, selectionStart)} `;
      if (checkMarkdownShortcut(withSpace, blockId)) {
        e.preventDefault();
        return;
      }
    }
    if (e.key === "/" && selectionStart === 0 && value === "") {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      setSlashMenu({
        blockId,
        query: "",
        position: { top: rect.bottom + 4, left: rect.left }
      });
      return;
    }
    if (e.key === "@") {
      const rect = el.getBoundingClientRect();
      setTimeout(() => {
        setMentionMenu({
          blockId,
          query: "",
          position: { top: rect.bottom + 4, left: rect.left }
        });
      }, 10);
    }
    if (slashMenu && slashMenu.blockId === blockId) {
      if (e.key === "Backspace" && slashMenu.query === "") {
        setSlashMenu(null);
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        setSlashMenu((s) => s ? { ...s, query: s.query + e.key } : null);
      }
    }
    if (mentionMenu && mentionMenu.blockId === blockId) {
      if (e.key === "Backspace" && mentionMenu.query === "") {
        setMentionMenu(null);
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        setMentionMenu((s) => s ? { ...s, query: s.query + e.key } : null);
      }
    }
    if (e.key === "Tab" && !e.shiftKey && !slashMenu && !mentionMenu) {
      e.preventDefault();
      const nextBlock = blocks[blockIdx + 1];
      if (nextBlock) {
        const target = document.querySelector(
          `[data-block-id="${nextBlock.id}"]`
        );
        target == null ? void 0 : target.focus();
      } else {
        const newBlock = {
          id: generateId(),
          type: "paragraph",
          content: ""
        };
        setBlocks((prev) => [...prev, newBlock]);
        requestAnimationFrame(() => {
          const target = document.querySelector(
            `[data-block-id="${newBlock.id}"]`
          );
          target == null ? void 0 : target.focus();
        });
      }
      return;
    }
    if (e.key === "Enter" && !e.shiftKey && !slashMenu && !mentionMenu) {
      const block = blocks[blockIdx];
      if (block.type === "divider") {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      const before = value.slice(0, selectionStart);
      const after = value.slice(selectionEnd);
      const newBlock = {
        id: generateId(),
        type: "paragraph",
        content: after
      };
      updateBlockContent(blockId, before);
      setBlocks((prev) => [
        ...prev.slice(0, blockIdx + 1),
        newBlock,
        ...prev.slice(blockIdx + 1)
      ]);
      requestAnimationFrame(() => {
        const target = document.querySelector(
          `[data-block-id="${newBlock.id}"]`
        );
        target == null ? void 0 : target.focus();
        target == null ? void 0 : target.setSelectionRange(0, 0);
      });
      return;
    }
    if (e.key === "Backspace" && value === "" && blocks.length > 1) {
      e.preventDefault();
      setBlocks((prev) => prev.filter((b) => b.id !== blockId));
      if (blockIdx > 0) {
        requestAnimationFrame(() => {
          const prevBlock = blocks[blockIdx - 1];
          const target = document.querySelector(
            `[data-block-id="${prevBlock.id}"]`
          );
          if (target) {
            target.focus();
            target.setSelectionRange(target.value.length, target.value.length);
          }
        });
      }
      return;
    }
    if (e.key === "ArrowUp" && selectionStart === 0 && blockIdx > 0) {
      e.preventDefault();
      const prevBlock = blocks[blockIdx - 1];
      const target = document.querySelector(
        `[data-block-id="${prevBlock.id}"]`
      );
      if (target) {
        target.focus();
        target.setSelectionRange(target.value.length, target.value.length);
      }
    }
    if (e.key === "ArrowDown" && selectionStart === value.length && blockIdx < blocks.length - 1) {
      e.preventDefault();
      const nextBlock = blocks[blockIdx + 1];
      const target = document.querySelector(
        `[data-block-id="${nextBlock.id}"]`
      );
      if (target) {
        target.focus();
        target.setSelectionRange(0, 0);
      }
    }
    if (e.ctrlKey || e.metaKey) {
      if (e.key === "b") {
        e.preventDefault();
        applyInlineFormat(el, "**");
      } else if (e.key === "i") {
        e.preventDefault();
        applyInlineFormat(el, "_");
      } else if (e.key === "u") {
        e.preventDefault();
        applyInlineFormat(el, "__");
      } else if (e.key === "`") {
        e.preventDefault();
        applyInlineFormat(el, "`");
      } else if (e.key === "s") {
        e.preventDefault();
        handleSaveRef.current();
      }
    }
  }
  function applyInlineFormat(el, marker) {
    const { selectionStart: s, selectionEnd: e, value } = el;
    const selected = value.slice(s, e);
    const newVal = value.slice(0, s) + marker + selected + marker + value.slice(e);
    const blockId = el.dataset.blockId;
    if (blockId) {
      updateBlockContent(blockId, newVal);
      requestAnimationFrame(() => {
        el.setSelectionRange(s + marker.length, e + marker.length);
        el.focus();
      });
    }
  }
  function handleBlockFocus(id, el) {
    setActiveBlockId(id);
    setInlineToolbar(null);
    isEditingRef.current = true;
    if (el.value === "/") {
      const rect = el.getBoundingClientRect();
      setSlashMenu({
        blockId: id,
        query: "",
        position: { top: rect.bottom + 4, left: rect.left }
      });
    }
  }
  function handleSelection(el) {
    const { selectionStart, selectionEnd } = el;
    if (selectionStart !== selectionEnd) {
      const rect = el.getBoundingClientRect();
      const blockId = el.dataset.blockId;
      if (blockId)
        setInlineToolbar({
          position: { top: rect.top, left: rect.left + rect.width / 2 - 80 },
          blockId
        });
    } else {
      setInlineToolbar(null);
    }
  }
  function handleInlineFormat(tag) {
    if (!inlineToolbar) return;
    const el = document.querySelector(
      `[data-block-id="${inlineToolbar.blockId}"]`
    );
    if (!el) return;
    applyInlineFormat(el, tag === "link" ? "[" : tag);
    setInlineToolbar(null);
  }
  function handleSlashSelect(type) {
    if (!slashMenu) return;
    const { blockId } = slashMenu;
    setBlocks(
      (prev) => prev.map(
        (b) => b.id === blockId ? {
          ...b,
          type,
          content: "",
          calloutIcon: type === "callout" ? "💡" : void 0,
          language: type === "code" ? "plaintext" : void 0
        } : b
      )
    );
    setSlashMenu(null);
    requestAnimationFrame(() => {
      const el = document.querySelector(
        `[data-block-id="${blockId}"]`
      );
      el == null ? void 0 : el.focus();
    });
  }
  function handleMentionSelect(name) {
    if (!mentionMenu) return;
    const { blockId } = mentionMenu;
    setBlocks(
      (prev) => prev.map((b) => {
        if (b.id !== blockId) return b;
        const atPos = b.content.lastIndexOf("@");
        return { ...b, content: `${b.content.slice(0, atPos)}@${name} ` };
      })
    );
    setMentionMenu(null);
    requestAnimationFrame(() => {
      const el = document.querySelector(
        `[data-block-id="${blockId}"]`
      );
      if (el) {
        el.focus();
        el.setSelectionRange(el.value.length, el.value.length);
      }
    });
  }
  function handleDragDrop(fromIdx, toIdx) {
    if (fromIdx === toIdx) return;
    setBlocks((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
    setDragIdx(null);
  }
  function handleBlockAction(blockId, action, newType) {
    if (action === "turnInto" && newType) {
      setBlocks(
        (prev) => prev.map((b) => b.id === blockId ? { ...b, type: newType } : b)
      );
    } else if (action === "duplicate") {
      const blockIdx = blocks.findIndex((b) => b.id === blockId);
      if (blockIdx >= 0) {
        const copy = { ...blocks[blockIdx], id: generateId() };
        setBlocks((prev) => [
          ...prev.slice(0, blockIdx + 1),
          copy,
          ...prev.slice(blockIdx + 1)
        ]);
      }
    } else if (action === "delete") {
      if (blocks.length > 1) {
        setBlocks((prev) => prev.filter((b) => b.id !== blockId));
      }
    }
  }
  function handleTagKeyDown(e) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTags = editTagInput.split(",").map((t) => t.trim().toLowerCase()).filter((t) => t.length > 0 && !editTags.includes(t));
      if (newTags.length > 0) setEditTags((prev) => [...prev, ...newTags]);
      setEditTagInput("");
    }
  }
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 sm:p-6 max-w-3xl space-y-5 pb-20 md:pb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-8 rounded-lg" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-48" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3.5 w-32" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2.5", children: [1, 2, 3, 4, 5].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Skeleton,
        {
          className: `h-4 ${n % 2 === 0 ? "w-4/5" : "w-full"}`
        },
        n
      )) })
    ] });
  }
  if (isError || !note) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 sm:p-6 max-w-3xl pb-20 md:pb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", asChild: true, className: "mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/$workspaceId/notes", params: { workspaceId }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-16 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-medium text-foreground mb-1.5", children: "Note not found" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mb-5", children: "This note may have been deleted." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, variant: "outline", size: "sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/$workspaceId/notes", params: { workspaceId }, children: "Back to Notes" }) })
      ] })
    ] });
  }
  const activeCover = COVER_GRADIENTS.find((c) => c.id === cover);
  const tocItems = blocks.filter(
    (b) => b.type === "heading1" || b.type === "heading2" || b.type === "heading3"
  ).map((b) => ({
    id: b.id,
    level: b.type === "heading1" ? 1 : b.type === "heading2" ? 2 : 3,
    content: b.content || "(Untitled heading)"
  }));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "animate-fade-in-up pb-20 md:pb-8",
      onClick: () => {
        setSlashMenu(null);
        setBlockActions(null);
      },
      onKeyDown: (e) => {
        if (e.key === "Escape") {
          setSlashMenu(null);
          setBlockActions(null);
        }
      },
      onBlur: () => {
        isEditingRef.current = false;
      },
      role: "presentation",
      children: [
        slashMenu && /* @__PURE__ */ jsxRuntimeExports.jsx(
          SlashMenu,
          {
            query: slashMenu.query,
            position: slashMenu.position,
            onSelect: handleSlashSelect,
            onClose: () => setSlashMenu(null)
          }
        ),
        inlineToolbar && /* @__PURE__ */ jsxRuntimeExports.jsx(
          InlineToolbar,
          {
            position: inlineToolbar.position,
            onFormat: handleInlineFormat
          }
        ),
        mentionMenu && /* @__PURE__ */ jsxRuntimeExports.jsx(
          MentionPicker,
          {
            query: mentionMenu.query,
            position: mentionMenu.position,
            members,
            onSelect: handleMentionSelect,
            onClose: () => setMentionMenu(null)
          }
        ),
        blockActions && /* @__PURE__ */ jsxRuntimeExports.jsx(
          BlockActionsMenu,
          {
            blockId: blockActions.blockId,
            blockType: ((_a = blocks.find((b) => b.id === blockActions.blockId)) == null ? void 0 : _a.type) ?? "paragraph",
            position: blockActions.position,
            onTurnInto: (type) => handleBlockAction(blockActions.blockId, "turnInto", type),
            onDuplicate: () => handleBlockAction(blockActions.blockId, "duplicate"),
            onDelete: () => handleBlockAction(blockActions.blockId, "delete"),
            onClose: () => setBlockActions(null)
          }
        ),
        activeCover && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `relative h-36 sm:h-44 bg-gradient-to-r ${activeCover.value} overflow-hidden mb-0 group`,
            "data-ocid": "note-cover-banner",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex items-end justify-between px-4 pb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  variant: "secondary",
                  className: "text-xs h-7 gap-1.5 bg-background/80 backdrop-blur-sm",
                  onClick: () => setShowCoverPicker(true),
                  "data-ocid": "note-change-cover-btn",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3 w-3" }),
                    " Change cover"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  variant: "secondary",
                  className: "text-xs h-7 bg-background/80 backdrop-blur-sm",
                  onClick: () => {
                    setCover("");
                    setShowCoverPicker(false);
                  },
                  children: "Remove"
                }
              )
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-0 relative", children: [
          tocItems.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "aside",
            {
              className: "hidden xl:flex w-52 shrink-0 flex-col sticky top-4 self-start pt-16 pl-4 pr-2 space-y-0.5 max-h-[calc(100vh-4rem)] overflow-y-auto",
              "aria-label": "Table of contents",
              "data-ocid": "note-toc",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-2", children: "Contents" }),
                tocItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      const el = document.querySelector(
                        `[data-block-id="${item.id}"]`
                      );
                      if (el)
                        el.scrollIntoView({ behavior: "smooth", block: "center" });
                    },
                    className: `text-left rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors truncate ${item.level === 1 ? "font-semibold" : item.level === 2 ? "pl-4 font-medium" : "pl-6"}`,
                    "data-ocid": `toc-item-${item.id}`,
                    children: item.content
                  },
                  item.id
                ))
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 sm:p-8 max-w-3xl flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 mb-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  asChild: true,
                  className: "shrink-0 h-9 w-9 min-h-[44px] min-w-[44px]",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Link,
                    {
                      to: "/app/$workspaceId/notes",
                      params: { workspaceId },
                      "aria-label": "Back to notes",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" })
                    }
                  )
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SaveIndicator, { status: saveStatus }),
                !activeCover && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Popover,
                  {
                    open: showCoverPicker,
                    onOpenChange: setShowCoverPicker,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Button,
                        {
                          size: "sm",
                          variant: "ghost",
                          className: "h-8 text-xs text-muted-foreground gap-1.5",
                          "data-ocid": "note-add-cover-btn",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "h-3 w-3" }),
                            " Cover"
                          ]
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(PopoverContent, { className: "w-64 p-3", align: "end", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground mb-2", children: "Choose a gradient" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: COVER_GRADIENTS.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => {
                              setCover(g.id);
                              setShowCoverPicker(false);
                            },
                            className: `h-10 rounded-lg bg-gradient-to-r ${g.value} hover:ring-2 hover:ring-primary/60 transition-all ${cover === g.id ? "ring-2 ring-primary" : ""}`,
                            "aria-label": g.label
                          },
                          g.id
                        )) })
                      ] })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialog, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "sm",
                      variant: "ghost",
                      className: "h-8 text-destructive hover:text-destructive hover:bg-destructive/10",
                      "data-ocid": "note-delete-btn",
                      "aria-label": "Delete note",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { className: "mx-4 max-w-sm sm:max-w-md", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Delete this note?" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { children: [
                          '"',
                          note.title,
                          '"'
                        ] }),
                        " will be permanently deleted."
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { className: "flex-col-reverse sm:flex-row gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { className: "w-full sm:w-auto", children: "Cancel" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        AlertDialogAction,
                        {
                          onClick: () => deleteNote(),
                          disabled: isDeleting,
                          className: "bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full sm:w-auto",
                          "data-ocid": "note-delete-confirm-btn",
                          children: [
                            isDeleting && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin mr-2" }),
                            " ",
                            "Delete"
                          ]
                        }
                      )
                    ] })
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(PresenceBar, { editors: activeEditors }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { open: showEmojiPicker, onOpenChange: setShowEmojiPicker, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      className: "text-3xl h-10 w-10 flex items-center justify-center rounded-lg hover:bg-muted transition-colors",
                      "aria-label": "Set note icon",
                      "data-ocid": "note-icon-btn",
                      children: icon || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30 text-base", children: "📄" })
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(PopoverContent, { className: "w-64 p-2", align: "start", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground mb-2 px-1", children: "Pick an icon" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-10 gap-0.5", children: COMMON_EMOJIS.map((emoji) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          setIcon(emoji);
                          setShowEmojiPicker(false);
                        },
                        className: "h-7 w-7 flex items-center justify-center rounded text-lg hover:bg-muted transition-colors",
                        children: emoji
                      },
                      emoji
                    )) }),
                    icon && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          setIcon("");
                          setShowEmojiPicker(false);
                        },
                        className: "mt-2 w-full text-xs text-muted-foreground hover:text-foreground text-center py-1",
                        children: "Remove icon"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    value: editTitle,
                    onChange: (e) => setEditTitle(e.target.value),
                    onKeyDown: (e) => {
                      if (e.key === "Tab") {
                        e.preventDefault();
                        const firstBlock = blocks[0];
                        if (firstBlock) {
                          const target = document.querySelector(
                            `[data-block-id="${firstBlock.id}"]`
                          );
                          target == null ? void 0 : target.focus();
                        }
                      }
                    },
                    className: "flex-1 bg-transparent text-2xl sm:text-3xl font-bold font-display text-foreground outline-none placeholder:text-muted-foreground/30 tracking-tight",
                    placeholder: "Untitled",
                    "data-ocid": "note-title-input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "h-3 w-3 shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "Created",
                  " ",
                  new Date(
                    Number(note.createdAt) / 1e6
                  ).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                  })
                ] }),
                lastEdit && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40", children: "·" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "Last edited by",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: lastEdit.displayName }),
                    " ",
                    formatRelativeTime(lastEdit.editedAt)
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5 items-center mb-5", children: [
              editTags.map((tag) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary",
                  children: [
                    tag,
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setEditTags((prev) => prev.filter((t) => t !== tag)),
                        className: "hover:text-destructive rounded-sm",
                        "aria-label": `Remove tag ${tag}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-2.5 w-2.5" })
                      }
                    )
                  ]
                },
                tag
              )),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "+ Add tag",
                  value: editTagInput,
                  onChange: (e) => setEditTagInput(e.target.value),
                  onKeyDown: handleTagKeyDown,
                  onBlur: () => {
                    if (editTagInput.trim()) {
                      const newTags = editTagInput.split(",").map((t) => t.trim().toLowerCase()).filter((t) => t.length > 0 && !editTags.includes(t));
                      if (newTags.length > 0)
                        setEditTags((prev) => [...prev, ...newTags]);
                      setEditTagInput("");
                    }
                  },
                  className: "h-7 w-24 border-0 px-2 shadow-none bg-transparent text-xs focus-visible:ring-0 text-muted-foreground placeholder:text-muted-foreground/40",
                  "data-ocid": "note-tag-input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "space-y-1 relative pl-6",
                "data-ocid": "note-block-editor",
                children: [
                  blocks.map((block, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    BlockEditor,
                    {
                      block,
                      idx,
                      isActive: activeBlockId === block.id,
                      onChange: updateBlockContent,
                      onKeyDown: handleBlockKeyDown,
                      onFocus: handleBlockFocus,
                      onDragStart: (i) => setDragIdx(i),
                      onDrop: (i) => dragIdx !== null && handleDragDrop(dragIdx, i),
                      onToggleExpand: (id) => setBlocks(
                        (prev) => prev.map(
                          (b) => b.id === id ? { ...b, expanded: !b.expanded } : b
                        )
                      ),
                      onSelection: handleSelection,
                      onToggleCheck: (id) => setBlocks(
                        (prev) => prev.map(
                          (b) => b.id === id ? { ...b, checked: !b.checked } : b
                        )
                      ),
                      onOpenActions: (id, pos) => {
                        setBlockActions({ blockId: id, position: pos });
                      },
                      onLanguageChange: (id, lang) => setBlocks(
                        (prev) => prev.map(
                          (b) => b.id === id ? { ...b, language: lang } : b
                        )
                      )
                    },
                    block.id
                  )),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-6 pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => {
                        const newBlock = {
                          id: generateId(),
                          type: "paragraph",
                          content: ""
                        };
                        setBlocks((prev) => [...prev, newBlock]);
                        requestAnimationFrame(() => {
                          const el = document.querySelector(
                            `[data-block-id="${newBlock.id}"]`
                          );
                          el == null ? void 0 : el.focus();
                        });
                      },
                      className: "text-xs text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors",
                      "data-ocid": "note-add-block-btn",
                      children: "Start writing, or press / for commands"
                    }
                  ) })
                ]
              }
            ),
            (note.crossLinks.length > 0 || editCrossLinks.length > 0) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 pt-5 border-t border-border/40 space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "h-3.5 w-3.5 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground", children: "Cross-links" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                CrossLinkPicker,
                {
                  tenantId,
                  value: editCrossLinks,
                  onChange: setEditCrossLinks
                }
              )
            ] })
          ] })
        ] })
      ]
    }
  );
}
export {
  NoteDetailPage as default
};
