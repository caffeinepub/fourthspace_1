import { h as getTenantId, a as useNavigate, d as useQueryClient, r as reactExports, A as AssetType, e as useQuery, j as jsxRuntimeExports, B as Button, f as Link, C as ChevronDown } from "./index-D7inqmxR.js";
import { B as Badge } from "./index-BJuRsRYe.js";
import { I as Input } from "./input-C0aO0R3D.js";
import { L as Label } from "./label-CBtn2p-5.js";
import { S as Skeleton } from "./skeleton-sexCBv2H.js";
import { u as useMutation } from "./useMutation-BeBnUQJD.js";
import { u as ue } from "./index-p-k3Ndic.js";
import { u as useBackend } from "./useBackend-BH6dl3yo.js";
import { A as ArrowLeft } from "./arrow-left-mNBAKt8w.js";
import { A as ArrowUpRight } from "./arrow-up-right-D6juibhc.js";
import { C as CircleCheck } from "./circle-check-gwasD9uJ.js";
import { f as format } from "./format-BjBbZPfh.js";
import "./en-US-CJ_JRP0W.js";
const E8S = BigInt(1e8);
function formatICP(e8s) {
  const whole = e8s / E8S;
  const frac = (e8s % E8S).toString().padStart(8, "0").slice(0, 4);
  return `${whole.toLocaleString()}.${frac} ICP`;
}
function formatBTC(sats) {
  const whole = sats / E8S;
  const frac = (sats % E8S).toString().padStart(8, "0").slice(0, 6);
  return `${whole.toLocaleString()}.${frac} BTC`;
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
function ConfirmationCard({ tx }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 space-y-4",
      "data-ocid": "send-confirmation",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-12 w-12 text-emerald-500 mx-auto" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold text-foreground", children: "Transaction Sent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Your simulated transaction has been submitted" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-card border border-border p-4 space-y-2.5", children: [
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
              value: tx.asset === AssetType.ICP ? formatICP(tx.amount) : formatBTC(tx.amount)
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
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", children: tx.status })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/wallet", className: "block", "data-ocid": "send-back-to-wallet", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
          "Back to Wallet"
        ] }) })
      ]
    }
  );
}
function WalletSendPage() {
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [asset, setAsset] = reactExports.useState(AssetType.ICP);
  const [amount, setAmount] = reactExports.useState("");
  const [toAddress, setToAddress] = reactExports.useState("");
  const [memo, setMemo] = reactExports.useState("");
  const [confirmedTx, setConfirmedTx] = reactExports.useState(
    null
  );
  const { data: account, isLoading } = useQuery({
    queryKey: ["walletAccount", tenantId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyWalletAccount(tenantId);
    },
    enabled: !!actor && !isFetching
  });
  const balance = account ? asset === AssetType.ICP ? account.icpBalance : account.btcBalance : BigInt(0);
  const amountBigInt = (() => {
    try {
      return amount ? amountToBigInt(amount) : BigInt(0);
    } catch {
      return BigInt(0);
    }
  })();
  const isInsufficient = amountBigInt > BigInt(0) && amountBigInt > balance;
  const amountError = isInsufficient ? `Insufficient balance. Available: ${asset === AssetType.ICP ? formatICP(balance) : formatBTC(balance)}` : null;
  const canSubmit = !!account && amount.trim() !== "" && toAddress.trim() !== "" && !isInsufficient && amountBigInt > BigInt(0);
  const sendMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !account) throw new Error("No actor or account");
      const res = await actor.sendAsset(
        tenantId,
        account.id,
        asset,
        amountBigInt,
        toAddress.trim(),
        memo.trim() || null
      );
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: (tx) => {
      queryClient.invalidateQueries({ queryKey: ["walletAccount", tenantId] });
      queryClient.invalidateQueries({ queryKey: ["walletTxs", tenantId] });
      setConfirmedTx(tx);
    },
    onError: (err) => ue.error(err.message)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 max-w-lg mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          onClick: () => navigate({ to: "/app/wallet" }),
          "aria-label": "Back to wallet",
          "data-ocid": "send-back-btn",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-5 w-5" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-2xl font-bold text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-6 w-6 text-violet-500" }),
          "Send Assets"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Simulated — no real assets will be transferred" })
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 rounded-2xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 rounded-2xl" })
    ] }) : !account ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "No wallet account found." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "mt-4", variant: "outline", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/wallet", children: "Go to Wallet" }) })
    ] }) : confirmedTx ? /* @__PURE__ */ jsxRuntimeExports.jsx(ConfirmationCard, { tx: confirmedTx }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card p-6 space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "asset-select", children: "Asset" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", "data-ocid": "send-asset-select", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              id: "asset-select",
              value: asset,
              onChange: (e) => setAsset(e.target.value),
              className: "w-full appearance-none rounded-lg border border-input bg-background px-3 py-2.5 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: AssetType.ICP, children: "ICP — Internet Computer" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: AssetType.BTC, children: "BTC — Bitcoin" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-violet-500/5 border border-violet-500/20 px-4 py-3 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Available balance" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-violet-600 dark:text-violet-400 text-sm", children: asset === AssetType.ICP ? formatICP(balance) : formatBTC(balance) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "send-amount", children: "Amount" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "send-amount",
            type: "number",
            min: "0",
            step: "0.0001",
            placeholder: asset === AssetType.ICP ? "0.0000" : "0.000000",
            value: amount,
            onChange: (e) => setAmount(e.target.value),
            className: amountError ? "border-red-500 focus-visible:ring-red-500" : "",
            "data-ocid": "send-amount-input"
          }
        ),
        amountError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-500", children: amountError })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "send-to", children: "To Address" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "send-to",
            type: "text",
            placeholder: "Principal or account ID",
            value: toAddress,
            onChange: (e) => setToAddress(e.target.value),
            className: "font-mono text-sm",
            "data-ocid": "send-to-input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "send-memo", children: [
          "Memo",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "(optional)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "send-memo",
            type: "text",
            placeholder: "Add a note or memo",
            value: memo,
            onChange: (e) => setMemo(e.target.value),
            "data-ocid": "send-memo-input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 pt-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            className: "flex-1",
            onClick: () => navigate({ to: "/app/wallet" }),
            "data-ocid": "send-cancel-btn",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            className: "flex-1 bg-violet-600 hover:bg-violet-700 text-white",
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
