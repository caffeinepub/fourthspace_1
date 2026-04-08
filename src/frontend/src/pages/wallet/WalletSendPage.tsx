import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  Info,
  ShieldAlert,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId, useWorkspace } from "../../hooks/useWorkspace";
import { AssetType, Role } from "../../types";
import type {
  WalletAccount,
  WalletTransaction,
  WorkspaceSpendingLimit,
} from "../../types";

const E8S = BigInt(100_000_000);

function formatICP(e8s: bigint): string {
  const whole = e8s / E8S;
  const frac = (e8s % E8S).toString().padStart(8, "0").slice(0, 4);
  return `${whole.toLocaleString()}.${frac} ICP`;
}

function formatCKBTC(sats: bigint): string {
  const whole = sats / E8S;
  const frac = (sats % E8S).toString().padStart(8, "0");
  return `${whole.toLocaleString()}.${frac} ckBTC`;
}

function amountToBigInt(value: string): bigint {
  const [whole = "0", frac = "0"] = value.split(".");
  const fracPadded = frac.slice(0, 8).padEnd(8, "0");
  return BigInt(whole) * E8S + BigInt(fracPadded);
}

function DetailRow({
  label,
  value,
  mono,
}: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span
        className={`text-xs font-medium text-foreground ${mono ? "font-mono" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}

function ConfirmationCard({
  tx,
  workspaceId,
}: { tx: WalletTransaction; workspaceId: string }) {
  const isPending = Number(tx.requiredApprovals) > 0;
  const blockHeight = tx.ledgerBlockHeight;
  return (
    <div
      className={`rounded-2xl border p-6 space-y-4 ${isPending ? "border-amber-500/30 bg-amber-500/5" : "border-emerald-500/30 bg-emerald-500/5"}`}
      data-ocid="send-confirmation"
    >
      <div className="text-center space-y-2">
        {isPending ? (
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto" />
        ) : (
          <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
        )}
        <h2 className="font-display text-xl font-bold text-foreground">
          {isPending ? "Pending Approval" : "Transaction Submitted"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {isPending
            ? `This transaction requires ${Number(tx.requiredApprovals)} approval(s) before it processes.`
            : "Transaction submitted. Your transfer is being processed on the ICP ledger."}
        </p>
      </div>
      <div className="rounded-xl bg-card border border-border/50 p-4 space-y-2.5">
        <DetailRow
          label="Transaction ID"
          value={`${tx.id.slice(0, 16)}…`}
          mono
        />
        <DetailRow
          label="Amount"
          value={
            tx.asset === AssetType.ICP
              ? formatICP(tx.amount)
              : formatCKBTC(tx.amount)
          }
        />
        {tx.toAddress && (
          <DetailRow label="To" value={`${tx.toAddress.slice(0, 24)}…`} mono />
        )}
        <DetailRow
          label="Date"
          value={format(
            new Date(Number(tx.createdAt / BigInt(1_000_000))),
            "MMM d, yyyy HH:mm",
          )}
        />
        {blockHeight !== undefined && blockHeight !== null && (
          <DetailRow
            label="Ledger Block"
            value={`#${blockHeight.toString()}`}
            mono
          />
        )}
        {Number(tx.requiredApprovals) > 0 && (
          <DetailRow
            label="Required Approvals"
            value={`${tx.approvals.length} / ${Number(tx.requiredApprovals)}`}
          />
        )}
        <div className="flex items-center justify-between pt-0.5">
          <span className="text-xs text-muted-foreground">Status</span>
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${isPending ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"}`}
          >
            {tx.status}
          </span>
        </div>
      </div>
      <Link
        to={`/app/${workspaceId}/wallet`}
        className="block"
        data-ocid="send-back-to-wallet"
      >
        <Button variant="outline" className="w-full">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Wallet
        </Button>
      </Link>
    </div>
  );
}

export default function WalletSendPage() {
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [asset, setAsset] = useState<AssetType>(AssetType.ICP);
  const [amount, setAmount] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [memo, setMemo] = useState("");
  const [requiredApprovals, setRequiredApprovals] = useState(0);
  const [confirmedTx, setConfirmedTx] = useState<WalletTransaction | null>(
    null,
  );

  const { data: account, isLoading } = useQuery<WalletAccount | null>({
    queryKey: ["walletAccount", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyWalletAccount(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching && !!workspaceId,
  });

  const { data: spendingLimit } = useQuery<WorkspaceSpendingLimit | null>({
    queryKey: ["spendingLimit", tenantId, workspaceId, Role.TeamMember],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSpendingLimit(tenantId, workspaceId, Role.TeamMember);
    },
    enabled: !!actor && !isFetching && !!workspaceId,
  });

  const balance = account
    ? asset === AssetType.ICP
      ? account.icpBalance
      : account.btcBalance
    : BigInt(0);
  const amountBigInt = (() => {
    try {
      return amount ? amountToBigInt(amount) : BigInt(0);
    } catch {
      return BigInt(0);
    }
  })();
  const amountNum = Number(amountBigInt) / Number(E8S);
  const limitNum = spendingLimit?.maxAmount ?? null;
  const exceedsLimit =
    limitNum !== null && amountNum > limitNum && amountBigInt > BigInt(0);
  const isInsufficient = amountBigInt > BigInt(0) && amountBigInt > balance;
  const amountError = isInsufficient
    ? `Insufficient balance. Available: ${asset === AssetType.ICP ? formatICP(balance) : formatCKBTC(balance)}`
    : null;
  const canSubmit =
    !!account &&
    amount.trim() !== "" &&
    toAddress.trim() !== "" &&
    !isInsufficient &&
    amountBigInt > BigInt(0);

  const sendMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !account) throw new Error("No actor or account");
      const res = await actor.sendAsset(
        tenantId,
        workspaceId,
        account.id,
        asset,
        amountBigInt,
        toAddress.trim(),
        memo.trim() || null,
        BigInt(requiredApprovals),
      );
      if (res.__kind__ === "err")
        throw new Error(`Transfer failed: ${res.err}`);
      return res.ok;
    },
    onSuccess: (tx) => {
      queryClient.invalidateQueries({
        queryKey: ["walletAccount", tenantId, workspaceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["walletTxs", tenantId, workspaceId],
      });
      setConfirmedTx(tx);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="animate-fade-in-up p-6 space-y-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: `/app/${workspaceId}/wallet` })}
          aria-label="Back to wallet"
          data-ocid="send-back-btn"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <ArrowUpRight className="h-6 w-6 text-violet-500" />
            Send Assets
          </h1>
          <p className="text-sm text-muted-foreground">
            Send ICP or ckBTC on the Internet Computer
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      ) : !account ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">No wallet account found.</p>
          <Button asChild className="mt-4" variant="outline">
            <Link to={`/app/${workspaceId}/wallet`}>Go to Wallet</Link>
          </Button>
        </div>
      ) : confirmedTx ? (
        <ConfirmationCard tx={confirmedTx} workspaceId={workspaceId} />
      ) : (
        <div className="rounded-2xl border border-border/50 bg-card shadow-card p-6 space-y-5">
          {/* Asset Selector */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Asset
            </Label>
            <div className="relative" data-ocid="send-asset-select">
              <select
                value={asset}
                onChange={(e) => setAsset(e.target.value as AssetType)}
                className="w-full appearance-none rounded-lg border border-input bg-background px-3 py-2.5 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value={AssetType.ICP}>
                  ICP — Internet Computer Protocol
                </option>
                <option value={AssetType.BTC}>ckBTC — Chain-Key Bitcoin</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* Balance display */}
          <div className="rounded-xl bg-violet-500/5 border border-violet-500/20 px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Available balance
            </span>
            <span className="font-semibold font-mono text-violet-600 dark:text-violet-400 tabular-nums">
              {asset === AssetType.ICP
                ? formatICP(balance)
                : formatCKBTC(balance)}
            </span>
          </div>

          {exceedsLimit && limitNum !== null && (
            <div className="rounded-xl bg-amber-500/5 border border-amber-200 dark:border-amber-800 px-4 py-3 flex items-start gap-2.5">
              <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                  Amount exceeds spending limit
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-500 mt-0.5">
                  Your role limit is {limitNum.toLocaleString()}{" "}
                  {spendingLimit?.currency ?? "USD"}. Additional approvals
                  required.
                </p>
              </div>
            </div>
          )}

          {/* Amount — large font-mono input */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Amount
            </Label>
            <Input
              type="number"
              min="0"
              step="0.0001"
              placeholder={asset === AssetType.ICP ? "0.0000" : "0.00000000"}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`font-mono text-2xl font-bold tabular-nums h-14 ${amountError ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              data-ocid="send-amount-input"
            />
            {amountError && (
              <p className="text-xs text-red-500">{amountError}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              To Address
            </Label>
            <Input
              type="text"
              placeholder={
                asset === AssetType.ICP
                  ? "64-character account ID or principal"
                  : "Principal ID or ICRC-1 account"
              }
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              className="font-mono text-sm"
              data-ocid="send-to-input"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Memo{" "}
              <span className="normal-case font-normal text-muted-foreground/60">
                (optional)
              </span>
            </Label>
            <Input
              type="text"
              placeholder="Add a note or memo"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              data-ocid="send-memo-input"
            />
          </div>

          {/* Fee estimate row */}
          <div className="rounded-xl bg-muted/40 border border-border/40 px-4 py-3 space-y-2">
            <DetailRow label="Network Fee" value="≈ 0.0001 ICP" mono />
            <DetailRow
              label="You'll send"
              value={
                amount
                  ? `${amount} ${asset === AssetType.BTC ? "ckBTC" : asset}`
                  : "—"
              }
              mono
            />
            <DetailRow
              label="Required Approvals"
              value={String(requiredApprovals)}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Required Approvals{" "}
              <span className="normal-case font-normal text-muted-foreground/60">
                (0 = instant)
              </span>
            </Label>
            <Input
              type="number"
              min="0"
              max="10"
              step="1"
              value={requiredApprovals}
              onChange={(e) =>
                setRequiredApprovals(
                  Math.max(0, Number.parseInt(e.target.value) || 0),
                )
              }
              data-ocid="send-approvals-input"
            />
            {requiredApprovals > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-violet-600 dark:text-violet-400">
                <Info className="h-3.5 w-3.5" />
                Transaction held until {requiredApprovals} admin(s) approve it.
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-1">
            <Button
              variant="outline"
              className="flex-1 active-press"
              onClick={() => navigate({ to: `/app/${workspaceId}/wallet` })}
              data-ocid="send-cancel-btn"
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-violet-600 hover:bg-violet-700 text-white active-press"
              disabled={!canSubmit || sendMutation.isPending}
              onClick={() => sendMutation.mutate()}
              data-ocid="send-submit-btn"
            >
              <ArrowUpRight className="mr-2 h-4 w-4" />
              {sendMutation.isPending ? "Sending…" : "Send"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
