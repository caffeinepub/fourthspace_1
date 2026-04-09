import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bold,
  Calendar,
  Check,
  ChevronDown,
  Code,
  GripVertical,
  Hash,
  Image as ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  MessageSquare,
  Minus,
  Quote,
  Trash2,
  Type,
  Underline,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { CrossLinkPicker } from "../../components/CrossLinkPicker";
import { useBackend } from "../../hooks/useBackend";
import { useWorkspace } from "../../hooks/useWorkspace";
import type {
  BlockType,
  CrossLink,
  Note,
  NoteEditorPresence,
  NoteInput,
} from "../../types";

// ── Cover gradient presets ───────────────────────────────────────────────────
const COVER_GRADIENTS = [
  {
    id: "indigo-purple",
    label: "Indigo to Purple",
    value: "from-indigo-500 via-purple-500 to-pink-500",
  },
  {
    id: "ocean",
    label: "Ocean",
    value: "from-cyan-500 via-blue-500 to-indigo-600",
  },
  {
    id: "sunset",
    label: "Sunset",
    value: "from-orange-400 via-rose-500 to-pink-600",
  },
  {
    id: "forest",
    label: "Forest",
    value: "from-emerald-400 via-teal-500 to-cyan-600",
  },
  {
    id: "golden",
    label: "Golden",
    value: "from-yellow-400 via-orange-400 to-red-500",
  },
  {
    id: "midnight",
    label: "Midnight",
    value: "from-slate-700 via-purple-800 to-slate-900",
  },
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
  "🐬",
];

// ── Block types ──────────────────────────────────────────────────────────────
interface EditorBlock {
  id: string;
  type: BlockType;
  content: string;
  checked?: boolean;
  expanded?: boolean;
  calloutIcon?: string;
}

const BLOCK_TYPES: Array<{
  type: BlockType;
  label: string;
  description: string;
  icon: React.ReactNode;
  shortcut?: string;
}> = [
  {
    type: "paragraph",
    label: "Text",
    description: "Plain text paragraph",
    icon: <Type className="h-3.5 w-3.5" />,
  },
  {
    type: "heading1",
    label: "Heading 1",
    description: "Large heading",
    icon: <Hash className="h-3.5 w-3.5" />,
    shortcut: "# ",
  },
  {
    type: "heading2",
    label: "Heading 2",
    description: "Medium heading",
    icon: <Hash className="h-3 w-3" />,
    shortcut: "## ",
  },
  {
    type: "heading3",
    label: "Heading 3",
    description: "Small heading",
    icon: <Hash className="h-2.5 w-2.5" />,
    shortcut: "### ",
  },
  {
    type: "bulletList",
    label: "Bullet List",
    description: "Unordered list",
    icon: <List className="h-3.5 w-3.5" />,
    shortcut: "- ",
  },
  {
    type: "numberedList",
    label: "Numbered List",
    description: "Ordered list",
    icon: <ListOrdered className="h-3.5 w-3.5" />,
    shortcut: "1. ",
  },
  {
    type: "toggle",
    label: "Toggle",
    description: "Expandable section",
    icon: <ChevronDown className="h-3.5 w-3.5" />,
  },
  {
    type: "callout",
    label: "Callout",
    description: "Highlight a note",
    icon: <MessageSquare className="h-3.5 w-3.5" />,
  },
  {
    type: "code",
    label: "Code",
    description: "Code block",
    icon: <Code className="h-3.5 w-3.5" />,
    shortcut: "```",
  },
  {
    type: "quote",
    label: "Quote",
    description: "Blockquote",
    icon: <Quote className="h-3.5 w-3.5" />,
  },
  {
    type: "divider",
    label: "Divider",
    description: "Horizontal rule",
    icon: <Minus className="h-3.5 w-3.5" />,
    shortcut: "---",
  },
];

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

function serializeBlocks(blocks: EditorBlock[]): string {
  return blocks
    .map((b) => {
      switch (b.type) {
        case "heading1":
          return `# ${b.content}`;
        case "heading2":
          return `## ${b.content}`;
        case "heading3":
          return `### ${b.content}`;
        case "bulletList":
          return `- ${b.content}`;
        case "numberedList":
          return `1. ${b.content}`;
        case "toggle":
          return `> toggle: ${b.content}`;
        case "callout":
          return `> callout(${b.calloutIcon ?? "💡"}): ${b.content}`;
        case "code":
          return `\`\`\`\n${b.content}\n\`\`\``;
        case "quote":
          return `> ${b.content}`;
        case "divider":
          return "---";
        default:
          return b.content;
      }
    })
    .join("\n\n");
}

function deserializeBlocks(content: string): EditorBlock[] {
  if (!content.trim())
    return [{ id: generateId(), type: "paragraph", content: "" }];
  const parts = content.split(/\n\n/);
  const blocks: EditorBlock[] = [];
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
        content: line.slice(4),
      });
    } else if (line.startsWith("## ")) {
      blocks.push({
        id: generateId(),
        type: "heading2",
        content: line.slice(3),
      });
    } else if (line.startsWith("# ")) {
      blocks.push({
        id: generateId(),
        type: "heading1",
        content: line.slice(2),
      });
    } else if (line.startsWith("- ")) {
      blocks.push({
        id: generateId(),
        type: "bulletList",
        content: line.slice(2),
      });
    } else if (/^\d+\.\s/.test(line)) {
      blocks.push({
        id: generateId(),
        type: "numberedList",
        content: line.replace(/^\d+\.\s/, ""),
      });
    } else if (line.startsWith("> toggle: ")) {
      blocks.push({
        id: generateId(),
        type: "toggle",
        content: line.slice(10),
        expanded: true,
      });
    } else if (line.startsWith("> callout(")) {
      const m = line.match(/^> callout\((.+?)\): (.*)/);
      blocks.push({
        id: generateId(),
        type: "callout",
        content: m ? m[2] : line.slice(10),
        calloutIcon: m ? m[1] : "💡",
      });
    } else if (line.startsWith("```")) {
      // Consume multi-line code block
      const codeLines: string[] = [];
      const rest = line.slice(3);
      if (rest && rest !== "") codeLines.push(rest);
      i++;
      while (i < parts.length && !parts[i].trim().startsWith("```")) {
        codeLines.push(parts[i]);
        i++;
      }
      blocks.push({
        id: generateId(),
        type: "code",
        content: codeLines.join("\n\n"),
      });
    } else if (line.startsWith("> ")) {
      blocks.push({ id: generateId(), type: "quote", content: line.slice(2) });
    } else {
      blocks.push({ id: generateId(), type: "paragraph", content: line });
    }
    i++;
  }
  return blocks.length > 0
    ? blocks
    : [{ id: generateId(), type: "paragraph", content: "" }];
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatRelativeTime(nsTimestamp: bigint): string {
  const ms = Number(nsTimestamp) / 1_000_000;
  const diff = Date.now() - ms;
  const secs = Math.floor(diff / 1000);
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
    year: "numeric",
  });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

type SaveStatus = "idle" | "saving" | "saved";

function SaveIndicator({ status }: { status: SaveStatus }) {
  if (status === "idle") return null;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs transition-all duration-300 ${status === "saved" ? "text-accent" : "text-muted-foreground"}`}
    >
      {status === "saving" ? (
        <>
          <Loader2 className="h-3 w-3 animate-spin" /> Saving…
        </>
      ) : (
        <>
          <Check className="h-3 w-3" /> Saved
        </>
      )}
    </span>
  );
}

function PresenceBar({ editors }: { editors: NoteEditorPresence[] }) {
  if (editors.length === 0) return null;
  const shown = editors.slice(0, 3);
  const overflow = editors.length - 3;
  return (
    <div className="flex items-center gap-2 py-1" data-ocid="note-presence-bar">
      <div className="flex -space-x-1.5">
        {shown.map((ed) => (
          <div
            key={ed.userId.toString()}
            title={`${ed.displayName} is viewing`}
            className="relative h-6 w-6 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center"
          >
            <span className="text-[9px] font-bold text-primary leading-none">
              {getInitials(ed.displayName)}
            </span>
            <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-accent border border-background" />
          </div>
        ))}
        {overflow > 0 && (
          <div className="relative h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center">
            <span className="text-[9px] font-bold text-muted-foreground">
              +{overflow}
            </span>
          </div>
        )}
      </div>
      <span className="text-xs text-muted-foreground">
        {editors.length === 1
          ? `${editors[0].displayName} is viewing`
          : `${editors.length} people viewing`}
      </span>
    </div>
  );
}

// ── Slash Command Menu ───────────────────────────────────────────────────────
interface SlashMenuProps {
  query: string;
  position: { top: number; left: number };
  onSelect: (type: BlockType) => void;
  onClose: () => void;
}

function SlashMenu({ query, position, onSelect, onClose }: SlashMenuProps) {
  const [selected, setSelected] = useState(0);
  const filtered = BLOCK_TYPES.filter(
    (bt) =>
      bt.label.toLowerCase().includes(query.toLowerCase()) ||
      bt.description.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
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

  if (filtered.length === 0) return null;

  return (
    <div
      className="fixed z-50 w-64 rounded-xl border border-border bg-popover shadow-xl overflow-hidden"
      style={{ top: position.top, left: position.left }}
      data-ocid="slash-menu"
    >
      <div className="p-1.5">
        <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Block types
        </p>
        {filtered.map((bt, idx) => (
          <button
            key={bt.type}
            type="button"
            onClick={() => onSelect(bt.type)}
            className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${idx === selected ? "bg-primary/10 text-primary" : "hover:bg-muted text-foreground"}`}
            data-ocid={`slash-option-${bt.type}`}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background shrink-0">
              {bt.icon}
            </span>
            <div className="min-w-0">
              <p className="font-medium text-xs leading-tight">{bt.label}</p>
              <p className="text-muted-foreground text-[10px] truncate">
                {bt.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Inline Toolbar ───────────────────────────────────────────────────────────
interface InlineToolbarProps {
  position: { top: number; left: number };
  onFormat: (tag: string) => void;
}

function InlineToolbar({ position, onFormat }: InlineToolbarProps) {
  return (
    <div
      className="fixed z-50 flex items-center gap-0.5 rounded-lg border border-border bg-popover px-1.5 py-1 shadow-xl"
      style={{ top: position.top - 44, left: position.left }}
      data-ocid="inline-toolbar"
      onMouseDown={(e) => e.preventDefault()}
    >
      {[
        {
          label: "Bold",
          icon: <Bold className="h-3 w-3" />,
          tag: "**",
          ocid: "fmt-bold",
        },
        {
          label: "Italic",
          icon: <Italic className="h-3 w-3" />,
          tag: "_",
          ocid: "fmt-italic",
        },
        {
          label: "Underline",
          icon: <Underline className="h-3 w-3" />,
          tag: "__",
          ocid: "fmt-underline",
        },
        {
          label: "Code",
          icon: <Code className="h-3 w-3" />,
          tag: "`",
          ocid: "fmt-code",
        },
        {
          label: "Link",
          icon: <Link2 className="h-3 w-3" />,
          tag: "link",
          ocid: "fmt-link",
        },
      ].map((t) => (
        <button
          key={t.tag}
          type="button"
          title={t.label}
          aria-label={t.label}
          onClick={() => onFormat(t.tag)}
          className="flex h-7 w-7 items-center justify-center rounded-md text-foreground hover:bg-muted transition-colors"
          data-ocid={t.ocid}
        >
          {t.icon}
        </button>
      ))}
    </div>
  );
}

// ── Block Renderer ───────────────────────────────────────────────────────────
interface BlockProps {
  block: EditorBlock;
  idx: number;
  isActive: boolean;
  onChange: (id: string, content: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>, id: string) => void;
  onFocus: (id: string, el: HTMLTextAreaElement) => void;
  onDragStart: (idx: number) => void;
  onDrop: (idx: number) => void;
  onToggleExpand: (id: string) => void;
  onSelection: (el: HTMLTextAreaElement) => void;
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
}: BlockProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  });

  if (block.type === "divider") {
    return (
      <div
        className="group relative flex items-center gap-2 py-2 cursor-pointer"
        draggable
        onDragStart={() => onDragStart(idx)}
        onDrop={() => onDrop(idx)}
        onDragOver={(e) => e.preventDefault()}
        data-ocid={`block-divider-${block.id}`}
      >
        <button
          type="button"
          className="absolute -left-6 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab text-muted-foreground"
          title="Drag to reorder"
          aria-label="Drag block"
        >
          <GripVertical className="h-3.5 w-3.5" />
        </button>
        <hr className="flex-1 border-border" />
      </div>
    );
  }

  const typeStyles: Record<BlockType, string> = {
    heading1: "text-2xl font-bold font-display tracking-tight",
    heading2: "text-xl font-bold font-display tracking-tight",
    heading3: "text-base font-semibold font-display",
    paragraph: "text-sm leading-relaxed",
    bulletList: "text-sm leading-relaxed pl-4",
    numberedList: "text-sm leading-relaxed pl-4",
    toggle: "text-sm leading-relaxed font-medium",
    callout: "text-sm leading-relaxed",
    code: "text-xs font-mono leading-relaxed",
    quote: "text-sm leading-relaxed italic",
    divider: "",
    table: "text-sm",
    image: "text-sm",
  };

  const wrapperStyles: Partial<Record<BlockType, string>> = {
    callout: "bg-primary/5 border border-primary/20 rounded-lg px-4 py-2",
    code: "bg-muted/60 border border-border rounded-lg px-4 py-2",
    quote: "border-l-4 border-primary/50 pl-4",
    toggle: "",
  };

  return (
    <div
      className="group relative"
      draggable
      onDragStart={() => onDragStart(idx)}
      onDrop={() => onDrop(idx)}
      onDragOver={(e) => e.preventDefault()}
      data-ocid={`block-${block.id}`}
    >
      <button
        type="button"
        className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab text-muted-foreground"
        title="Drag to reorder"
        aria-label="Drag block"
      >
        <GripVertical className="h-3.5 w-3.5" />
      </button>

      {block.type === "toggle" && (
        <button
          type="button"
          onClick={() => onToggleExpand(block.id)}
          className="absolute -left-1 top-1 text-muted-foreground hover:text-foreground transition-colors"
          aria-label={block.expanded ? "Collapse" : "Expand"}
        >
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform ${block.expanded ? "" : "-rotate-90"}`}
          />
        </button>
      )}

      {block.type === "callout" && (
        <span className="absolute left-2 top-2 text-base">
          {block.calloutIcon ?? "💡"}
        </span>
      )}

      <div className={wrapperStyles[block.type] ?? ""}>
        {block.type === "bulletList" && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-foreground/50" />
        )}

        {block.type === "toggle" && !block.expanded ? (
          <button
            type="button"
            className={`${typeStyles.toggle} text-foreground/70 cursor-pointer pl-4 w-full text-left`}
            onClick={() => onToggleExpand(block.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onToggleExpand(block.id);
            }}
          >
            {block.content || (
              <span className="text-muted-foreground/50">Toggle block…</span>
            )}
          </button>
        ) : (
          <textarea
            ref={textareaRef}
            value={block.content}
            onChange={(e) => onChange(block.id, e.target.value)}
            onKeyDown={(e) => onKeyDown(e, block.id)}
            onFocus={(e) => onFocus(block.id, e.currentTarget)}
            onSelect={(e) => onSelection(e.currentTarget)}
            className={`w-full resize-none bg-transparent outline-none placeholder:text-muted-foreground/40 ${typeStyles[block.type] ?? "text-sm"} ${block.type === "callout" ? "pl-8" : ""} ${block.type === "numberedList" ? "pl-6" : ""}`}
            placeholder={
              block.type === "heading1"
                ? "Heading 1"
                : block.type === "heading2"
                  ? "Heading 2"
                  : block.type === "heading3"
                    ? "Heading 3"
                    : block.type === "callout"
                      ? "Callout note…"
                      : block.type === "code"
                        ? "Code…"
                        : block.type === "quote"
                          ? "Quote…"
                          : block.type === "toggle"
                            ? "Toggle title…"
                            : "Type something, or / for blocks"
            }
            rows={1}
            data-block-id={block.id}
            data-ocid={`block-input-${block.id}`}
            spellCheck={block.type !== "code"}
          />
        )}
      </div>
    </div>
  );
}

// ── @mention picker ──────────────────────────────────────────────────────────
interface MentionPickerProps {
  query: string;
  position: { top: number; left: number };
  members: Array<{ id: string; displayName: string }>;
  onSelect: (name: string) => void;
  onClose: () => void;
}

function MentionPicker({
  query,
  position,
  members,
  onSelect,
  onClose,
}: MentionPickerProps) {
  const filtered = members
    .filter((m) => m.displayName.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 6);
  const [sel, setSel] = useState(0);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
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

  return (
    <div
      className="fixed z-50 w-52 rounded-xl border border-border bg-popover shadow-xl overflow-hidden"
      style={{ top: position.top, left: position.left }}
      data-ocid="mention-picker"
    >
      {filtered.map((m, i) => (
        <button
          key={m.id}
          type="button"
          onClick={() => onSelect(m.displayName)}
          className={`flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors ${i === sel ? "bg-primary/10 text-primary" : "hover:bg-muted text-foreground"}`}
        >
          <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
            {m.displayName.slice(0, 2).toUpperCase()}
          </div>
          <span className="truncate">{m.displayName}</span>
        </button>
      ))}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function NoteDetailPage() {
  const { workspaceId, noteId } = useParams({
    from: "/app/$workspaceId/notes/$noteId",
  });
  const { actor, isFetching } = useBackend();
  const { tenantId } = useWorkspace();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Editor state
  const [editTitle, setEditTitle] = useState("");
  const [blocks, setBlocks] = useState<EditorBlock[]>([
    { id: generateId(), type: "paragraph", content: "" },
  ]);
  const [editTags, setEditTags] = useState<string[]>([]);
  const [editTagInput, setEditTagInput] = useState("");
  const [editCrossLinks, setEditCrossLinks] = useState<CrossLink[]>([]);

  // Cover & icon
  const [cover, setCover] = useState("");
  const [icon, setIcon] = useState("");
  const [showCoverPicker, setShowCoverPicker] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Save status
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Presence
  const [activeEditors, setActiveEditors] = useState<NoteEditorPresence[]>([]);
  const [lastEdit, setLastEdit] = useState<{
    displayName: string;
    editedAt: bigint;
  } | null>(null);
  const presenceIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );

  // Active block tracking
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  // Slash menu
  const [slashMenu, setSlashMenu] = useState<{
    blockId: string;
    query: string;
    position: { top: number; left: number };
  } | null>(null);

  // Inline toolbar
  const [inlineToolbar, setInlineToolbar] = useState<{
    position: { top: number; left: number };
    blockId: string;
  } | null>(null);

  // Mention picker
  const [mentionMenu, setMentionMenu] = useState<{
    blockId: string;
    query: string;
    position: { top: number; left: number };
  } | null>(null);
  const [members, setMembers] = useState<
    Array<{ id: string; displayName: string }>
  >([]);

  // Fetch note
  const {
    data: note,
    isLoading,
    isError,
  } = useQuery<Note | null>({
    queryKey: ["note", tenantId, workspaceId, noteId],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getNote(tenantId, workspaceId, noteId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    enabled: !!actor && !isFetching,
  });

  // Seed editor from note
  useEffect(() => {
    if (note) {
      setEditTitle(note.title);
      setBlocks(deserializeBlocks(note.content));
      setEditTags([...note.tags]);
      setEditCrossLinks([...note.crossLinks]);
      const noteWithMeta = note as Note & {
        coverGradient?: string;
        iconEmoji?: string;
      };
      if (noteWithMeta.coverGradient) setCover(noteWithMeta.coverGradient);
      if (noteWithMeta.iconEmoji) setIcon(noteWithMeta.iconEmoji);
    }
  }, [note]);

  // Fetch last edit info
  useEffect(() => {
    if (!actor || !noteId || isFetching) return;
    actor
      .getLastNoteEdit(tenantId, workspaceId, noteId)
      .then((r) => {
        if (r)
          setLastEdit({ displayName: r.displayName, editedAt: r.editedAt });
      })
      .catch(() => {});
  }, [actor, tenantId, workspaceId, noteId, isFetching]);

  // Fetch workspace members for @mentions
  useEffect(() => {
    if (!actor || isFetching) return;
    actor
      .listWorkspaceMembers(tenantId, workspaceId)
      .then((ms) => {
        setMembers(
          ms.map((m) => ({
            id: m.userId.toString(),
            displayName: m.displayName || m.userId.toString().slice(0, 8),
          })),
        );
      })
      .catch(() => {});
  }, [actor, tenantId, workspaceId, isFetching]);

  // Presence: update every 15s, poll every 8s
  useEffect(() => {
    if (!actor || !noteId || isFetching) return;
    const updatePresence = async () => {
      try {
        const profile = await actor.getMyProfile(tenantId);
        const displayName = profile
          ? `${(profile as { firstName?: string }).firstName ?? ""} ${(profile as { lastName?: string }).lastName ?? ""}`.trim() ||
            "Anonymous"
          : "Anonymous";
        await actor.updateNotePresence(
          tenantId,
          workspaceId,
          noteId,
          displayName,
        );
      } catch {}
    };
    const pollEditors = async () => {
      try {
        const editors = await actor.getNoteActiveEditors(
          tenantId,
          workspaceId,
          noteId,
        );
        setActiveEditors(editors);
      } catch {}
    };
    updatePresence();
    pollEditors();
    const presenceInterval = setInterval(updatePresence, 15_000);
    const pollInterval = setInterval(pollEditors, 8_000);
    presenceIntervalRef.current = presenceInterval;
    return () => {
      clearInterval(presenceInterval);
      clearInterval(pollInterval);
    };
  }, [actor, tenantId, workspaceId, noteId, isFetching]);

  const { mutate: updateNote } = useMutation({
    mutationFn: async (payload: NoteInput) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.updateNote(
        tenantId,
        workspaceId,
        noteId,
        payload,
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onMutate: () => setSaveStatus("saving"),
    onSuccess: (updated) => {
      queryClient.setQueryData(
        ["note", tenantId, workspaceId, noteId],
        updated,
      );
      queryClient.invalidateQueries({
        queryKey: ["notes", tenantId, workspaceId],
      });
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
      if (actor) {
        actor
          .getLastNoteEdit(tenantId, workspaceId, noteId)
          .then((r) => {
            if (r)
              setLastEdit({ displayName: r.displayName, editedAt: r.editedAt });
          })
          .catch(() => {});
      }
    },
    onError: (err: Error) => {
      setSaveStatus("idle");
      toast.error("Failed to save note", { description: err.message });
    },
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
        queryKey: ["notes", tenantId, workspaceId],
      });
      toast.success("Note deleted");
      navigate({ to: "/app/$workspaceId/notes", params: { workspaceId } });
    },
    onError: (err: Error) =>
      toast.error("Failed to delete note", { description: err.message }),
  });

  const handleSave = useCallback(() => {
    if (!editTitle.trim()) {
      toast.error("Title is required");
      return;
    }
    const payload: NoteInput = {
      title: editTitle.trim(),
      content: serializeBlocks(blocks),
      tags: editTags,
      crossLinks: editCrossLinks,
    };
    if (cover)
      (payload as NoteInput & { coverGradient?: string }).coverGradient = cover;
    if (icon) (payload as NoteInput & { iconEmoji?: string }).iconEmoji = icon;
    updateNote(payload);
  }, [editTitle, blocks, editTags, editCrossLinks, cover, icon, updateNote]);

  const handleSaveRef = useRef(handleSave);
  useEffect(() => {
    handleSaveRef.current = handleSave;
  }, [handleSave]);

  // Autosave: fires 2s after last change to title, blocks, tags, cover, or icon
  const triggerAutoSave = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (editTitle.trim()) handleSaveRef.current();
    }, 2000);
  }, [editTitle]);

  useEffect(() => {
    triggerAutoSave();
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [triggerAutoSave]);

  // Also trigger save when blocks/tags/cover/icon change (not just title)
  const blocksRef = useRef(blocks);
  useEffect(() => {
    if (blocksRef.current !== blocks) {
      blocksRef.current = blocks;
      triggerAutoSave();
    }
  }, [blocks, triggerAutoSave]);

  const editTagsRef = useRef(editTags);
  useEffect(() => {
    if (editTagsRef.current !== editTags) {
      editTagsRef.current = editTags;
      triggerAutoSave();
    }
  }, [editTags, triggerAutoSave]);

  // Block mutations
  function updateBlockContent(id: string, content: string) {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, content } : b)));
  }

  function checkMarkdownShortcut(value: string, blockId: string): boolean {
    const shortcuts: Array<{ prefix: string; type: BlockType }> = [
      { prefix: "# ", type: "heading1" },
      { prefix: "## ", type: "heading2" },
      { prefix: "### ", type: "heading3" },
      { prefix: "> ", type: "quote" },
      { prefix: "- ", type: "bulletList" },
      { prefix: "* ", type: "bulletList" },
      { prefix: "1. ", type: "numberedList" },
      { prefix: "``` ", type: "code" },
      { prefix: "```\n", type: "code" },
    ];
    for (const { prefix, type } of shortcuts) {
      if (value === prefix) {
        setBlocks((prev) =>
          prev.map((b) => (b.id === blockId ? { ...b, type, content: "" } : b)),
        );
        requestAnimationFrame(() => {
          const target = document.querySelector(
            `[data-block-id="${blockId}"]`,
          ) as HTMLTextAreaElement;
          if (target) target.value = "";
        });
        return true;
      }
    }
    return false;
  }

  function handleBlockKeyDown(
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    blockId: string,
  ) {
    const el = e.currentTarget;
    const { selectionStart, selectionEnd, value } = el;
    const blockIdx = blocks.findIndex((b) => b.id === blockId);

    // Markdown shortcut check on Space key
    if (e.key === " ") {
      const withSpace = `${value.slice(0, selectionStart)} `;
      if (checkMarkdownShortcut(withSpace, blockId)) {
        e.preventDefault();
        return;
      }
    }

    // Slash menu trigger
    if (e.key === "/" && selectionStart === 0 && value === "") {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      setSlashMenu({
        blockId,
        query: "",
        position: { top: rect.bottom + 4, left: rect.left },
      });
      return;
    }

    // @ mention trigger
    if (e.key === "@") {
      const rect = el.getBoundingClientRect();
      setTimeout(() => {
        setMentionMenu({
          blockId,
          query: "",
          position: { top: rect.bottom + 4, left: rect.left },
        });
      }, 10);
    }

    // Update slash/mention query
    if (slashMenu && slashMenu.blockId === blockId) {
      if (e.key === "Backspace" && slashMenu.query === "") {
        setSlashMenu(null);
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        setSlashMenu((s) => (s ? { ...s, query: s.query + e.key } : null));
      }
    }
    if (mentionMenu && mentionMenu.blockId === blockId) {
      if (e.key === "Backspace" && mentionMenu.query === "") {
        setMentionMenu(null);
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        setMentionMenu((s) => (s ? { ...s, query: s.query + e.key } : null));
      }
    }

    // Enter: add new paragraph block below
    if (e.key === "Enter" && !e.shiftKey && !slashMenu && !mentionMenu) {
      const block = blocks[blockIdx];
      if (block.type === "divider") {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      const before = value.slice(0, selectionStart);
      const after = value.slice(selectionEnd);
      // Split content
      const newBlock: EditorBlock = {
        id: generateId(),
        type: "paragraph",
        content: after,
      };
      updateBlockContent(blockId, before);
      setBlocks((prev) => [
        ...prev.slice(0, blockIdx + 1),
        newBlock,
        ...prev.slice(blockIdx + 1),
      ]);
      // Focus new block
      requestAnimationFrame(() => {
        const target = document.querySelector(
          `[data-block-id="${newBlock.id}"]`,
        ) as HTMLTextAreaElement;
        target?.focus();
        target?.setSelectionRange(0, 0);
      });
      return;
    }

    // Backspace on empty block → remove it
    if (e.key === "Backspace" && value === "" && blocks.length > 1) {
      e.preventDefault();
      setBlocks((prev) => prev.filter((b) => b.id !== blockId));
      // Focus previous block
      if (blockIdx > 0) {
        requestAnimationFrame(() => {
          const prevBlock = blocks[blockIdx - 1];
          const target = document.querySelector(
            `[data-block-id="${prevBlock.id}"]`,
          ) as HTMLTextAreaElement;
          if (target) {
            target.focus();
            target.setSelectionRange(target.value.length, target.value.length);
          }
        });
      }
      return;
    }

    // Arrow up/down to move between blocks
    if (e.key === "ArrowUp" && selectionStart === 0 && blockIdx > 0) {
      e.preventDefault();
      const prevBlock = blocks[blockIdx - 1];
      const target = document.querySelector(
        `[data-block-id="${prevBlock.id}"]`,
      ) as HTMLTextAreaElement;
      if (target) {
        target.focus();
        target.setSelectionRange(target.value.length, target.value.length);
      }
    }
    if (
      e.key === "ArrowDown" &&
      selectionStart === value.length &&
      blockIdx < blocks.length - 1
    ) {
      e.preventDefault();
      const nextBlock = blocks[blockIdx + 1];
      const target = document.querySelector(
        `[data-block-id="${nextBlock.id}"]`,
      ) as HTMLTextAreaElement;
      if (target) {
        target.focus();
        target.setSelectionRange(0, 0);
      }
    }

    // Inline formatting shortcuts
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

  function applyInlineFormat(el: HTMLTextAreaElement, marker: string) {
    const { selectionStart: s, selectionEnd: e, value } = el;
    const selected = value.slice(s, e);
    const newVal =
      value.slice(0, s) + marker + selected + marker + value.slice(e);
    const blockId = el.dataset.blockId;
    if (blockId) {
      updateBlockContent(blockId, newVal);
      requestAnimationFrame(() => {
        el.setSelectionRange(s + marker.length, e + marker.length);
        el.focus();
      });
    }
  }

  function handleBlockFocus(id: string, el: HTMLTextAreaElement) {
    setActiveBlockId(id);
    setInlineToolbar(null);
    // Check if there's a draft slash command
    if (el.value === "/") {
      const rect = el.getBoundingClientRect();
      setSlashMenu({
        blockId: id,
        query: "",
        position: { top: rect.bottom + 4, left: rect.left },
      });
    }
  }

  function handleSelection(el: HTMLTextAreaElement) {
    const { selectionStart, selectionEnd } = el;
    if (selectionStart !== selectionEnd) {
      const rect = el.getBoundingClientRect();
      const blockId = el.dataset.blockId;
      if (blockId) {
        setInlineToolbar({
          position: { top: rect.top, left: rect.left + rect.width / 2 - 80 },
          blockId,
        });
      }
    } else {
      setInlineToolbar(null);
    }
  }

  function handleInlineFormat(tag: string) {
    if (!inlineToolbar) return;
    const el = document.querySelector(
      `[data-block-id="${inlineToolbar.blockId}"]`,
    ) as HTMLTextAreaElement;
    if (!el) return;
    applyInlineFormat(el, tag === "link" ? "[" : tag);
    setInlineToolbar(null);
  }

  function handleSlashSelect(type: BlockType) {
    if (!slashMenu) return;
    const { blockId } = slashMenu;
    setBlocks((prev) =>
      prev.map((b) => (b.id === blockId ? { ...b, type, content: "" } : b)),
    );
    setSlashMenu(null);
    requestAnimationFrame(() => {
      const el = document.querySelector(
        `[data-block-id="${blockId}"]`,
      ) as HTMLTextAreaElement;
      el?.focus();
    });
  }

  function handleMentionSelect(name: string) {
    if (!mentionMenu) return;
    const { blockId } = mentionMenu;
    setBlocks((prev) =>
      prev.map((b) => {
        if (b.id !== blockId) return b;
        const atPos = b.content.lastIndexOf("@");
        return { ...b, content: `${b.content.slice(0, atPos)}@${name} ` };
      }),
    );
    setMentionMenu(null);
    requestAnimationFrame(() => {
      const el = document.querySelector(
        `[data-block-id="${blockId}"]`,
      ) as HTMLTextAreaElement;
      if (el) {
        el.focus();
        el.setSelectionRange(el.value.length, el.value.length);
      }
    });
  }

  function handleDragDrop(fromIdx: number, toIdx: number) {
    if (fromIdx === toIdx) return;
    setBlocks((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
    setDragIdx(null);
  }

  // Tag handlers
  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTags = editTagInput
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter((t) => t.length > 0 && !editTags.includes(t));
      if (newTags.length > 0) setEditTags((prev) => [...prev, ...newTags]);
      setEditTagInput("");
    }
  }

  // Loading / error states
  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 max-w-3xl space-y-5 pb-20 md:pb-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <div className="space-y-1.5">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-3.5 w-32" />
          </div>
        </div>
        <div className="space-y-2.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <Skeleton
              key={n}
              className={`h-4 ${n % 2 === 0 ? "w-4/5" : "w-full"}`}
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !note) {
    return (
      <div className="p-4 sm:p-6 max-w-3xl pb-20 md:pb-6">
        <Button variant="ghost" size="icon" asChild className="mb-6">
          <Link to="/app/$workspaceId/notes" params={{ workspaceId }}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-base font-medium text-foreground mb-1.5">
            Note not found
          </p>
          <p className="text-muted-foreground text-sm mb-5">
            This note may have been deleted.
          </p>
          <Button asChild variant="outline" size="sm">
            <Link to="/app/$workspaceId/notes" params={{ workspaceId }}>
              Back to Notes
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const activeCover = COVER_GRADIENTS.find((c) => c.id === cover);

  return (
    <div
      className="animate-fade-in-up pb-20 md:pb-8"
      onClick={() => {
        setSlashMenu(null);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") setSlashMenu(null);
      }}
      role="presentation"
    >
      {/* Slash menu */}
      {slashMenu && (
        <SlashMenu
          query={slashMenu.query}
          position={slashMenu.position}
          onSelect={handleSlashSelect}
          onClose={() => setSlashMenu(null)}
        />
      )}

      {/* Inline toolbar */}
      {inlineToolbar && (
        <InlineToolbar
          position={inlineToolbar.position}
          onFormat={handleInlineFormat}
        />
      )}

      {/* Mention picker */}
      {mentionMenu && (
        <MentionPicker
          query={mentionMenu.query}
          position={mentionMenu.position}
          members={members}
          onSelect={handleMentionSelect}
          onClose={() => setMentionMenu(null)}
        />
      )}

      {/* Cover banner */}
      {activeCover && (
        <div
          className={`relative h-36 sm:h-44 bg-gradient-to-r ${activeCover.value} overflow-hidden mb-0 group`}
          data-ocid="note-cover-banner"
        >
          <div className="absolute inset-0 flex items-end justify-between px-4 pb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              size="sm"
              variant="secondary"
              className="text-xs h-7 gap-1.5 bg-background/80 backdrop-blur-sm"
              onClick={() => setShowCoverPicker(true)}
              data-ocid="note-change-cover-btn"
            >
              <ChevronDown className="h-3 w-3" /> Change cover
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="text-xs h-7 bg-background/80 backdrop-blur-sm"
              onClick={() => {
                setCover("");
                setShowCoverPicker(false);
              }}
            >
              Remove
            </Button>
          </div>
        </div>
      )}

      <div className="p-4 sm:p-8 max-w-3xl">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="shrink-0 h-9 w-9 min-h-[44px] min-w-[44px]"
            >
              <Link
                to="/app/$workspaceId/notes"
                params={{ workspaceId }}
                aria-label="Back to notes"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <SaveIndicator status={saveStatus} />

            {!activeCover && (
              <Popover open={showCoverPicker} onOpenChange={setShowCoverPicker}>
                <PopoverTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 text-xs text-muted-foreground gap-1.5"
                    data-ocid="note-add-cover-btn"
                  >
                    <ImageIcon className="h-3 w-3" /> Cover
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-3" align="end">
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Choose a gradient
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {COVER_GRADIENTS.map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => {
                          setCover(g.id);
                          setShowCoverPicker(false);
                        }}
                        className={`h-10 rounded-lg bg-gradient-to-r ${g.value} hover:ring-2 hover:ring-primary/60 transition-all ${cover === g.id ? "ring-2 ring-primary" : ""}`}
                        aria-label={g.label}
                      />
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  data-ocid="note-delete-btn"
                  aria-label="Delete note"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="mx-4 max-w-sm sm:max-w-md">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this note?</AlertDialogTitle>
                  <AlertDialogDescription>
                    <strong>"{note.title}"</strong> will be permanently deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col-reverse sm:flex-row gap-2">
                  <AlertDialogCancel className="w-full sm:w-auto">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteNote()}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full sm:w-auto"
                    data-ocid="note-delete-confirm-btn"
                  >
                    {isDeleting && (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    )}{" "}
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Presence bar */}
        <PresenceBar editors={activeEditors} />

        {/* Note header: emoji icon + title */}
        <div className="mb-6 space-y-2">
          <div className="flex items-center gap-2">
            <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="text-3xl h-10 w-10 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
                  aria-label="Set note icon"
                  data-ocid="note-icon-btn"
                >
                  {icon || (
                    <span className="text-muted-foreground/30 text-base">
                      +
                    </span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2" align="start">
                <p className="text-xs font-medium text-muted-foreground mb-2 px-1">
                  Pick an icon
                </p>
                <div className="grid grid-cols-10 gap-0.5">
                  {COMMON_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => {
                        setIcon(emoji);
                        setShowEmojiPicker(false);
                      }}
                      className="h-7 w-7 flex items-center justify-center rounded text-lg hover:bg-muted transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                {icon && (
                  <button
                    type="button"
                    onClick={() => {
                      setIcon("");
                      setShowEmojiPicker(false);
                    }}
                    className="mt-2 w-full text-xs text-muted-foreground hover:text-foreground text-center py-1"
                  >
                    Remove icon
                  </button>
                )}
              </PopoverContent>
            </Popover>

            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="flex-1 bg-transparent text-2xl sm:text-3xl font-bold font-display text-foreground outline-none placeholder:text-muted-foreground/30 tracking-tight"
              placeholder="Untitled"
              data-ocid="note-title-input"
            />
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 shrink-0" />
            <span>
              Created{" "}
              {new Date(Number(note.createdAt) / 1_000_000).toLocaleDateString(
                "en-US",
                { month: "long", day: "numeric", year: "numeric" },
              )}
            </span>
            {lastEdit && (
              <>
                <span className="text-muted-foreground/40">·</span>
                <span>
                  Last edited by{" "}
                  <span className="text-foreground font-medium">
                    {lastEdit.displayName}
                  </span>{" "}
                  {formatRelativeTime(lastEdit.editedAt)}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 items-center mb-5">
          {editTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary"
            >
              {tag}
              <button
                type="button"
                onClick={() =>
                  setEditTags((prev) => prev.filter((t) => t !== tag))
                }
                className="hover:text-destructive rounded-sm"
                aria-label={`Remove tag ${tag}`}
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          ))}
          <Input
            placeholder="+ Add tag"
            value={editTagInput}
            onChange={(e) => setEditTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            onBlur={() => {
              if (editTagInput.trim()) {
                const newTags = editTagInput
                  .split(",")
                  .map((t) => t.trim().toLowerCase())
                  .filter((t) => t.length > 0 && !editTags.includes(t));
                if (newTags.length > 0)
                  setEditTags((prev) => [...prev, ...newTags]);
                setEditTagInput("");
              }
            }}
            className="h-7 w-24 border-0 px-2 shadow-none bg-transparent text-xs focus-visible:ring-0 text-muted-foreground placeholder:text-muted-foreground/40"
            data-ocid="note-tag-input"
          />
        </div>

        {/* Block editor */}
        <div className="space-y-1 relative pl-6" data-ocid="note-block-editor">
          {blocks.map((block, idx) => (
            <BlockEditor
              key={block.id}
              block={block}
              idx={idx}
              isActive={activeBlockId === block.id}
              onChange={updateBlockContent}
              onKeyDown={handleBlockKeyDown}
              onFocus={handleBlockFocus}
              onDragStart={(i) => setDragIdx(i)}
              onDrop={(i) => dragIdx !== null && handleDragDrop(dragIdx, i)}
              onToggleExpand={(id) =>
                setBlocks((prev) =>
                  prev.map((b) =>
                    b.id === id ? { ...b, expanded: !b.expanded } : b,
                  ),
                )
              }
              onSelection={handleSelection}
            />
          ))}

          {/* Add block hint */}
          <div className="pt-4 pb-2">
            <button
              type="button"
              onClick={() => {
                const newBlock: EditorBlock = {
                  id: generateId(),
                  type: "paragraph",
                  content: "",
                };
                setBlocks((prev) => [...prev, newBlock]);
                requestAnimationFrame(() => {
                  const el = document.querySelector(
                    `[data-block-id="${newBlock.id}"]`,
                  ) as HTMLTextAreaElement;
                  el?.focus();
                });
              }}
              className="text-xs text-muted-foreground/40 hover:text-muted-foreground transition-colors"
              data-ocid="note-add-block-btn"
            >
              Click to add a block, or type / to pick a type
            </button>
          </div>
        </div>

        {/* Cross-links */}
        {(note.crossLinks.length > 0 || editCrossLinks.length > 0) && (
          <div className="mt-6 pt-5 border-t border-border/40 space-y-2">
            <div className="flex items-center gap-1.5">
              <Link2 className="h-3.5 w-3.5 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">
                Cross-links
              </h2>
            </div>
            <CrossLinkPicker
              tenantId={tenantId}
              value={editCrossLinks}
              onChange={setEditCrossLinks}
            />
          </div>
        )}
      </div>
    </div>
  );
}
