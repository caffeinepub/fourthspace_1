import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import {
  ArrowDownLeft,
  ArrowRightLeft,
  ArrowUpRight,
  Bitcoin,
  ClipboardCopy,
  Plus,
  RefreshCw,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId } from "../../hooks/useWorkspace";
import { AssetType, TransactionStatus, TransactionType } from "../../types";
import type { WalletAccount, WalletTransaction } from "../../types";

const E8S = BigInt(100_000_000);

function formatICP(e8s: bigint): string {
  const whole = e8s / E8S;
  const frac = (e8s % E8S).toString().padStart(8, "0").slice(0, 4);
  return `${whole.toLocaleString()}.${frac}`;
}

function formatBTC(sats: bigint): string {
  const whole = sats / E8S;
  const frac = (sats % E8S).toString().padStart(8, "0").slice(0, 6);
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
    "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
  [TransactionStatus.Completed]:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  [TransactionStatus.Failed]: "bg-red-500/10 text-red-600 dark:text-red-400",
  [TransactionStatus.Cancelled]: "bg-muted text-muted-foreground",
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
      className="ml-1.5 text-white/60 hover:text-white transition-colors"
    >
      <ClipboardCopy className="h-3.5 w-3.5" />
    </button>
  );
}

function AccountCard({ account }: { account: WalletAccount }) {
  return (
    <div
      className="rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 p-6 text-white shadow-lg"
      data-ocid="wallet-account-card"
    >
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-xs font-medium text-white/60 uppercase tracking-wider">
            Fourthspace Wallet
          </p>
          <h2 className="font-display text-xl font-bold mt-1">
            {account.displayName}
          </h2>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold">
          <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse" />
          Simulated
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="rounded-xl bg-white/10 p-3.5">
          <p className="text-xs text-white/60 mb-1.5">ICP Balance</p>
          <p className="font-display text-2xl font-bold leading-none">
            {formatICP(account.icpBalance)}
          </p>
          <p className="text-xs text-white/50 mt-1">ICP</p>
        </div>
        <div className="rounded-xl bg-white/10 p-3.5">
          <p className="text-xs text-white/60 mb-1.5">BTC Balance</p>
          <p className="font-display text-2xl font-bold leading-none">
            {formatBTC(account.btcBalance)}
          </p>
          <p className="text-xs text-white/50 mt-1">BTC</p>
        </div>
      </div>

      <div className="space-y-2 text-xs border-t border-white/20 pt-4">
        <div className="flex items-center gap-2">
          <span className="text-white/50 w-20 shrink-0">Principal</span>
          <code className="flex-1 truncate text-white/80 font-mono">
            {truncateAddress(account.principalId, 14)}
          </code>
          <CopyButton value={account.principalId} label="Principal ID" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/50 w-20 shrink-0">Account ID</span>
          <code className="flex-1 truncate text-white/80 font-mono">
            {truncateAddress(account.accountId, 14)}
          </code>
          <CopyButton value={account.accountId} label="Account ID" />
        </div>
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
      className="flex items-center gap-3 py-3.5 border-b border-border last:border-0"
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
        <p className="text-xs text-muted-foreground">
          {format(
            new Date(Number(tx.createdAt / BigInt(1_000_000))),
            "MMM d, yyyy",
          )}
        </p>
      </div>
      <div className="text-right shrink-0 space-y-1">
        <p
          className={`text-sm font-semibold ${isDebit ? "text-red-500" : "text-emerald-500"}`}
        >
          {isDebit ? "−" : "+"}
          {tx.asset === AssetType.ICP
            ? formatICP(tx.amount)
            : formatBTC(tx.amount)}{" "}
          {tx.asset}
        </p>
        <Badge className={TX_STATUS_STYLES[tx.status]} variant="secondary">
          {tx.status}
        </Badge>
      </div>
    </div>
  );
}

export default function WalletPage() {
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const queryClient = useQueryClient();

  const { data: account, isLoading } = useQuery<WalletAccount | null>({
    queryKey: ["walletAccount", tenantId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyWalletAccount(tenantId);
    },
    enabled: !!actor && !isFetching,
  });

  const { data: transactions, isLoading: txLoading } = useQuery<
    WalletTransaction[]
  >({
    queryKey: ["walletTxs", tenantId, account?.id],
    queryFn: async () => {
      if (!actor || !account) return [];
      return actor.listTransactions(tenantId, account.id);
    },
    enabled: !!actor && !isFetching && !!account,
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
      toast.success("Wallet created successfully");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <Wallet className="h-6 w-6 text-violet-500" />
            Wallet
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your simulated ICP and BTC balances
          </p>
        </div>
        {account && (
          <div className="flex gap-2">
            <Button
              asChild
              size="sm"
              className="bg-violet-600 hover:bg-violet-700 text-white"
              data-ocid="wallet-send-btn"
            >
              <Link to="/app/wallet/send">
                <ArrowUpRight className="mr-1.5 h-4 w-4" />
                Send
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              data-ocid="wallet-recurring-btn"
            >
              <Link to="/app/wallet/recurring">
                <RefreshCw className="mr-1.5 h-4 w-4" />
                Recurring
              </Link>
            </Button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-52 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
      ) : !account ? (
        <div
          className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-20 text-center"
          data-ocid="wallet-empty"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 mb-4">
            <Wallet className="h-8 w-8 text-violet-500" />
          </div>
          <h3 className="font-display font-semibold text-foreground">
            No wallet yet
          </h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-xs">
            Create your simulated wallet to manage ICP and BTC balances.
          </p>
          <Button
            className="mt-6 bg-violet-600 hover:bg-violet-700 text-white"
            onClick={() => createMutation.mutate()}
            disabled={createMutation.isPending}
            data-ocid="wallet-create-btn"
          >
            <Plus className="mr-2 h-4 w-4" />
            {createMutation.isPending ? "Creating…" : "Create Wallet Account"}
          </Button>
        </div>
      ) : (
        <>
          <AccountCard account={account} />

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                label: "Send ICP",
                icon: <ArrowUpRight className="h-5 w-5 text-violet-500" />,
                href: "/app/wallet/send" as const,
                ocid: "quick-send-icp",
              },
              {
                label: "Send BTC",
                icon: <Bitcoin className="h-5 w-5 text-orange-500" />,
                href: "/app/wallet/send" as const,
                ocid: "quick-send-btc",
              },
              {
                label: "Recurring",
                icon: <RefreshCw className="h-5 w-5 text-violet-500" />,
                href: "/app/wallet/recurring" as const,
                ocid: "quick-recurring",
              },
            ].map((action) => (
              <Link
                key={action.label}
                to={action.href}
                data-ocid={action.ocid}
                className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center transition-smooth hover:border-violet-500/50 hover:bg-violet-500/5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
                  {action.icon}
                </div>
                <span className="text-xs font-medium text-foreground">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Transaction History */}
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="font-display font-semibold text-foreground">
                Transaction History
              </h2>
            </div>
            <div className="px-5">
              {txLoading ? (
                <div className="space-y-3 py-4">
                  {[1, 2, 3].map((n) => (
                    <Skeleton key={n} className="h-14" />
                  ))}
                </div>
              ) : transactions && transactions.length > 0 ? (
                <div data-ocid="tx-list">
                  {transactions.map((tx) => (
                    <TxRow key={tx.id} tx={tx} />
                  ))}
                </div>
              ) : (
                <div
                  className="flex flex-col items-center py-10 text-center"
                  data-ocid="tx-empty"
                >
                  <ArrowRightLeft className="h-8 w-8 text-muted-foreground/40 mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No transactions yet
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Send assets to see activity here
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
