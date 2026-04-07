import { g as createLucideIcon, h as getTenantId, d as useQueryClient, e as useQuery, j as jsxRuntimeExports, a5 as Wallet, B as Button, f as Link, as as TransactionType, A as AssetType, at as TransactionStatus } from "./index-D7inqmxR.js";
import { B as Badge } from "./index-BJuRsRYe.js";
import { S as Skeleton } from "./skeleton-sexCBv2H.js";
import { u as useMutation } from "./useMutation-BeBnUQJD.js";
import { u as ue } from "./index-p-k3Ndic.js";
import { u as useBackend } from "./useBackend-BH6dl3yo.js";
import { A as ArrowUpRight } from "./arrow-up-right-D6juibhc.js";
import { R as RefreshCw } from "./refresh-cw-DkNAkJEv.js";
import { P as Plus } from "./plus-DNap1HPx.js";
import { A as ArrowRightLeft } from "./arrow-right-left-CG4euwl7.js";
import { f as format } from "./format-BjBbZPfh.js";
import "./en-US-CJ_JRP0W.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M17 7 7 17", key: "15tmo1" }],
  ["path", { d: "M17 17H7V7", key: "1org7z" }]
];
const ArrowDownLeft = createLucideIcon("arrow-down-left", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727",
      key: "yr8idg"
    }
  ]
];
const Bitcoin = createLucideIcon("bitcoin", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1", key: "tgr4d6" }],
  ["path", { d: "M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2", key: "4jdomd" }],
  ["path", { d: "M16 4h2a2 2 0 0 1 2 2v4", key: "3hqy98" }],
  ["path", { d: "M21 14H11", key: "1bme5i" }],
  ["path", { d: "m15 10-4 4 4 4", key: "5dvupr" }]
];
const ClipboardCopy = createLucideIcon("clipboard-copy", __iconNode);
const E8S = BigInt(1e8);
function formatICP(e8s) {
  const whole = e8s / E8S;
  const frac = (e8s % E8S).toString().padStart(8, "0").slice(0, 4);
  return `${whole.toLocaleString()}.${frac}`;
}
function formatBTC(sats) {
  const whole = sats / E8S;
  const frac = (sats % E8S).toString().padStart(8, "0").slice(0, 6);
  return `${whole.toLocaleString()}.${frac}`;
}
function truncateAddress(addr, len = 8) {
  if (addr.length <= len * 2 + 3) return addr;
  return `${addr.slice(0, len)}...${addr.slice(-len)}`;
}
const TX_TYPE_ICONS = {
  [TransactionType.Send]: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-4 w-4 text-red-500" }),
  [TransactionType.Receive]: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownLeft, { className: "h-4 w-4 text-emerald-500" }),
  [TransactionType.Swap]: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRightLeft, { className: "h-4 w-4 text-violet-500" }),
  [TransactionType.Stake]: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4 text-violet-500" }),
  [TransactionType.Unstake]: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4 text-muted-foreground" })
};
const TX_STATUS_STYLES = {
  [TransactionStatus.Pending]: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  [TransactionStatus.Completed]: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  [TransactionStatus.Failed]: "bg-red-500/10 text-red-600 dark:text-red-400",
  [TransactionStatus.Cancelled]: "bg-muted text-muted-foreground"
};
function CopyButton({ value, label }) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    ue.success(`${label} copied`);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      onClick: handleCopy,
      "aria-label": `Copy ${label}`,
      className: "ml-1.5 text-white/60 hover:text-white transition-colors",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardCopy, { className: "h-3.5 w-3.5" })
    }
  );
}
function AccountCard({ account }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 p-6 text-white shadow-lg",
      "data-ocid": "wallet-account-card",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-white/60 uppercase tracking-wider", children: "Fourthspace Wallet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-bold mt-1", children: account.displayName })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse" }),
            "Simulated"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-white/10 p-3.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/60 mb-1.5", children: "ICP Balance" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl font-bold leading-none", children: formatICP(account.icpBalance) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/50 mt-1", children: "ICP" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-white/10 p-3.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/60 mb-1.5", children: "BTC Balance" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl font-bold leading-none", children: formatBTC(account.btcBalance) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/50 mt-1", children: "BTC" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-xs border-t border-white/20 pt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/50 w-20 shrink-0", children: "Principal" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "flex-1 truncate text-white/80 font-mono", children: truncateAddress(account.principalId, 14) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CopyButton, { value: account.principalId, label: "Principal ID" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/50 w-20 shrink-0", children: "Account ID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "flex-1 truncate text-white/80 font-mono", children: truncateAddress(account.accountId, 14) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CopyButton, { value: account.accountId, label: "Account ID" })
          ] })
        ] })
      ]
    }
  );
}
function TxRow({ tx }) {
  const counterparty = tx.txType === TransactionType.Send ? tx.toAddress : tx.fromAddress;
  const isDebit = tx.txType === TransactionType.Send || tx.txType === TransactionType.Stake;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center gap-3 py-3.5 border-b border-border last:border-0",
      "data-ocid": `tx-row-${tx.id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted", children: TX_TYPE_ICONS[tx.txType] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: tx.txType }),
          counterparty && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate font-mono", children: truncateAddress(counterparty) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: format(
            new Date(Number(tx.createdAt / BigInt(1e6))),
            "MMM d, yyyy"
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right shrink-0 space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "p",
            {
              className: `text-sm font-semibold ${isDebit ? "text-red-500" : "text-emerald-500"}`,
              children: [
                isDebit ? "−" : "+",
                tx.asset === AssetType.ICP ? formatICP(tx.amount) : formatBTC(tx.amount),
                " ",
                tx.asset
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: TX_STATUS_STYLES[tx.status], variant: "secondary", children: tx.status })
        ] })
      ]
    }
  );
}
function WalletPage() {
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const queryClient = useQueryClient();
  const { data: account, isLoading } = useQuery({
    queryKey: ["walletAccount", tenantId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyWalletAccount(tenantId);
    },
    enabled: !!actor && !isFetching
  });
  const { data: transactions, isLoading: txLoading } = useQuery({
    queryKey: ["walletTxs", tenantId, account == null ? void 0 : account.id],
    queryFn: async () => {
      if (!actor || !account) return [];
      return actor.listTransactions(tenantId, account.id);
    },
    enabled: !!actor && !isFetching && !!account
  });
  const createMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      const res = await actor.createWalletAccount(tenantId, "My Wallet");
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["walletAccount", tenantId] });
      ue.success("Wallet created successfully");
    },
    onError: (err) => ue.error(err.message)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 max-w-3xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-2xl font-bold text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-6 w-6 text-violet-500" }),
          "Wallet"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Manage your simulated ICP and BTC balances" })
      ] }),
      account && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            asChild: true,
            size: "sm",
            className: "bg-violet-600 hover:bg-violet-700 text-white",
            "data-ocid": "wallet-send-btn",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/wallet/send", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "mr-1.5 h-4 w-4" }),
              "Send"
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            asChild: true,
            variant: "outline",
            size: "sm",
            "data-ocid": "wallet-recurring-btn",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/app/wallet/recurring", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "mr-1.5 h-4 w-4" }),
              "Recurring"
            ] })
          }
        )
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-52 rounded-2xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 rounded-2xl" })
    ] }) : !account ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-20 text-center",
        "data-ocid": "wallet-empty",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-8 w-8 text-violet-500" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground", children: "No wallet yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground max-w-xs", children: "Create your simulated wallet to manage ICP and BTC balances." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              className: "mt-6 bg-violet-600 hover:bg-violet-700 text-white",
              onClick: () => createMutation.mutate(),
              disabled: createMutation.isPending,
              "data-ocid": "wallet-create-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
                createMutation.isPending ? "Creating…" : "Create Wallet Account"
              ]
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AccountCard, { account }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3", children: [
        {
          label: "Send ICP",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-5 w-5 text-violet-500" }),
          href: "/app/wallet/send",
          ocid: "quick-send-icp"
        },
        {
          label: "Send BTC",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Bitcoin, { className: "h-5 w-5 text-orange-500" }),
          href: "/app/wallet/send",
          ocid: "quick-send-btc"
        },
        {
          label: "Recurring",
          icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-5 w-5 text-violet-500" }),
          href: "/app/wallet/recurring",
          ocid: "quick-recurring"
        }
      ].map((action) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: action.href,
          "data-ocid": action.ocid,
          className: "flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center transition-smooth hover:border-violet-500/50 hover:bg-violet-500/5",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-muted", children: action.icon }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-foreground", children: action.label })
          ]
        },
        action.label
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-4 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-foreground", children: "Transaction History" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5", children: txLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 py-4", children: [1, 2, 3].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14" }, n)) }) : transactions && transactions.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "tx-list", children: transactions.map((tx) => /* @__PURE__ */ jsxRuntimeExports.jsx(TxRow, { tx }, tx.id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center py-10 text-center",
            "data-ocid": "tx-empty",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRightLeft, { className: "h-8 w-8 text-muted-foreground/40 mb-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No transactions yet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Send assets to see activity here" })
            ]
          }
        ) })
      ] })
    ] })
  ] });
}
export {
  WalletPage as default
};
