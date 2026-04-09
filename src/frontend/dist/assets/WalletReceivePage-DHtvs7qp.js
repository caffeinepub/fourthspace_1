import { g as getTenantId, f as useWorkspace, d as useNavigate, r as reactExports, h as useQuery, j as jsxRuntimeExports, B as Button, W as Wallet } from "./index-CQ7TXF2a.js";
import { S as Skeleton } from "./skeleton-CzZABium.js";
import { u as ue } from "./index-BGFcG_k-.js";
import { u as useBackend } from "./index--h8TKSCt.js";
import { A as ArrowLeft } from "./arrow-left-D6cz-lXM.js";
import { Q as QrCode, B as Bitcoin } from "./qr-code-DMIM7-Bw.js";
import { C as CircleCheck } from "./circle-check-B7zTmrRV.js";
import { C as ClipboardCopy } from "./clipboard-copy-DpZg-yFM.js";
function QRCodeDisplay({ value }) {
  const size = 14;
  const encoded = value.split("").map((c) => c.charCodeAt(0));
  const flatCells = [];
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const idx = (row * size + col) % (encoded.length || 1);
      const filled = (encoded[idx] ^ row * 7 + col * 13) % 2 === 0;
      flatCells.push({ key: `cell-${row * size + col}`, filled });
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "inline-block p-4 bg-card border-2 border-border rounded-2xl shadow-card",
      "aria-label": "QR code for wallet address",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "grid gap-0.5",
          style: { gridTemplateColumns: `repeat(${size}, 1fr)` },
          children: flatCells.map(({ key, filled }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `h-4 w-4 rounded-sm ${filled ? "bg-foreground" : "bg-background"}`
            },
            key
          ))
        }
      )
    }
  );
}
function AddressBox({
  label,
  sublabel,
  value,
  icon
}) {
  const [copied, setCopied] = reactExports.useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    ue.success(`${label} copied to clipboard`);
    setTimeout(() => setCopied(false), 2e3);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border/50 bg-muted/20 p-4 space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: [
          icon,
          label
        ] }),
        sublabel && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-0.5", children: sublabel })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: handleCopy,
          "aria-label": `Copy ${label}`,
          "data-ocid": `copy-${label.toLowerCase().replace(/\s+/g, "-")}`,
          className: `shrink-0 flex h-8 w-8 items-center justify-center rounded-lg border transition-all ${copied ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600" : "border-border bg-background hover:bg-muted text-muted-foreground"}`,
          children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardCopy, { className: "h-4 w-4" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "block font-mono text-xs text-foreground break-all leading-relaxed", children: value })
  ] });
}
function WalletReceivePage() {
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const navigate = useNavigate();
  const [activeToken, setActiveToken] = reactExports.useState("icp");
  const { data: account, isLoading } = useQuery({
    queryKey: ["walletAccount", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyWalletAccount(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const qrValue = activeToken === "icp" ? (account == null ? void 0 : account.accountId) ?? "" : (account == null ? void 0 : account.icrc1Account) ?? "";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-fade-in-up p-6 space-y-6 max-w-lg mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          onClick: () => navigate({ to: `/app/${workspaceId}/wallet` }),
          "aria-label": "Back to wallet",
          "data-ocid": "receive-back-btn",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-5 w-5" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-2xl font-bold tracking-tight text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(QrCode, { className: "h-6 w-6 text-violet-500" }),
          "Receive Assets"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Share your address to receive ICP or ckBTC" })
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 rounded-2xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 rounded-xl" })
    ] }) : !account ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/50 bg-card shadow-card p-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "mx-auto h-10 w-10 text-muted-foreground mb-3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No wallet account found. Create one from the Wallet page." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          className: "mt-4",
          variant: "outline",
          onClick: () => navigate({ to: `/app/${workspaceId}/wallet` }),
          children: "Back to Wallet"
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("fieldset", { className: "flex gap-1.5 p-1.5 rounded-xl bg-muted border-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("legend", { className: "sr-only", children: "Select token to receive" }),
        [
          {
            id: "icp",
            label: "ICP",
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-3.5 w-3.5" })
          },
          {
            id: "ckbtc",
            label: "ckBTC",
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Bitcoin, { className: "h-3.5 w-3.5" })
          }
        ].map(({ id, label, icon }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setActiveToken(id),
            "data-ocid": `receive-token-${id}`,
            className: `flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${activeToken === id ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`,
            children: [
              icon,
              label
            ]
          },
          id
        ))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/50 bg-card shadow-card p-6 flex flex-col items-center gap-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1", children: [
            "Your ",
            activeToken === "icp" ? "ICP" : "ckBTC",
            " Receive Address"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Screenshot or copy the address below to share" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(QRCodeDisplay, { value: qrValue })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: activeToken === "icp" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AddressBox,
          {
            label: "ICP Account Address",
            sublabel: "Use this to receive ICP from any compatible wallet or exchange",
            value: account.accountId,
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-3.5 w-3.5" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AddressBox,
          {
            label: "Principal ID",
            sublabel: "Your Internet Identity principal",
            value: account.principalId,
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-3.5 w-3.5" })
          }
        )
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AddressBox,
          {
            label: "ICRC-1 Account (ckBTC)",
            sublabel: "Use this to receive ckBTC and other ICRC-1 tokens",
            value: account.icrc1Account,
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Bitcoin, { className: "h-3.5 w-3.5" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          AddressBox,
          {
            label: "Principal ID",
            sublabel: "Your Internet Identity principal",
            value: account.principalId,
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-3.5 w-3.5" })
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl bg-violet-500/5 border border-violet-500/20 px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-violet-700 dark:text-violet-400 leading-relaxed", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "On-chain addresses:" }),
        " ",
        activeToken === "icp" ? "Your ICP Account Address is derived from your principal ID and is permanent. Send it to anyone who wants to transfer ICP to you." : "Your ICRC-1 Account is required for receiving ckBTC and other ICRC-1 tokens. Use this address when withdrawing from exchanges that support ckBTC."
      ] }) })
    ] })
  ] });
}
export {
  WalletReceivePage as default
};
