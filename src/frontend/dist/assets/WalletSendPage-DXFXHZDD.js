import { m as useParams, f as useWorkspace, d as useNavigate, n as useQueryClient, r as reactExports, aj as AssetType, h as useQuery, j as jsxRuntimeExports, B as Button, W as Wallet } from "./index-1XRv9GHr.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-CFU1s52N.js";
import { I as Input } from "./input-BOIU-9S_.js";
import { L as Label } from "./label-cy3JJ-Xo.js";
import { S as Skeleton } from "./index-wZVP6u7e.js";
import { u as useMutation } from "./useMutation-X94w2CVk.js";
import { u as ue } from "./index-BOWFyaIB.js";
import { u as useBackend } from "./useBackend-DyFxq-Jw.js";
import { A as ArrowLeft } from "./arrow-left-B-gbON0E.js";
import { A as ArrowUpRight } from "./arrow-up-right-BbVj4O-F.js";
import { L as LoaderCircle } from "./loader-circle-CtmMa9i8.js";
function formatICP(e8s) {
  return `${(Number(e8s) / 1e8).toFixed(4)} ICP`;
}
function WalletSendPage() {
  const { workspaceId } = useParams({ strict: false });
  const { tenantId } = useWorkspace();
  const { actor, isFetching } = useBackend();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [asset, setAsset] = reactExports.useState(AssetType.ICP);
  const [toAddress, setToAddress] = reactExports.useState("");
  const [amount, setAmount] = reactExports.useState("");
  const [memo, setMemo] = reactExports.useState("");
  const [addressError, setAddressError] = reactExports.useState("");
  const { data: wallet, isLoading } = useQuery({
    queryKey: ["myWallet", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyWalletAccount(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching && !!workspaceId
  });
  function validateAddress(addr) {
    const trimmed = addr.trim();
    if (asset === AssetType.ICP) {
      if (/^[0-9a-fA-F]{64}$/.test(trimmed)) return true;
      if (/^[a-z0-9]+-[a-z0-9-]+-cai$/.test(trimmed) || trimmed.includes("-"))
        return true;
      return false;
    }
    return trimmed.length > 5;
  }
  const sendMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !wallet) throw new Error("Wallet not loaded");
      const parsedAmount = BigInt(Math.round(Number.parseFloat(amount) * 1e8));
      const r = await actor.sendAsset(
        tenantId,
        workspaceId,
        wallet.id,
        asset,
        parsedAmount,
        toAddress.trim(),
        memo.trim() || null,
        1n
      );
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      ue.success("Transfer initiated successfully");
      void queryClient.invalidateQueries({ queryKey: ["myWallet"] });
      void queryClient.invalidateQueries({ queryKey: ["walletTx"] });
      navigate({ to: `/app/${workspaceId}/wallet` });
    },
    onError: (e) => ue.error(e.message ?? "Transfer failed")
  });
  function handleSubmit(e) {
    e.preventDefault();
    if (!validateAddress(toAddress)) {
      setAddressError(
        asset === AssetType.ICP ? "Enter a valid 64-character hex account ID or principal" : "Enter a valid principal ID"
      );
      return;
    }
    setAddressError("");
    if (!amount || Number.parseFloat(amount) <= 0) {
      ue.error("Amount must be greater than 0");
      return;
    }
    if (!wallet) {
      ue.error("Wallet not found");
      return;
    }
    sendMutation.mutate();
  }
  const maxBalance = wallet ? asset === AssetType.ICP ? wallet.icpBalance : wallet.btcBalance : 0n;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6 p-4 sm:p-6 max-w-lg mx-auto w-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          onClick: () => navigate({ to: `/app/${workspaceId}/wallet` }),
          "data-ocid": "send-back-btn",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "w-5 h-5 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold font-display text-foreground", children: "Send Tokens" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Transfer ICP or ckBTC on-chain" })
        ] })
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-80 w-full rounded-xl" }) : !wallet ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-dashed", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex flex-col items-center py-12 gap-3 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "w-10 h-10 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No wallet found. Create one first." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: () => navigate({ to: `/app/${workspaceId}/wallet` }),
          children: "Go to Wallet"
        }
      )
    ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-display", children: "Transfer Details" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Asset" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: [AssetType.ICP, AssetType.BTC].map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": `send-asset-${a}`,
              onClick: () => setAsset(a),
              className: `flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${asset === a ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:text-foreground"}`,
              children: a === AssetType.BTC ? "ckBTC" : "ICP"
            },
            a
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-lg bg-muted/30 border border-border flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Available balance" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: formatICP(maxBalance) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "send-to", children: asset === AssetType.ICP ? "Recipient Account ID" : "Recipient Principal" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "send-to",
              "data-ocid": "send-address-input",
              placeholder: asset === AssetType.ICP ? "64-character hex account ID or principal" : "Principal ID",
              value: toAddress,
              onChange: (e) => {
                setToAddress(e.target.value);
                setAddressError("");
              },
              className: "font-mono text-xs",
              required: true
            }
          ),
          addressError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: addressError })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "send-amount", children: "Amount" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setAmount((Number(maxBalance) / 1e8).toFixed(8)),
                className: "text-xs text-primary hover:underline",
                children: "Max"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "send-amount",
              "data-ocid": "send-amount-input",
              type: "number",
              min: "0",
              step: "0.0001",
              placeholder: "0.0000",
              value: amount,
              onChange: (e) => setAmount(e.target.value),
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "send-memo", children: "Memo (optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "send-memo",
              "data-ocid": "send-memo-input",
              placeholder: "e.g. Payment for invoice #1234",
              value: memo,
              onChange: (e) => setMemo(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 rounded-lg bg-muted/30 border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "ICP network fee:",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: "0.0001 ICP" }),
          " ",
          "per transfer. The actual fee is deducted by the ledger."
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 justify-end", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              onClick: () => navigate({ to: `/app/${workspaceId}/wallet` }),
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              "data-ocid": "send-submit-btn",
              disabled: sendMutation.isPending,
              className: "gap-2",
              children: sendMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }),
                "Sending…"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "w-4 h-4" }),
                "Send ",
                asset === AssetType.BTC ? "ckBTC" : "ICP"
              ] })
            }
          )
        ] })
      ] }) })
    ] })
  ] });
}
export {
  WalletSendPage as default
};
