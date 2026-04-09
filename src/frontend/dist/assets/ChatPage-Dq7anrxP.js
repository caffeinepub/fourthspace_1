const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-wZVP6u7e.js","assets/index-1XRv9GHr.js","assets/index-B3uM4LW_.css"])))=>i.map(i=>d[i]);
import { m as useParams, y as useInternetIdentity, g as getTenantId, n as useQueryClient, d as useNavigate, r as reactExports, h as useQuery, j as jsxRuntimeExports, B as Button, P as Plus, _ as __vitePreload, X, i as Link, V as Variant_away_offline_online } from "./index-1XRv9GHr.js";
import { I as Input } from "./input-BOIU-9S_.js";
import { L as Label } from "./label-cy3JJ-Xo.js";
import { P as Popover, a as PopoverTrigger, b as PopoverContent } from "./popover-Cv78KGce.js";
import { S as Skeleton } from "./index-wZVP6u7e.js";
import { S as Switch } from "./switch-CkJgAgK0.js";
import { T as Textarea } from "./textarea-DsJhlE90.js";
import { u as useMutation } from "./useMutation-X94w2CVk.js";
import { u as ue } from "./index-BOWFyaIB.js";
import { u as useBackend } from "./useBackend-DyFxq-Jw.js";
import { S as Search } from "./search-CWnD_rod.js";
import { G as Globe } from "./globe-DMamDC3j.js";
import { L as Lock } from "./lock-DFW6_LHS.js";
import { H as Hash } from "./hash-Djb3fa_z.js";
import { M as MessageCircle } from "./message-circle-lXQ9m4vn.js";
import { U as Users } from "./users-BwTeKVE_.js";
import "./index-DYs8jb_i.js";
function toVariant(s) {
  const map = {
    online: Variant_away_offline_online.online,
    away: Variant_away_offline_online.away,
    offline: Variant_away_offline_online.offline
  };
  return map[s];
}
function PresenceDot({ status }) {
  const colorMap = {
    online: "bg-emerald-500",
    away: "bg-amber-400",
    offline: "bg-muted-foreground/40"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `inline-block h-2.5 w-2.5 rounded-full shrink-0 ring-2 ring-background ${colorMap[status]}`,
      "aria-label": `Status: ${status}`
    }
  );
}
function SetStatusPopover({
  currentStatus,
  currentCustom,
  onSave,
  isSaving
}) {
  const [open, setOpen] = reactExports.useState(false);
  const [status, setStatus] = reactExports.useState(currentStatus);
  const [custom, setCustom] = reactExports.useState(currentCustom);
  reactExports.useEffect(() => {
    if (open) {
      setStatus(currentStatus);
      setCustom(currentCustom);
    }
  }, [open, currentStatus, currentCustom]);
  const statusOptions = [
    { value: "online", label: "Online", color: "bg-emerald-500" },
    { value: "away", label: "Away", color: "bg-amber-400" },
    { value: "offline", label: "Offline", color: "bg-muted-foreground/40" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        className: "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full",
        "aria-label": "Set your status",
        "data-ocid": "presence-dot-trigger",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(PresenceDot, { status: currentStatus })
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      PopoverContent,
      {
        className: "w-64 p-4 space-y-3",
        align: "start",
        "data-ocid": "status-popover",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Set Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: statusOptions.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setStatus(opt.value),
              className: `flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-colors ${status === opt.value ? "bg-primary/10 text-foreground font-medium" : "hover:bg-muted text-muted-foreground"}`,
              "data-ocid": `status-option-${opt.value}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `h-2.5 w-2.5 rounded-full shrink-0 ${opt.color}`
                  }
                ),
                opt.label
              ]
            },
            opt.value
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "custom-status", className: "text-xs", children: "Custom status message" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "custom-status",
                placeholder: "What are you up to?",
                value: custom,
                onChange: (e) => setCustom(e.target.value),
                className: "h-8 text-sm",
                "data-ocid": "custom-status-input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              className: "w-full",
              disabled: isSaving,
              onClick: () => {
                onSave(status, custom);
                setOpen(false);
              },
              "data-ocid": "status-save-btn",
              children: isSaving ? "Saving…" : "Save status"
            }
          )
        ]
      }
    )
  ] });
}
function ChannelCard({
  channel,
  workspaceId,
  onJoin,
  isJoining,
  unreadCount,
  hasMention
}) {
  const hasUnread = unreadCount != null && unreadCount > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: "/app/$workspaceId/chat/$channelId",
        params: { workspaceId, channelId: channel.id },
        "data-ocid": `channel-item-${channel.id}`,
        className: "flex-1 flex items-center gap-3 rounded-xl border border-border/50 bg-card px-3.5 py-3 transition-smooth hover:shadow-sm hover:border-teal-300/40 dark:hover:border-teal-700/40 group min-w-0 card-interactive",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { className: "h-3.5 w-3.5 text-teal-500" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: `font-semibold truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors text-sm ${hasUnread ? "text-foreground" : "text-foreground"}`,
                  children: [
                    "#",
                    channel.name
                  ]
                }
              ),
              channel.isPublic ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium border border-teal-500/30 text-teal-600 dark:text-teal-400 inline-flex items-center gap-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-2 w-2" }),
                " Public"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium border border-border text-muted-foreground inline-flex items-center gap-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-2 w-2" }),
                " Private"
              ] }),
              hasMention && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "inline-flex items-center justify-center h-4 w-4 rounded-full bg-amber-400 text-[10px] font-bold text-amber-950 shrink-0",
                  "aria-label": "Unread mention",
                  "data-ocid": `channel-mention-${channel.id}`,
                  children: "@"
                }
              )
            ] }),
            channel.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 truncate", children: channel.description })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-muted-foreground text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3 w-3" }),
              channel.memberIds.length
            ] }),
            hasUnread && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold",
                "aria-label": `${unreadCount} unread`,
                "data-ocid": `channel-unread-${channel.id}`,
                children: (unreadCount ?? 0) > 99 ? "99+" : unreadCount
              }
            )
          ] })
        ]
      }
    ),
    onJoin && channel.isPublic && /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        variant: "outline",
        size: "sm",
        className: "shrink-0 text-teal-600 border-teal-500/30 hover:bg-teal-50 dark:hover:bg-teal-950/30 text-xs h-8 px-3",
        onClick: () => onJoin(channel.id),
        disabled: isJoining,
        "data-ocid": `channel-join-${channel.id}`,
        children: "Join"
      }
    )
  ] });
}
function DMRow({
  member,
  statusMap,
  unreadCount,
  onOpen,
  isOpening
}) {
  const userId = member.userId.toString();
  const status = statusMap.get(userId) ?? "offline";
  const initials = member.displayName ? member.displayName.slice(0, 2).toUpperCase() : userId.slice(0, 2).toUpperCase();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick: () => onOpen(userId),
      disabled: isOpening,
      "data-ocid": `dm-row-${userId}`,
      className: "flex w-full items-center gap-3 rounded-xl border border-border/50 bg-card px-3.5 py-3 transition-smooth hover:shadow-sm hover:border-teal-300/40 dark:hover:border-teal-700/40 group text-left min-w-0 card-interactive",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary", children: initials }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -bottom-0.5 -right-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PresenceDot, { status }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors", children: member.displayName || `${userId.slice(0, 10)}…` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground capitalize", children: status })
        ] }),
        unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold shrink-0",
            "data-ocid": `dm-unread-${userId}`,
            children: unreadCount > 99 ? "99+" : unreadCount
          }
        )
      ]
    }
  );
}
function CreateChannelForm({
  workspaceId,
  onClose
}) {
  const { actor } = useBackend();
  const tenantId = getTenantId();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [name, setName] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [isPublic, setIsPublic] = reactExports.useState(true);
  const createMutation = useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.createChannel(tenantId, workspaceId, input);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (channel) => {
      queryClient.invalidateQueries({
        queryKey: ["channels", tenantId, workspaceId]
      });
      ue.success("Channel created");
      onClose();
      void navigate({
        to: "/app/$workspaceId/chat/$channelId",
        params: { workspaceId, channelId: channel.id }
      });
    },
    onError: (err) => ue.error(err.message)
  });
  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    createMutation.mutate({
      name: name.trim(),
      description: description.trim(),
      isPublic,
      memberIds: []
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-teal-500/30 bg-card p-6 shadow-lg", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { className: "h-4 w-4 text-teal-500" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-foreground", children: "Create Channel" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          onClick: onClose,
          "data-ocid": "create-channel-close",
          "aria-label": "Close",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "ch-name", children: "Channel name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "ch-name",
            placeholder: "e.g. general, announcements, design",
            value: name,
            onChange: (e) => setName(e.target.value),
            "data-ocid": "channel-name-input",
            required: true
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "ch-desc", children: [
          "Description",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal text-xs", children: "(optional)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            id: "ch-desc",
            placeholder: "What's this channel about?",
            rows: 2,
            value: description,
            onChange: (e) => setDescription(e.target.value),
            "data-ocid": "channel-description-input",
            className: "resize-none"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-xl border border-border bg-muted/30 p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          isPublic ? /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-4 w-4 text-teal-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-foreground", children: [
              isPublic ? "Public" : "Private",
              " channel"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: isPublic ? "Anyone in the workspace can join" : "Only invited members can access" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Switch,
          {
            checked: isPublic,
            onCheckedChange: setIsPublic,
            "data-ocid": "channel-public-toggle"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: onClose,
            className: "flex-1",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            disabled: !name.trim() || createMutation.isPending,
            className: "flex-1 bg-teal-600 hover:bg-teal-700 text-white",
            "data-ocid": "channel-save-btn",
            children: createMutation.isPending ? "Creating…" : "Create Channel"
          }
        )
      ] })
    ] })
  ] });
}
const IDLE_TIMEOUT_MS = 5 * 60 * 1e3;
const PRESENCE_PING_MS = 3e4;
const STATUS_POLL_MS = 1e4;
const UNREAD_POLL_MS = 5e3;
const CHANNEL_POLL_MS = 5e3;
function ChatPage() {
  const { workspaceId } = useParams({ strict: false });
  const { actor, isFetching } = useBackend();
  const { identity } = useInternetIdentity();
  const tenantId = getTenantId();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [showCreate, setShowCreate] = reactExports.useState(false);
  const [localStatus, setLocalStatus] = reactExports.useState("online");
  const [localCustom, setLocalCustom] = reactExports.useState("");
  const idleTimerRef = reactExports.useRef(null);
  const presencePingRef = reactExports.useRef(null);
  const myPrincipalText = (identity == null ? void 0 : identity.getPrincipal().toText()) ?? "";
  const statusMutation = useMutation({
    mutationFn: async ({
      status,
      custom
    }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.setUserStatus(
        tenantId,
        workspaceId,
        toVariant(status),
        custom
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (data) => {
      setLocalStatus(data.status);
      setLocalCustom(data.customStatus);
    },
    onError: () => {
    }
  });
  reactExports.useEffect(() => {
    if (!actor || isFetching) return;
    const mutate = statusMutation.mutate;
    mutate({ status: "online", custom: "" });
    const pingInterval = setInterval(() => {
      if (!actor) return;
      actor.updatePresence(tenantId, workspaceId).catch(() => {
      });
    }, PRESENCE_PING_MS);
    presencePingRef.current = pingInterval;
    return () => {
      clearInterval(pingInterval);
    };
  }, [actor, isFetching, tenantId, workspaceId, statusMutation.mutate]);
  const resetIdleTimer = reactExports.useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    const mutate = statusMutation.mutate;
    if (localStatus === "away") {
      mutate({ status: "online", custom: localCustom });
    }
    idleTimerRef.current = setTimeout(() => {
      mutate({ status: "away", custom: localCustom });
    }, IDLE_TIMEOUT_MS);
  }, [localStatus, localCustom, statusMutation.mutate]);
  reactExports.useEffect(() => {
    const events = ["mousemove", "keydown", "pointerdown", "scroll"];
    for (const ev of events)
      window.addEventListener(ev, resetIdleTimer, { passive: true });
    resetIdleTimer();
    return () => {
      for (const ev of events) window.removeEventListener(ev, resetIdleTimer);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [resetIdleTimer]);
  const { data: channels, isLoading } = useQuery({
    queryKey: ["channels", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listChannels(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: CHANNEL_POLL_MS
  });
  const { data: members } = useQuery({
    queryKey: ["members", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listWorkspaceMembers(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching
  });
  const { data: statusList } = useQuery({
    queryKey: ["workspaceStatuses", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listWorkspaceStatuses(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: STATUS_POLL_MS
  });
  const statusMap = /* @__PURE__ */ new Map();
  if (statusList) {
    for (const s of statusList) {
      statusMap.set(s.id.toString(), s.status);
    }
  }
  const { data: unreadRaw } = useQuery({
    queryKey: ["unreadCounts", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUnreadCounts(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching,
    refetchInterval: UNREAD_POLL_MS
  });
  const unreadMap = /* @__PURE__ */ new Map();
  const mentionMap = /* @__PURE__ */ new Map();
  if (unreadRaw) {
    for (const [channelId, count] of unreadRaw) {
      unreadMap.set(channelId, Number(count));
    }
  }
  if (channels) {
    for (const ch of channels) {
      if (ch.mentionFlags) {
        const hasMention = ch.mentionFlags.some((mf) => mf.hasMention);
        if (hasMention) mentionMap.set(ch.id, true);
      }
    }
  }
  const dmChannelByUserId = /* @__PURE__ */ new Map();
  if (channels && myPrincipalText) {
    for (const ch of channels) {
      if (ch.name.startsWith("dm:")) {
        const parts = ch.name.split(":");
        const pA = parts[1];
        const pB = parts[2];
        if (pA && pB) {
          const other = pA === myPrincipalText ? pB : pA;
          dmChannelByUserId.set(other, ch.id);
        }
      }
    }
  }
  const joinMutation = useMutation({
    mutationFn: async (channelId) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.joinChannel(tenantId, workspaceId, channelId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["channels", tenantId, workspaceId]
      });
      ue.success("Joined channel");
    },
    onError: (err) => ue.error(err.message)
  });
  const openDMMutation = useMutation({
    mutationFn: async (targetUserId) => {
      if (!actor) throw new Error("Not connected");
      const { Principal } = await __vitePreload(async () => {
        const { Principal: Principal2 } = await import("./index-wZVP6u7e.js").then((n) => n.i);
        return { Principal: Principal2 };
      }, true ? __vite__mapDeps([0,1,2]) : void 0);
      const result = await actor.createOrGetDMChannel(
        tenantId,
        workspaceId,
        Principal.fromText(targetUserId)
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (channel) => {
      queryClient.invalidateQueries({
        queryKey: ["channels", tenantId, workspaceId]
      });
      void navigate({
        to: "/app/$workspaceId/chat/$channelId",
        params: { workspaceId, channelId: channel.id }
      });
    },
    onError: (err) => ue.error(err.message)
  });
  const publicChannels = (channels == null ? void 0 : channels.filter((c) => c.isPublic)) ?? [];
  const privateChannels = (channels == null ? void 0 : channels.filter((c) => !c.isPublic)) ?? [];
  const totalUnread = unreadRaw ? unreadRaw.reduce((sum, [, n]) => sum + Number(n), 0) : 0;
  const dmMembers = (members == null ? void 0 : members.filter((m) => {
    const uid = m.userId.toString();
    return myPrincipalText === "" || uid !== myPrincipalText;
  })) ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-fade-in-up p-4 sm:p-6 max-w-3xl mx-auto space-y-4 sm:space-y-5 pb-20 md:pb-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 sm:gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 sm:gap-3 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SetStatusPopover,
          {
            currentStatus: localStatus,
            currentCustom: localCustom,
            onSave: (s, c) => {
              setLocalStatus(s);
              setLocalCustom(c);
              statusMutation.mutate({ status: s, custom: c });
            },
            isSaving: statusMutation.isPending
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl sm:text-2xl font-bold text-foreground tracking-tight", children: "Chat" }),
            totalUnread > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold",
                "data-ocid": "chat-total-unread",
                children: totalUnread > 99 ? "99+" : totalUnread
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "capitalize", children: localStatus }),
            localCustom && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40", children: "·" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate max-w-[180px]", children: localCustom })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 sm:gap-2 shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            className: "gap-1.5 h-9 text-xs min-h-[44px] min-w-[44px]",
            onClick: () => navigate({
              to: "/app/$workspaceId/chat/search",
              params: { workspaceId }
            }),
            "data-ocid": "chat-search-btn",
            "aria-label": "Search messages",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-3.5 w-3.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Search" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => setShowCreate((v) => !v),
            size: "sm",
            className: "bg-teal-600 hover:bg-teal-700 text-white active-press gap-1.5 h-9 text-xs min-h-[44px]",
            "data-ocid": "create-channel-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "New Channel" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sm:hidden", children: "New" })
            ]
          }
        )
      ] })
    ] }),
    showCreate && /* @__PURE__ */ jsxRuntimeExports.jsx(
      CreateChannelForm,
      {
        workspaceId,
        onClose: () => setShowCreate(false)
      }
    ),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2.5", children: [1, 2, 3, 4].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 rounded-xl" }, n)) }) : channels && channels.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
      publicChannels.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-3 w-3 text-teal-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Public" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-xs text-muted-foreground", children: publicChannels.length })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: publicChannels.map((ch) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          ChannelCard,
          {
            channel: ch,
            workspaceId,
            onJoin: (id) => joinMutation.mutate(id),
            isJoining: joinMutation.isPending,
            unreadCount: unreadMap.get(ch.id),
            hasMention: mentionMap.get(ch.id)
          },
          ch.id
        )) })
      ] }),
      privateChannels.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-3 w-3 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Private" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-xs text-muted-foreground", children: privateChannels.length })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: privateChannels.map((ch) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          ChannelCard,
          {
            channel: ch,
            workspaceId,
            unreadCount: unreadMap.get(ch.id),
            hasMention: mentionMap.get(ch.id)
          },
          ch.id
        )) })
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 py-16 text-center",
        "data-ocid": "channels-empty",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { className: "h-6 w-6 text-teal-500" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground", children: "No channels yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-sm text-muted-foreground max-w-xs", children: "Create your first channel to start collaborating with your team." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: () => setShowCreate(true),
              size: "sm",
              className: "mt-5 bg-teal-600 hover:bg-teal-700 text-white active-press gap-1.5",
              "data-ocid": "channels-empty-cta",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
                " Create first channel"
              ]
            }
          )
        ]
      }
    ),
    dmMembers.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "dm-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-3 w-3 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Direct Messages" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: dmMembers.length }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            className: "h-5 w-5 ml-auto text-muted-foreground hover:text-foreground",
            title: "New direct message",
            "aria-label": "New direct message",
            "data-ocid": "new-dm-btn",
            onClick: () => {
              var _a;
              (_a = document.getElementById("dm-member-list")) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", id: "dm-member-list", children: dmMembers.map((member) => {
        const uid = member.userId.toString();
        const dmChannelId = dmChannelByUserId.get(uid);
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          DMRow,
          {
            member,
            statusMap,
            unreadCount: dmChannelId ? unreadMap.get(dmChannelId) ?? 0 : 0,
            onOpen: (userId) => openDMMutation.mutate(userId),
            isOpening: openDMMutation.isPending
          },
          uid
        );
      }) })
    ] }),
    members && members.length <= 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 py-10 text-center",
        "data-ocid": "dm-empty",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-8 w-8 text-muted-foreground/40 mb-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "No teammates yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Invite members to your workspace to start direct conversations." })
        ]
      }
    )
  ] });
}
export {
  ChatPage as default
};
