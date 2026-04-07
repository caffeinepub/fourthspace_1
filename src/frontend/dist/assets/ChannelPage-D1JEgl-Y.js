import { g as createLucideIcon, b as useParams, d as useQueryClient, h as getTenantId, r as reactExports, e as useQuery, j as jsxRuntimeExports, B as Button, f as Link, X } from "./index-D7inqmxR.js";
import { B as Badge } from "./index-BJuRsRYe.js";
import { I as Input } from "./input-C0aO0R3D.js";
import { S as ScrollArea, a as Send } from "./scroll-area-CzbWO35w.js";
import { S as Separator } from "./separator-B6dqygkP.js";
import { S as Skeleton } from "./skeleton-sexCBv2H.js";
import { u as useMutation } from "./useMutation-BeBnUQJD.js";
import { u as ue } from "./index-p-k3Ndic.js";
import { u as useBackend } from "./useBackend-BH6dl3yo.js";
import { A as ArrowLeft } from "./arrow-left-mNBAKt8w.js";
import { H as Hash, G as Globe, L as Lock } from "./lock-B0mxDg5j.js";
import { U as Users } from "./users-0z2gux4W.js";
import { f as formatDistanceToNow } from "./formatDistanceToNow-gmG56FeV.js";
import { L as Link2 } from "./link-2-CZnDvFVS.js";
import "./index-IXOTxK3N.js";
import "./en-US-CJ_JRP0W.js";
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
function MessageBubble({ msg, replyTarget, onReply }) {
  const timestampMs = Number(msg.createdAt) / 1e6;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "group flex items-start gap-3 px-4 py-2 rounded-xl hover:bg-muted/30 transition-colors",
      "data-ocid": `message-${msg.id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarColor(msg.senderId)}`,
            children: senderInitials(msg.senderId)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold text-foreground", children: [
              msg.senderId.toString().slice(0, 10),
              "…"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: formatDistanceToNow(timestampMs, { addSuffix: true }) })
          ] }),
          replyTarget && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 rounded-lg border-l-2 border-teal-500 bg-teal-500/5 px-3 py-1.5 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CornerUpLeft, { className: "h-3 w-3 shrink-0 mt-0.5 text-teal-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "line-clamp-1", children: replyTarget.content })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-relaxed", children: msg.content }),
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
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            className: "h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0",
            onClick: () => onReply(msg),
            "aria-label": "Reply",
            "data-ocid": `reply-btn-${msg.id}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(CornerUpLeft, { className: "h-3.5 w-3.5 text-muted-foreground" })
          }
        )
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
      channel.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground pt-1 leading-relaxed", children: channel.description })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
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
function ChannelPage() {
  const { channelId } = useParams({ from: "/app/chat/$channelId" });
  const { actor, isFetching } = useBackend();
  const queryClient = useQueryClient();
  const tenantId = getTenantId();
  const [messageText, setMessageText] = reactExports.useState("");
  const [replyTo, setReplyTo] = reactExports.useState(null);
  const { data: channel } = useQuery({
    queryKey: ["channel", tenantId, channelId],
    queryFn: async () => {
      if (!actor) return null;
      const r = await actor.getChannel(tenantId, channelId);
      return r.__kind__ === "ok" ? r.ok : null;
    },
    enabled: !!actor && !isFetching
  });
  const { data: messages, isLoading } = useQuery({
    queryKey: ["messages", tenantId, channelId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMessages(tenantId, channelId, BigInt(50), null);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 3e3
  });
  const messageMap = new Map(
    (messages == null ? void 0 : messages.map((m) => [m.id, m])) ?? []
  );
  const sendMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.sendMessage(tenantId, {
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
        queryKey: ["messages", tenantId, channelId]
      });
      setMessageText("");
      setReplyTo(null);
    },
    onError: (err) => ue.error(err.message)
  });
  function handleSend() {
    if (!messageText.trim()) return;
    sendMutation.mutate();
  }
  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === "Escape") setReplyTo(null);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full overflow-hidden", children: [
    channel && /* @__PURE__ */ jsxRuntimeExports.jsx(ChannelInfoPanel, { channel }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col overflow-hidden min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-14 items-center gap-3 border-b border-border bg-card px-4 shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            asChild: true,
            "aria-label": "Back to channels",
            "data-ocid": "channel-back-btn",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/chat", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { className: "h-4 w-4 text-teal-500" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-sm truncate", children: (channel == null ? void 0 : channel.name) ?? "Channel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            (channel == null ? void 0 : channel.memberIds.length) ?? 0,
            " members"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-muted-foreground lg:hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3.5 w-3.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: (channel == null ? void 0 : channel.memberIds.length) ?? 0 })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "flex-1 py-2", "data-ocid": "messages-list", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 px-4 py-4", children: [1, 2, 3, 4].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-8 rounded-full shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-32" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full max-w-xs" })
        ] })
      ] }, n)) }) : messages && messages.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-2", children: [
        messages.map((msg) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          MessageBubble,
          {
            msg,
            replyTarget: msg.replyToId ? messageMap.get(msg.replyToId) : void 0,
            onReply: setReplyTo
          },
          msg.id
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            ref: (el) => {
              el == null ? void 0 : el.scrollIntoView();
            }
          }
        )
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
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border bg-card px-4 py-3 space-y-2 shrink-0", children: [
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
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: `Message #${(channel == null ? void 0 : channel.name) ?? "channel"}…`,
              value: messageText,
              onChange: (e) => setMessageText(e.target.value),
              onKeyDown: handleKeyDown,
              "data-ocid": "message-input",
              className: "flex-1",
              autoComplete: "off"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleSend,
              disabled: !messageText.trim() || sendMutation.isPending,
              className: "bg-teal-600 hover:bg-teal-700 text-white shrink-0",
              "data-ocid": "message-send-btn",
              "aria-label": "Send message",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" })
            }
          )
        ] })
      ] })
    ] })
  ] });
}
export {
  ChannelPage as default
};
