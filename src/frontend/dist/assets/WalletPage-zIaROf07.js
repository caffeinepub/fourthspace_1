import { s as createLucideIcon, g as getTenantId, f as useWorkspace, n as useQueryClient, r as reactExports, h as useQuery, j as jsxRuntimeExports, W as Wallet, B as Button, i as Link, y as Settings, ai as User, k as Building2, ag as AssetType, P as Plus, aS as TransactionType, aT as TransactionStatus } from "./index-CzyNqtbv.js";
import { I as Input } from "./input-982h_Ebl.js";
import { L as Label } from "./label-D31XgQrg.js";
import { S as Skeleton } from "./skeleton-DMAdSNre.js";
import { u as useMutation } from "./useMutation-BsRk2Bod.js";
import { u as ue } from "./index-DaWH_LJ9.js";
import { u as useBackend } from "./index-CJtF1vtU.js";
import { A as ArrowUpRight } from "./arrow-up-right-CkIpV1tI.js";
import { Q as QrCode, B as Bitcoin } from "./qr-code-DPjiFLXG.js";
import { R as RefreshCw } from "./refresh-cw-E57THFPd.js";
import { C as CircleAlert } from "./circle-alert-aUZdVIV-.js";
import { C as CircleCheck } from "./circle-check-Bz_M8Dh9.js";
import { C as CircleX } from "./circle-x-BX5Efhsc.js";
import { T as TrendingUp } from "./trending-up-CqMdsyEa.js";
import { D as Download } from "./download-BwKI_7SK.js";
import { A as ArrowRightLeft } from "./arrow-right-left-cXRLXgaw.js";
import { f as format } from "./format-BjBbZPfh.js";
import { C as ClipboardCopy } from "./clipboard-copy-T3lPHdLM.js";
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
const E8S = BigInt(1e8);
function formatICP(e8s) {
  const whole = e8s / E8S;
  const frac = (e8s % E8S).toString().padStart(8, "0").slice(0, 4);
  return `${whole.toLocaleString()}.${frac}`;
}
function formatCKBTC(sats) {
  const whole = sats / E8S;
  const frac = (sats % E8S).toString().padStart(8, "0");
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
  [TransactionStatus.Pending]: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  [TransactionStatus.Completed]: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  [TransactionStatus.Failed]: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  [TransactionStatus.Cancelled]: "bg-muted text-muted-foreground border-border",
  [TransactionStatus.AwaitingApproval]: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
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
      className: "ml-1.5 text-white/60 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center -mr-2",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardCopy, { className: "h-3.5 w-3.5" })
    }
  );
}
function AccountCard({
  account,
  label
}) {
  const isPersonal = label === "Personal";
  const gradient = isPersonal ? "from-violet-600 to-purple-700" : "from-blue-600 to-indigo-700";
  const accountIdLabel = isPersonal ? "Account ID (personal subaccount)" : "Account ID (workspace subaccount)";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `rounded-2xl bg-gradient-to-br ${gradient} p-5 sm:p-6 text-white shadow-lg`,
      "data-ocid": "wallet-account-card",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between mb-4 sm:mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-medium text-white/60 uppercase tracking-wider", children: [
                label,
                " Wallet"
              ] }),
              !isPersonal && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-blue-400/30 border border-blue-300/30 px-2 py-0.5 text-[10px] font-semibold text-blue-100", children: "Workspace" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg sm:text-xl font-bold mt-1", children: account.displayName })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" }),
            "Live"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-white/10 p-3 sm:p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/60 mb-1", children: "ICP Balance" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xl sm:text-2xl font-bold leading-none tabular-nums", children: formatICP(account.icpBalance) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/50 mt-1", children: "ICP" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-white/10 p-3 sm:p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/60 mb-1", children: "ckBTC Balance" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xl sm:text-2xl font-bold leading-none tabular-nums", children: formatCKBTC(account.btcBalance) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/50 mt-1", children: "ckBTC" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2.5 text-xs border-t border-white/20 pt-3 sm:pt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/50 shrink-0 min-w-[5rem]", children: "Account ID" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "flex-1 truncate text-white/90 font-mono text-[11px]", children: account.accountId }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CopyButton, { value: account.accountId, label: "Account ID" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-white/40 pl-[5.25rem] leading-relaxed", children: [
              accountIdLabel,
              " — 64-char hex, unique to this wallet"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/50 shrink-0 min-w-[5rem]", children: "ICRC-1" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "flex-1 truncate text-white/80 font-mono text-[11px]", children: account.icrc1Account }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CopyButton, { value: account.icrc1Account, label: "ICRC-1 Account" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-white/40 pl-[5.25rem]", children: "For ckBTC and ICRC-1 tokens" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/50 shrink-0 min-w-[5rem]", children: "Principal" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "flex-1 truncate text-white/60 font-mono text-[11px]", children: truncateAddress(account.principalId, 12) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CopyButton, { value: account.principalId, label: "Principal ID" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-white/40 pl-[5.25rem]", children: "Your Internet Identity — shared across all your wallets" })
          ] })
        ] })
      ]
    }
  );
}
function AccountCardSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-gradient-to-br from-violet-600/50 to-purple-700/50 p-5 sm:p-6 space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-20 bg-white/20" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-32 bg-white/20" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-16 rounded-full bg-white/20" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 rounded-xl bg-white/20" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 rounded-xl bg-white/20" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 border-t border-white/20 pt-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full bg-white/20" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full bg-white/20" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full bg-white/20" })
    ] })
  ] });
}
function TxRow({ tx }) {
  const counterparty = tx.txType === TransactionType.Send ? tx.toAddress : tx.fromAddress;
  const isDebit = tx.txType === TransactionType.Send || tx.txType === TransactionType.Stake;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex items-center gap-3 py-3 border-b border-border/40 last:border-0 hover:bg-muted/50 transition-colors px-4 sm:px-5",
      "data-ocid": `tx-row-${tx.id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted", children: TX_TYPE_ICONS[tx.txType] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: tx.txType }),
          counterparty && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate font-mono", children: truncateAddress(counterparty) }),
          tx.ledgerBlockHeight !== void 0 && tx.ledgerBlockHeight !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-mono", children: [
            "Block #",
            tx.ledgerBlockHeight.toString()
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: format(
            new Date(Number(tx.createdAt / BigInt(1e6))),
            "MMM d, yyyy"
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right shrink-0 space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "p",
            {
              className: `text-sm font-semibold font-mono tabular-nums ${isDebit ? "text-red-500" : "text-emerald-500"}`,
              children: [
                isDebit ? "−" : "+",
                tx.asset === AssetType.ICP ? formatICP(tx.amount) : formatCKBTC(tx.amount),
                " ",
                tx.asset === AssetType.BTC ? "ckBTC" : tx.asset
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border ${TX_STATUS_STYLES[tx.status]}`,
              children: tx.status
            }
          ),
          Number(tx.requiredApprovals) > 0 && tx.status === TransactionStatus.Pending && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground", children: [
            tx.approvals.length,
            "/",
            Number(tx.requiredApprovals),
            " approvals"
          ] })
        ] })
      ]
    }
  );
}
function WalletPage() {
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = reactExports.useState("personal");
  const [txTypeFilter, setTxTypeFilter] = reactExports.useState("");
  const [txStatusFilter, setTxStatusFilter] = reactExports.useState("");
  const [dateFrom, setDateFrom] = reactExports.useState("");
  const [dateTo, setDateTo] = reactExports.useState("");
  const [amountMin, setAmountMin] = reactExports.useState("");
  const [amountMax, setAmountMax] = reactExports.useState("");
  const [showFilters, setShowFilters] = reactExports.useState(false);
  const {
    data: account,
    isLoading,
    isError: accountError,
    refetch: refetchAccount
  } = useQuery({
    queryKey: ["walletAccount", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyWalletAccount(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching && !!workspaceId,
    retry: 1
  });
  const {
    data: treasury,
    isLoading: treasuryLoading,
    isError: treasuryError,
    refetch: refetchTreasury
  } = useQuery({
    queryKey: ["workspaceTreasury", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getWorkspaceTreasury(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching && !!workspaceId,
    retry: 1
  });
  const activeAccount = activeTab === "personal" ? account : treasury;
  const activeAccountLoading = activeTab === "personal" ? isLoading : treasuryLoading;
  const activeAccountError = activeTab === "personal" ? accountError : treasuryError;
  const refetchActiveAccount = activeTab === "personal" ? refetchAccount : refetchTreasury;
  const txFilter = {
    ...txTypeFilter ? { txType: txTypeFilter } : {},
    ...txStatusFilter ? { status: txStatusFilter } : {},
    ...dateFrom ? { fromDate: BigInt(new Date(dateFrom).getTime()) * BigInt(1e6) } : {},
    ...dateTo ? {
      toDate: BigInt(new Date(dateTo).getTime() + 864e5) * BigInt(1e6)
    } : {},
    ...amountMin ? { minAmount: Number(amountMin) } : {},
    ...amountMax ? { maxAmount: Number(amountMax) } : {}
  };
  const hasFilters = !!(txTypeFilter || txStatusFilter || dateFrom || dateTo || amountMin || amountMax);
  const { data: transactions, isLoading: txLoading } = useQuery({
    queryKey: ["walletTxs", tenantId, workspaceId, activeAccount == null ? void 0 : activeAccount.id, txFilter],
    queryFn: async () => {
      if (!actor || !activeAccount) return [];
      return actor.listTransactions(
        tenantId,
        workspaceId,
        activeAccount.id,
        null
      );
    },
    enabled: !!actor && !isFetching && !!activeAccount && !!workspaceId
  });
  const { data: pendingApprovals } = useQuery({
    queryKey: ["pendingApprovals", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPendingApprovals(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const createMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      const res = await actor.createWalletAccount(
        tenantId,
        workspaceId,
        "My Wallet"
      );
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["walletAccount", tenantId, workspaceId]
      });
      ue.success("Wallet created successfully");
    },
    onError: (err) => ue.error(err.message)
  });
  const createTreasuryMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      const res = await actor.createWorkspaceTreasury(tenantId, workspaceId);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspaceTreasury", tenantId, workspaceId]
      });
      ue.success("Workspace treasury created");
    },
    onError: (err) => ue.error(err.message)
  });
  const approveMutation = useMutation({
    mutationFn: async ({
      txId,
      approved
    }) => {
      if (!actor) throw new Error("No actor");
      const res = await actor.approveTransaction(
        tenantId,
        workspaceId,
        txId,
        approved
      );
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: (_, { approved }) => {
      queryClient.invalidateQueries({
        queryKey: ["pendingApprovals", tenantId, workspaceId]
      });
      queryClient.invalidateQueries({
        queryKey: ["walletTxs", tenantId, workspaceId]
      });
      ue.success(approved ? "Transaction approved" : "Transaction rejected");
    },
    onError: (err) => ue.error(err.message)
  });
  function handleExportCSV() {
    if (!actor || !activeAccount) return;
    actor.exportTransactions(
      tenantId,
      workspaceId,
      activeAccount.id,
      hasFilters ? txFilter : null
    ).then((csv) => {
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `wallet-transactions-${format(/* @__PURE__ */ new Date(), "yyyy-MM-dd")}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      ue.success("CSV exported");
    }).catch((err) => ue.error(err.message));
  }
  const filteredTxs = (transactions ?? []).filter((tx) => {
    if (txTypeFilter && tx.txType !== txTypeFilter) return false;
    if (txStatusFilter && tx.status !== txStatusFilter) return false;
    return true;
  });
  const pendingList = pendingApprovals ?? [];
  const quickActions = [
    {
      label: "Send",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-5 w-5 text-violet-500" }),
      href: `/app/${workspaceId}/wallet/send`,
      ocid: "quick-send"
    },
    {
      label: "Receive",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(QrCode, { className: "h-5 w-5 text-violet-500" }),
      href: `/app/${workspaceId}/wallet/receive`,
      ocid: "quick-receive"
    },
    {
      label: "ckBTC",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Bitcoin, { className: "h-5 w-5 text-orange-500" }),
      href: `/app/${workspaceId}/wallet/send`,
      ocid: "quick-send-ckbtc"
    },
    {
      label: "Recurring",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-5 w-5 text-violet-500" }),
      href: `/app/${workspaceId}/wallet/recurring`,
      ocid: "quick-recurring"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-fade-in-up p-4 sm:p-6 space-y-5 max-w-3xl mx-auto pb-20 md:pb-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 border border-violet-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-5 w-5 text-violet-600 dark:text-violet-400" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-xl sm:text-2xl font-bold tracking-tight text-foreground", children: "Wallet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground hidden sm:block", children: "ICP and ckBTC on the Internet Computer" })
        ] })
      ] }),
      activeAccount && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            asChild: true,
            size: "sm",
            className: "bg-violet-600 hover:bg-violet-700 text-white active-press min-h-[44px]",
            "data-ocid": "wallet-send-btn",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: `/app/${workspaceId}/wallet/send`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "mr-1 h-4 w-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Send" })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            asChild: true,
            variant: "outline",
            size: "sm",
            "data-ocid": "wallet-receive-btn",
            className: "min-h-[44px]",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: `/app/${workspaceId}/wallet/receive`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(QrCode, { className: "mr-1 h-4 w-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Receive" })
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
            className: "min-h-[44px]",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: `/app/${workspaceId}/wallet/recurring`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "mr-1 h-4 w-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Recurring" })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            asChild: true,
            variant: "outline",
            size: "sm",
            "data-ocid": "wallet-limits-btn",
            className: "min-h-[44px]",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: `/app/${workspaceId}/wallet/spending-limits`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "mr-1 h-4 w-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Limits" })
            ] })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border/60", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex overflow-x-auto scrollbar-none", children: [
      {
        id: "personal",
        label: "Personal Wallet",
        icon: User
      },
      {
        id: "treasury",
        label: "Workspace Treasury",
        icon: Building2
      }
    ].map(({ id, label, icon: Icon }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => setActiveTab(id),
        "data-ocid": `wallet-tab-${id}`,
        className: `flex items-center gap-2 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap min-h-[44px] ${activeTab === id ? "border-violet-500 text-violet-600 dark:text-violet-400" : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sm:hidden", children: id === "personal" ? "Personal" : "Treasury" })
        ]
      },
      id
    )) }) }),
    pendingList.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-500/5 p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-2 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" }),
        pendingList.length,
        " transaction",
        pendingList.length > 1 ? "s" : "",
        " ",
        "awaiting approval"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: pendingList.map((tx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center justify-between gap-3 rounded-lg bg-card border border-border/50 p-3 flex-wrap",
          "data-ocid": `pending-approval-${tx.id}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-medium text-foreground", children: [
                tx.txType,
                " —",
                " ",
                tx.asset === AssetType.BTC ? "ckBTC" : tx.asset
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                tx.asset === AssetType.ICP ? formatICP(tx.amount) : formatCKBTC(tx.amount),
                " ",
                tx.asset === AssetType.BTC ? "ckBTC" : tx.asset,
                tx.toAddress && ` → ${truncateAddress(tx.toAddress)}`
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground", children: [
                tx.approvals.length,
                "/",
                Number(tx.requiredApprovals),
                " ",
                "approvals"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5 shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  onClick: () => approveMutation.mutate({ txId: tx.id, approved: true }),
                  disabled: approveMutation.isPending,
                  className: "h-9 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1 active-press min-h-[44px]",
                  "data-ocid": `approve-tx-${tx.id}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }),
                    " Approve"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  onClick: () => approveMutation.mutate({ txId: tx.id, approved: false }),
                  disabled: approveMutation.isPending,
                  className: "h-9 text-xs border-red-300 text-red-600 hover:bg-red-50 gap-1 min-h-[44px]",
                  "data-ocid": `reject-tx-${tx.id}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3 w-3" }),
                    " Reject"
                  ]
                }
              )
            ] })
          ]
        },
        tx.id
      )) })
    ] }),
    activeAccountLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AccountCardSkeleton, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 rounded-2xl" })
    ] }) : activeAccountError ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/5 py-12 text-center px-4",
        "data-ocid": "wallet-error",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-10 w-10 text-destructive/60 mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: "Balance unavailable" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1 mb-4", children: "Could not fetch your wallet balance. Please try again." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              onClick: () => refetchActiveAccount(),
              className: "gap-2 min-h-[44px]",
              "data-ocid": "wallet-retry-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-4 w-4" }),
                "Retry"
              ]
            }
          )
        ]
      }
    ) : !activeAccount ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-16 sm:py-20 text-center px-4",
        "data-ocid": "wallet-empty",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 mb-4", children: activeTab === "personal" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-8 w-8 text-violet-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-8 w-8 text-blue-500" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-foreground", children: activeTab === "personal" ? "No personal wallet" : "No workspace treasury" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground max-w-xs", children: activeTab === "personal" ? "Set up your wallet to start sending and receiving ICP and ckBTC tokens." : "Create a workspace treasury to manage shared funds." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              className: `mt-6 ${activeTab === "personal" ? "bg-violet-600 hover:bg-violet-700" : "bg-blue-600 hover:bg-blue-700"} text-white active-press min-h-[44px]`,
              onClick: () => activeTab === "personal" ? createMutation.mutate() : createTreasuryMutation.mutate(),
              disabled: createMutation.isPending || createTreasuryMutation.isPending,
              "data-ocid": "wallet-create-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
                createMutation.isPending || createTreasuryMutation.isPending ? "Creating…" : activeTab === "personal" ? "Create Personal Wallet" : "Create Treasury"
              ]
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        AccountCard,
        {
          account: activeAccount,
          label: activeTab === "personal" ? "Personal" : "Treasury"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 gap-2 sm:gap-3", children: quickActions.map((action) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: action.href,
          "data-ocid": action.ocid,
          className: "flex flex-col items-center gap-1.5 sm:gap-2 rounded-xl border border-border/50 bg-card p-3 sm:p-4 text-center transition-all hover:border-violet-500/50 hover:bg-violet-500/5 hover:shadow-card min-h-[72px] sm:min-h-[80px]",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-muted", children: action.icon }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] sm:text-xs font-medium text-foreground", children: action.label })
          ]
        },
        action.label
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border/50 bg-card shadow-card overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 sm:px-5 py-4 border-b border-border/40 flex items-center justify-between gap-3 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4 text-violet-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-foreground text-sm sm:text-base", children: "Transaction History" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => setShowFilters(!showFilters),
                "data-ocid": "tx-filter-toggle",
                className: "h-8 text-xs gap-1 min-h-[44px]",
                children: [
                  "Filters",
                  hasFilters && " •"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: handleExportCSV,
                "data-ocid": "tx-export-btn",
                className: "h-8 text-xs gap-1 min-h-[44px]",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-3 w-3" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "CSV" })
                ]
              }
            )
          ] })
        ] }),
        showFilters && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 sm:px-5 py-4 border-b border-border/40 bg-muted/20 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  value: txTypeFilter,
                  onChange: (e) => setTxTypeFilter(e.target.value),
                  className: "w-full rounded-md border border-input bg-background px-2 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring h-10",
                  "data-ocid": "tx-type-filter",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All types" }),
                    Object.values(TransactionType).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: t, children: t }, t))
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  value: txStatusFilter,
                  onChange: (e) => setTxStatusFilter(e.target.value),
                  className: "w-full rounded-md border border-input bg-background px-2 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring h-10",
                  "data-ocid": "tx-status-filter",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "All statuses" }),
                    Object.values(TransactionStatus).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s, children: s }, s))
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "From date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "date",
                  value: dateFrom,
                  onChange: (e) => setDateFrom(e.target.value),
                  className: "h-10 text-xs",
                  "data-ocid": "tx-date-from"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "To date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "date",
                  value: dateTo,
                  onChange: (e) => setDateTo(e.target.value),
                  className: "h-10 text-xs",
                  "data-ocid": "tx-date-to"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Min amount" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: "0",
                  placeholder: "0",
                  value: amountMin,
                  onChange: (e) => setAmountMin(e.target.value),
                  className: "h-10 text-xs",
                  "data-ocid": "tx-amount-min"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Max amount" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: "0",
                  placeholder: "∞",
                  value: amountMax,
                  onChange: (e) => setAmountMax(e.target.value),
                  className: "h-10 text-xs",
                  "data-ocid": "tx-amount-max"
                }
              )
            ] })
          ] }),
          hasFilters && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                setTxTypeFilter("");
                setTxStatusFilter("");
                setDateFrom("");
                setDateTo("");
                setAmountMin("");
                setAmountMax("");
              },
              className: "text-xs text-muted-foreground hover:text-foreground transition-colors",
              children: "Clear all filters"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: txLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 p-5", children: [1, 2, 3].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14" }, n)) }) : filteredTxs.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-ocid": "tx-list", children: filteredTxs.map((tx) => /* @__PURE__ */ jsxRuntimeExports.jsx(TxRow, { tx }, tx.id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center py-10 text-center px-4",
            "data-ocid": "tx-empty",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRightLeft, { className: "h-8 w-8 text-muted-foreground/40 mb-3" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: hasFilters ? "No matching transactions" : "No transactions yet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: hasFilters ? "Try adjusting your filters." : "Send or receive ICP to see your history here." })
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
