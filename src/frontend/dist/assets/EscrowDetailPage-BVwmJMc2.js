import { s as createLucideIcon, m as useParams, g as getTenantId, f as useWorkspace, d as useNavigate, n as useQueryClient, r as reactExports, h as useQuery, j as jsxRuntimeExports, p as Shield, B as Button, D as DollarSign, ae as EscrowStatus, aM as DisputeStatus, ah as User, aN as MilestoneStatus__1 } from "./index-BZqaRhAX.js";
import { B as Badge } from "./index--nGTycyb.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-DQu6DGwy.js";
import { I as Input } from "./input-BJtw5f9h.js";
import { L as Label } from "./label-CvyzRjc5.js";
import { S as Separator } from "./separator-J7DkFB-P.js";
import { S as Skeleton } from "./skeleton-CXUiMpVp.js";
import { T as Textarea } from "./textarea-CZBafaSY.js";
import { u as useMutation } from "./useMutation-CLofsIuD.js";
import { u as ue } from "./index-BRf-248B.js";
import { u as useBackend } from "./useBackend-DSxJo5MU.js";
import { C as CircleX } from "./circle-x-C_OAUkSE.js";
import { T as TriangleAlert } from "./triangle-alert-DZo5ldlW.js";
import { C as CircleCheck } from "./circle-check-wa2s5his.js";
import { C as Clock } from "./clock-BL9M8ZaB.js";
import { L as Layers } from "./layers-D2OloIh5.js";
import { A as ArrowLeft } from "./arrow-left-BCLeiEG1.js";
import { D as Download } from "./download-BiuWll3S.js";
import { F as Flag } from "./flag-ALt0GhwJ.js";
import { E as ExternalLink } from "./external-link-Cetn1x_C.js";
import { C as ChevronRight } from "./chevron-right-CJImBI0a.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m14.5 12.5-8 8a2.119 2.119 0 1 1-3-3l8-8", key: "15492f" }],
  ["path", { d: "m16 16 6-6", key: "vzrcl6" }],
  ["path", { d: "m8 8 6-6", key: "18bi4p" }],
  ["path", { d: "m9 7 8 8", key: "5jnvq1" }],
  ["path", { d: "m21 11-8-8", key: "z4y7zo" }]
];
const Gavel = createLucideIcon("gavel", __iconNode);
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
  const curr = currency ?? "USD";
  return `${curr} ${num.toLocaleString("en-US", {
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
function formatDateTime(ts) {
  return new Date(Number(ts) / 1e6).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
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
const MILESTONE_STATUS_STYLES = {
  [MilestoneStatus__1.Pending]: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  [MilestoneStatus__1.Approved]: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  [MilestoneStatus__1.Releasing]: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  [MilestoneStatus__1.Released]: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
};
function EscrowDetailPage() {
  const { escrowId: contractId } = useParams({
    from: "/app/$workspaceId/escrow/$escrowId"
  });
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = reactExports.useState("overview");
  const [disputeReason, setDisputeReason] = reactExports.useState("");
  const [arbiterPrincipal, setArbiterPrincipal] = reactExports.useState("");
  const [disputeResolution, setDisputeResolution] = reactExports.useState("");
  const [showDisputeForm, setShowDisputeForm] = reactExports.useState(false);
  const { data: contract, isLoading } = useQuery({
    queryKey: ["escrow", tenantId, workspaceId, contractId],
    queryFn: async () => {
      if (!actor) return null;
      const r = await actor.getEscrow(tenantId, workspaceId, contractId);
      return r.__kind__ === "ok" ? r.ok : null;
    },
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const { data: milestones } = useQuery({
    queryKey: ["escrowMilestones", tenantId, workspaceId, contractId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listEscrowMilestones(tenantId, workspaceId, contractId);
    },
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const { data: disputes } = useQuery({
    queryKey: ["escrowDisputes", tenantId, workspaceId, contractId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listEscrowDisputes(tenantId, workspaceId, contractId);
    },
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const { data: summary } = useQuery({
    queryKey: ["escrowSummary", tenantId, workspaceId, contractId],
    queryFn: async () => {
      if (!actor) return null;
      const r = await actor.getEscrowSummary(tenantId, workspaceId, contractId);
      return r.__kind__ === "ok" ? r.ok : null;
    },
    enabled: !!actor && !isFetching && !!workspaceId && activeTab === "overview"
  });
  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: ["escrow", tenantId, workspaceId, contractId]
    });
    queryClient.invalidateQueries({
      queryKey: ["escrows", tenantId, workspaceId]
    });
    queryClient.invalidateQueries({
      queryKey: ["escrowMilestones", tenantId, workspaceId, contractId]
    });
    queryClient.invalidateQueries({
      queryKey: ["escrowDisputes", tenantId, workspaceId, contractId]
    });
  };
  const fundMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.fundEscrow(tenantId, workspaceId, contractId);
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
      const r = await actor.releaseEscrow(tenantId, workspaceId, contractId);
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      invalidate();
      ue.success("Funds released to payee");
    },
    onError: (e) => ue.error(e.message)
  });
  const cancelMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.cancelEscrow(tenantId, workspaceId, contractId);
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      invalidate();
      ue.info("Escrow contract cancelled");
    },
    onError: (e) => ue.error(e.message)
  });
  const approveMilestoneMutation = useMutation({
    mutationFn: async (milestoneId) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.approveMilestone(
        tenantId,
        workspaceId,
        milestoneId
      );
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      invalidate();
      ue.success("Milestone approved");
    },
    onError: (e) => ue.error(e.message)
  });
  const releaseMilestoneMutation = useMutation({
    mutationFn: async (milestoneId) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.releaseMilestoneFunds(
        tenantId,
        workspaceId,
        milestoneId
      );
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      invalidate();
      ue.success("Milestone funds released");
    },
    onError: (e) => ue.error(e.message)
  });
  const raiseDisputeMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.raiseEscrowDispute(
        tenantId,
        workspaceId,
        contractId,
        disputeReason
      );
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      invalidate();
      ue.warning("Dispute raised");
      setShowDisputeForm(false);
      setDisputeReason("");
      setArbiterPrincipal("");
      setActiveTab("dispute");
    },
    onError: (e) => ue.error(e.message)
  });
  const resolveDisputeMutation = useMutation({
    mutationFn: async (disputeId) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.resolveDispute(
        tenantId,
        workspaceId,
        disputeId,
        disputeResolution
      );
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      invalidate();
      ue.success("Dispute resolved");
      setDisputeResolution("");
    },
    onError: (e) => ue.error(e.message)
  });
  const isBusy = fundMutation.isPending || releaseMutation.isPending || cancelMutation.isPending || raiseDisputeMutation.isPending;
  function handleDownloadSummary() {
    if (!summary) {
      ue.error("Summary not available");
      return;
    }
    const lines = [
      "Escrow Summary",
      "==============",
      `Title: ${summary.title}`,
      `Status: ${summary.status}`,
      `Amount: ${summary.currency} ${(Number(summary.amount) / 100).toFixed(2)}`,
      `Payer: ${summary.payerId}`,
      `Payee: ${summary.payeeId}`,
      `Created: ${new Date(Number(summary.createdAt) / 1e6).toLocaleString("en-US")}`,
      `Milestone Count: ${Number(summary.milestoneCount)}`,
      "",
      "Conditions:",
      ...summary.conditions.map((c, i) => `  ${i + 1}. ${c}`),
      "",
      "Status History:",
      ...summary.statusHistory.map(
        (h) => `  ${h.status} — ${new Date(Number(h.timestamp) / 1e6).toLocaleString("en-US")} by ${h.changedBy.toString()}`
      )
    ];
    const text = lines.join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `escrow-${contractId.slice(0, 8)}-summary.txt`;
    a.click();
    URL.revokeObjectURL(url);
    ue.success("Summary downloaded");
  }
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
          onClick: () => navigate({ to: `/app/${workspaceId}/escrow` }),
          children: "Back to Escrow"
        }
      )
    ] });
  }
  const cfg = STATUS_CONFIG[contract.status];
  const StatusIcon = cfg.icon;
  const isTerminal = contract.status === EscrowStatus.Released || contract.status === EscrowStatus.Cancelled;
  const milestoneList = milestones ?? [];
  const disputeList = disputes ?? [];
  const openDispute = disputeList.find((d) => d.status === DisputeStatus.Open) ?? null;
  const TABS = [
    { id: "overview", label: "Overview", icon: Shield },
    {
      id: "milestones",
      label: `Milestones${milestoneList.length > 0 ? ` (${milestoneList.length})` : ""}`,
      icon: Layers
    },
    { id: "timeline", label: "Status History", icon: Clock },
    {
      id: "dispute",
      label: `Dispute${disputeList.length > 0 ? ` (${disputeList.length})` : ""}`,
      icon: Gavel
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-fade-in-up p-6 md:p-8 max-w-3xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => navigate({ to: `/app/${workspaceId}/escrow` }),
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
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: handleDownloadSummary,
          disabled: !summary,
          "data-ocid": "escrow-download-summary",
          className: "shrink-0 gap-1.5",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-3.5 w-3.5" }),
            "Summary"
          ]
        }
      )
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
    !isTerminal && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-foreground", children: "Actions" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
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
            !openDispute && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                onClick: () => setShowDisputeForm(!showDisputeForm),
                disabled: isBusy,
                "data-ocid": "escrow-dispute-btn",
                className: "gap-2 border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { className: "h-4 w-4" }),
                  "Raise Dispute"
                ]
              }
            )
          ] })
        ] }),
        showDisputeForm && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 rounded-xl border border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10 p-4 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-red-700 dark:text-red-400 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4" }),
            "Raise a Dispute"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "dispute-reason", className: "text-xs", children: [
              "Reason ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-500", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "dispute-reason",
                placeholder: "Describe the reason for the dispute...",
                value: disputeReason,
                onChange: (e) => setDisputeReason(e.target.value),
                rows: 3,
                "data-ocid": "dispute-reason-textarea"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "arbiter-principal", className: "text-xs", children: [
              "Arbiter Principal ID",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "(optional)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "arbiter-principal",
                placeholder: "Enter arbiter's principal ID",
                value: arbiterPrincipal,
                onChange: (e) => setArbiterPrincipal(e.target.value),
                className: "font-mono text-xs",
                "data-ocid": "arbiter-principal-input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                onClick: () => raiseDisputeMutation.mutate(),
                disabled: !disputeReason.trim() || raiseDisputeMutation.isPending,
                className: "bg-red-600 hover:bg-red-700 text-white",
                "data-ocid": "dispute-submit-btn",
                children: raiseDisputeMutation.isPending ? "Submitting..." : "Submit Dispute"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                variant: "outline",
                onClick: () => {
                  setShowDisputeForm(false);
                  setDisputeReason("");
                },
                children: "Cancel"
              }
            )
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-0 overflow-x-auto", children: TABS.map((tab) => {
      const TabIcon = tab.icon;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setActiveTab(tab.id),
          "data-ocid": `escrow-tab-${tab.id}`,
          className: `flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-smooth whitespace-nowrap ${activeTab === tab.id ? "border-amber-500 text-amber-600 dark:text-amber-400" : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabIcon, { className: "h-3.5 w-3.5" }),
            tab.label
          ]
        },
        tab.id
      );
    }) }) }),
    activeTab === "overview" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold text-foreground", children: "Status Timeline" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusTimeline, { status: contract.status }) })
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
    ] }),
    activeTab === "milestones" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: milestoneList.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-dashed border-border py-12 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "mx-auto h-8 w-8 text-muted-foreground/40 mb-3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No milestones for this contract" })
    ] }) : milestoneList.map((milestone) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-4 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm text-foreground truncate", children: milestone.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              className: `text-[10px] px-1.5 py-0.5 ${MILESTONE_STATUS_STYLES[milestone.status]}`,
              variant: "secondary",
              children: milestone.status
            }
          )
        ] }),
        milestone.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-2", children: milestone.description }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
          "Created ",
          formatDate(milestone.createdAt)
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right shrink-0 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-sm text-amber-600 dark:text-amber-400", children: formatAmount(milestone.amount, contract.currency) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5 justify-end", children: [
          milestone.status === MilestoneStatus__1.Pending && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              onClick: () => approveMilestoneMutation.mutate(milestone.id),
              disabled: approveMilestoneMutation.isPending,
              className: "h-7 text-xs bg-blue-600 hover:bg-blue-700 text-white",
              "data-ocid": `milestone-approve-${milestone.id}`,
              children: "Approve"
            }
          ),
          milestone.status === MilestoneStatus__1.Approved && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              onClick: () => releaseMilestoneMutation.mutate(milestone.id),
              disabled: releaseMilestoneMutation.isPending,
              className: "h-7 text-xs bg-green-600 hover:bg-green-700 text-white",
              "data-ocid": `milestone-release-${milestone.id}`,
              children: "Release Funds"
            }
          ),
          milestone.status === MilestoneStatus__1.Released && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-xs text-green-600 dark:text-green-400", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5" }),
            "Released"
          ] })
        ] })
      ] })
    ] }) }) }, milestone.id)) }),
    activeTab === "timeline" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      contract.crossLinks.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative pl-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-0 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusIcon, { className: "h-3 w-3" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pb-4 border-b border-border last:border-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: cfg.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Current status" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative pl-8 mt-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-0 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-muted border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Created" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: formatDateTime(contract.createdAt) })
          ] })
        ] })
      ] }),
      summary && summary.statusHistory.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "mt-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-amber-500" }),
          "Full Status History"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: summary.statusHistory.map((h, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-start gap-3 py-2 border-b border-border last:border-0",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3 text-amber-600 dark:text-amber-400" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: h.status }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: new Date(
                  Number(h.timestamp) / 1e6
                ).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit"
                }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "p",
                  {
                    className: "text-xs text-muted-foreground font-mono truncate",
                    title: h.changedBy.toString(),
                    children: [
                      h.changedBy.toString().slice(0, 24),
                      "…"
                    ]
                  }
                )
              ] })
            ]
          },
          `${h.status}-${idx}`
        )) }) })
      ] })
    ] }),
    activeTab === "dispute" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      disputeList.length === 0 && !showDisputeForm ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-dashed border-border py-12 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Gavel, { className: "mx-auto h-8 w-8 text-muted-foreground/40 mb-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No disputes for this contract" }),
        contract.status === EscrowStatus.Funded && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "outline",
            onClick: () => setShowDisputeForm(true),
            className: "mt-4 gap-1.5 border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20",
            "data-ocid": "dispute-raise-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { className: "h-3.5 w-3.5" }),
              "Raise Dispute"
            ]
          }
        )
      ] }) : disputeList.map((dispute) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: dispute.status === DisputeStatus.Open ? "border-red-200 dark:border-red-800 bg-red-50/30 dark:bg-red-900/10" : "",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold text-foreground flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Gavel, { className: "h-4 w-4 text-red-500" }),
                "Dispute"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "secondary",
                  className: dispute.status === DisputeStatus.Open ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                  children: dispute.status
                }
              )
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5", children: "Reason" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: dispute.reason })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5", children: "Raised By" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "p",
                    {
                      className: "text-xs text-foreground font-mono truncate",
                      title: dispute.raisedBy.toString(),
                      children: [
                        dispute.raisedBy.toString().slice(0, 18),
                        "…"
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5", children: "Date" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground", children: formatDateTime(dispute.createdAt) })
                ] })
              ] }),
              dispute.arbiter && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5", children: "Arbiter" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-foreground font-mono truncate", children: [
                  dispute.arbiter.toString().slice(0, 24),
                  "…"
                ] })
              ] }),
              dispute.resolution && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5", children: "Resolution" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: dispute.resolution })
              ] }),
              dispute.status === DisputeStatus.Open && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2 space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-foreground", children: "Resolve Dispute (Arbiter only)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    placeholder: "Enter resolution details...",
                    value: disputeResolution,
                    onChange: (e) => setDisputeResolution(e.target.value),
                    rows: 2,
                    "data-ocid": "dispute-resolution-textarea"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "sm",
                    onClick: () => resolveDisputeMutation.mutate(dispute.id),
                    disabled: !disputeResolution.trim() || resolveDisputeMutation.isPending,
                    className: "bg-green-600 hover:bg-green-700 text-white gap-1.5",
                    "data-ocid": "dispute-resolve-btn",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5" }),
                      resolveDisputeMutation.isPending ? "Resolving..." : "Resolve Dispute"
                    ]
                  }
                )
              ] })
            ] })
          ]
        },
        dispute.id
      )),
      showDisputeForm && disputeList.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-red-200 dark:border-red-800", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-4 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "dispute-reason-tab", className: "text-xs", children: "Reason *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              id: "dispute-reason-tab",
              placeholder: "Describe the reason...",
              value: disputeReason,
              onChange: (e) => setDisputeReason(e.target.value),
              rows: 3,
              "data-ocid": "dispute-reason-tab-textarea"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              onClick: () => raiseDisputeMutation.mutate(),
              disabled: !disputeReason.trim() || raiseDisputeMutation.isPending,
              className: "bg-red-600 hover:bg-red-700 text-white",
              children: raiseDisputeMutation.isPending ? "Submitting..." : "Submit"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              variant: "outline",
              onClick: () => setShowDisputeForm(false),
              children: "Cancel"
            }
          )
        ] })
      ] }) })
    ] })
  ] });
}
export {
  EscrowDetailPage as default
};
