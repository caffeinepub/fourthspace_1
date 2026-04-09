import { m as useParams, f as useWorkspace, d as useNavigate, n as useQueryClient, r as reactExports, h as useQuery, j as jsxRuntimeExports, B as Button, ah as EscrowStatus, p as Shield, D as DollarSign, ai as MilestoneStatus__1 } from "./index-1XRv9GHr.js";
import { B as Badge } from "./badge-rX4oLW6l.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-CFU1s52N.js";
import { S as Skeleton } from "./index-wZVP6u7e.js";
import { T as Textarea } from "./textarea-DsJhlE90.js";
import { u as useMutation } from "./useMutation-X94w2CVk.js";
import { u as ue } from "./index-BOWFyaIB.js";
import { u as useBackend } from "./useBackend-DyFxq-Jw.js";
import { C as CircleX } from "./circle-x-Dqw7TEgJ.js";
import { A as ArrowLeft } from "./arrow-left-B-gbON0E.js";
import { L as LoaderCircle } from "./loader-circle-CtmMa9i8.js";
import { C as CircleCheckBig } from "./circle-check-big-ChIOUVol.js";
import { F as Flag } from "./flag-_dwFYLb_.js";
import { R as RefreshCw } from "./refresh-cw-J9WZ69Bg.js";
import { T as TriangleAlert } from "./triangle-alert-Dm4aJj7p.js";
import { f as format } from "./format-BjBbZPfh.js";
import "./en-US-CJ_JRP0W.js";
function formatICP(e8s) {
  return `${(Number(e8s) / 1e8).toFixed(4)} ICP`;
}
function formatTs(ts) {
  return format(new Date(Number(ts) / 1e6), "MMM d, yyyy HH:mm");
}
const ESCROW_COLORS = {
  [EscrowStatus.Pending]: "bg-muted text-muted-foreground",
  [EscrowStatus.Funded]: "bg-primary/10 text-primary",
  [EscrowStatus.Released]: "bg-accent/10 text-accent-foreground",
  [EscrowStatus.Disputed]: "bg-destructive/10 text-destructive",
  [EscrowStatus.Cancelled]: "bg-muted text-muted-foreground"
};
const MS_COLORS = {
  [MilestoneStatus__1.Pending]: "bg-muted text-muted-foreground",
  [MilestoneStatus__1.Approved]: "bg-primary/10 text-primary",
  [MilestoneStatus__1.Releasing]: "bg-secondary/10 text-secondary-foreground",
  [MilestoneStatus__1.Released]: "bg-accent/10 text-accent-foreground"
};
function EscrowDetailPage() {
  var _a, _b;
  const { workspaceId, escrowId } = useParams({ strict: false });
  const { tenantId } = useWorkspace();
  const { actor, isFetching } = useBackend();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [disputeReason, setDisputeReason] = reactExports.useState("");
  const [showDisputeForm, setShowDisputeForm] = reactExports.useState(false);
  const { data: escrow, isLoading } = useQuery({
    queryKey: ["escrow", tenantId, workspaceId, escrowId],
    queryFn: async () => {
      if (!actor) return null;
      const r = await actor.getEscrow(tenantId, workspaceId, escrowId);
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    enabled: !!actor && !isFetching && !!escrowId
  });
  const { data: milestones = [] } = useQuery({
    queryKey: ["escrowMilestones", tenantId, workspaceId, escrowId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listEscrowMilestones(tenantId, workspaceId, escrowId);
    },
    enabled: !!actor && !isFetching && !!escrowId
  });
  const { data: disputes = [] } = useQuery({
    queryKey: ["escrowDisputes", tenantId, workspaceId, escrowId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listEscrowDisputes(tenantId, workspaceId, escrowId);
    },
    enabled: !!actor && !isFetching && !!escrowId
  });
  function invalidate() {
    void queryClient.invalidateQueries({
      queryKey: ["escrow", tenantId, workspaceId, escrowId]
    });
    void queryClient.invalidateQueries({
      queryKey: ["escrowMilestones", tenantId, workspaceId, escrowId]
    });
    void queryClient.invalidateQueries({
      queryKey: ["escrowDisputes", tenantId, workspaceId, escrowId]
    });
    void queryClient.invalidateQueries({
      queryKey: ["escrow", tenantId, workspaceId]
    });
  }
  const fundMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.fundEscrow(tenantId, workspaceId, escrowId);
      if (r.__kind__ === "err") throw new Error(r.err);
    },
    onSuccess: () => {
      ue.success("Escrow funded successfully");
      invalidate();
    },
    onError: (e) => ue.error(e.message)
  });
  const releaseMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.releaseEscrow(tenantId, workspaceId, escrowId);
      if (r.__kind__ === "err") throw new Error(r.err);
    },
    onSuccess: () => {
      ue.success("Funds released successfully");
      invalidate();
    },
    onError: (e) => ue.error(e.message)
  });
  const refundMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.refundEscrow(tenantId, workspaceId, escrowId);
      if (r.__kind__ === "err") throw new Error(r.err);
    },
    onSuccess: () => {
      ue.success("Escrow refunded");
      invalidate();
    },
    onError: (e) => ue.error(e.message)
  });
  const cancelMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.cancelEscrow(tenantId, workspaceId, escrowId);
      if (r.__kind__ === "err") throw new Error(r.err);
    },
    onSuccess: () => {
      ue.success("Escrow cancelled");
      invalidate();
    },
    onError: (e) => ue.error(e.message)
  });
  const disputeMutation = useMutation({
    mutationFn: async (reason) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.raiseEscrowDispute(
        tenantId,
        workspaceId,
        escrowId,
        reason
      );
      if (r.__kind__ === "err") throw new Error(r.err);
    },
    onSuccess: () => {
      ue.success("Dispute raised");
      setShowDisputeForm(false);
      setDisputeReason("");
      invalidate();
    },
    onError: (e) => ue.error(e.message)
  });
  const approveMsMutation = useMutation({
    mutationFn: async (milestoneId) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.approveMilestone(
        tenantId,
        workspaceId,
        milestoneId
      );
      if (r.__kind__ === "err") throw new Error(r.err);
    },
    onSuccess: () => {
      ue.success("Milestone approved");
      invalidate();
    },
    onError: (e) => ue.error(e.message)
  });
  const releaseMsMutation = useMutation({
    mutationFn: async (milestoneId) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.releaseMilestoneFunds(
        tenantId,
        workspaceId,
        milestoneId
      );
      if (r.__kind__ === "err") throw new Error(r.err);
    },
    onSuccess: () => {
      ue.success("Milestone released successfully");
      invalidate();
    },
    onError: (e) => ue.error(e.message)
  });
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-4 p-4 sm:p-6 max-w-3xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-64" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 w-full rounded-lg" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 w-full rounded-lg" })
    ] });
  }
  if (!escrow) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-20 gap-4 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-12 h-12 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Escrow not found." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: () => navigate({ to: `/app/${workspaceId}/escrow` }),
          children: "Back to Escrow"
        }
      )
    ] });
  }
  const canFund = escrow.status === EscrowStatus.Pending;
  const canRelease = escrow.status === EscrowStatus.Funded;
  const canDispute = escrow.status === EscrowStatus.Funded || escrow.status === EscrowStatus.Pending;
  const canRefund = escrow.status === EscrowStatus.Disputed || escrow.status === EscrowStatus.Funded;
  const canCancel = escrow.status === EscrowStatus.Pending;
  const isTerminal = escrow.status === EscrowStatus.Released || escrow.status === EscrowStatus.Cancelled;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-5 p-4 sm:p-6 max-w-3xl mx-auto w-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          onClick: () => navigate({ to: `/app/${workspaceId}/escrow` }),
          "data-ocid": "escrow-detail-back",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-5 h-5 text-primary shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold font-display truncate flex-1 min-w-0", children: escrow.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Badge,
        {
          className: `shrink-0 text-xs ${ESCROW_COLORS[escrow.status] ?? "bg-muted text-muted-foreground"}`,
          variant: "outline",
          children: escrow.status
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 grid grid-cols-2 sm:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Amount", value: formatICP(escrow.amount) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Currency", value: escrow.currency }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Created", value: formatTs(escrow.createdAt) }),
      escrow.dueDate ? /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Due", value: formatTs(escrow.dueDate) }) : null
    ] }) }),
    escrow.description && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1.5", children: "Description" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: escrow.description })
    ] }) }),
    !isTerminal && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-display", children: "Actions" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "px-4 pb-4 pt-0 flex flex-col gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
          canFund && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              "data-ocid": "escrow-fund-btn",
              size: "sm",
              onClick: () => fundMutation.mutate(),
              disabled: fundMutation.isPending,
              className: "gap-1.5",
              children: [
                fundMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "w-3.5 h-3.5" }),
                "Fund Escrow"
              ]
            }
          ),
          canRelease && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              "data-ocid": "escrow-release-btn",
              size: "sm",
              variant: "outline",
              onClick: () => releaseMutation.mutate(),
              disabled: releaseMutation.isPending,
              className: "gap-1.5",
              children: [
                releaseMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-3.5 h-3.5" }),
                "Release Funds"
              ]
            }
          ),
          canDispute && !showDisputeForm && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              "data-ocid": "escrow-dispute-btn",
              size: "sm",
              variant: "outline",
              onClick: () => setShowDisputeForm(true),
              className: "gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/5",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { className: "w-3.5 h-3.5" }),
                "Raise Dispute"
              ]
            }
          ),
          canRefund && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              "data-ocid": "escrow-refund-btn",
              size: "sm",
              variant: "outline",
              onClick: () => refundMutation.mutate(),
              disabled: refundMutation.isPending,
              className: "gap-1.5",
              children: [
                refundMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3.5 h-3.5" }),
                "Refund"
              ]
            }
          ),
          canCancel && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              "data-ocid": "escrow-cancel-btn",
              size: "sm",
              variant: "ghost",
              onClick: () => cancelMutation.mutate(),
              disabled: cancelMutation.isPending,
              className: "gap-1.5 text-destructive hover:text-destructive",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3.5 h-3.5" }),
                "Cancel"
              ]
            }
          )
        ] }),
        showDisputeForm && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-lg border border-destructive/30 bg-destructive/5 flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-destructive flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4" }),
            "Raise a Dispute"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              "data-ocid": "escrow-dispute-reason",
              placeholder: "Describe the reason for the dispute...",
              value: disputeReason,
              onChange: (e) => setDisputeReason(e.target.value),
              rows: 3
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                variant: "ghost",
                onClick: () => setShowDisputeForm(false),
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                variant: "destructive",
                "data-ocid": "escrow-dispute-submit",
                onClick: () => disputeMutation.mutate(disputeReason),
                disabled: disputeMutation.isPending || !disputeReason.trim(),
                children: disputeMutation.isPending ? "Submitting..." : "Submit Dispute"
              }
            )
          ] })
        ] })
      ] })
    ] }),
    milestones.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-display", children: [
        "Milestones (",
        milestones.length,
        ")"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-4 pb-4 pt-0 flex flex-col gap-3", children: milestones.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": `milestone-card-${m.id}`,
          className: "p-3 rounded-lg border border-border bg-background flex items-start justify-between gap-3 flex-wrap",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-0.5 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: m.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: `text-xs shrink-0 ${MS_COLORS[m.status] ?? "bg-muted"}`,
                    children: m.status
                  }
                )
              ] }),
              m.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-1", children: m.description }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-medium text-foreground mt-1", children: [
                formatICP(m.amount),
                m.ledgerBlockHeight != null && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground font-normal ml-2", children: [
                  "Block #",
                  m.ledgerBlockHeight.toString()
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5 shrink-0", children: [
              m.status === MilestoneStatus__1.Pending && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  onClick: () => approveMsMutation.mutate(m.id),
                  disabled: approveMsMutation.isPending,
                  "data-ocid": `milestone-approve-${m.id}`,
                  className: "text-xs h-7 px-2 gap-1",
                  children: [
                    approveMsMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3 h-3 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-3 h-3" }),
                    "Approve"
                  ]
                }
              ),
              m.status === MilestoneStatus__1.Approved && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  onClick: () => releaseMsMutation.mutate(m.id),
                  disabled: releaseMsMutation.isPending,
                  "data-ocid": `milestone-release-${m.id}`,
                  className: "text-xs h-7 px-2 gap-1",
                  children: [
                    releaseMsMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3 h-3 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "w-3 h-3" }),
                    "Release"
                  ]
                }
              )
            ] })
          ]
        },
        m.id
      )) })
    ] }),
    ((_a = escrow.statusHistory) == null ? void 0 : _a.length) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-display", children: "Status Timeline" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-4 pb-4 pt-0", children: escrow.statusHistory.map((entry, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        TimelineEntry,
        {
          entry,
          isLast: idx === escrow.statusHistory.length - 1
        },
        `timeline-${entry.timestamp.toString()}-${idx}`
      )) })
    ] }),
    disputes.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-destructive/30", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-display text-destructive flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4" }),
        "Disputes"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-4 pb-4 pt-0 flex flex-col gap-3", children: disputes.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "p-3 rounded-md bg-destructive/5 border border-destructive/20",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: d.status === "Open" ? "text-destructive border-destructive/30" : "text-muted-foreground",
                  children: d.status
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: formatTs(d.createdAt) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: d.reason }),
            d.resolution && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1.5", children: [
              "Resolution: ",
              d.resolution
            ] })
          ]
        },
        d.id
      )) })
    ] }),
    ((_b = escrow.conditions) == null ? void 0 : _b.length) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-display", children: "Conditions" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-4 pb-4 pt-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "flex flex-col gap-1.5", children: escrow.conditions.map((c, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "li",
        {
          className: "flex items-start gap-2 text-sm text-foreground",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground shrink-0 mt-0.5 font-mono text-xs", children: [
              idx + 1,
              "."
            ] }),
            c
          ]
        },
        `cond-${c.slice(0, 10)}-${idx}`
      )) }) })
    ] })
  ] });
}
function Stat({ label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground mt-0.5", children: value })
  ] });
}
function TimelineEntry({
  entry,
  isLast
}) {
  const dotColor = entry.status === EscrowStatus.Disputed ? "bg-destructive" : entry.status === EscrowStatus.Released ? "bg-accent" : entry.status === EscrowStatus.Funded ? "bg-primary" : "bg-muted-foreground";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-2 h-2 rounded-full mt-1.5 shrink-0 ${dotColor}` }),
      !isLast && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px flex-1 bg-border mt-1" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground", children: entry.status }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: formatTs(entry.timestamp) })
      ] }),
      entry.note && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: entry.note })
    ] })
  ] });
}
export {
  EscrowDetailPage as default
};
