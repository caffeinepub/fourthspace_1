import { t as createLucideIcon, r as reactExports, j as jsxRuntimeExports, B as Button, m as useParams, n as useQueryClient, g as getTenantId, d as useNavigate, h as useQuery, i as Link, X, b as MessageSquare, F as FileText } from "./index-DemOGW1B.js";
import { B as Badge } from "./badge-BgvX66QS.js";
import { S as ScrollArea } from "./scroll-area-DndIXHgD.js";
import { S as Separator } from "./separator-BpTCfbtM.js";
import { S as Skeleton } from "./skeleton-M5HtR2mS.js";
import { T as Textarea } from "./textarea-DdbmcPlU.js";
import { u as useMutation } from "./useMutation-4TvYOXEz.js";
import { u as ue } from "./index-BBpqu5x7.js";
import { P as Popover, a as PopoverTrigger, b as PopoverContent } from "./popover-BPsRruq-.js";
import { u as useBackend } from "./index-CeqQA3r7.js";
import { A as ArrowLeft } from "./arrow-left-lpbCbWBz.js";
import { H as Hash } from "./hash-BDKk6UFe.js";
import { U as Users } from "./users-CP73E1L-.js";
import { S as Send } from "./send-Dgz6jlfL.js";
import { G as Globe } from "./globe-CXaldVnt.js";
import { L as Lock } from "./lock-C1VmcN9s.js";
import { P as Pin } from "./pin-Bl32MLhp.js";
import { L as Link2 } from "./link-2-CeDyFl-9.js";
import { D as Download } from "./download-C-gBOiYU.js";
import { B as Bold, I as Italic, C as Code } from "./italic-CbSQ3VDA.js";
import { L as List } from "./list-BsGv3Gll.js";
import "./index-IXOTxK3N.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M20 20v-7a4 4 0 0 0-4-4H4", key: "1nkjon" }],
  ["path", { d: "M9 14 4 9l5-5", key: "102s5s" }]
];
const CornerUpLeft = createLucideIcon("corner-up-left", __iconNode);
const EMOJI_CATEGORIES = [
  {
    label: "Reactions",
    emojis: ["👍", "👎", "❤️", "😂", "😮", "😢", "😡", "🎉", "🙏", "🔥"]
  },
  {
    label: "People",
    emojis: ["😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😊", "😇", "🥰"]
  },
  {
    label: "Objects",
    emojis: ["💡", "✅", "❌", "⚡", "🚀", "💯", "📌", "📎", "🔑", "💬"]
  },
  {
    label: "Symbols",
    emojis: ["⭐", "✨", "💥", "🌟", "🎯", "🏆", "🥇", "💪", "👀", "🤔"]
  }
];
function EmojiPicker({ onEmojiSelect, trigger }) {
  const [open, setOpen] = reactExports.useState(false);
  function handleSelect(emoji) {
    onEmojiSelect(emoji);
    setOpen(false);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: trigger ?? /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        variant: "ghost",
        size: "icon",
        className: "h-6 w-6 text-muted-foreground hover:text-foreground",
        "aria-label": "Add reaction",
        "data-ocid": "emoji-picker-trigger",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "😊" })
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PopoverContent,
      {
        className: "w-72 p-2",
        side: "top",
        align: "start",
        "data-ocid": "emoji-picker-popover",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: EMOJI_CATEGORIES.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 px-1", children: cat.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-10 gap-0.5", children: cat.emojis.map((emoji) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => handleSelect(emoji),
              className: "flex h-7 w-7 items-center justify-center rounded hover:bg-muted transition-colors text-base",
              title: emoji,
              children: emoji
            },
            emoji
          )) })
        ] }, cat.label)) })
      }
    )
  ] });
}
const PREFIX = "fourthspace_chat_draft_";
function saveDraft(channelId, content) {
  if (content.trim()) {
    localStorage.setItem(`${PREFIX}${channelId}`, content);
  } else {
    localStorage.removeItem(`${PREFIX}${channelId}`);
  }
}
function getDraft(channelId) {
  return localStorage.getItem(`${PREFIX}${channelId}`) ?? "";
}
function clearDraft(channelId) {
  localStorage.removeItem(`${PREFIX}${channelId}`);
}
function applyBold(value, selStart, selEnd) {
  return wrapSelection(value, selStart, selEnd, "**", "**");
}
function applyItalic(value, selStart, selEnd) {
  return wrapSelection(value, selStart, selEnd, "_", "_");
}
function applyCode(value, selStart, selEnd) {
  return wrapSelection(value, selStart, selEnd, "`", "`");
}
function applyBulletList(value, selStart, selEnd) {
  const lineStart = value.lastIndexOf("\n", selStart - 1) + 1;
  const before = value.slice(0, lineStart);
  const after = value.slice(lineStart);
  const newValue = `${before}• ${after}`;
  const offset = 2;
  return [newValue, selStart + offset, selEnd + offset];
}
function wrapSelection(value, selStart, selEnd, prefix, suffix) {
  const selected = value.slice(selStart, selEnd);
  const newValue = value.slice(0, selStart) + prefix + selected + suffix + value.slice(selEnd);
  return [newValue, selStart + prefix.length, selEnd + prefix.length];
}
function renderFormattedText(content) {
  let html = content.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(new RegExp("(?<!\\*)\\*(?!\\*)(.+?)(?<!\\*)\\*(?!\\*)", "g"), "<em>$1</em>");
  html = html.replace(/_(.+?)_/g, "<em>$1</em>");
  html = html.replace(
    /`([^`]+)`/g,
    '<code class="bg-muted px-1 py-0.5 rounded text-xs font-mono">$1</code>'
  );
  html = html.replace(
    /^[•\-] (.+)$/gm,
    '<span class="flex gap-1.5"><span>•</span><span>$1</span></span>'
  );
  html = html.replace(/\n/g, "<br/>");
  return html;
}
function isImageUrl(url) {
  return /\.(png|jpg|jpeg|gif|webp)(\?.*)?$/i.test(url);
}
function isPdfUrl(url) {
  return /\.pdf(\?.*)?$/i.test(url);
}
function filenameFromUrl(url) {
  try {
    const path = new URL(url).pathname;
    return decodeURIComponent(path.split("/").pop() ?? url);
  } catch {
    return url.split("/").pop() ?? url;
  }
}
function extractUrls(content) {
  const re = /https?:\/\/[^\s"'<>]+/g;
  return content.match(re) ?? [];
}
function FormattedContent({ html }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "p",
    {
      className: "text-sm text-foreground leading-relaxed",
      ref: (el) => {
        if (el) el.innerHTML = html;
      }
    }
  );
}
function senderInitials(id) {
  const s = id.toString();
  return s.slice(0, 2).toUpperCase();
}
const AVATAR_COLORS = [
  "bg-teal-500/20 text-teal-700 dark:text-teal-300",
  "bg-violet-500/20 text-violet-700 dark:text-violet-300",
  "bg-orange-500/20 text-orange-700 dark:text-orange-300",
  "bg-sky-500/20 text-sky-700 dark:text-sky-300",
  "bg-pink-500/20 text-pink-700 dark:text-pink-300"
];
function avatarColor(id) {
  let hash = 0;
  const s = id.toString();
  for (let i = 0; i < s.length; i++)
    hash = hash * 31 + s.charCodeAt(i) & 65535;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}
function formatRelativeTime(createdAt) {
  const ms = Number(createdAt) / 1e6;
  const diffMs = Date.now() - ms;
  if (diffMs < 6e4) return "just now";
  if (diffMs < 36e5) return `${Math.floor(diffMs / 6e4)}m ago`;
  const d = new Date(ms);
  const today = /* @__PURE__ */ new Date();
  if (d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}
function FileAttachments({ content }) {
  const urls = extractUrls(content);
  if (urls.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 space-y-1.5", children: urls.map((url) => {
    if (isImageUrl(url)) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: url,
          alt: "attachment",
          className: "max-h-48 max-w-xs rounded-lg border border-border object-cover",
          loading: "lazy"
        },
        url
      );
    }
    if (isPdfUrl(url)) {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "a",
        {
          href: url,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "inline-flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-xs hover:bg-muted transition-colors",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-3.5 w-3.5 text-red-500 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate max-w-[180px]", children: filenameFromUrl(url) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px] py-0", children: "PDF" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-3 w-3 text-muted-foreground" })
          ]
        },
        url
      );
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "a",
      {
        href: url,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "inline-flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-1.5 text-xs hover:bg-muted transition-colors",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-3.5 w-3.5 text-muted-foreground shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate max-w-[200px]", children: filenameFromUrl(url) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-3 w-3 text-muted-foreground" })
        ]
      },
      url
    );
  }) });
}
function ReactionBar({ reactions, myPrincipal, onToggle }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-1 mt-1.5", children: [
    reactions.map((r) => {
      const isOwn = r.userIds.some((u) => u.toString() === myPrincipal);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => onToggle(r.emoji, isOwn),
          className: `inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-colors ${isOwn ? "border-teal-500/60 bg-teal-500/10 text-teal-700 dark:text-teal-300" : "border-border bg-muted/40 hover:bg-muted text-foreground"}`,
          "data-ocid": `reaction-${r.emoji}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: r.emoji }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: r.userIds.length })
          ]
        },
        r.emoji
      );
    }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmojiPicker,
      {
        onEmojiSelect: (emoji) => {
          const existing = reactions.find((r) => r.emoji === emoji);
          const isOwn = (existing == null ? void 0 : existing.userIds.some((u) => u.toString() === myPrincipal)) ?? false;
          onToggle(emoji, isOwn);
        },
        trigger: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "inline-flex items-center rounded-full border border-border bg-muted/40 hover:bg-muted px-2 py-0.5 text-xs text-muted-foreground transition-colors",
            "aria-label": "Add reaction",
            "data-ocid": "add-reaction-btn",
            children: "+😊"
          }
        )
      }
    )
  ] });
}
function MessageBubble({
  msg,
  replyTarget,
  onReply,
  onPin,
  onReaction,
  isPinned,
  myPrincipal,
  isMention,
  workspaceId,
  isGrouped = false
}) {
  const formattedHtml = renderFormattedText(msg.content);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `group flex items-start gap-3 px-4 rounded-xl transition-colors ${isMention ? "border-l-2 border-amber-500 bg-amber-500/5 hover:bg-amber-500/8 py-2" : isGrouped ? "py-0.5 hover:bg-muted/30" : "py-2 hover:bg-muted/30"}`,
      "data-ocid": `message-${msg.id}`,
      children: [
        isGrouped ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 shrink-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity", children: formatRelativeTime(msg.createdAt).split(" ").slice(-1)[0] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarColor(msg.senderId)}`,
            children: senderInitials(msg.senderId)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 space-y-0.5", children: [
          !isGrouped && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold text-foreground", children: [
              msg.senderId.toString().slice(0, 10),
              "…"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: formatRelativeTime(msg.createdAt) }),
            isPinned && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Badge,
              {
                variant: "outline",
                className: "text-[10px] py-0 gap-0.5 border-amber-500/40 text-amber-600 dark:text-amber-400",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Pin, { className: "h-2.5 w-2.5" }),
                  "Pinned"
                ]
              }
            )
          ] }),
          replyTarget && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 rounded-lg border-l-2 border-teal-500 bg-teal-500/5 px-3 py-1.5 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CornerUpLeft, { className: "h-3 w-3 shrink-0 mt-0.5 text-teal-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "line-clamp-1", children: replyTarget.content })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FormattedContent, { html: formattedHtml }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileAttachments, { content: msg.content }),
          msg.crossLinks.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5 mt-1", children: msg.crossLinks.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              variant: "outline",
              className: "text-xs gap-1 py-0",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "h-2.5 w-2.5" }),
                link.linkLabel || link.entityType
              ]
            },
            link.entityId
          )) }),
          msg.reactions && msg.reactions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            ReactionBar,
            {
              reactions: msg.reactions,
              myPrincipal,
              onToggle: (emoji, isOwn) => onReaction(msg.id, emoji, isOwn)
            }
          ),
          msg.threadCount !== void 0 && msg.threadCount > BigInt(0) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: "/app/$workspaceId/chat/$channelId/thread/$messageId",
              params: {
                workspaceId,
                channelId: msg.channelId,
                messageId: msg.id
              },
              className: "inline-flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400 hover:underline mt-1",
              "data-ocid": `thread-link-${msg.id}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-3 w-3" }),
                msg.threadCount.toString(),
                " repl",
                msg.threadCount === BigInt(1) ? "y" : "ies"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            EmojiPicker,
            {
              onEmojiSelect: (emoji) => {
                var _a;
                const existing = (_a = msg.reactions) == null ? void 0 : _a.find((r) => r.emoji === emoji);
                const isOwn = (existing == null ? void 0 : existing.userIds.some((u) => u.toString() === myPrincipal)) ?? false;
                onReaction(msg.id, emoji, isOwn);
              },
              trigger: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "h-6 w-6",
                  "aria-label": "React",
                  "data-ocid": `react-btn-${msg.id}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: "😊" })
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: "h-6 w-6",
              onClick: () => onPin(msg.id),
              "aria-label": isPinned ? "Unpin message" : "Pin message",
              "data-ocid": `pin-btn-${msg.id}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pin, { className: "h-3.5 w-3.5 text-muted-foreground" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: "h-6 w-6",
              onClick: () => onReply(msg),
              "aria-label": "Reply in thread",
              "data-ocid": `reply-btn-${msg.id}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(CornerUpLeft, { className: "h-3.5 w-3.5 text-muted-foreground" })
            }
          )
        ] })
      ]
    }
  );
}
function ChannelInfoPanel({ channel }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "hidden lg:flex w-64 flex-col border-r border-border bg-card/60 p-4 space-y-4 shrink-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { className: "h-4 w-4 text-teal-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-foreground text-sm", children: channel.name })
      ] }),
      channel.isPublic ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Badge,
        {
          variant: "outline",
          className: "text-xs gap-1 border-teal-500/30 text-teal-600 dark:text-teal-400",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-2.5 w-2.5" }),
            "Public"
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-xs gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-2.5 w-2.5" }),
        "Private"
      ] }),
      channel.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground pt-1 leading-relaxed", children: channel.description }),
      channel.topic && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-teal-600 dark:text-teal-400 italic leading-relaxed border-t border-border pt-1", children: [
        "📌 ",
        channel.topic
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
    channel.pinnedMessageIds && channel.pinnedMessageIds.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Pin, { className: "h-3.5 w-3.5 text-amber-500" }),
      channel.pinnedMessageIds.length,
      " pinned message",
      channel.pinnedMessageIds.length !== 1 ? "s" : ""
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3.5 w-3.5" }),
        "Members (",
        channel.memberIds.length,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        channel.memberIds.slice(0, 8).map((memberId) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${avatarColor(memberId)}`,
              children: senderInitials(memberId)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-foreground truncate", children: [
            memberId.toString().slice(0, 12),
            "…"
          ] })
        ] }, memberId.toString())),
        channel.memberIds.length > 8 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground pl-8", children: [
          "+",
          channel.memberIds.length - 8,
          " more"
        ] })
      ] })
    ] })
  ] });
}
function FormattingToolbar({
  textareaRef,
  value,
  onChange
}) {
  function apply(fn) {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const [newVal, newStart, newEnd] = fn(value, start, end);
    onChange(newVal);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(newStart, newEnd);
    });
  }
  const tools = [
    {
      label: "Bold",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Bold, { className: "h-3.5 w-3.5" }),
      shortcut: "Cmd+B",
      fn: applyBold,
      ocid: "fmt-bold"
    },
    {
      label: "Italic",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Italic, { className: "h-3.5 w-3.5" }),
      shortcut: "Cmd+I",
      fn: applyItalic,
      ocid: "fmt-italic"
    },
    {
      label: "Code",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Code, { className: "h-3.5 w-3.5" }),
      shortcut: "Cmd+`",
      fn: applyCode,
      ocid: "fmt-code"
    },
    {
      label: "Bullet",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(List, { className: "h-3.5 w-3.5" }),
      shortcut: "Cmd+Shift+8",
      fn: applyBulletList,
      ocid: "fmt-bullet"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-0.5 border-b border-border pb-1.5 mb-1", children: tools.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    Button,
    {
      type: "button",
      variant: "ghost",
      size: "icon",
      className: "h-7 w-7 text-muted-foreground hover:text-foreground",
      title: `${t.label} (${t.shortcut})`,
      "aria-label": t.label,
      onClick: () => apply(t.fn),
      "data-ocid": t.ocid,
      children: t.icon
    },
    t.label
  )) });
}
function ChannelPage() {
  var _a;
  const { workspaceId, channelId } = useParams({ strict: false });
  const { actor, isFetching } = useBackend();
  const queryClient = useQueryClient();
  const tenantId = getTenantId();
  const navigate = useNavigate();
  const [myPrincipal] = reactExports.useState(() => "");
  const [messageText, setMessageText] = reactExports.useState(() => getDraft(channelId));
  const [replyTo, setReplyTo] = reactExports.useState(null);
  const [hasDraft] = reactExports.useState(() => getDraft(channelId).length > 0);
  const textareaRef = reactExports.useRef(null);
  const bottomRef = reactExports.useRef(null);
  const scrollAreaRef = reactExports.useRef(null);
  const { data: channel } = useQuery({
    queryKey: ["channel", tenantId, workspaceId, channelId],
    queryFn: async () => {
      if (!actor) return null;
      const r = await actor.getChannel(tenantId, workspaceId, channelId);
      return r.__kind__ === "ok" ? r.ok : null;
    },
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const { data: messages, isLoading } = useQuery({
    queryKey: ["messages", tenantId, workspaceId, channelId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMessages(
        tenantId,
        workspaceId,
        channelId,
        BigInt(50),
        null
      );
    },
    enabled: !!actor && !isFetching && !!workspaceId,
    refetchInterval: 2e3
  });
  reactExports.useEffect(() => {
    if (!actor || !channelId || isFetching || !workspaceId) return;
    actor.markChannelRead(tenantId, workspaceId, channelId).then(() => {
      queryClient.invalidateQueries({
        queryKey: ["unreadCounts", tenantId, workspaceId]
      });
    }).catch(() => {
    });
  }, [actor, channelId, isFetching, tenantId, workspaceId, queryClient]);
  const prevMsgCountRef = reactExports.useRef(0);
  reactExports.useEffect(() => {
    const msgCount = (messages == null ? void 0 : messages.length) ?? 0;
    if (msgCount !== prevMsgCountRef.current) {
      prevMsgCountRef.current = msgCount;
      requestAnimationFrame(() => {
        var _a2;
        (_a2 = bottomRef.current) == null ? void 0 : _a2.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, [messages]);
  function handleTextChange(v) {
    setMessageText(v);
    saveDraft(channelId, v);
  }
  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
      return;
    }
    if (e.key === "Escape") {
      setReplyTo(null);
      return;
    }
    const meta = e.metaKey || e.ctrlKey;
    if (!meta) return;
    const el = textareaRef.current;
    if (!el) return;
    const s = el.selectionStart;
    const end = el.selectionEnd;
    if (e.key === "b") {
      e.preventDefault();
      const [v, ns, ne] = applyBold(messageText, s, end);
      handleTextChange(v);
      requestAnimationFrame(() => el.setSelectionRange(ns, ne));
    } else if (e.key === "i") {
      e.preventDefault();
      const [v, ns, ne] = applyItalic(messageText, s, end);
      handleTextChange(v);
      requestAnimationFrame(() => el.setSelectionRange(ns, ne));
    } else if (e.key === "`") {
      e.preventDefault();
      const [v, ns, ne] = applyCode(messageText, s, end);
      handleTextChange(v);
      requestAnimationFrame(() => el.setSelectionRange(ns, ne));
    }
  }
  const sendMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.sendMessage(tenantId, workspaceId, {
        content: messageText.trim(),
        channelId,
        replyToId: replyTo == null ? void 0 : replyTo.id,
        crossLinks: []
      });
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", tenantId, workspaceId, channelId]
      });
      queryClient.invalidateQueries({
        queryKey: ["unreadCounts", tenantId, workspaceId]
      });
      clearDraft(channelId);
      setMessageText("");
      setReplyTo(null);
    },
    onError: (err) => ue.error(err.message)
  });
  const reactionMutation = useMutation({
    mutationFn: async ({
      messageId,
      emoji,
      isOwn
    }) => {
      if (!actor) throw new Error("Not connected");
      if (isOwn) {
        const r = await actor.removeReaction(
          tenantId,
          workspaceId,
          messageId,
          emoji
        );
        if (r.__kind__ === "err") throw new Error(r.err);
      } else {
        const r = await actor.addReaction(
          tenantId,
          workspaceId,
          messageId,
          emoji
        );
        if (r.__kind__ === "err") throw new Error(r.err);
      }
    },
    onSuccess: () => queryClient.invalidateQueries({
      queryKey: ["messages", tenantId, workspaceId, channelId]
    }),
    onError: (err) => ue.error(err.message)
  });
  const pinMutation = useMutation({
    mutationFn: async (messageId) => {
      var _a2;
      if (!actor) throw new Error("Not connected");
      const isPinned = (_a2 = channel == null ? void 0 : channel.pinnedMessageIds) == null ? void 0 : _a2.includes(messageId);
      if (isPinned) {
        const r = await actor.unpinMessage(
          tenantId,
          workspaceId,
          channelId,
          messageId
        );
        if (r.__kind__ === "err") throw new Error(r.err);
      } else {
        const r = await actor.pinMessage(
          tenantId,
          workspaceId,
          channelId,
          messageId
        );
        if (r.__kind__ === "err") throw new Error(r.err);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["channel", tenantId, workspaceId, channelId]
      });
      ue.success("Pin updated");
    },
    onError: (err) => ue.error(err.message)
  });
  const messageMap = new Map(
    (messages == null ? void 0 : messages.map((m) => [m.id, m])) ?? []
  );
  const pinnedIds = new Set((channel == null ? void 0 : channel.pinnedMessageIds) ?? []);
  function isGrouped(idx) {
    if (!messages || idx === 0) return false;
    const prev = messages[idx - 1];
    const curr = messages[idx];
    if (prev.senderId.toString() !== curr.senderId.toString()) return false;
    const timeDiff = Number(curr.createdAt - prev.createdAt) / 1e9;
    return timeDiff < 300;
  }
  const myUnreadEntry = (_a = channel == null ? void 0 : channel.unreadCounts) == null ? void 0 : _a.find(
    (u) => u.userId.toString() === myPrincipal
  );
  const unreadCount = myUnreadEntry ? Number(myUnreadEntry.count) : 0;
  const unreadBoundaryIndex = messages && unreadCount > 0 ? Math.max(0, messages.length - unreadCount) : -1;
  function handleSend() {
    if (!messageText.trim()) return;
    sendMutation.mutate();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full overflow-hidden pb-16 md:pb-0", children: [
    channel && /* @__PURE__ */ jsxRuntimeExports.jsx(ChannelInfoPanel, { channel }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col overflow-hidden min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-auto min-h-14 flex-col justify-center border-b border-border/60 bg-card/90 backdrop-blur-subtle px-4 py-2 shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              asChild: true,
              className: "h-8 w-8",
              "aria-label": "Back to channels",
              "data-ocid": "channel-back-btn",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/$workspaceId/chat", params: { workspaceId }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }) })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-7 w-7 items-center justify-center rounded-lg bg-teal-500/10 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { className: "h-3.5 w-3.5 text-teal-500" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-sm truncate tracking-tight", children: (channel == null ? void 0 : channel.name) ?? "Channel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              (channel == null ? void 0 : channel.memberIds.length) ?? 0,
              " members"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-muted-foreground lg:hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3 w-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: (channel == null ? void 0 : channel.memberIds.length) ?? 0 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "text-xs text-muted-foreground h-7 px-2.5",
              onClick: () => navigate({
                to: "/app/$workspaceId/chat/$channelId/settings",
                params: { workspaceId, channelId }
              }),
              "data-ocid": "channel-settings-link",
              children: "Settings"
            }
          )
        ] }),
        (channel == null ? void 0 : channel.topic) && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-teal-600 dark:text-teal-400 italic ml-11 mt-0.5 truncate", children: [
          "📌 ",
          channel.topic
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ScrollArea,
        {
          className: "flex-1 py-2",
          "data-ocid": "messages-list",
          ref: scrollAreaRef,
          children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 px-4 py-4", children: [1, 2, 3, 4].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-8 rounded-full shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-32" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full max-w-xs" })
            ] })
          ] }, n)) }) : messages && messages.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-2", children: [
            messages.map((msg, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              idx === unreadBoundaryIndex && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center gap-2 px-4 py-1 my-1",
                  "data-ocid": "unread-separator",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-amber-500/40" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-semibold text-amber-600 dark:text-amber-400 whitespace-nowrap shrink-0", children: [
                      unreadCount,
                      " unread message",
                      unreadCount !== 1 ? "s" : ""
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-px bg-amber-500/40" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                MessageBubble,
                {
                  msg,
                  replyTarget: msg.replyToId ? messageMap.get(msg.replyToId) : void 0,
                  onReply: setReplyTo,
                  onPin: (id) => pinMutation.mutate(id),
                  onReaction: (msgId, emoji, isOwn) => reactionMutation.mutate({
                    messageId: msgId,
                    emoji,
                    isOwn
                  }),
                  isPinned: pinnedIds.has(msg.id),
                  myPrincipal,
                  isMention: myPrincipal.length > 0 && msg.content.includes(`@${myPrincipal}`),
                  workspaceId,
                  isGrouped: isGrouped(idx)
                }
              )
            ] }, msg.id)),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: bottomRef, className: "h-4" })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center justify-center py-24 text-center px-4",
              "data-ocid": "messages-empty",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/10 mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { className: "h-6 w-6 text-teal-500" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold text-foreground text-sm", children: [
                  "Welcome to #",
                  channel == null ? void 0 : channel.name,
                  "!"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground max-w-xs", children: "This is the beginning of the channel. Send a message to get the conversation started." })
              ]
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "border-t border-border bg-card px-4 py-3 space-y-1.5 shrink-0",
          "data-ocid": "message-input-area",
          children: [
            replyTo && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-lg border-l-2 border-teal-500 bg-teal-500/5 px-3 py-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CornerUpLeft, { className: "h-3 w-3 text-teal-500 shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground flex-1 truncate", children: [
                "Replying to: ",
                replyTo.content
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "h-5 w-5",
                  onClick: () => setReplyTo(null),
                  "aria-label": "Cancel reply",
                  "data-ocid": "cancel-reply-btn",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-input bg-background focus-within:ring-1 focus-within:ring-ring p-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                FormattingToolbar,
                {
                  textareaRef,
                  value: messageText,
                  onChange: handleTextChange
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    ref: textareaRef,
                    placeholder: hasDraft && messageText ? "(draft) Continue message…" : `Message #${(channel == null ? void 0 : channel.name) ?? "channel"}…`,
                    value: messageText,
                    onChange: (e) => handleTextChange(e.target.value),
                    onKeyDown: handleKeyDown,
                    "data-ocid": "message-input",
                    className: "flex-1 min-h-[2.25rem] max-h-40 resize-none border-0 p-0 shadow-none focus-visible:ring-0 bg-transparent text-sm",
                    rows: 1,
                    autoComplete: "off"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    onClick: handleSend,
                    disabled: !messageText.trim() || sendMutation.isPending,
                    className: "bg-teal-600 hover:bg-teal-700 text-white shrink-0 h-8 w-8 p-0",
                    "data-ocid": "message-send-btn",
                    "aria-label": "Send message",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-3.5 w-3.5" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Enter to send · Shift+Enter for new line · Cmd+B bold · Cmd+I italic" })
          ]
        }
      )
    ] })
  ] });
}
export {
  ChannelInfoPanel,
  MessageBubble,
  ChannelPage as default
};
