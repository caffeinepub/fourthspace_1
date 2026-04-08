import { g as getTenantId, f as useWorkspace, d as useNavigate, n as useQueryClient, r as reactExports, h as useQuery, j as jsxRuntimeExports, B as Button, P as Plus, W as Wallet, i as Link, af as AssetType, a8 as PayFrequency, ab as ChevronDown } from "./index-BZqaRhAX.js";
import { I as Input } from "./input-BJtw5f9h.js";
import { L as Label } from "./label-CvyzRjc5.js";
import { S as Skeleton } from "./skeleton-CXUiMpVp.js";
import { u as useMutation } from "./useMutation-CLofsIuD.js";
import { u as ue } from "./index-BRf-248B.js";
import { u as useBackend } from "./useBackend-DSxJo5MU.js";
import { A as ArrowLeft } from "./arrow-left-BCLeiEG1.js";
import { R as RefreshCw } from "./refresh-cw-zBJl8Ogw.js";
import { f as format } from "./format-BjBbZPfh.js";
import { P as Pause } from "./pause-8_e3Pumg.js";
import { T as Trash2 } from "./trash-2-B2tpJk42.js";
import "./en-US-CJ_JRP0W.js";
const E8S = BigInt(1e8);
function formatAmount(amount, asset) {
  const whole = amount / E8S;
  const frac = (amount % E8S).toString().padStart(8, "0").slice(0, 4);
  return `${whole.toLocaleString()}.${frac} ${asset}`;
}
function amountToBigInt(value) {
  const [whole = "0", frac = "0"] = value.split(".");
  const fracPadded = frac.slice(0, 8).padEnd(8, "0");
  return BigInt(whole) * E8S + BigInt(fracPadded);
}
function truncateAddress(addr, len = 10) {
  if (addr.length <= len * 2 + 3) return addr;
  return `${addr.slice(0, len)}...${addr.slice(-len)}`;
}
const FREQ_LABELS = {
  [PayFrequency.Weekly]: "Weekly",
  [PayFrequency.BiWeekly]: "Bi-Weekly",
  [PayFrequency.SemiMonthly]: "Semi-Monthly",
  [PayFrequency.Monthly]: "Monthly",
  [PayFrequency.Quarterly]: "Quarterly"
};
const FREQ_COLORS = {
  [PayFrequency.Weekly]: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-500/20",
  [PayFrequency.BiWeekly]: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20",
  [PayFrequency.SemiMonthly]: "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/20",
  [PayFrequency.Monthly]: "bg-violet-500/15 text-violet-700 dark:text-violet-400 border-violet-500/20",
  [PayFrequency.Quarterly]: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20"
};
function RecurringRow({
  payment,
  onCancel,
  isCancelling
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center gap-4 rounded-xl border border-border/50 bg-card shadow-card p-4 hover:border-violet-400/40 transition-all",
      "data-ocid": `recurring-row-${payment.id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-5 w-5 text-violet-500" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate font-mono", children: truncateAddress(payment.toAddress) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-0.5 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-muted-foreground", children: formatAmount(payment.amount, payment.asset) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "·" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${FREQ_COLORS[payment.frequency] ?? "bg-muted text-muted-foreground border-border"}`,
                children: FREQ_LABELS[payment.frequency]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
            "Next:",
            " ",
            format(
              new Date(Number(payment.nextRunAt / BigInt(1e6))),
              "MMM d, yyyy"
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border ${payment.isActive ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20" : "bg-muted text-muted-foreground border-border"}`,
              children: payment.isActive ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-500" }),
                "Active"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "h-3 w-3" }),
                "Inactive"
              ] })
            }
          ),
          payment.isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              "aria-label": "Cancel payment",
              className: "h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10",
              onClick: () => onCancel(payment.id),
              disabled: isCancelling,
              "data-ocid": `cancel-recurring-${payment.id}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
            }
          )
        ] })
      ]
    }
  );
}
function NewPaymentForm({
  accountId,
  tenantId,
  workspaceId,
  onSuccess,
  onCancel
}) {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const [toAddress, setToAddress] = reactExports.useState("");
  const [amount, setAmount] = reactExports.useState("");
  const [asset, setAsset] = reactExports.useState(AssetType.ICP);
  const [frequency, setFrequency] = reactExports.useState(
    PayFrequency.Monthly
  );
  const canSubmit = toAddress.trim() !== "" && amount.trim() !== "" && Number(amount) > 0;
  const createMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      const res = await actor.createRecurringPayment(
        tenantId,
        workspaceId,
        accountId,
        toAddress.trim(),
        amountToBigInt(amount),
        asset,
        frequency
      );
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["recurringPayments", tenantId, workspaceId]
      });
      ue.success("Recurring payment created");
      onSuccess();
    },
    onError: (err) => ue.error(err.message)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-2xl border border-violet-500/30 bg-violet-500/5 p-5 space-y-4",
      "data-ocid": "new-recurring-form",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground", children: "New Recurring Payment" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Asset" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  value: asset,
                  onChange: (e) => setAsset(e.target.value),
                  className: "w-full appearance-none rounded-lg border border-input bg-background px-3 py-2.5 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
                  "data-ocid": "rec-asset-select",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: AssetType.ICP, children: "ICP" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: AssetType.BTC, children: "BTC" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Frequency" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "select",
                {
                  value: frequency,
                  onChange: (e) => setFrequency(e.target.value),
                  className: "w-full appearance-none rounded-lg border border-input bg-background px-3 py-2.5 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
                  "data-ocid": "rec-freq-select",
                  children: Object.entries(FREQ_LABELS).map(
                    ([val, label]) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: val, children: label }, val)
                  )
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Amount" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              min: "0",
              step: "0.0001",
              placeholder: "0.0000",
              value: amount,
              onChange: (e) => setAmount(e.target.value),
              className: "font-mono text-lg tabular-nums h-12",
              "data-ocid": "rec-amount-input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "To Address" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "text",
              placeholder: "Principal or account ID",
              value: toAddress,
              onChange: (e) => setToAddress(e.target.value),
              className: "font-mono text-sm",
              "data-ocid": "rec-to-input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              className: "flex-1",
              onClick: onCancel,
              "data-ocid": "rec-cancel-btn",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              className: "flex-1 bg-violet-600 hover:bg-violet-700 text-white active-press",
              disabled: !canSubmit || createMutation.isPending,
              onClick: () => createMutation.mutate(),
              "data-ocid": "rec-submit-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
                createMutation.isPending ? "Creating…" : "Create Payment"
              ]
            }
          )
        ] })
      ]
    }
  );
}
function WalletRecurringPage() {
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = reactExports.useState(false);
  const { data: account, isLoading: accountLoading } = useQuery({
    queryKey: ["walletAccount", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyWalletAccount(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ["recurringPayments", tenantId, workspaceId, account == null ? void 0 : account.id],
    queryFn: async () => {
      if (!actor || !account) return [];
      return actor.listRecurringPayments(tenantId, workspaceId, account.id);
    },
    enabled: !!actor && !isFetching && !!account && !!workspaceId
  });
  const cancelMutation = useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("No actor");
      const res = await actor.cancelRecurringPayment(tenantId, workspaceId, id);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["recurringPayments", tenantId, workspaceId]
      });
      ue.success("Recurring payment cancelled");
    },
    onError: (err) => ue.error(err.message)
  });
  const isLoading = accountLoading || paymentsLoading;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-fade-in-up p-6 space-y-6 max-w-2xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          onClick: () => navigate({ to: `/app/${workspaceId}/wallet` }),
          "aria-label": "Back to wallet",
          "data-ocid": "recurring-back-btn",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-5 w-5" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-2xl font-bold tracking-tight text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-6 w-6 text-violet-500" }),
          "Recurring Payments"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Automate scheduled asset transfers" })
      ] }),
      account && !showForm && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          className: "bg-violet-600 hover:bg-violet-700 text-white shrink-0 active-press",
          size: "sm",
          onClick: () => setShowForm(true),
          "data-ocid": "recurring-new-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1.5 h-4 w-4" }),
            "New"
          ]
        }
      )
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 rounded-xl" }, n)) }) : !account ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-20 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-7 w-7 text-violet-500" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground", children: "No wallet account" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Create a wallet first to set up recurring payments." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "mt-6", variant: "outline", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: `/app/${workspaceId}/wallet`, children: "Go to Wallet" }) })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      showForm && /* @__PURE__ */ jsxRuntimeExports.jsx(
        NewPaymentForm,
        {
          accountId: account.id,
          tenantId,
          workspaceId,
          onSuccess: () => setShowForm(false),
          onCancel: () => setShowForm(false)
        }
      ),
      payments && payments.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: payments.map((payment) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        RecurringRow,
        {
          payment,
          onCancel: (id) => cancelMutation.mutate(id),
          isCancelling: cancelMutation.isPending
        },
        payment.id
      )) }) : !showForm && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-16 text-center",
          "data-ocid": "recurring-empty",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-7 w-7 text-violet-500" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground", children: "No recurring payments" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground max-w-xs", children: "Set up automatic scheduled transfers for regular payments." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                className: "mt-6 bg-violet-600 hover:bg-violet-700 text-white active-press",
                onClick: () => setShowForm(true),
                "data-ocid": "recurring-empty-cta",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
                  "New Recurring Payment"
                ]
              }
            )
          ]
        }
      )
    ] })
  ] });
}
export {
  WalletRecurringPage as default
};
