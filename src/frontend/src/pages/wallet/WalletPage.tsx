import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import {
  AlertCircle,
  ArrowDownLeft,
  ArrowRightLeft,
  ArrowUpRight,
  Bitcoin,
  Building2,
  CheckCircle2,
  ClipboardCopy,
  Download,
  Plus,
  QrCode,
  RefreshCw,
  Settings,
  TrendingUp,
  User,
  Wallet,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { TxFilter } from "../../backend";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId, useWorkspace } from "../../hooks/useWorkspace";
import { AssetType, TransactionStatus, TransactionType } from "../../types";
import type { WalletAccount, WalletTransaction } from "../../types";

const E8S = BigInt(100_000_000);

function formatICP(e8s: bigint): string {
  const whole = e8s / E8S;
  const frac = (e8s % E8S).toString().padStart(8, "0").slice(0, 4);
  return `${whole.toLocaleString()}.${frac}`;
}

function formatCKBTC(sats: bigint): string {
  const whole = sats / E8S;
  const frac = (sats % E8S).toString().padStart(8, "0");
  return `${whole.toLocaleString()}.${frac}`;
}

function truncateAddress(addr: string, len = 8): string {
  if (addr.length <= len * 2 + 3) return addr;
  return `${addr.slice(0, len)}...${addr.slice(-len)}`;
}

const TX_TYPE_ICONS: Record<TransactionType, React.ReactNode> = {
  [TransactionType.Send]: <ArrowUpRight className="h-4 w-4 text-red-500" />,
  [TransactionType.Receive]: (
    <ArrowDownLeft className="h-4 w-4 text-emerald-500" />
  ),
  [TransactionType.Swap]: (
    <ArrowRightLeft className="h-4 w-4 text-violet-500" />
  ),
  [TransactionType.Stake]: <RefreshCw className="h-4 w-4 text-violet-500" />,
  [TransactionType.Unstake]: (
    <RefreshCw className="h-4 w-4 text-muted-foreground" />
  ),
};

const TX_STATUS_STYLES: Record<TransactionStatus, string> = {
  [TransactionStatus.Pending]:
    "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  [TransactionStatus.Completed]:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  [TransactionStatus.Failed]:
    "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  [TransactionStatus.Cancelled]: "bg-muted text-muted-foreground border-border",
  [TransactionStatus.AwaitingApproval]:
    "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
};

function CopyButton({ value, label }: { value: string; label: string }) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    toast.success(`${label} copied`);
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copy ${label}`}
      className="ml-1.5 text-white/60 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center -mr-2"
    >
      <ClipboardCopy className="h-3.5 w-3.5" />
    </button>
  );
}

function AccountCard({
  account,
  label,
}: { account: WalletAccount; label: string }) {
  const isPersonal = label === "Personal";
  const gradient = isPersonal
    ? "from-violet-600 to-purple-700"
    : "from-blue-600 to-indigo-700";

  // The Account ID is always a unique 64-char hex derived from principal + subaccount.
  // For personal wallets: default subaccount (all-zeros). For treasury: workspace-derived subaccount.
  // Both wallets share the same Principal ID (same user) but have DISTINCT Account IDs.
  const accountIdLabel = isPersonal
    ? "Account ID (personal subaccount)"
    : "Account ID (workspace subaccount)";

  return (
    <div
      className={`rounded-2xl bg-gradient-to-br ${gradient} p-5 sm:p-6 text-white shadow-lg`}
      data-ocid="wallet-account-card"
    >
      <div className="flex items-start justify-between mb-4 sm:mb-5">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-xs font-medium text-white/60 uppercase tracking-wider">
              {label} Wallet
            </p>
            {!isPersonal && (
              <span className="rounded-full bg-blue-400/30 border border-blue-300/30 px-2 py-0.5 text-[10px] font-semibold text-blue-100">
                Workspace
              </span>
            )}
          </div>
          <h2 className="font-display text-lg sm:text-xl font-bold mt-1">
            {account.displayName}
          </h2>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-5">
        <div className="rounded-xl bg-white/10 p-3 sm:p-4">
          <p className="text-xs text-white/60 mb-1">ICP Balance</p>
          <p className="font-mono text-xl sm:text-2xl font-bold leading-none tabular-nums">
            {formatICP(account.icpBalance)}
          </p>
          <p className="text-xs text-white/50 mt-1">ICP</p>
        </div>
        <div className="rounded-xl bg-white/10 p-3 sm:p-4">
          <p className="text-xs text-white/60 mb-1">ckBTC Balance</p>
          <p className="font-mono text-xl sm:text-2xl font-bold leading-none tabular-nums">
            {formatCKBTC(account.btcBalance)}
          </p>
          <p className="text-xs text-white/50 mt-1">ckBTC</p>
        </div>
      </div>
      <div className="space-y-2.5 text-xs border-t border-white/20 pt-3 sm:pt-4">
        {/* Account ID — unique per wallet (personal vs treasury use different subaccounts) */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-white/50 shrink-0 min-w-[5rem]">
              Account ID
            </span>
            <code className="flex-1 truncate text-white/90 font-mono text-[11px]">
              {account.accountId}
            </code>
            <CopyButton value={account.accountId} label="Account ID" />
          </div>
          <p className="text-[10px] text-white/40 pl-[5.25rem] leading-relaxed">
            {accountIdLabel} — 64-char hex, unique to this wallet
          </p>
        </div>
        {/* ICRC-1 */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-white/50 shrink-0 min-w-[5rem]">ICRC-1</span>
            <code className="flex-1 truncate text-white/80 font-mono text-[11px]">
              {account.icrc1Account}
            </code>
            <CopyButton value={account.icrc1Account} label="ICRC-1 Account" />
          </div>
          <p className="text-[10px] text-white/40 pl-[5.25rem]">
            For ckBTC and ICRC-1 tokens
          </p>
        </div>
        {/* Principal ID — same for both wallets (it's the user's identity) */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-white/50 shrink-0 min-w-[5rem]">
              Principal
            </span>
            <code className="flex-1 truncate text-white/60 font-mono text-[11px]">
              {truncateAddress(account.principalId, 12)}
            </code>
            <CopyButton value={account.principalId} label="Principal ID" />
          </div>
          <p className="text-[10px] text-white/40 pl-[5.25rem]">
            Your Internet Identity — shared across all your wallets
          </p>
        </div>
      </div>
    </div>
  );
}

function AccountCardSkeleton() {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-violet-600/50 to-purple-700/50 p-5 sm:p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-3 w-20 bg-white/20" />
          <Skeleton className="h-5 w-32 bg-white/20" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full bg-white/20" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-20 rounded-xl bg-white/20" />
        <Skeleton className="h-20 rounded-xl bg-white/20" />
      </div>
      <div className="space-y-2 border-t border-white/20 pt-3">
        <Skeleton className="h-4 w-full bg-white/20" />
        <Skeleton className="h-4 w-full bg-white/20" />
        <Skeleton className="h-4 w-full bg-white/20" />
      </div>
    </div>
  );
}

function TxRow({ tx }: { tx: WalletTransaction }) {
  const counterparty =
    tx.txType === TransactionType.Send ? tx.toAddress : tx.fromAddress;
  const isDebit =
    tx.txType === TransactionType.Send || tx.txType === TransactionType.Stake;
  return (
    <div
      className="flex items-center gap-3 py-3 border-b border-border/40 last:border-0 hover:bg-muted/50 transition-colors px-4 sm:px-5"
      data-ocid={`tx-row-${tx.id}`}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted">
        {TX_TYPE_ICONS[tx.txType]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{tx.txType}</p>
        {counterparty && (
          <p className="text-xs text-muted-foreground truncate font-mono">
            {truncateAddress(counterparty)}
          </p>
        )}
        {tx.ledgerBlockHeight !== undefined &&
          tx.ledgerBlockHeight !== null && (
            <p className="text-xs text-muted-foreground font-mono">
              Block #{tx.ledgerBlockHeight.toString()}
            </p>
          )}
        <p className="text-xs text-muted-foreground">
          {format(
            new Date(Number(tx.createdAt / BigInt(1_000_000))),
            "MMM d, yyyy",
          )}
        </p>
      </div>
      <div className="text-right shrink-0 space-y-1">
        <p
          className={`text-sm font-semibold font-mono tabular-nums ${isDebit ? "text-red-500" : "text-emerald-500"}`}
        >
          {isDebit ? "−" : "+"}
          {tx.asset === AssetType.ICP
            ? formatICP(tx.amount)
            : formatCKBTC(tx.amount)}{" "}
          {tx.asset === AssetType.BTC ? "ckBTC" : tx.asset}
        </p>
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border ${TX_STATUS_STYLES[tx.status]}`}
        >
          {tx.status}
        </span>
        {Number(tx.requiredApprovals) > 0 &&
          tx.status === TransactionStatus.Pending && (
            <p className="text-[10px] text-muted-foreground">
              {tx.approvals.length}/{Number(tx.requiredApprovals)} approvals
            </p>
          )}
      </div>
    </div>
  );
}

type WalletTab = "personal" | "treasury";

export default function WalletPage() {
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<WalletTab>("personal");
  const [txTypeFilter, setTxTypeFilter] = useState<string>("");
  const [txStatusFilter, setTxStatusFilter] = useState<string>("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [amountMin, setAmountMin] = useState("");
  const [amountMax, setAmountMax] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const {
    data: account,
    isLoading,
    isError: accountError,
    refetch: refetchAccount,
  } = useQuery<WalletAccount | null>({
    queryKey: ["walletAccount", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyWalletAccount(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching && !!workspaceId,
    retry: 1,
  });

  const {
    data: treasury,
    isLoading: treasuryLoading,
    isError: treasuryError,
    refetch: refetchTreasury,
  } = useQuery<WalletAccount | null>({
    queryKey: ["workspaceTreasury", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getWorkspaceTreasury(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching && !!workspaceId,
    retry: 1,
  });

  const activeAccount = activeTab === "personal" ? account : treasury;
  const activeAccountLoading =
    activeTab === "personal" ? isLoading : treasuryLoading;
  const activeAccountError =
    activeTab === "personal" ? accountError : treasuryError;
  const refetchActiveAccount =
    activeTab === "personal" ? refetchAccount : refetchTreasury;

  const txFilter: TxFilter = {
    ...(txTypeFilter ? { txType: txTypeFilter as TransactionType } : {}),
    ...(txStatusFilter ? { status: txStatusFilter as TransactionStatus } : {}),
    ...(dateFrom
      ? { fromDate: BigInt(new Date(dateFrom).getTime()) * BigInt(1_000_000) }
      : {}),
    ...(dateTo
      ? {
          toDate:
            BigInt(new Date(dateTo).getTime() + 86_400_000) * BigInt(1_000_000),
        }
      : {}),
    ...(amountMin ? { minAmount: Number(amountMin) } : {}),
    ...(amountMax ? { maxAmount: Number(amountMax) } : {}),
  };

  const hasFilters = !!(
    txTypeFilter ||
    txStatusFilter ||
    dateFrom ||
    dateTo ||
    amountMin ||
    amountMax
  );

  const { data: transactions, isLoading: txLoading } = useQuery<
    WalletTransaction[]
  >({
    queryKey: ["walletTxs", tenantId, workspaceId, activeAccount?.id, txFilter],
    queryFn: async () => {
      if (!actor || !activeAccount) return [];
      return actor.listTransactions(
        tenantId,
        workspaceId,
        activeAccount.id,
        null,
      );
    },
    enabled: !!actor && !isFetching && !!activeAccount && !!workspaceId,
  });

  const { data: pendingApprovals } = useQuery<WalletTransaction[]>({
    queryKey: ["pendingApprovals", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPendingApprovals(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching && !!workspaceId,
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      const res = await actor.createWalletAccount(
        tenantId,
        workspaceId,
        "My Wallet",
      );
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["walletAccount", tenantId, workspaceId],
      });
      toast.success("Wallet created successfully");
    },
    onError: (err: Error) => toast.error(err.message),
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
        queryKey: ["workspaceTreasury", tenantId, workspaceId],
      });
      toast.success("Workspace treasury created");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const approveMutation = useMutation({
    mutationFn: async ({
      txId,
      approved,
    }: { txId: string; approved: boolean }) => {
      if (!actor) throw new Error("No actor");
      const res = await actor.approveTransaction(
        tenantId,
        workspaceId,
        txId,
        approved,
      );
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: (_, { approved }) => {
      queryClient.invalidateQueries({
        queryKey: ["pendingApprovals", tenantId, workspaceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["walletTxs", tenantId, workspaceId],
      });
      toast.success(approved ? "Transaction approved" : "Transaction rejected");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  function handleExportCSV() {
    if (!actor || !activeAccount) return;
    actor
      .exportTransactions(
        tenantId,
        workspaceId,
        activeAccount.id,
        hasFilters ? txFilter : null,
      )
      .then((csv) => {
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `wallet-transactions-${format(new Date(), "yyyy-MM-dd")}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("CSV exported");
      })
      .catch((err: Error) => toast.error(err.message));
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
      icon: <ArrowUpRight className="h-5 w-5 text-violet-500" />,
      href: `/app/${workspaceId}/wallet/send`,
      ocid: "quick-send",
    },
    {
      label: "Receive",
      icon: <QrCode className="h-5 w-5 text-violet-500" />,
      href: `/app/${workspaceId}/wallet/receive`,
      ocid: "quick-receive",
    },
    {
      label: "ckBTC",
      icon: <Bitcoin className="h-5 w-5 text-orange-500" />,
      href: `/app/${workspaceId}/wallet/send`,
      ocid: "quick-send-ckbtc",
    },
    {
      label: "Recurring",
      icon: <RefreshCw className="h-5 w-5 text-violet-500" />,
      href: `/app/${workspaceId}/wallet/recurring`,
      ocid: "quick-recurring",
    },
  ];

  return (
    <div className="animate-fade-in-up p-4 sm:p-6 space-y-5 max-w-3xl mx-auto pb-20 md:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 border border-violet-500/20">
            <Wallet className="h-5 w-5 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Wallet
            </h1>
            <p className="text-sm text-muted-foreground hidden sm:block">
              ICP and ckBTC on the Internet Computer
            </p>
          </div>
        </div>
        {activeAccount && (
          <div className="flex gap-2 flex-wrap">
            <Button
              asChild
              size="sm"
              className="bg-violet-600 hover:bg-violet-700 text-white active-press min-h-[44px]"
              data-ocid="wallet-send-btn"
            >
              <Link to={`/app/${workspaceId}/wallet/send`}>
                <ArrowUpRight className="mr-1 h-4 w-4" />
                <span className="hidden sm:inline">Send</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              data-ocid="wallet-receive-btn"
              className="min-h-[44px]"
            >
              <Link to={`/app/${workspaceId}/wallet/receive`}>
                <QrCode className="mr-1 h-4 w-4" />
                <span className="hidden sm:inline">Receive</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              data-ocid="wallet-recurring-btn"
              className="min-h-[44px]"
            >
              <Link to={`/app/${workspaceId}/wallet/recurring`}>
                <RefreshCw className="mr-1 h-4 w-4" />
                <span className="hidden sm:inline">Recurring</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              data-ocid="wallet-limits-btn"
              className="min-h-[44px]"
            >
              <Link to={`/app/${workspaceId}/wallet/spending-limits`}>
                <Settings className="mr-1 h-4 w-4" />
                <span className="hidden sm:inline">Limits</span>
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-border/60">
        <div className="flex overflow-x-auto scrollbar-none">
          {(
            [
              {
                id: "personal" as WalletTab,
                label: "Personal Wallet",
                icon: User,
              },
              {
                id: "treasury" as WalletTab,
                label: "Workspace Treasury",
                icon: Building2,
              },
            ] as const
          ).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              data-ocid={`wallet-tab-${id}`}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-colors whitespace-nowrap min-h-[44px] ${
                activeTab === id
                  ? "border-violet-500 text-violet-600 dark:text-violet-400"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">
                {id === "personal" ? "Personal" : "Treasury"}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Pending Approvals */}
      {pendingList.length > 0 && (
        <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-500/5 p-4">
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-2 mb-3">
            <AlertCircle className="h-4 w-4" />
            {pendingList.length} transaction{pendingList.length > 1 ? "s" : ""}{" "}
            awaiting approval
          </p>
          <div className="space-y-2">
            {pendingList.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between gap-3 rounded-lg bg-card border border-border/50 p-3 flex-wrap"
                data-ocid={`pending-approval-${tx.id}`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground">
                    {tx.txType} —{" "}
                    {tx.asset === AssetType.BTC ? "ckBTC" : tx.asset}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {tx.asset === AssetType.ICP
                      ? formatICP(tx.amount)
                      : formatCKBTC(tx.amount)}{" "}
                    {tx.asset === AssetType.BTC ? "ckBTC" : tx.asset}
                    {tx.toAddress && ` → ${truncateAddress(tx.toAddress)}`}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {tx.approvals.length}/{Number(tx.requiredApprovals)}{" "}
                    approvals
                  </p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <Button
                    size="sm"
                    onClick={() =>
                      approveMutation.mutate({ txId: tx.id, approved: true })
                    }
                    disabled={approveMutation.isPending}
                    className="h-9 text-xs bg-emerald-600 hover:bg-emerald-700 text-white gap-1 active-press min-h-[44px]"
                    data-ocid={`approve-tx-${tx.id}`}
                  >
                    <CheckCircle2 className="h-3 w-3" /> Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      approveMutation.mutate({ txId: tx.id, approved: false })
                    }
                    disabled={approveMutation.isPending}
                    className="h-9 text-xs border-red-300 text-red-600 hover:bg-red-50 gap-1 min-h-[44px]"
                    data-ocid={`reject-tx-${tx.id}`}
                  >
                    <XCircle className="h-3 w-3" /> Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeAccountLoading ? (
        <div className="space-y-4">
          <AccountCardSkeleton />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
      ) : activeAccountError ? (
        <div
          className="flex flex-col items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/5 py-12 text-center px-4"
          data-ocid="wallet-error"
        >
          <AlertCircle className="h-10 w-10 text-destructive/60 mb-3" />
          <p className="font-semibold text-foreground">Balance unavailable</p>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            Could not fetch your wallet balance. Please try again.
          </p>
          <Button
            variant="outline"
            onClick={() => refetchActiveAccount()}
            className="gap-2 min-h-[44px]"
            data-ocid="wallet-retry-btn"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      ) : !activeAccount ? (
        <div
          className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-16 sm:py-20 text-center px-4"
          data-ocid="wallet-empty"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 mb-4">
            {activeTab === "personal" ? (
              <Wallet className="h-8 w-8 text-violet-500" />
            ) : (
              <Building2 className="h-8 w-8 text-blue-500" />
            )}
          </div>
          <h3 className="font-display font-semibold text-foreground">
            {activeTab === "personal"
              ? "No personal wallet"
              : "No workspace treasury"}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-xs">
            {activeTab === "personal"
              ? "Set up your wallet to start sending and receiving ICP and ckBTC tokens."
              : "Create a workspace treasury to manage shared funds."}
          </p>
          <Button
            className={`mt-6 ${activeTab === "personal" ? "bg-violet-600 hover:bg-violet-700" : "bg-blue-600 hover:bg-blue-700"} text-white active-press min-h-[44px]`}
            onClick={() =>
              activeTab === "personal"
                ? createMutation.mutate()
                : createTreasuryMutation.mutate()
            }
            disabled={
              createMutation.isPending || createTreasuryMutation.isPending
            }
            data-ocid="wallet-create-btn"
          >
            <Plus className="mr-2 h-4 w-4" />
            {createMutation.isPending || createTreasuryMutation.isPending
              ? "Creating…"
              : activeTab === "personal"
                ? "Create Personal Wallet"
                : "Create Treasury"}
          </Button>
        </div>
      ) : (
        <>
          <AccountCard
            account={activeAccount}
            label={activeTab === "personal" ? "Personal" : "Treasury"}
          />

          {/* Quick Actions — 4-col grid */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.href}
                data-ocid={action.ocid}
                className="flex flex-col items-center gap-1.5 sm:gap-2 rounded-xl border border-border/50 bg-card p-3 sm:p-4 text-center transition-all hover:border-violet-500/50 hover:bg-violet-500/5 hover:shadow-card min-h-[72px] sm:min-h-[80px]"
              >
                <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-muted">
                  {action.icon}
                </div>
                <span className="text-[10px] sm:text-xs font-medium text-foreground">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Transaction History */}
          <div className="rounded-2xl border border-border/50 bg-card shadow-card overflow-hidden">
            <div className="px-4 sm:px-5 py-4 border-b border-border/40 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-violet-500" />
                <h2 className="font-display font-semibold text-foreground text-sm sm:text-base">
                  Transaction History
                </h2>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  data-ocid="tx-filter-toggle"
                  className="h-8 text-xs gap-1 min-h-[44px]"
                >
                  Filters{hasFilters && " •"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportCSV}
                  data-ocid="tx-export-btn"
                  className="h-8 text-xs gap-1 min-h-[44px]"
                >
                  <Download className="h-3 w-3" />
                  <span className="hidden sm:inline">CSV</span>
                </Button>
              </div>
            </div>

            {showFilters && (
              <div className="px-4 sm:px-5 py-4 border-b border-border/40 bg-muted/20 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Type
                    </Label>
                    <select
                      value={txTypeFilter}
                      onChange={(e) => setTxTypeFilter(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-2 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring h-10"
                      data-ocid="tx-type-filter"
                    >
                      <option value="">All types</option>
                      {Object.values(TransactionType).map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Status
                    </Label>
                    <select
                      value={txStatusFilter}
                      onChange={(e) => setTxStatusFilter(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-2 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring h-10"
                      data-ocid="tx-status-filter"
                    >
                      <option value="">All statuses</option>
                      {Object.values(TransactionStatus).map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      From date
                    </Label>
                    <Input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="h-10 text-xs"
                      data-ocid="tx-date-from"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      To date
                    </Label>
                    <Input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="h-10 text-xs"
                      data-ocid="tx-date-to"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Min amount
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={amountMin}
                      onChange={(e) => setAmountMin(e.target.value)}
                      className="h-10 text-xs"
                      data-ocid="tx-amount-min"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Max amount
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      placeholder="∞"
                      value={amountMax}
                      onChange={(e) => setAmountMax(e.target.value)}
                      className="h-10 text-xs"
                      data-ocid="tx-amount-max"
                    />
                  </div>
                </div>
                {hasFilters && (
                  <button
                    type="button"
                    onClick={() => {
                      setTxTypeFilter("");
                      setTxStatusFilter("");
                      setDateFrom("");
                      setDateTo("");
                      setAmountMin("");
                      setAmountMax("");
                    }}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}

            <div>
              {txLoading ? (
                <div className="space-y-3 p-5">
                  {[1, 2, 3].map((n) => (
                    <Skeleton key={n} className="h-14" />
                  ))}
                </div>
              ) : filteredTxs.length > 0 ? (
                <div data-ocid="tx-list">
                  {filteredTxs.map((tx) => (
                    <TxRow key={tx.id} tx={tx} />
                  ))}
                </div>
              ) : (
                <div
                  className="flex flex-col items-center py-10 text-center px-4"
                  data-ocid="tx-empty"
                >
                  <ArrowRightLeft className="h-8 w-8 text-muted-foreground/40 mb-3" />
                  <p className="text-sm text-muted-foreground">
                    {hasFilters
                      ? "No matching transactions"
                      : "No transactions yet"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {hasFilters
                      ? "Try adjusting your filters."
                      : "Send or receive ICP to see your history here."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
