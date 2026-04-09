import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { format } from "date-fns";
import {
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight,
  Building2,
  Copy,
  Download,
  Plus,
  RefreshCw,
  User,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { useWorkspace } from "../../hooks/useWorkspace";
import type { WalletAccount, WalletTransaction } from "../../types";
import { TransactionType } from "../../types";

function formatICP(e8s: bigint): string {
  return `${(Number(e8s) / 1e8).toFixed(4)} ICP`;
}
function formatBTC(sats: bigint): string {
  return `${(Number(sats) / 1e8).toFixed(8)} ckBTC`;
}
function formatTs(ts: bigint): string {
  return format(new Date(Number(ts) / 1_000_000), "MMM d, yyyy HH:mm");
}

const TX_ICONS: Record<string, React.ReactNode> = {
  [TransactionType.Receive]: (
    <ArrowDownLeft className="w-3.5 h-3.5 text-green-500" />
  ),
  [TransactionType.Send]: (
    <ArrowUpRight className="w-3.5 h-3.5 text-destructive" />
  ),
};

function truncatePrincipal(id: string): string {
  if (!id || id.length <= 16) return id;
  return `${id.slice(0, 8)}...${id.slice(-4)}`;
}

export default function WalletPage() {
  const { workspaceId } = useParams({ strict: false }) as {
    workspaceId: string;
  };
  const { tenantId } = useWorkspace();
  const { actor, isFetching } = useBackend();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"personal" | "treasury">(
    "personal",
  );

  const { data: personal, isLoading: loadingPersonal } =
    useQuery<WalletAccount | null>({
      queryKey: ["myWallet", tenantId, workspaceId],
      queryFn: async () => {
        if (!actor) return null;
        return actor.getMyWalletAccount(tenantId, workspaceId);
      },
      enabled: !!actor && !isFetching && !!workspaceId,
    });

  const { data: treasury, isLoading: loadingTreasury } =
    useQuery<WalletAccount | null>({
      queryKey: ["treasury", tenantId, workspaceId],
      queryFn: async () => {
        if (!actor) return null;
        return actor.getWorkspaceTreasury(tenantId, workspaceId);
      },
      enabled: !!actor && !isFetching && !!workspaceId,
    });

  const activeAccount = activeTab === "personal" ? personal : treasury;

  // Wallet configuration error: personal and treasury must have different account IDs
  const walletConfigError =
    personal &&
    treasury &&
    personal.accountId &&
    treasury.accountId &&
    personal.accountId === treasury.accountId;

  const { data: transactions = [], isLoading: loadingTx } = useQuery<
    WalletTransaction[]
  >({
    queryKey: ["walletTx", tenantId, workspaceId, activeAccount?.id],
    queryFn: async () => {
      if (!actor || !activeAccount?.id) return [];
      return actor.listTransactions(
        tenantId,
        workspaceId,
        activeAccount.id,
        null,
      );
    },
    enabled: !!actor && !isFetching && !!activeAccount?.id,
  });

  const createPersonalMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.createWalletAccount(
        tenantId,
        workspaceId,
        "My Wallet",
      );
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      toast.success("Personal wallet created");
      void queryClient.invalidateQueries({ queryKey: ["myWallet"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const createTreasuryMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.createWorkspaceTreasury(tenantId, workspaceId);
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      toast.success("Workspace treasury created");
      void queryClient.invalidateQueries({ queryKey: ["treasury"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const refreshMutation = useMutation({
    mutationFn: async () => {
      await queryClient.invalidateQueries({ queryKey: ["myWallet"] });
      await queryClient.invalidateQueries({ queryKey: ["treasury"] });
      await queryClient.invalidateQueries({ queryKey: ["walletTx"] });
    },
    onSuccess: () => toast.success("Balances refreshed"),
  });

  function copyToClipboard(text: string) {
    void navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  }

  const isLoading = loadingPersonal || loadingTreasury;

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Wallet className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground font-display">
              Wallet
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage ICP and ckBTC balances
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refreshMutation.mutate()}
            disabled={refreshMutation.isPending}
            data-ocid="wallet-refresh-btn"
            className="gap-1.5"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${refreshMutation.isPending ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() =>
              navigate({ to: `/app/${workspaceId}/wallet/receive` as "/" })
            }
            data-ocid="wallet-receive-btn"
            className="gap-1.5"
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            Receive
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              navigate({ to: `/app/${workspaceId}/wallet/send` as "/" })
            }
            data-ocid="wallet-send-btn"
            className="gap-1.5"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            Send
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-border">
        {(["personal", "treasury"] as const).map((tab) => (
          <button
            type="button"
            key={tab}
            data-ocid={`wallet-tab-${tab}`}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "personal" ? (
              <User className="w-4 h-4" />
            ) : (
              <Building2 className="w-4 h-4" />
            )}
            {tab === "personal" ? "Personal Wallet" : "Workspace Treasury"}
          </button>
        ))}
      </div>

      {/* Account section */}
      {walletConfigError ? (
        <Card className="border-destructive/40 bg-destructive/5">
          <CardContent className="flex flex-col items-center justify-center py-10 gap-3 text-center">
            <AlertTriangle className="w-8 h-8 text-destructive" />
            <p className="font-semibold text-destructive font-display text-sm">
              Wallet configuration error
            </p>
            <p className="text-xs text-muted-foreground max-w-xs">
              Your personal wallet and workspace treasury are showing the same
              address, which means the wallet needs to be reconfigured. Please
              contact support.
            </p>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <Skeleton className="h-44 w-full rounded-xl" />
      ) : !activeAccount ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 gap-4">
            {activeTab === "personal" ? (
              <User className="w-10 h-10 text-muted-foreground" />
            ) : (
              <Building2 className="w-10 h-10 text-muted-foreground" />
            )}
            <div className="text-center">
              <p className="font-medium text-foreground font-display">
                {activeTab === "personal"
                  ? "No personal wallet yet"
                  : "No workspace treasury yet"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Create one to start receiving and sending tokens.
              </p>
            </div>
            <Button
              data-ocid={`wallet-create-${activeTab}`}
              onClick={() =>
                activeTab === "personal"
                  ? createPersonalMutation.mutate()
                  : createTreasuryMutation.mutate()
              }
              disabled={
                createPersonalMutation.isPending ||
                createTreasuryMutation.isPending
              }
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Create{" "}
              {activeTab === "personal"
                ? "Personal Wallet"
                : "Workspace Treasury"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <AccountCard
          account={activeAccount}
          label={
            activeTab === "personal" ? "Personal Wallet" : "Workspace Treasury"
          }
          icon={
            activeTab === "personal" ? (
              <User className="w-4 h-4" />
            ) : (
              <Building2 className="w-4 h-4" />
            )
          }
          onCopy={copyToClipboard}
          workspaceId={workspaceId}
          navigate={navigate}
        />
      )}

      {/* Transaction history */}
      <div>
        <h2 className="text-sm font-semibold text-foreground font-display mb-3">
          Transaction History
        </h2>
        {loadingTx ? (
          <div className="flex flex-col gap-2">
            {(["a", "b", "c"] as const).map((k) => (
              <Skeleton key={k} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div
            data-ocid="wallet-tx-empty"
            className="flex flex-col items-center justify-center py-12 gap-2 text-center rounded-lg border border-dashed border-border"
          >
            <Wallet className="w-8 h-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No transactions yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {transactions.map((tx) => (
              <TxRow key={tx.id} tx={tx} />
            ))}
          </div>
        )}
      </div>

      {/* Export */}
      {transactions.length > 0 && activeAccount && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            data-ocid="wallet-export-btn"
            onClick={async () => {
              if (!actor || !activeAccount) return;
              const csv = await actor.exportTransactions(
                tenantId,
                workspaceId,
                activeAccount.id,
                null,
              );
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `transactions-${activeAccount.accountType}-${Date.now()}.csv`;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </Button>
        </div>
      )}
    </div>
  );
}

function AccountCard({
  account,
  label,
  icon,
  onCopy,
  workspaceId,
  navigate,
}: {
  account: WalletAccount;
  label: string;
  icon: React.ReactNode;
  onCopy: (text: string) => void;
  workspaceId: string;
  navigate: ReturnType<typeof useNavigate>;
}) {
  return (
    <Card className="bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-display flex items-center gap-2">
          {icon}
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Balances */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-xs text-muted-foreground mb-1">ICP Balance</p>
            <p className="text-lg font-bold text-foreground font-display">
              {formatICP(account.icpBalance)}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-secondary/5 border border-secondary/20">
            <p className="text-xs text-muted-foreground mb-1">ckBTC Balance</p>
            <p className="text-lg font-bold text-foreground font-display">
              {formatBTC(account.btcBalance)}
            </p>
          </div>
        </div>

        {/* ICP Account ID (for receiving ICP) */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-muted-foreground">
              ICP Account ID (64-char hex)
            </p>
            <button
              type="button"
              onClick={() => onCopy(account.accountId)}
              className="text-xs text-primary hover:underline flex items-center gap-1"
              data-ocid="wallet-copy-account-id"
            >
              <Copy className="w-3 h-3" />
              Copy
            </button>
          </div>
          <p
            className="text-xs font-mono bg-muted/50 px-3 py-2 rounded-md break-all text-foreground border border-border"
            data-ocid="wallet-account-id"
          >
            {account.accountId || "Generating…"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Share this address to receive ICP from any compatible wallet or
            exchange.
          </p>
        </div>

        {/* ICRC-1 / Principal address */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs text-muted-foreground">
              Principal (for ckBTC / ICRC-1 tokens)
            </p>
            <button
              type="button"
              onClick={() =>
                onCopy(account.icrc1Account || account.principalId || "")
              }
              className="text-xs text-primary hover:underline flex items-center gap-1"
              data-ocid="wallet-copy-principal"
            >
              <Copy className="w-3 h-3" />
              Copy
            </button>
          </div>
          <p
            className="text-xs font-mono bg-muted/50 px-3 py-2 rounded-md text-foreground border border-border"
            data-ocid="wallet-principal-id"
            title={account.icrc1Account || account.principalId || "—"}
          >
            {truncatePrincipal(
              account.icrc1Account || account.principalId || "",
            ) || "—"}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              navigate({ to: `/app/${workspaceId}/wallet/receive` as "/" })
            }
            className="gap-1.5 flex-1"
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            Receive
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              navigate({ to: `/app/${workspaceId}/wallet/send` as "/" })
            }
            className="gap-1.5 flex-1"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function TxRow({ tx }: { tx: WalletTransaction }) {
  const isReceive = tx.txType === TransactionType.Receive;
  const amtStr = formatICP(tx.amount);

  return (
    <div
      data-ocid={`tx-row-${tx.id}`}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors"
    >
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
          isReceive ? "bg-accent/10" : "bg-destructive/10"
        }`}
      >
        {TX_ICONS[tx.txType] ?? (
          <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{tx.txType}</p>
        {tx.memo && (
          <p className="text-xs text-muted-foreground truncate">{tx.memo}</p>
        )}
      </div>
      <div className="text-right shrink-0">
        <p
          className={`text-sm font-semibold ${isReceive ? "text-accent-foreground" : "text-destructive"}`}
        >
          {isReceive ? "+" : "-"}
          {amtStr}
        </p>
        <p className="text-xs text-muted-foreground">
          {tx.createdAt ? formatTs(tx.createdAt) : "—"}
        </p>
      </div>
      <Badge variant="outline" className="text-xs shrink-0 ml-1">
        {tx.status}
      </Badge>
    </div>
  );
}
