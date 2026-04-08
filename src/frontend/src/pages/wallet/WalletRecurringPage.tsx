import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import {
  ArrowLeft,
  ChevronDown,
  Pause,
  Plus,
  RefreshCw,
  Trash2,
  Wallet,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId, useWorkspace } from "../../hooks/useWorkspace";
import { AssetType, PayFrequency } from "../../types";
import type { RecurringPayment, WalletAccount } from "../../types";

const E8S = BigInt(100_000_000);

function formatAmount(amount: bigint, asset: AssetType): string {
  const whole = amount / E8S;
  const frac = (amount % E8S).toString().padStart(8, "0").slice(0, 4);
  return `${whole.toLocaleString()}.${frac} ${asset}`;
}

function amountToBigInt(value: string): bigint {
  const [whole = "0", frac = "0"] = value.split(".");
  const fracPadded = frac.slice(0, 8).padEnd(8, "0");
  return BigInt(whole) * E8S + BigInt(fracPadded);
}

function truncateAddress(addr: string, len = 10): string {
  if (addr.length <= len * 2 + 3) return addr;
  return `${addr.slice(0, len)}...${addr.slice(-len)}`;
}

const FREQ_LABELS: Record<PayFrequency, string> = {
  [PayFrequency.Weekly]: "Weekly",
  [PayFrequency.BiWeekly]: "Bi-Weekly",
  [PayFrequency.SemiMonthly]: "Semi-Monthly",
  [PayFrequency.Monthly]: "Monthly",
  [PayFrequency.Quarterly]: "Quarterly",
};

const FREQ_COLORS: Record<string, string> = {
  [PayFrequency.Weekly]:
    "bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-500/20",
  [PayFrequency.BiWeekly]:
    "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20",
  [PayFrequency.SemiMonthly]:
    "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/20",
  [PayFrequency.Monthly]:
    "bg-violet-500/15 text-violet-700 dark:text-violet-400 border-violet-500/20",
  [PayFrequency.Quarterly]:
    "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20",
};

function RecurringRow({
  payment,
  onCancel,
  isCancelling,
}: {
  payment: RecurringPayment;
  onCancel: (id: string) => void;
  isCancelling: boolean;
}) {
  return (
    <div
      className="flex items-center gap-4 rounded-xl border border-border/50 bg-card shadow-card p-4 hover:border-violet-400/40 transition-all"
      data-ocid={`recurring-row-${payment.id}`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10">
        <RefreshCw className="h-5 w-5 text-violet-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate font-mono">
          {truncateAddress(payment.toAddress)}
        </p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="text-xs font-mono text-muted-foreground">
            {formatAmount(payment.amount, payment.asset)}
          </span>
          <span className="text-muted-foreground text-xs">·</span>
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${FREQ_COLORS[payment.frequency] ?? "bg-muted text-muted-foreground border-border"}`}
          >
            {FREQ_LABELS[payment.frequency]}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          Next:{" "}
          {format(
            new Date(Number(payment.nextRunAt / BigInt(1_000_000))),
            "MMM d, yyyy",
          )}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border ${payment.isActive ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20" : "bg-muted text-muted-foreground border-border"}`}
        >
          {payment.isActive ? (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Active
            </>
          ) : (
            <>
              <Pause className="h-3 w-3" />
              Inactive
            </>
          )}
        </span>
        {payment.isActive && (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Cancel payment"
            className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
            onClick={() => onCancel(payment.id)}
            disabled={isCancelling}
            data-ocid={`cancel-recurring-${payment.id}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

function NewPaymentForm({
  accountId,
  tenantId,
  workspaceId,
  onSuccess,
  onCancel,
}: {
  accountId: string;
  tenantId: string;
  workspaceId: string;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [asset, setAsset] = useState<AssetType>(AssetType.ICP);
  const [frequency, setFrequency] = useState<PayFrequency>(
    PayFrequency.Monthly,
  );

  const canSubmit =
    toAddress.trim() !== "" && amount.trim() !== "" && Number(amount) > 0;

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("No actor");
      const res = await actor.createRecurringPayment(
        tenantId,
        workspaceId,
        accountId,
        toAddress.trim(),
        amountToBigInt(amount),
        asset,
        frequency,
      );
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["recurringPayments", tenantId, workspaceId],
      });
      toast.success("Recurring payment created");
      onSuccess();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div
      className="rounded-2xl border border-violet-500/30 bg-violet-500/5 p-5 space-y-4"
      data-ocid="new-recurring-form"
    >
      <h3 className="font-display font-semibold text-foreground">
        New Recurring Payment
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Asset
          </Label>
          <div className="relative">
            <select
              value={asset}
              onChange={(e) => setAsset(e.target.value as AssetType)}
              className="w-full appearance-none rounded-lg border border-input bg-background px-3 py-2.5 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              data-ocid="rec-asset-select"
            >
              <option value={AssetType.ICP}>ICP</option>
              <option value={AssetType.BTC}>BTC</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Frequency
          </Label>
          <div className="relative">
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as PayFrequency)}
              className="w-full appearance-none rounded-lg border border-input bg-background px-3 py-2.5 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              data-ocid="rec-freq-select"
            >
              {(Object.entries(FREQ_LABELS) as [PayFrequency, string][]).map(
                ([val, label]) => (
                  <option key={val} value={val}>
                    {label}
                  </option>
                ),
              )}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Amount
        </Label>
        <Input
          type="number"
          min="0"
          step="0.0001"
          placeholder="0.0000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="font-mono text-lg tabular-nums h-12"
          data-ocid="rec-amount-input"
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          To Address
        </Label>
        <Input
          type="text"
          placeholder="Principal or account ID"
          value={toAddress}
          onChange={(e) => setToAddress(e.target.value)}
          className="font-mono text-sm"
          data-ocid="rec-to-input"
        />
      </div>
      <div className="flex gap-3 pt-1">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onCancel}
          data-ocid="rec-cancel-btn"
        >
          Cancel
        </Button>
        <Button
          className="flex-1 bg-violet-600 hover:bg-violet-700 text-white active-press"
          disabled={!canSubmit || createMutation.isPending}
          onClick={() => createMutation.mutate()}
          data-ocid="rec-submit-btn"
        >
          <Plus className="mr-2 h-4 w-4" />
          {createMutation.isPending ? "Creating…" : "Create Payment"}
        </Button>
      </div>
    </div>
  );
}

export default function WalletRecurringPage() {
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data: account, isLoading: accountLoading } =
    useQuery<WalletAccount | null>({
      queryKey: ["walletAccount", tenantId, workspaceId],
      queryFn: async () => {
        if (!actor) return null;
        return actor.getMyWalletAccount(tenantId, workspaceId);
      },
      enabled: !!actor && !isFetching && !!workspaceId,
    });

  const { data: payments, isLoading: paymentsLoading } = useQuery<
    RecurringPayment[]
  >({
    queryKey: ["recurringPayments", tenantId, workspaceId, account?.id],
    queryFn: async () => {
      if (!actor || !account) return [];
      return actor.listRecurringPayments(tenantId, workspaceId, account.id);
    },
    enabled: !!actor && !isFetching && !!account && !!workspaceId,
  });

  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error("No actor");
      const res = await actor.cancelRecurringPayment(tenantId, workspaceId, id);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["recurringPayments", tenantId, workspaceId],
      });
      toast.success("Recurring payment cancelled");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const isLoading = accountLoading || paymentsLoading;

  return (
    <div className="animate-fade-in-up p-6 space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: `/app/${workspaceId}/wallet` })}
          aria-label="Back to wallet"
          data-ocid="recurring-back-btn"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <RefreshCw className="h-6 w-6 text-violet-500" />
            Recurring Payments
          </h1>
          <p className="text-sm text-muted-foreground">
            Automate scheduled asset transfers
          </p>
        </div>
        {account && !showForm && (
          <Button
            className="bg-violet-600 hover:bg-violet-700 text-white shrink-0 active-press"
            size="sm"
            onClick={() => setShowForm(true)}
            data-ocid="recurring-new-btn"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            New
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <Skeleton key={n} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : !account ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-20 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 mb-4">
            <Wallet className="h-7 w-7 text-violet-500" />
          </div>
          <h3 className="font-display font-semibold text-foreground">
            No wallet account
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Create a wallet first to set up recurring payments.
          </p>
          <Button asChild className="mt-6" variant="outline">
            <Link to={`/app/${workspaceId}/wallet`}>Go to Wallet</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {showForm && (
            <NewPaymentForm
              accountId={account.id}
              tenantId={tenantId}
              workspaceId={workspaceId}
              onSuccess={() => setShowForm(false)}
              onCancel={() => setShowForm(false)}
            />
          )}
          {payments && payments.length > 0 ? (
            <div className="space-y-3">
              {payments.map((payment) => (
                <RecurringRow
                  key={payment.id}
                  payment={payment}
                  onCancel={(id) => cancelMutation.mutate(id)}
                  isCancelling={cancelMutation.isPending}
                />
              ))}
            </div>
          ) : (
            !showForm && (
              <div
                className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-16 text-center"
                data-ocid="recurring-empty"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 mb-4">
                  <RefreshCw className="h-7 w-7 text-violet-500" />
                </div>
                <h3 className="font-display font-semibold text-foreground">
                  No recurring payments
                </h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-xs">
                  Set up automatic scheduled transfers for regular payments.
                </p>
                <Button
                  className="mt-6 bg-violet-600 hover:bg-violet-700 text-white active-press"
                  onClick={() => setShowForm(true)}
                  data-ocid="recurring-empty-cta"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Recurring Payment
                </Button>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
