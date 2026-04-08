import { s as createLucideIcon, m as useParams, n as useQueryClient, g as getTenantId, an as useInternetIdentity, h as useQuery, r as reactExports, j as jsxRuntimeExports, B as Button, i as Link, y as Settings } from "./index-CzyNqtbv.js";
import { B as Badge } from "./badge-B6elWcoD.js";
import { I as Input } from "./input-982h_Ebl.js";
import { L as Label } from "./label-D31XgQrg.js";
import { S as ScrollArea } from "./scroll-area-B7ckKdOv.js";
import { S as Separator } from "./separator-Klf3Mw5O.js";
import { S as Skeleton } from "./skeleton-DMAdSNre.js";
import { T as Textarea } from "./textarea-BbzS3l8F.js";
import { u as useMutation } from "./useMutation-BsRk2Bod.js";
import { u as ue } from "./index-DaWH_LJ9.js";
import { u as useBackend } from "./index-CJtF1vtU.js";
import { A as ArrowLeft } from "./arrow-left-BnDr9sMT.js";
import { G as Globe } from "./globe-DMGt-3h4.js";
import { L as Lock } from "./lock-D0A9Gk1A.js";
import { H as Hash } from "./hash-BbMZFyje.js";
import { P as Pin } from "./pin-C6tISQyv.js";
import { U as Users } from "./users-6wl8SB25.js";
import { f as formatDistanceToNow } from "./formatDistanceToNow-gmG56FeV.js";
import "./index-IXOTxK3N.js";
import "./en-US-CJ_JRP0W.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m5 19-2 2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2", key: "1xuzuj" }],
  ["path", { d: "M9 10h6", key: "9gxzsh" }],
  ["path", { d: "M12 7v6", key: "lw1j43" }],
  ["path", { d: "M9 17h6", key: "r8uit2" }]
];
const MessageSquareDiff = createLucideIcon("message-square-diff", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 17v5", key: "bb1du9" }],
  ["path", { d: "M15 9.34V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H7.89", key: "znwnzq" }],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }],
  [
    "path",
    {
      d: "M9 9v1.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h11",
      key: "c9qhm2"
    }
  ]
];
const PinOff = createLucideIcon("pin-off", __iconNode);
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
function memberInitials(id) {
  return id.toString().slice(0, 2).toUpperCase();
}
function PinnedRow({ msg, canEdit, onUnpin, unpinPending }) {
  const tsMs = Number(msg.createdAt) / 1e6;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 rounded-xl border border-border bg-card/60 p-3 group", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarColor(msg.senderId)}`,
        children: memberInitials(msg.senderId)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 space-y-0.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold text-foreground", children: [
          msg.senderId.toString().slice(0, 10),
          "…"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: formatDistanceToNow(tsMs, { addSuffix: true }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-relaxed line-clamp-3", children: msg.content })
    ] }),
    canEdit && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        variant: "ghost",
        size: "sm",
        className: "h-7 gap-1 text-xs shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive",
        onClick: () => onUnpin(msg.id),
        disabled: unpinPending,
        "aria-label": "Unpin message",
        "data-ocid": `unpin-btn-${msg.id}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(PinOff, { className: "h-3 w-3" }),
          "Unpin"
        ]
      }
    )
  ] });
}
function ChannelSettingsPage() {
  const { workspaceId, channelId } = useParams({
    from: "/app/$workspaceId/chat/$channelId/settings"
  });
  const { actor, isFetching } = useBackend();
  const queryClient = useQueryClient();
  const tenantId = getTenantId();
  const { identity } = useInternetIdentity();
  const { data: channel, isLoading: channelLoading } = useQuery(
    {
      queryKey: ["channel", tenantId, workspaceId, channelId],
      queryFn: async () => {
        if (!actor) return null;
        const r = await actor.getChannel(tenantId, workspaceId, channelId);
        return r.__kind__ === "ok" ? r.ok : null;
      },
      enabled: !!actor && !isFetching
    }
  );
  const { data: pinnedMessages, isLoading: pinsLoading } = useQuery({
    queryKey: ["channelPins", tenantId, workspaceId, channelId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getChannelPins(tenantId, workspaceId, channelId);
    },
    enabled: !!actor && !isFetching
  });
  const myPrincipal = identity == null ? void 0 : identity.getPrincipal();
  const isCreator = myPrincipal && channel ? channel.createdBy.toString() === myPrincipal.toString() : false;
  const [name, setName] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [topic, setTopic] = reactExports.useState("");
  reactExports.useEffect(() => {
    if (channel) {
      setName(channel.name);
      setDescription(channel.description ?? "");
      setTopic(channel.topic ?? "");
    }
  }, [channel]);
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.updateChannel(
        tenantId,
        workspaceId,
        channelId,
        name.trim(),
        description.trim(),
        topic.trim()
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["channel", tenantId, workspaceId, channelId]
      });
      queryClient.invalidateQueries({
        queryKey: ["channels", tenantId, workspaceId]
      });
      ue.success("Channel settings saved");
    },
    onError: (err) => ue.error(err.message)
  });
  const unpinMutation = useMutation({
    mutationFn: async (messageId) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.unpinMessage(
        tenantId,
        workspaceId,
        channelId,
        messageId
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["channelPins", tenantId, workspaceId, channelId]
      });
      queryClient.invalidateQueries({
        queryKey: ["channel", tenantId, workspaceId, channelId]
      });
      ue.success("Message unpinned");
    },
    onError: (err) => ue.error(err.message)
  });
  function handleSave(e) {
    e.preventDefault();
    if (!name.trim()) {
      ue.error("Channel name is required");
      return;
    }
    saveMutation.mutate();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full overflow-hidden animate-fade-in-up", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-13 items-center gap-3 border-b border-border/60 bg-card/90 backdrop-blur-subtle px-4 shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          asChild: true,
          className: "h-8 w-8",
          "aria-label": "Back to channel",
          "data-ocid": "channel-settings-back-btn",
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
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-7 w-7 items-center justify-center rounded-lg bg-teal-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-3.5 w-3.5 text-teal-500" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground text-sm truncate tracking-tight", children: "Channel Settings" }),
        channel && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground truncate", children: [
          "#",
          channel.name
        ] })
      ] }),
      channel && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: `rounded-full px-2 py-0.5 text-xs font-medium border inline-flex items-center gap-1 ${channel.isPublic ? "border-teal-500/30 text-teal-600 dark:text-teal-400" : "border-border text-muted-foreground"}`,
          children: channel.isPublic ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-2.5 w-2.5" }),
            " Public"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-2.5 w-2.5" }),
            " Private"
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto px-4 py-6 space-y-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "channel-settings-form-section", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { className: "h-3.5 w-3.5 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-foreground text-sm uppercase tracking-wider", children: "General" })
        ] }),
        channelLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: [1, 2, 3].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" }, n)) }) : isCreator ? /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSave, className: "space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "channel-name",
                className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                children: "Channel Name"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "channel-name",
                value: name,
                onChange: (e) => setName(e.target.value),
                placeholder: "e.g. general",
                "data-ocid": "channel-name-input",
                required: true
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            (channel == null ? void 0 : channel.description) && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground bg-muted/40 rounded-lg px-3 py-2 border border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-foreground", children: [
                "Current description:",
                " "
              ] }),
              channel.description
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "channel-description",
                className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                children: "Description"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "channel-description",
                value: description,
                onChange: (e) => setDescription(e.target.value),
                placeholder: "What is this channel about?",
                rows: 3,
                "data-ocid": "channel-description-input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            (channel == null ? void 0 : channel.topic) && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground bg-muted/40 rounded-lg px-3 py-2 border border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-foreground", children: [
                "Current topic:",
                " "
              ] }),
              channel.topic
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "channel-topic",
                className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                children: "Topic"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "channel-topic",
                value: topic,
                onChange: (e) => setTopic(e.target.value),
                placeholder: "e.g. Current sprint goals, team updates…",
                "data-ocid": "channel-topic-input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end pt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              disabled: saveMutation.isPending || !name.trim(),
              "data-ocid": "channel-settings-save-btn",
              className: "gap-2",
              children: saveMutation.isPending ? "Saving…" : "Save Changes"
            }
          ) })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card/60 divide-y divide-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 space-y-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-foreground font-medium", children: [
              "#",
              channel == null ? void 0 : channel.name
            ] })
          ] }),
          (channel == null ? void 0 : channel.description) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 space-y-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-relaxed", children: channel.description })
          ] }),
          (channel == null ? void 0 : channel.topic) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 space-y-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Topic" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-relaxed", children: channel.topic })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "outline",
              className: "text-xs text-muted-foreground",
              children: "Only the channel creator can edit settings"
            }
          ) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "channel-pinned-section", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-7 w-7 items-center justify-center rounded-lg bg-secondary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pin, { className: "h-3.5 w-3.5 text-secondary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-foreground text-sm uppercase tracking-wider", children: "Pinned Messages" })
          ] }),
          !pinsLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "text-xs", children: [
            (pinnedMessages == null ? void 0 : pinnedMessages.length) ?? 0,
            " pinned"
          ] })
        ] }),
        pinsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-8 rounded-full shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-28" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full max-w-sm" })
          ] })
        ] }, n)) }) : pinnedMessages && pinnedMessages.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "pinned-messages-list", children: pinnedMessages.map((msg) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          PinnedRow,
          {
            msg,
            canEdit: isCreator,
            onUnpin: (id) => unpinMutation.mutate(id),
            unpinPending: unpinMutation.isPending
          },
          msg.id
        )) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center py-10 text-center rounded-xl border border-dashed border-border bg-muted/20",
            "data-ocid": "pinned-messages-empty",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-muted mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquareDiff, { className: "h-5 w-5 text-muted-foreground" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "No pinned messages yet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 max-w-xs", children: "Pin important messages from the channel to surface them here." })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "channel-members-section", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-7 w-7 items-center justify-center rounded-lg bg-accent/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3.5 w-3.5 text-accent" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-foreground text-sm uppercase tracking-wider", children: "Members" }),
          channel && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-xs ml-auto", children: [
            channel.memberIds.length,
            " ",
            channel.memberIds.length === 1 ? "member" : "members"
          ] })
        ] }),
        channelLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2, 3].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 py-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-8 rounded-full shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3.5 w-40" })
        ] }, n)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "divide-y divide-border rounded-xl border border-border bg-card/60 overflow-hidden",
            "data-ocid": "channel-members-list",
            children: channel == null ? void 0 : channel.memberIds.map((memberId) => {
              const isOwner = channel.createdBy.toString() === memberId.toString();
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center gap-3 px-4 py-3",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: `flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${avatarColor(memberId)}`,
                        children: memberInitials(memberId)
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-foreground font-medium flex-1 min-w-0 truncate", children: [
                      memberId.toString().slice(0, 16),
                      "…"
                    ] }),
                    isOwner && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        variant: "outline",
                        className: "text-[10px] border-teal-500/30 text-teal-600 dark:text-teal-400 shrink-0",
                        children: "Creator"
                      }
                    )
                  ]
                },
                memberId.toString()
              );
            })
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  ChannelSettingsPage as default
};
