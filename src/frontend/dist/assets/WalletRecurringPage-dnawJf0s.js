import { g as createLucideIcon, h as getTenantId, a as useNavigate, d as useQueryClient, r as reactExports, e as useQuery, j as jsxRuntimeExports, B as Button, a5 as Wallet, f as Link, A as AssetType, k as PayFrequency, C as ChevronDown, X } from "./index-D7inqmxR.js";
import { B as Badge } from "./index-BJuRsRYe.js";
import { I as Input } from "./input-C0aO0R3D.js";
import { L as Label } from "./label-CBtn2p-5.js";
import { S as Skeleton } from "./skeleton-sexCBv2H.js";
import { u as useMutation } from "./useMutation-BeBnUQJD.js";
import { u as ue } from "./index-p-k3Ndic.js";
import { u as useBackend } from "./useBackend-BH6dl3yo.js";
import { A as ArrowLeft } from "./arrow-left-mNBAKt8w.js";
import { R as RefreshCw } from "./refresh-cw-DkNAkJEv.js";
import { P as Plus } from "./plus-DNap1HPx.js";
import { f as format } from "./format-BjBbZPfh.js";
import "./en-US-CJ_JRP0W.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "9", cy: "12", r: "3", key: "u3jwor" }],
  ["rect", { width: "20", height: "14", x: "2", y: "5", rx: "7", key: "g7kal2" }]
];
const ToggleLeft = createLucideIcon("toggle-left", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "15", cy: "12", r: "3", key: "1afu0r" }],
  ["rect", { width: "20", height: "14", x: "2", y: "5", rx: "7", key: "g7kal2" }]
];
const ToggleRight = createLucideIcon("toggle-right", __iconNode);
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
  [PayFrequency.Monthly]: "Monthly",
  [PayFrequency.Quarterly]: "Quarterly"
};
function RecurringRow({
  payment,
  onCancel,
  isCancelling
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-smooth hover:border-violet-500/30",
      "data-ocid": `recurring-row-${payment.id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-5 w-5 text-violet-500" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate font-mono", children: truncateAddress(payment.toAddress) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-0.5 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: formatAmount(payment.amount, payment.asset) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "·" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "secondary",
                className: "text-xs bg-violet-500/10 text-violet-600 dark:text-violet-400",
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
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            payment.isActive ? /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleRight, { className: "h-5 w-5 text-emerald-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleLeft, { className: "h-5 w-5 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `text-xs font-medium ${payment.isActive ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`,
                children: payment.isActive ? "Active" : "Inactive"
              }
            )
          ] }),
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
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
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
        queryKey: ["recurringPayments", tenantId]
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
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "rec-asset", children: "Asset" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  id: "rec-asset",
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
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "rec-freq", children: "Frequency" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "select",
                {
                  id: "rec-freq",
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
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "rec-amount", children: "Amount" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "rec-amount",
              type: "number",
              min: "0",
              step: "0.0001",
              placeholder: "0.0000",
              value: amount,
              onChange: (e) => setAmount(e.target.value),
              "data-ocid": "rec-amount-input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "rec-to", children: "To Address" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "rec-to",
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
              className: "flex-1 bg-violet-600 hover:bg-violet-700 text-white",
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
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = reactExports.useState(false);
  const { data: account, isLoading: accountLoading } = useQuery({
    queryKey: ["walletAccount", tenantId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyWalletAccount(tenantId);
    },
    enabled: !!actor && !isFetching
  });
  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ["recurringPayments", tenantId, account == null ? void 0 : account.id],
    queryFn: async () => {
      if (!actor || !account) return [];
      return actor.listRecurringPayments(tenantId, account.id);
    },
    enabled: !!actor && !isFetching && !!account
  });
  const cancelMutation = useMutation({
    mutationFn: async (id) => {
      if (!actor) throw new Error("No actor");
      const res = await actor.cancelRecurringPayment(tenantId, id);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["recurringPayments", tenantId]
      });
      ue.success("Recurring payment cancelled");
    },
    onError: (err) => ue.error(err.message)
  });
  const isLoading = accountLoading || paymentsLoading;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 max-w-2xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          onClick: () => navigate({ to: "/app/wallet" }),
          "aria-label": "Back to wallet",
          "data-ocid": "recurring-back-btn",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-5 w-5" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-2xl font-bold text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-6 w-6 text-violet-500" }),
          "Recurring Payments"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Automate scheduled asset transfers" })
      ] }),
      account && !showForm && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          className: "bg-violet-600 hover:bg-violet-700 text-white shrink-0",
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
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "mt-6", variant: "outline", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/wallet", children: "Go to Wallet" }) })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      showForm && /* @__PURE__ */ jsxRuntimeExports.jsx(
        NewPaymentForm,
        {
          accountId: account.id,
          tenantId,
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
                className: "mt-6 bg-violet-600 hover:bg-violet-700 text-white",
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
