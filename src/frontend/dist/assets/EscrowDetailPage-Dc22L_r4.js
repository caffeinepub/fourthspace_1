import { b as useParams, h as getTenantId, a as useNavigate, d as useQueryClient, e as useQuery, j as jsxRuntimeExports, l as Shield, B as Button, D as DollarSign, E as EscrowStatus, U as User } from "./index-D7inqmxR.js";
import { B as Badge } from "./index-BJuRsRYe.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-wy6FYjGT.js";
import { S as Separator } from "./separator-B6dqygkP.js";
import { S as Skeleton } from "./skeleton-sexCBv2H.js";
import { u as useMutation } from "./useMutation-BeBnUQJD.js";
import { u as ue } from "./index-p-k3Ndic.js";
import { u as useBackend } from "./useBackend-BH6dl3yo.js";
import { C as CircleX } from "./circle-x-ZZk2DaqI.js";
import { T as TriangleAlert } from "./triangle-alert-BVd-weXD.js";
import { C as CircleCheck } from "./circle-check-gwasD9uJ.js";
import { C as Clock } from "./clock-xD41YETq.js";
import { A as ArrowLeft } from "./arrow-left-mNBAKt8w.js";
import { E as ExternalLink } from "./external-link-RatDOdkB.js";
const STATUS_CONFIG = {
  [EscrowStatus.Pending]: {
    label: "Pending",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    icon: Clock,
    description: "Awaiting funding by the payer"
  },
  [EscrowStatus.Funded]: {
    label: "Funded",
    className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    icon: DollarSign,
    description: "Funds are held in escrow"
  },
  [EscrowStatus.Released]: {
    label: "Released",
    className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    icon: CircleCheck,
    description: "Funds have been released to payee"
  },
  [EscrowStatus.Disputed]: {
    label: "Disputed",
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    icon: TriangleAlert,
    description: "Contract is under dispute"
  },
  [EscrowStatus.Cancelled]: {
    label: "Cancelled",
    className: "bg-muted text-muted-foreground",
    icon: CircleX,
    description: "Contract has been cancelled"
  }
};
const TIMELINE_STEPS = [
  EscrowStatus.Pending,
  EscrowStatus.Funded,
  EscrowStatus.Released
];
function formatAmount(amount, currency) {
  const num = Number(amount) / 100;
  return `${currency} ${num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}
function formatDate(ts) {
  return new Date(Number(ts) / 1e6).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}
function StatusTimeline({ status }) {
  const isDisputed = status === EscrowStatus.Disputed;
  const isCancelled = status === EscrowStatus.Cancelled;
  if (isDisputed || isCancelled) {
    const Icon = isDisputed ? TriangleAlert : CircleX;
    const color = isDisputed ? "text-red-500" : "text-muted-foreground";
    const bg = isDisputed ? "bg-red-50 dark:bg-red-900/20" : "bg-muted";
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-3 rounded-xl p-4 ${bg}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `h-5 w-5 shrink-0 ${color}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-sm font-medium ${color}`, children: isDisputed ? "This contract is under dispute" : "This contract was cancelled" })
    ] });
  }
  const currentIdx = TIMELINE_STEPS.indexOf(status);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center", children: TIMELINE_STEPS.map((s, idx) => {
    const cfg = STATUS_CONFIG[s];
    const Icon = cfg.icon;
    const isPast = idx < currentIdx;
    const isCurrent = idx === currentIdx;
    const isFuture = idx > currentIdx;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center flex-1 last:flex-none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `flex h-8 w-8 items-center justify-center rounded-full border-2 transition-smooth ${isPast ? "border-amber-500 bg-amber-500 text-white" : isCurrent ? "border-amber-500 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" : "border-border bg-muted text-muted-foreground"}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `text-[10px] font-medium whitespace-nowrap ${isFuture ? "text-muted-foreground" : "text-foreground"}`,
            children: cfg.label
          }
        )
      ] }),
      idx < TIMELINE_STEPS.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `h-0.5 flex-1 mx-2 mb-4 rounded-full transition-smooth ${isPast ? "bg-amber-500" : "bg-border"}`
        }
      )
    ] }, s);
  }) });
}
function EscrowDetailPage() {
  const { contractId } = useParams({ from: "/app/escrow/$contractId" });
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: contract, isLoading } = useQuery({
    queryKey: ["escrow", tenantId, contractId],
    queryFn: async () => {
      if (!actor) return null;
      const r = await actor.getEscrow(tenantId, contractId);
      return r.__kind__ === "ok" ? r.ok : null;
    },
    enabled: !!actor && !isFetching
  });
  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: ["escrow", tenantId, contractId]
    });
    queryClient.invalidateQueries({ queryKey: ["escrows", tenantId] });
  };
  const fundMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.fundEscrow(tenantId, contractId);
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      invalidate();
      ue.success("Escrow funded successfully");
    },
    onError: (e) => ue.error(e.message)
  });
  const releaseMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.releaseEscrow(tenantId, contractId);
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      invalidate();
      ue.success("Funds released to payee");
    },
    onError: (e) => ue.error(e.message)
  });
  const disputeMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.disputeEscrow(tenantId, contractId);
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      invalidate();
      ue.warning("Dispute raised");
    },
    onError: (e) => ue.error(e.message)
  });
  const cancelMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.cancelEscrow(tenantId, contractId);
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      invalidate();
      ue.info("Escrow contract cancelled");
    },
    onError: (e) => ue.error(e.message)
  });
  const isBusy = fundMutation.isPending || releaseMutation.isPending || disputeMutation.isPending || cancelMutation.isPending;
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 max-w-3xl mx-auto space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-48" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 rounded-xl" })
    ] });
  }
  if (!contract) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 max-w-3xl mx-auto text-center py-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "mx-auto h-12 w-12 text-muted-foreground mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "Contract not found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          className: "mt-4",
          onClick: () => navigate({ to: "/app/escrow" }),
          children: "Back to Escrow"
        }
      )
    ] });
  }
  const cfg = STATUS_CONFIG[contract.status];
  const StatusIcon = cfg.icon;
  const isTerminal = contract.status === EscrowStatus.Released || contract.status === EscrowStatus.Cancelled;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 max-w-3xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => navigate({ to: "/app/escrow" }),
          "aria-label": "Back to escrow",
          className: "mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card hover:bg-muted transition-smooth shrink-0",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4 text-muted-foreground" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl font-bold text-foreground truncate", children: contract.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: `inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.className}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(StatusIcon, { className: "h-3 w-3" }),
                cfg.label
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: cfg.description })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-500 p-6 text-white shadow-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-white/80 mb-1", children: "Contract Amount" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-4xl font-bold tracking-tight", children: formatAmount(contract.amount, contract.currency) }),
      contract.dueDate && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-white/70 mt-2 flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5" }),
        "Due ",
        formatDate(contract.dueDate)
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-foreground", children: "Status Timeline" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusTimeline, { status: contract.status }) })
    ] }),
    !isTerminal && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-foreground", children: "Actions" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
        contract.status === EscrowStatus.Pending && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: () => fundMutation.mutate(),
              disabled: isBusy,
              "data-ocid": "escrow-fund-btn",
              className: "bg-amber-500 hover:bg-amber-600 text-white gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-4 w-4" }),
                fundMutation.isPending ? "Funding..." : "Fund Escrow"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              onClick: () => cancelMutation.mutate(),
              disabled: isBusy,
              "data-ocid": "escrow-cancel-contract-btn",
              className: "gap-2 border-destructive/40 text-destructive hover:bg-destructive/10",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-4 w-4" }),
                cancelMutation.isPending ? "Cancelling..." : "Cancel"
              ]
            }
          )
        ] }),
        contract.status === EscrowStatus.Funded && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: () => releaseMutation.mutate(),
              disabled: isBusy,
              "data-ocid": "escrow-release-btn",
              className: "bg-green-600 hover:bg-green-700 text-white gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }),
                releaseMutation.isPending ? "Releasing..." : "Release Funds"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              onClick: () => disputeMutation.mutate(),
              disabled: isBusy,
              "data-ocid": "escrow-dispute-btn",
              className: "gap-2 border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4" }),
                disputeMutation.isPending ? "Raising..." : "Raise Dispute"
              ]
            }
          )
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4 text-amber-500" }),
          "Parties"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5", children: "Payer" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "p",
              {
                className: "text-xs text-foreground font-mono truncate",
                title: contract.payerId.toString(),
                children: [
                  contract.payerId.toString().slice(0, 24),
                  "…"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5", children: "Payee" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "p",
              {
                className: "text-xs text-foreground font-mono truncate",
                title: contract.payeeId.toString(),
                children: [
                  contract.payeeId.toString().slice(0, 24),
                  "…"
                ]
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-amber-500" }),
          "Dates"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5", children: "Created" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: formatDate(contract.createdAt) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5", children: "Due Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: contract.dueDate ? formatDate(contract.dueDate) : "—" })
          ] })
        ] })
      ] })
    ] }),
    contract.description && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-foreground", children: "Description" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground leading-relaxed", children: contract.description }) })
    ] }),
    contract.conditions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold text-foreground flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-amber-500" }),
        "Release Conditions"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "space-y-2", children: contract.conditions.map((cond, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "li",
        {
          className: "flex gap-3 text-sm text-foreground",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold mt-0.5", children: idx + 1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "leading-relaxed", children: cond })
          ]
        },
        `cond-${cond.slice(0, 20)}-${idx}`
      )) }) })
    ] }),
    contract.crossLinks.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold text-foreground flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-4 w-4 text-amber-500" }),
        "Cross-Links"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: contract.crossLinks.map((link, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Badge,
        {
          variant: "secondary",
          className: "gap-1.5 py-1 px-2.5 text-xs",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "capitalize text-muted-foreground", children: [
              link.entityType,
              ":"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: link.linkLabel })
          ]
        },
        `${link.entityType}-${link.entityId}-${idx}`
      )) }) })
    ] })
  ] });
}
export {
  EscrowDetailPage as default
};
