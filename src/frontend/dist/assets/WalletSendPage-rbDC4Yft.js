import { g as getTenantId, f as useWorkspace, d as useNavigate, n as useQueryClient, r as reactExports, af as AssetType, h as useQuery, ag as Role, j as jsxRuntimeExports, B as Button, i as Link, ab as ChevronDown } from "./index-BZqaRhAX.js";
import { I as Input } from "./input-BJtw5f9h.js";
import { L as Label } from "./label-CvyzRjc5.js";
import { S as Skeleton } from "./skeleton-CXUiMpVp.js";
import { u as useMutation } from "./useMutation-CLofsIuD.js";
import { u as ue } from "./index-BRf-248B.js";
import { u as useBackend } from "./useBackend-DSxJo5MU.js";
import { A as ArrowLeft } from "./arrow-left-BCLeiEG1.js";
import { A as ArrowUpRight } from "./arrow-up-right-CcHohqoi.js";
import { S as ShieldAlert } from "./shield-alert-CESpSo-o.js";
import { I as Info } from "./info-jIqTkrKJ.js";
import { T as TriangleAlert } from "./triangle-alert-DZo5ldlW.js";
import { C as CircleCheck } from "./circle-check-wa2s5his.js";
import { f as format } from "./format-BjBbZPfh.js";
import "./en-US-CJ_JRP0W.js";
const E8S = BigInt(1e8);
function formatICP(e8s) {
  const whole = e8s / E8S;
  const frac = (e8s % E8S).toString().padStart(8, "0").slice(0, 4);
  return `${whole.toLocaleString()}.${frac} ICP`;
}
function formatCKBTC(sats) {
  const whole = sats / E8S;
  const frac = (sats % E8S).toString().padStart(8, "0");
  return `${whole.toLocaleString()}.${frac} ckBTC`;
}
function amountToBigInt(value) {
  const [whole = "0", frac = "0"] = value.split(".");
  const fracPadded = frac.slice(0, 8).padEnd(8, "0");
  return BigInt(whole) * E8S + BigInt(fracPadded);
}
function DetailRow({
  label,
  value,
  mono
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: `text-xs font-medium text-foreground ${mono ? "font-mono" : ""}`,
        children: value
      }
    )
  ] });
}
function ConfirmationCard({
  tx,
  workspaceId
}) {
  const isPending = Number(tx.requiredApprovals) > 0;
  const blockHeight = tx.ledgerBlockHeight;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `rounded-2xl border p-6 space-y-4 ${isPending ? "border-amber-500/30 bg-amber-500/5" : "border-emerald-500/30 bg-emerald-500/5"}`,
      "data-ocid": "send-confirmation",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", children: [
          isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-12 w-12 text-amber-500 mx-auto" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-12 w-12 text-emerald-500 mx-auto" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold text-foreground", children: isPending ? "Pending Approval" : "Transaction Submitted" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: isPending ? `This transaction requires ${Number(tx.requiredApprovals)} approval(s) before it processes.` : "Transaction submitted. Your transfer is being processed on the ICP ledger." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-card border border-border/50 p-4 space-y-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DetailRow,
            {
              label: "Transaction ID",
              value: `${tx.id.slice(0, 16)}…`,
              mono: true
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DetailRow,
            {
              label: "Amount",
              value: tx.asset === AssetType.ICP ? formatICP(tx.amount) : formatCKBTC(tx.amount)
            }
          ),
          tx.toAddress && /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "To", value: `${tx.toAddress.slice(0, 24)}…`, mono: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DetailRow,
            {
              label: "Date",
              value: format(
                new Date(Number(tx.createdAt / BigInt(1e6))),
                "MMM d, yyyy HH:mm"
              )
            }
          ),
          blockHeight !== void 0 && blockHeight !== null && /* @__PURE__ */ jsxRuntimeExports.jsx(
            DetailRow,
            {
              label: "Ledger Block",
              value: `#${blockHeight.toString()}`,
              mono: true
            }
          ),
          Number(tx.requiredApprovals) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            DetailRow,
            {
              label: "Required Approvals",
              value: `${tx.approvals.length} / ${Number(tx.requiredApprovals)}`
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${isPending ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"}`,
                children: tx.status
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: `/app/${workspaceId}/wallet`,
            className: "block",
            "data-ocid": "send-back-to-wallet",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
              "Back to Wallet"
            ] })
          }
        )
      ]
    }
  );
}
function WalletSendPage() {
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [asset, setAsset] = reactExports.useState(AssetType.ICP);
  const [amount, setAmount] = reactExports.useState("");
  const [toAddress, setToAddress] = reactExports.useState("");
  const [memo, setMemo] = reactExports.useState("");
  const [requiredApprovals, setRequiredApprovals] = reactExports.useState(0);
  const [confirmedTx, setConfirmedTx] = reactExports.useState(
    null
  );
  const { data: account, isLoading } = useQuery({
    queryKey: ["walletAccount", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyWalletAccount(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const { data: spendingLimit } = useQuery({
    queryKey: ["spendingLimit", tenantId, workspaceId, Role.TeamMember],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSpendingLimit(tenantId, workspaceId, Role.TeamMember);
    },
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const balance = account ? asset === AssetType.ICP ? account.icpBalance : account.btcBalance : BigInt(0);
  const amountBigInt = (() => {
    try {
      return amount ? amountToBigInt(amount) : BigInt(0);
    } catch {
      return BigInt(0);
    }
  })();
  const amountNum = Number(amountBigInt) / Number(E8S);
  const limitNum = (spendingLimit == null ? void 0 : spendingLimit.maxAmount) ?? null;
  const exceedsLimit = limitNum !== null && amountNum > limitNum && amountBigInt > BigInt(0);
  const isInsufficient = amountBigInt > BigInt(0) && amountBigInt > balance;
  const amountError = isInsufficient ? `Insufficient balance. Available: ${asset === AssetType.ICP ? formatICP(balance) : formatCKBTC(balance)}` : null;
  const canSubmit = !!account && amount.trim() !== "" && toAddress.trim() !== "" && !isInsufficient && amountBigInt > BigInt(0);
  const sendMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !account) throw new Error("No actor or account");
      const res = await actor.sendAsset(
        tenantId,
        workspaceId,
        account.id,
        asset,
        amountBigInt,
        toAddress.trim(),
        memo.trim() || null,
        BigInt(requiredApprovals)
      );
      if (res.__kind__ === "err")
        throw new Error(`Transfer failed: ${res.err}`);
      return res.ok;
    },
    onSuccess: (tx) => {
      queryClient.invalidateQueries({
        queryKey: ["walletAccount", tenantId, workspaceId]
      });
      queryClient.invalidateQueries({
        queryKey: ["walletTxs", tenantId, workspaceId]
      });
      setConfirmedTx(tx);
    },
    onError: (err) => ue.error(err.message)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-fade-in-up p-6 space-y-6 max-w-lg mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          onClick: () => navigate({ to: `/app/${workspaceId}/wallet` }),
          "aria-label": "Back to wallet",
          "data-ocid": "send-back-btn",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-5 w-5" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-2xl font-bold tracking-tight text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-6 w-6 text-violet-500" }),
          "Send Assets"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Send ICP or ckBTC on the Internet Computer" })
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 rounded-2xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 rounded-2xl" })
    ] }) : !account ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "No wallet account found." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "mt-4", variant: "outline", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: `/app/${workspaceId}/wallet`, children: "Go to Wallet" }) })
    ] }) : confirmedTx ? /* @__PURE__ */ jsxRuntimeExports.jsx(ConfirmationCard, { tx: confirmedTx, workspaceId }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/50 bg-card shadow-card p-6 space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Asset" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", "data-ocid": "send-asset-select", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              value: asset,
              onChange: (e) => setAsset(e.target.value),
              className: "w-full appearance-none rounded-lg border border-input bg-background px-3 py-2.5 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: AssetType.ICP, children: "ICP — Internet Computer Protocol" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: AssetType.BTC, children: "ckBTC — Chain-Key Bitcoin" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-violet-500/5 border border-violet-500/20 px-4 py-3 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Available balance" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold font-mono text-violet-600 dark:text-violet-400 tabular-nums", children: asset === AssetType.ICP ? formatICP(balance) : formatCKBTC(balance) })
      ] }),
      exceedsLimit && limitNum !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-amber-500/5 border border-amber-200 dark:border-amber-800 px-4 py-3 flex items-start gap-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-amber-700 dark:text-amber-400", children: "Amount exceeds spending limit" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-amber-600 dark:text-amber-500 mt-0.5", children: [
            "Your role limit is ",
            limitNum.toLocaleString(),
            " ",
            (spendingLimit == null ? void 0 : spendingLimit.currency) ?? "USD",
            ". Additional approvals required."
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
            placeholder: asset === AssetType.ICP ? "0.0000" : "0.00000000",
            value: amount,
            onChange: (e) => setAmount(e.target.value),
            className: `font-mono text-2xl font-bold tabular-nums h-14 ${amountError ? "border-red-500 focus-visible:ring-red-500" : ""}`,
            "data-ocid": "send-amount-input"
          }
        ),
        amountError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-500", children: amountError })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "To Address" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "text",
            placeholder: asset === AssetType.ICP ? "64-character account ID or principal" : "Principal ID or ICRC-1 account",
            value: toAddress,
            onChange: (e) => setToAddress(e.target.value),
            className: "font-mono text-sm",
            "data-ocid": "send-to-input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: [
          "Memo",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "normal-case font-normal text-muted-foreground/60", children: "(optional)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "text",
            placeholder: "Add a note or memo",
            value: memo,
            onChange: (e) => setMemo(e.target.value),
            "data-ocid": "send-memo-input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-muted/40 border border-border/40 px-4 py-3 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Network Fee", value: "≈ 0.0001 ICP", mono: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          DetailRow,
          {
            label: "You'll send",
            value: amount ? `${amount} ${asset === AssetType.BTC ? "ckBTC" : asset}` : "—",
            mono: true
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          DetailRow,
          {
            label: "Required Approvals",
            value: String(requiredApprovals)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: [
          "Required Approvals",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "normal-case font-normal text-muted-foreground/60", children: "(0 = instant)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "number",
            min: "0",
            max: "10",
            step: "1",
            value: requiredApprovals,
            onChange: (e) => setRequiredApprovals(
              Math.max(0, Number.parseInt(e.target.value) || 0)
            ),
            "data-ocid": "send-approvals-input"
          }
        ),
        requiredApprovals > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-violet-600 dark:text-violet-400", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-3.5 w-3.5" }),
          "Transaction held until ",
          requiredApprovals,
          " admin(s) approve it."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            className: "flex-1 active-press",
            onClick: () => navigate({ to: `/app/${workspaceId}/wallet` }),
            "data-ocid": "send-cancel-btn",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            className: "flex-1 bg-violet-600 hover:bg-violet-700 text-white active-press",
            disabled: !canSubmit || sendMutation.isPending,
            onClick: () => sendMutation.mutate(),
            "data-ocid": "send-submit-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "mr-2 h-4 w-4" }),
              sendMutation.isPending ? "Sending…" : "Send"
            ]
          }
        )
      ] })
    ] })
  ] });
}
export {
  WalletSendPage as default
};
