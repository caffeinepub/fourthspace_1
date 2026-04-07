import { h as getTenantId, d as useQueryClient, r as reactExports, e as useQuery, j as jsxRuntimeExports, B as Button, X, f as Link } from "./index-D7inqmxR.js";
import { B as Badge } from "./index-BJuRsRYe.js";
import { I as Input } from "./input-C0aO0R3D.js";
import { L as Label } from "./label-CBtn2p-5.js";
import { S as Skeleton } from "./skeleton-sexCBv2H.js";
import { S as Switch } from "./switch-DMUk12Ll.js";
import { T as Textarea } from "./textarea-DoR08WA4.js";
import { u as useMutation } from "./useMutation-BeBnUQJD.js";
import { u as ue } from "./index-p-k3Ndic.js";
import { u as useBackend } from "./useBackend-BH6dl3yo.js";
import { P as Plus } from "./plus-DNap1HPx.js";
import { G as Globe, L as Lock, H as Hash } from "./lock-B0mxDg5j.js";
import { U as Users } from "./users-0z2gux4W.js";
import "./index-BGFsRO7G.js";
function ChannelCard({
  channel,
  onJoin,
  isJoining
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: "/app/chat/$channelId",
        params: { channelId: channel.id },
        "data-ocid": `channel-item-${channel.id}`,
        className: "flex-1 flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-smooth hover:shadow-md hover:-translate-y-0.5 group min-w-0",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { className: "h-5 w-5 text-teal-500" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-foreground truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors text-sm", children: [
                "#",
                channel.name
              ] }),
              channel.isPublic ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Badge,
                {
                  variant: "outline",
                  className: "shrink-0 text-xs gap-1 border-teal-500/30 text-teal-600 dark:text-teal-400 py-0",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-2.5 w-2.5" }),
                    "Public"
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "shrink-0 text-xs gap-1 py-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-2.5 w-2.5" }),
                "Private"
              ] })
            ] }),
            channel.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 truncate", children: channel.description })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-muted-foreground shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3.5 w-3.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium", children: channel.memberIds.length })
          ] })
        ]
      }
    ),
    onJoin && channel.isPublic && /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        variant: "outline",
        size: "sm",
        className: "shrink-0 text-teal-600 border-teal-500/30 hover:bg-teal-50 dark:hover:bg-teal-950/30",
        onClick: () => onJoin(channel.id),
        disabled: isJoining,
        "data-ocid": `channel-join-${channel.id}`,
        children: "Join"
      }
    )
  ] });
}
function CreateChannelForm({ onClose }) {
  const { actor } = useBackend();
  const tenantId = getTenantId();
  const queryClient = useQueryClient();
  const [name, setName] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [isPublic, setIsPublic] = reactExports.useState(true);
  const createMutation = useMutation({
    mutationFn: async (input) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.createChannel(tenantId, input);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["channels", tenantId] });
      ue.success("Channel created");
      onClose();
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
function ChatPage() {
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = reactExports.useState(false);
  const { data: channels, isLoading } = useQuery({
    queryKey: ["channels", tenantId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listChannels(tenantId);
    },
    enabled: !!actor && !isFetching
  });
  const joinMutation = useMutation({
    mutationFn: async (channelId) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.joinChannel(tenantId, channelId);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (_, channelId) => {
      queryClient.invalidateQueries({ queryKey: ["channels", tenantId] });
      ue.success("Joined channel");
    },
    onError: (err) => ue.error(err.message)
  });
  const publicChannels = (channels == null ? void 0 : channels.filter((c) => c.isPublic)) ?? [];
  const privateChannels = (channels == null ? void 0 : channels.filter((c) => !c.isPublic)) ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 max-w-3xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Chat" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Team channels and conversations" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: () => setShowCreate((v) => !v),
          className: "bg-teal-600 hover:bg-teal-700 text-white gap-2",
          "data-ocid": "create-channel-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "New Channel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sm:hidden", children: "New" })
          ]
        }
      )
    ] }),
    showCreate && /* @__PURE__ */ jsxRuntimeExports.jsx(CreateChannelForm, { onClose: () => setShowCreate(false) }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3, 4].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-[72px] rounded-2xl" }, n)) }) : channels && channels.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      publicChannels.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-3.5 w-3.5 text-teal-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Public" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-xs text-muted-foreground", children: publicChannels.length })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: publicChannels.map((ch) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          ChannelCard,
          {
            channel: ch,
            onJoin: (id) => joinMutation.mutate(id),
            isJoining: joinMutation.isPending
          },
          ch.id
        )) })
      ] }),
      privateChannels.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-3.5 w-3.5 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Private" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-xs text-muted-foreground", children: privateChannels.length })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: privateChannels.map((ch) => /* @__PURE__ */ jsxRuntimeExports.jsx(ChannelCard, { channel: ch }, ch.id)) })
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-20 text-center",
        "data-ocid": "channels-empty",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500/10 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { className: "h-7 w-7 text-teal-500" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground", children: "No channels yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground max-w-xs", children: "Create your first channel to start collaborating with your team." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: () => setShowCreate(true),
              className: "mt-6 bg-teal-600 hover:bg-teal-700 text-white",
              "data-ocid": "channels-empty-cta",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
                "Create first channel"
              ]
            }
          )
        ]
      }
    )
  ] });
}
export {
  ChatPage as default
};
