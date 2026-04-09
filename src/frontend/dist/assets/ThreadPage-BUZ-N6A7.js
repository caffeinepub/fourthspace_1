import { t as createLucideIcon, m as useParams, n as useQueryClient, g as getTenantId, an as useInternetIdentity, r as reactExports, h as useQuery, j as jsxRuntimeExports, B as Button, i as Link, b as MessageSquare } from "./index-CQ7TXF2a.js";
import { B as Badge } from "./badge-DOwzzuc_.js";
import { S as ScrollArea } from "./scroll-area-_pStEkgn.js";
import { S as Skeleton } from "./skeleton-CzZABium.js";
import { T as Textarea } from "./textarea-CkHQfDFp.js";
import { u as useMutation } from "./useMutation-fGi-GboX.js";
import { u as ue } from "./index-BGFcG_k-.js";
import { u as useBackend } from "./index--h8TKSCt.js";
import { A as ArrowLeft } from "./arrow-left-D6cz-lXM.js";
import { S as Send } from "./send-DNZwJrYP.js";
import { L as Link2 } from "./link-2-Vn75IhwF.js";
import { B as Bold, I as Italic, C as Code } from "./italic-B5o8gq_t.js";
import { L as List } from "./list-k-lHThjo.js";
import "./index-IXOTxK3N.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m15 10 5 5-5 5", key: "qqa56n" }],
  ["path", { d: "M4 4v7a4 4 0 0 0 4 4h12", key: "z08zvw" }]
];
const CornerDownRight = createLucideIcon("corner-down-right", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M8 14s1.5 2 4 2 4-2 4-2", key: "1y1vjs" }],
  ["line", { x1: "9", x2: "9.01", y1: "9", y2: "9", key: "yxxnd0" }],
  ["line", { x1: "15", x2: "15.01", y1: "9", y2: "9", key: "1p4y9e" }]
];
const Smile = createLucideIcon("smile", __iconNode);
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
function senderInitials(id) {
  return id.toString().slice(0, 2).toUpperCase();
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
const QUICK_EMOJIS = ["👍", "❤️", "😂", "🎉", "🔥", "👀", "✅", "🙏"];
function ThreadMessage({
  msg,
  isParent,
  onReact,
  myPrincipal
}) {
  const [showPicker, setShowPicker] = reactExports.useState(false);
  const reactions = msg.reactions ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `group relative flex items-start gap-3 px-4 py-3 rounded-xl transition-colors ${isParent ? "bg-muted/30 border border-border" : "hover:bg-muted/20"}`,
      "data-ocid": `thread-msg-${msg.id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarColor(msg.senderId)}`,
            children: senderInitials(msg.senderId)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold text-foreground", children: [
              msg.senderId.toString().slice(0, 10),
              "…"
            ] }),
            isParent && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px] py-0 px-1.5", children: "Original" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: formatRelativeTime(msg.createdAt) })
          ] }),
          msg.crossLinks.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: msg.crossLinks.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
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
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words", children: msg.content }),
          reactions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 pt-0.5", children: reactions.map((r) => {
            const isOwn = r.userIds.some((u) => u.toString() === myPrincipal);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => onReact(msg.id, r.emoji),
                className: `inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-colors ${isOwn ? "border-teal-500/60 bg-teal-500/10 text-teal-700 dark:text-teal-300" : "border-border bg-muted/40 hover:bg-muted/70"}`,
                "data-ocid": `reaction-${msg.id}-${r.emoji}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: r.emoji }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-muted-foreground", children: r.userIds.length })
                ]
              },
              r.emoji
            );
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-3 top-2.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: "h-6 w-6",
              "aria-label": "React",
              "data-ocid": `react-btn-${msg.id}`,
              onClick: () => setShowPicker((p) => !p),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Smile, { className: "h-3.5 w-3.5 text-muted-foreground" })
            }
          ),
          showPicker && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-0 top-7 z-50 flex gap-1 rounded-xl border border-border bg-card p-2 shadow-lg", children: QUICK_EMOJIS.map((em) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "rounded-lg p-1 text-base hover:bg-muted/60 transition-colors",
              onClick: () => {
                onReact(msg.id, em);
                setShowPicker(false);
              },
              "data-ocid": `emoji-pick-${em}`,
              children: em
            },
            em
          )) })
        ] }) })
      ]
    }
  );
}
function FormatToolbar({ onFormat }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-0.5 px-1", children: [
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Bold, { className: "h-3 w-3" }),
      title: "Bold (Ctrl+B)",
      prefix: "**",
      suffix: "**",
      ocid: "fmt-bold",
      label: "Bold"
    },
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Italic, { className: "h-3 w-3" }),
      title: "Italic (Ctrl+I)",
      prefix: "_",
      suffix: "_",
      ocid: "fmt-italic",
      label: "Italic"
    },
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Code, { className: "h-3 w-3" }),
      title: "Inline code",
      prefix: "`",
      suffix: "`",
      ocid: "fmt-code",
      label: "Code"
    },
    {
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(List, { className: "h-3 w-3" }),
      title: "Bullet list",
      prefix: "• ",
      suffix: void 0,
      ocid: "fmt-list",
      label: "Bullet list"
    }
  ].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    Button,
    {
      variant: "ghost",
      size: "icon",
      className: "h-6 w-6",
      title: t.title,
      onClick: () => onFormat(t.prefix, t.suffix),
      "data-ocid": t.ocid,
      type: "button",
      "aria-label": t.label,
      children: t.icon
    },
    t.ocid
  )) });
}
function ThreadPage() {
  const { workspaceId, channelId, messageId } = useParams({
    strict: false
  });
  const { actor, isFetching } = useBackend();
  const queryClient = useQueryClient();
  const tenantId = getTenantId();
  const { identity } = useInternetIdentity();
  const myPrincipal = (identity == null ? void 0 : identity.getPrincipal().toText()) ?? "";
  const [replyText, setReplyText] = reactExports.useState("");
  const textareaRef = reactExports.useRef(null);
  const bottomRef = reactExports.useRef(null);
  const { data: parentMessage } = useQuery({
    queryKey: ["message-parent", tenantId, workspaceId, channelId, messageId],
    queryFn: async () => {
      if (!actor) return null;
      const msgs = await actor.getMessages(
        tenantId,
        workspaceId,
        channelId,
        BigInt(200),
        null
      );
      return msgs.find((m) => m.id === messageId) ?? null;
    },
    enabled: !!actor && !isFetching && !!workspaceId,
    staleTime: 1e4
  });
  const { data: threadMessages, isLoading } = useQuery({
    queryKey: ["thread-messages", tenantId, workspaceId, messageId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getThreadMessages(tenantId, workspaceId, messageId);
    },
    enabled: !!actor && !isFetching && !!workspaceId,
    refetchInterval: 3e3
  });
  const prevCountRef = reactExports.useRef(0);
  reactExports.useEffect(() => {
    const count = (threadMessages == null ? void 0 : threadMessages.length) ?? 0;
    if (count !== prevCountRef.current) {
      prevCountRef.current = count;
      requestAnimationFrame(() => {
        var _a;
        (_a = bottomRef.current) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, [threadMessages]);
  const sendMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.sendMessage(tenantId, workspaceId, {
        content: replyText.trim(),
        channelId,
        replyToId: messageId,
        crossLinks: []
      });
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["thread-messages", tenantId, workspaceId, messageId]
      });
      queryClient.invalidateQueries({
        queryKey: ["messages", tenantId, workspaceId, channelId]
      });
      queryClient.invalidateQueries({
        queryKey: ["unreadCounts", tenantId, workspaceId]
      });
      setReplyText("");
    },
    onError: (err) => ue.error(err.message)
  });
  const reactMutation = useMutation({
    mutationFn: async ({ msgId, emoji }) => {
      var _a;
      if (!actor) throw new Error("Not connected");
      const allMsgs = [
        ...threadMessages ?? [],
        ...parentMessage ? [parentMessage] : []
      ];
      const targetMsg = allMsgs.find((m) => m.id === msgId);
      const alreadyReacted = ((_a = targetMsg == null ? void 0 : targetMsg.reactions) == null ? void 0 : _a.some(
        (r) => r.emoji === emoji && r.userIds.some((u) => u.toString() === myPrincipal)
      )) ?? false;
      if (alreadyReacted) {
        const result2 = await actor.removeReaction(
          tenantId,
          workspaceId,
          msgId,
          emoji
        );
        if (result2.__kind__ === "err") throw new Error(result2.err);
        return result2.ok;
      }
      const result = await actor.addReaction(
        tenantId,
        workspaceId,
        msgId,
        emoji
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => queryClient.invalidateQueries({
      queryKey: ["thread-messages", tenantId, workspaceId, messageId]
    }),
    onError: (err) => ue.error(err.message)
  });
  const applyFormat = reactExports.useCallback(
    (prefix, suffix = "") => {
      const el = textareaRef.current;
      if (!el) return;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const selected = replyText.slice(start, end);
      const newText = `${replyText.slice(0, start)}${prefix}${selected}${suffix}${replyText.slice(end)}`;
      setReplyText(newText);
      requestAnimationFrame(() => {
        el.setSelectionRange(start + prefix.length, end + prefix.length);
        el.focus();
      });
    },
    [replyText]
  );
  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (replyText.trim()) sendMutation.mutate();
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "b") {
      e.preventDefault();
      applyFormat("**", "**");
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "i") {
      e.preventDefault();
      applyFormat("_", "_");
    }
  }
  const replyCount = (threadMessages == null ? void 0 : threadMessages.length) ?? 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full overflow-hidden bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-14 items-center gap-3 border-b border-border/60 bg-card/90 backdrop-blur-subtle px-4 shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          asChild: true,
          className: "h-8 w-8",
          "aria-label": "Back to channel",
          "data-ocid": "thread-back-btn",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/app/$workspaceId/chat/$channelId",
              params: { workspaceId, channelId },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" })
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-3.5 w-3.5 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-sm tracking-tight", children: "Thread" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          replyCount,
          " ",
          replyCount === 1 ? "reply" : "replies"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "flex-1 overflow-y-auto", "data-ocid": "thread-scroll", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto w-full max-w-2xl px-4 py-6 space-y-4", children: [
      parentMessage ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        ThreadMessage,
        {
          msg: parentMessage,
          isParent: true,
          onReact: (msgId, emoji) => reactMutation.mutate({ msgId, emoji }),
          myPrincipal
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 rounded-xl bg-muted/30 border border-border px-4 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-8 rounded-full shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-28" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full max-w-sm" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-3",
          "data-ocid": "thread-reply-count",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-border" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground font-medium", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CornerDownRight, { className: "h-3 w-3" }),
              isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-16 inline-block" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                replyCount,
                " ",
                replyCount === 1 ? "reply" : "replies"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-border" })
          ]
        }
      ),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: [1, 2, 3].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-8 rounded-full shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-24" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" })
        ] })
      ] }, n)) }) : threadMessages && threadMessages.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: threadMessages.map((msg) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        ThreadMessage,
        {
          msg,
          onReact: (msgId, emoji) => reactMutation.mutate({ msgId, emoji }),
          myPrincipal
        },
        msg.id
      )) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center justify-center py-10 text-center",
          "data-ocid": "thread-empty",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-5 w-5 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "No replies yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground max-w-xs", children: "Be the first to reply to this thread." })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: bottomRef, className: "h-2" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "border-t border-border bg-card px-4 pt-3 pb-4 shrink-0 space-y-2",
        "data-ocid": "thread-reply-composer",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 border border-border rounded-t-lg bg-muted/30 px-2 py-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FormatToolbar, { onFormat: applyFormat }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 items-end", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                ref: textareaRef,
                placeholder: "Reply in thread… (Enter to send, Shift+Enter for new line)",
                value: replyText,
                onChange: (e) => setReplyText(e.target.value),
                onKeyDown: handleKeyDown,
                "data-ocid": "thread-reply-input",
                rows: 2,
                className: "flex-1 resize-none rounded-t-none border-t-0 focus-visible:ring-0 focus-visible:ring-offset-0",
                autoComplete: "off"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: () => {
                  if (replyText.trim()) sendMutation.mutate();
                },
                disabled: !replyText.trim() || sendMutation.isPending,
                className: "bg-primary hover:bg-primary/90 text-primary-foreground shrink-0 self-end",
                "data-ocid": "thread-reply-send-btn",
                "aria-label": "Send reply",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Enter to send · Shift+Enter for new line · Ctrl+B bold · Ctrl+I italic" })
        ]
      }
    )
  ] });
}
export {
  ThreadPage as default
};
