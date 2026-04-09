import { s as createLucideIcon, m as useParams, f as useWorkspace, d as useNavigate, n as useQueryClient, r as reactExports, h as useQuery, j as jsxRuntimeExports, W as Wallet, B as Button, ak as User, k as Building2, P as Plus, aR as TransactionType } from "./index-1XRv9GHr.js";
import { B as Badge } from "./badge-rX4oLW6l.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-CFU1s52N.js";
import { S as Skeleton } from "./index-wZVP6u7e.js";
import { u as useMutation } from "./useMutation-X94w2CVk.js";
import { u as ue } from "./index-BOWFyaIB.js";
import { u as useBackend } from "./useBackend-DyFxq-Jw.js";
import { R as RefreshCw } from "./refresh-cw-J9WZ69Bg.js";
import { A as ArrowUpRight } from "./arrow-up-right-BbVj4O-F.js";
import { T as TriangleAlert } from "./triangle-alert-Dm4aJj7p.js";
import { D as Download } from "./download-B8M1zj2A.js";
import { C as Copy } from "./copy-BH7dsCoj.js";
import { f as format } from "./format-BjBbZPfh.js";
import "./en-US-CJ_JRP0W.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M17 7 7 17", key: "15tmo1" }],
  ["path", { d: "M17 17H7V7", key: "1org7z" }]
];
const ArrowDownLeft = createLucideIcon("arrow-down-left", __iconNode);
function formatICP(e8s) {
  return `${(Number(e8s) / 1e8).toFixed(4)} ICP`;
}
function formatBTC(sats) {
  return `${(Number(sats) / 1e8).toFixed(8)} ckBTC`;
}
function formatTs(ts) {
  return format(new Date(Number(ts) / 1e6), "MMM d, yyyy HH:mm");
}
const TX_ICONS = {
  [TransactionType.Receive]: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownLeft, { className: "w-3.5 h-3.5 text-green-500" }),
  [TransactionType.Send]: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "w-3.5 h-3.5 text-destructive" })
};
function truncatePrincipal(id) {
  if (!id || id.length <= 16) return id;
  return `${id.slice(0, 8)}...${id.slice(-4)}`;
}
function WalletPage() {
  const { workspaceId } = useParams({ strict: false });
  const { tenantId } = useWorkspace();
  const { actor, isFetching } = useBackend();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = reactExports.useState(
    "personal"
  );
  const { data: personal, isLoading: loadingPersonal } = useQuery({
    queryKey: ["myWallet", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyWalletAccount(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const { data: treasury, isLoading: loadingTreasury } = useQuery({
    queryKey: ["treasury", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getWorkspaceTreasury(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const activeAccount = activeTab === "personal" ? personal : treasury;
  const walletConfigError = personal && treasury && personal.accountId && treasury.accountId && personal.accountId === treasury.accountId;
  const { data: transactions = [], isLoading: loadingTx } = useQuery({
    queryKey: ["walletTx", tenantId, workspaceId, activeAccount == null ? void 0 : activeAccount.id],
    queryFn: async () => {
      if (!actor || !(activeAccount == null ? void 0 : activeAccount.id)) return [];
      return actor.listTransactions(
        tenantId,
        workspaceId,
        activeAccount.id,
        null
      );
    },
    enabled: !!actor && !isFetching && !!(activeAccount == null ? void 0 : activeAccount.id)
  });
  const createPersonalMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.createWalletAccount(
        tenantId,
        workspaceId,
        "My Wallet"
      );
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      ue.success("Personal wallet created");
      void queryClient.invalidateQueries({ queryKey: ["myWallet"] });
    },
    onError: (e) => ue.error(e.message)
  });
  const createTreasuryMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.createWorkspaceTreasury(tenantId, workspaceId);
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      ue.success("Workspace treasury created");
      void queryClient.invalidateQueries({ queryKey: ["treasury"] });
    },
    onError: (e) => ue.error(e.message)
  });
  const refreshMutation = useMutation({
    mutationFn: async () => {
      await queryClient.invalidateQueries({ queryKey: ["myWallet"] });
      await queryClient.invalidateQueries({ queryKey: ["treasury"] });
      await queryClient.invalidateQueries({ queryKey: ["walletTx"] });
    },
    onSuccess: () => ue.success("Balances refreshed")
  });
  function copyToClipboard(text) {
    void navigator.clipboard.writeText(text);
    ue.success("Copied to clipboard");
  }
  const isLoading = loadingPersonal || loadingTreasury;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6 p-4 sm:p-6 max-w-4xl mx-auto w-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "w-5 h-5 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold text-foreground font-display", children: "Wallet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Manage ICP and ckBTC balances" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => refreshMutation.mutate(),
            disabled: refreshMutation.isPending,
            "data-ocid": "wallet-refresh-btn",
            className: "gap-1.5",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                RefreshCw,
                {
                  className: `w-3.5 h-3.5 ${refreshMutation.isPending ? "animate-spin" : ""}`
                }
              ),
              "Refresh"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            onClick: () => navigate({ to: `/app/${workspaceId}/wallet/receive` }),
            "data-ocid": "wallet-receive-btn",
            className: "gap-1.5",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownLeft, { className: "w-3.5 h-3.5" }),
              "Receive"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "outline",
            onClick: () => navigate({ to: `/app/${workspaceId}/wallet/send` }),
            "data-ocid": "wallet-send-btn",
            className: "gap-1.5",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "w-3.5 h-3.5" }),
              "Send"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-0 border-b border-border", children: ["personal", "treasury"].map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        "data-ocid": `wallet-tab-${tab}`,
        onClick: () => setActiveTab(tab),
        className: `flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`,
        children: [
          tab === "personal" ? /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "w-4 h-4" }),
          tab === "personal" ? "Personal Wallet" : "Workspace Treasury"
        ]
      },
      tab
    )) }),
    walletConfigError ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-destructive/40 bg-destructive/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex flex-col items-center justify-center py-10 gap-3 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-8 h-8 text-destructive" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-destructive font-display text-sm", children: "Wallet configuration error" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground max-w-xs", children: "Your personal wallet and workspace treasury are showing the same address, which means the wallet needs to be reconfigured. Please contact support." })
    ] }) }) : isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-44 w-full rounded-xl" }) : !activeAccount ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-dashed", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex flex-col items-center justify-center py-12 gap-4", children: [
      activeTab === "personal" ? /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-10 h-10 text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "w-10 h-10 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground font-display", children: activeTab === "personal" ? "No personal wallet yet" : "No workspace treasury yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Create one to start receiving and sending tokens." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          "data-ocid": `wallet-create-${activeTab}`,
          onClick: () => activeTab === "personal" ? createPersonalMutation.mutate() : createTreasuryMutation.mutate(),
          disabled: createPersonalMutation.isPending || createTreasuryMutation.isPending,
          className: "gap-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
            "Create",
            " ",
            activeTab === "personal" ? "Personal Wallet" : "Workspace Treasury"
          ]
        }
      )
    ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      AccountCard,
      {
        account: activeAccount,
        label: activeTab === "personal" ? "Personal Wallet" : "Workspace Treasury",
        icon: activeTab === "personal" ? /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "w-4 h-4" }),
        onCopy: copyToClipboard,
        workspaceId,
        navigate
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground font-display mb-3", children: "Transaction History" }),
      loadingTx ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2", children: ["a", "b", "c"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-full rounded-lg" }, k)) }) : transactions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "wallet-tx-empty",
          className: "flex flex-col items-center justify-center py-12 gap-2 text-center rounded-lg border border-dashed border-border",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "w-8 h-8 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No transactions yet" })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1", children: transactions.map((tx) => /* @__PURE__ */ jsxRuntimeExports.jsx(TxRow, { tx }, tx.id)) })
    ] }),
    transactions.length > 0 && activeAccount && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        variant: "outline",
        size: "sm",
        "data-ocid": "wallet-export-btn",
        onClick: async () => {
          if (!actor || !activeAccount) return;
          const csv = await actor.exportTransactions(
            tenantId,
            workspaceId,
            activeAccount.id,
            null
          );
          const blob = new Blob([csv], { type: "text/csv" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `transactions-${activeAccount.accountType}-${Date.now()}.csv`;
          a.click();
          URL.revokeObjectURL(url);
        },
        className: "gap-1.5",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3.5 h-3.5" }),
          "Export CSV"
        ]
      }
    ) })
  ] });
}
function AccountCard({
  account,
  label,
  icon,
  onCopy,
  workspaceId,
  navigate
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-display flex items-center gap-2", children: [
      icon,
      label
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex flex-col gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-lg bg-primary/5 border border-primary/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "ICP Balance" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold text-foreground font-display", children: formatICP(account.icpBalance) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-lg bg-secondary/5 border border-secondary/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "ckBTC Balance" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold text-foreground font-display", children: formatBTC(account.btcBalance) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "ICP Account ID (64-char hex)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => onCopy(account.accountId),
              className: "text-xs text-primary hover:underline flex items-center gap-1",
              "data-ocid": "wallet-copy-account-id",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3 h-3" }),
                "Copy"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-xs font-mono bg-muted/50 px-3 py-2 rounded-md break-all text-foreground border border-border",
            "data-ocid": "wallet-account-id",
            children: account.accountId || "Generating…"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Share this address to receive ICP from any compatible wallet or exchange." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Principal (for ckBTC / ICRC-1 tokens)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => onCopy(account.icrc1Account || account.principalId || ""),
              className: "text-xs text-primary hover:underline flex items-center gap-1",
              "data-ocid": "wallet-copy-principal",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3 h-3" }),
                "Copy"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-xs font-mono bg-muted/50 px-3 py-2 rounded-md text-foreground border border-border",
            "data-ocid": "wallet-principal-id",
            title: account.icrc1Account || account.principalId || "—",
            children: truncatePrincipal(
              account.icrc1Account || account.principalId || ""
            ) || "—"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "outline",
            onClick: () => navigate({ to: `/app/${workspaceId}/wallet/receive` }),
            className: "gap-1.5 flex-1",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownLeft, { className: "w-3.5 h-3.5" }),
              "Receive"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "outline",
            onClick: () => navigate({ to: `/app/${workspaceId}/wallet/send` }),
            className: "gap-1.5 flex-1",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "w-3.5 h-3.5" }),
              "Send"
            ]
          }
        )
      ] })
    ] })
  ] });
}
function TxRow({ tx }) {
  const isReceive = tx.txType === TransactionType.Receive;
  const amtStr = formatICP(tx.amount);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `tx-row-${tx.id}`,
      className: "flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${isReceive ? "bg-accent/10" : "bg-destructive/10"}`,
            children: TX_ICONS[tx.txType] ?? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "w-3.5 h-3.5 text-muted-foreground" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: tx.txType }),
          tx.memo && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: tx.memo })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "p",
            {
              className: `text-sm font-semibold ${isReceive ? "text-accent-foreground" : "text-destructive"}`,
              children: [
                isReceive ? "+" : "-",
                amtStr
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: tx.createdAt ? formatTs(tx.createdAt) : "—" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-xs shrink-0 ml-1", children: tx.status })
      ]
    }
  );
}
export {
  WalletPage as default
};
