import { m as useParams, e as useActor, f as useWorkspace, n as useQueryClient, r as reactExports, h as useQuery, j as jsxRuntimeExports, B as Button, i as Link, p as Shield, C as Check, l as createActor } from "./index-1XRv9GHr.js";
import { B as Badge } from "./badge-rX4oLW6l.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-CFU1s52N.js";
import { I as Input } from "./input-BOIU-9S_.js";
import { L as Label } from "./label-cy3JJ-Xo.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BNtSJS5c.js";
import { S as Skeleton } from "./index-wZVP6u7e.js";
import { u as useMutation } from "./useMutation-X94w2CVk.js";
import { u as ue } from "./index-BOWFyaIB.js";
import { A as ArrowLeft } from "./arrow-left-B-gbON0E.js";
import { U as Users } from "./users-BwTeKVE_.js";
import { M as Mail } from "./mail-B_aTQ92B.js";
import { U as UserPlus } from "./user-plus-B38w6Ff0.js";
import { C as Copy } from "./copy-BH7dsCoj.js";
import { U as UserMinus } from "./user-minus-C6uSuzR5.js";
import "./index-IXOTxK3N.js";
import "./index-DYs8jb_i.js";
import "./chevron-up-BUdvSziG.js";
const STATUS_COLORS = {
  Active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  Pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  Revoked: "bg-muted text-muted-foreground border-border"
};
function formatDate(ts) {
  return new Date(Number(ts) / 1e6).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
function GuestAccessPage() {
  const { workspaceId, projectId } = useParams({
    from: "/app/$workspaceId/projects/$projectId/guests"
  });
  const { actor: rawActor, isFetching } = useActor(createActor);
  const actor = rawActor;
  const { tenantId } = useWorkspace();
  const queryClient = useQueryClient();
  const [email, setEmail] = reactExports.useState("");
  const [expiresInDays, setExpiresInDays] = reactExports.useState("30");
  const [inviteLink, setInviteLink] = reactExports.useState(null);
  const [copied, setCopied] = reactExports.useState(false);
  const { data: guests = [], isLoading } = useQuery({
    queryKey: ["guestUsers", tenantId, workspaceId, projectId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listGuestUsers(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching
  });
  const inviteMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.createGuestInvitation({
        tenantId,
        workspaceId,
        projectId,
        inviteeEmail: email,
        expiresInDays: Number(expiresInDays)
      });
    },
    onSuccess: (invitation) => {
      const link = `${window.location.origin}/invite/${invitation.inviteToken}`;
      setInviteLink(link);
      setEmail("");
      ue.success("Invitation created", {
        description: `Invite link generated for ${invitation.inviteeEmail}`
      });
      queryClient.invalidateQueries({
        queryKey: ["guestUsers", tenantId, workspaceId, projectId]
      });
    },
    onError: () => ue.error("Failed to create invitation")
  });
  const revokeMutation = useMutation({
    mutationFn: async (guestId) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateGuestStatus(tenantId, workspaceId, guestId, "Revoked");
    },
    onSuccess: () => {
      ue.success("Guest access revoked");
      queryClient.invalidateQueries({
        queryKey: ["guestUsers", tenantId, workspaceId, projectId]
      });
    },
    onError: () => ue.error("Failed to revoke access")
  });
  const handleCopy = async () => {
    if (!inviteLink) return;
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2e3);
  };
  const activeCount = guests.filter((g) => g.status === "Active").length;
  const pendingCount = guests.filter((g) => g.status === "Pending").length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "p-4 md:p-6 space-y-6 max-w-6xl mx-auto animate-fade-in-up",
      "data-ocid": "guest-access-page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              asChild: true,
              className: "shrink-0 hover:bg-muted",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/app/$workspaceId/projects/$projectId",
                  params: { workspaceId, projectId },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" })
                }
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold tracking-tight text-foreground", children: "Guest Access" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Invite external collaborators with read-only access" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3", children: [
          {
            label: "Active Guests",
            value: activeCount,
            icon: Users,
            color: "text-emerald-500 bg-emerald-500/10"
          },
          {
            label: "Pending Invites",
            value: pendingCount,
            icon: Mail,
            color: "text-amber-500 bg-amber-500/10"
          },
          {
            label: "Access Level",
            value: "Guest",
            icon: Shield,
            color: "text-primary bg-primary/10"
          }
        ].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border/50 bg-card shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-3 md:p-4 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `flex h-9 w-9 items-center justify-center rounded-xl shrink-0 ${s.color}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(s.icon, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-display font-bold text-foreground leading-tight", children: s.value }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: s.label })
          ] })
        ] }) }, s.label)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Card,
            {
              className: "border-border/50 bg-card shadow-card",
              "data-ocid": "invite-form-card",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-4 w-4 text-primary" }),
                  "Invite Guest"
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "guest-email", children: "Email address" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "guest-email",
                        type: "email",
                        placeholder: "guest@example.com",
                        value: email,
                        onChange: (e) => setEmail(e.target.value),
                        "data-ocid": "guest-email-input"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Permission Level" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-10 items-center rounded-lg border border-input bg-muted/30 px-3 text-sm text-muted-foreground gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4 shrink-0 text-primary" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Guest — read-only access to this project" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "expiry-select", children: "Invitation expires" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: expiresInDays, onValueChange: setExpiresInDays, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "expiry-select", "data-ocid": "expiry-select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "7", children: "In 7 days" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "30", children: "In 30 days" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "90", children: "In 90 days" })
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      className: "w-full active-press",
                      onClick: () => inviteMutation.mutate(),
                      disabled: !email.trim() || inviteMutation.isPending,
                      "data-ocid": "send-invite-btn",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-4 w-4 mr-2" }),
                        inviteMutation.isPending ? "Sending…" : "Send Invitation"
                      ]
                    }
                  ),
                  inviteLink && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-3",
                      "data-ocid": "invite-link-box",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 shrink-0" }),
                          "Invitation created — share this link"
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "flex-1 truncate text-xs bg-muted rounded px-2 py-1.5 font-mono text-foreground", children: inviteLink }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Button,
                            {
                              size: "icon",
                              variant: "outline",
                              className: "h-8 w-8 shrink-0 active-press",
                              onClick: handleCopy,
                              "aria-label": "Copy invite link",
                              "data-ocid": "copy-invite-link-btn",
                              children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5 text-emerald-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-3.5 w-3.5" })
                            }
                          )
                        ] })
                      ]
                    }
                  )
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Card,
            {
              className: "border-border/50 bg-card shadow-card",
              "data-ocid": "guest-list-card",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 text-primary" }),
                  "Active Guests",
                  guests.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "ml-auto text-xs rounded-full px-2.5 py-0.5 bg-muted text-muted-foreground border-border", children: guests.length })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 pb-6 space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-9 rounded-full" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 flex-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-3/4" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/2" })
                  ] })
                ] }, i)) }) : guests.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "px-6 pb-8 pt-4 text-center",
                    "data-ocid": "guests-empty-state",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-muted mx-auto mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-5 w-5 text-muted-foreground/60" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "No guests yet" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Send an invitation to add external collaborators." })
                    ]
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-border/40", children: guests.map((guest) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "flex items-start gap-3 px-4 py-3.5 hover:bg-muted/20 transition-colors duration-150",
                    "data-ocid": `guest-row-${guest.id}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold shrink-0", children: guest.email.charAt(0).toUpperCase() }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 space-y-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: guest.email }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Badge,
                            {
                              className: `text-xs rounded-full px-2 py-0.5 ${STATUS_COLORS[guest.status] ?? ""}`,
                              children: guest.status
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                            "Invited ",
                            formatDate(guest.createdAt)
                          ] })
                        ] })
                      ] }),
                      guest.status === "Active" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Button,
                        {
                          variant: "ghost",
                          size: "sm",
                          className: "h-8 text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0",
                          onClick: () => revokeMutation.mutate(guest.id),
                          disabled: revokeMutation.isPending,
                          "aria-label": `Revoke access for ${guest.email}`,
                          "data-ocid": `revoke-guest-${guest.id}`,
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(UserMinus, { className: "h-3.5 w-3.5 mr-1" }),
                            "Revoke"
                          ]
                        }
                      )
                    ]
                  },
                  guest.id
                )) }) })
              ]
            }
          )
        ] })
      ]
    }
  );
}
export {
  GuestAccessPage as default
};
