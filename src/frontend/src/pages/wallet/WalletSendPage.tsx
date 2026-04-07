import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId } from "../../hooks/useWorkspace";
import { AssetType } from "../../types";
import type { WalletAccount, WalletTransaction } from "../../types";

const E8S = BigInt(100_000_000);

function formatICP(e8s: bigint): string {
  const whole = e8s / E8S;
  const frac = (e8s % E8S).toString().padStart(8, "0").slice(0, 4);
  return `${whole.toLocaleString()}.${frac} ICP`;
}

function formatBTC(sats: bigint): string {
  const whole = sats / E8S;
  const frac = (sats % E8S).toString().padStart(8, "0").slice(0, 6);
  return `${whole.toLocaleString()}.${frac} BTC`;
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
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
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

function ConfirmationCard({ tx }: { tx: WalletTransaction }) {
  return (
    <div
      className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 space-y-4"
      data-ocid="send-confirmation"
    >
      <div className="text-center space-y-2">
        <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
        <h2 className="font-display text-xl font-bold text-foreground">
          Transaction Sent
        </h2>
        <p className="text-sm text-muted-foreground">
          Your simulated transaction has been submitted
        </p>
      </div>
      <div className="rounded-xl bg-card border border-border p-4 space-y-2.5">
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
              : formatBTC(tx.amount)
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
        <div className="flex items-center justify-between pt-0.5">
          <span className="text-xs text-muted-foreground">Status</span>
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            {tx.status}
          </Badge>
        </div>
      </div>
      <Link to="/app/wallet" className="block" data-ocid="send-back-to-wallet">
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
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [asset, setAsset] = useState<AssetType>(AssetType.ICP);
  const [amount, setAmount] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [memo, setMemo] = useState("");
  const [confirmedTx, setConfirmedTx] = useState<WalletTransaction | null>(
    null,
  );

  const { data: account, isLoading } = useQuery<WalletAccount | null>({
    queryKey: ["walletAccount", tenantId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyWalletAccount(tenantId);
    },
    enabled: !!actor && !isFetching,
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

  const isInsufficient = amountBigInt > BigInt(0) && amountBigInt > balance;
  const amountError = isInsufficient
    ? `Insufficient balance. Available: ${asset === AssetType.ICP ? formatICP(balance) : formatBTC(balance)}`
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
        account.id,
        asset,
        amountBigInt,
        toAddress.trim(),
        memo.trim() || null,
      );
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: (tx) => {
      queryClient.invalidateQueries({ queryKey: ["walletAccount", tenantId] });
      queryClient.invalidateQueries({ queryKey: ["walletTxs", tenantId] });
      setConfirmedTx(tx);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="p-6 md:p-8 max-w-lg mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: "/app/wallet" })}
          aria-label="Back to wallet"
          data-ocid="send-back-btn"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <ArrowUpRight className="h-6 w-6 text-violet-500" />
            Send Assets
          </h1>
          <p className="text-sm text-muted-foreground">
            Simulated — no real assets will be transferred
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
            <Link to="/app/wallet">Go to Wallet</Link>
          </Button>
        </div>
      ) : confirmedTx ? (
        <ConfirmationCard tx={confirmedTx} />
      ) : (
        <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
          {/* Asset Selector */}
          <div className="space-y-1.5">
            <Label htmlFor="asset-select">Asset</Label>
            <div className="relative" data-ocid="send-asset-select">
              <select
                id="asset-select"
                value={asset}
                onChange={(e) => setAsset(e.target.value as AssetType)}
                className="w-full appearance-none rounded-lg border border-input bg-background px-3 py-2.5 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value={AssetType.ICP}>ICP — Internet Computer</option>
                <option value={AssetType.BTC}>BTC — Bitcoin</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {/* Balance display */}
          <div className="rounded-xl bg-violet-500/5 border border-violet-500/20 px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Available balance
            </span>
            <span className="font-semibold text-violet-600 dark:text-violet-400 text-sm">
              {asset === AssetType.ICP
                ? formatICP(balance)
                : formatBTC(balance)}
            </span>
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <Label htmlFor="send-amount">Amount</Label>
            <Input
              id="send-amount"
              type="number"
              min="0"
              step="0.0001"
              placeholder={asset === AssetType.ICP ? "0.0000" : "0.000000"}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={
                amountError ? "border-red-500 focus-visible:ring-red-500" : ""
              }
              data-ocid="send-amount-input"
            />
            {amountError && (
              <p className="text-xs text-red-500">{amountError}</p>
            )}
          </div>

          {/* To Address */}
          <div className="space-y-1.5">
            <Label htmlFor="send-to">To Address</Label>
            <Input
              id="send-to"
              type="text"
              placeholder="Principal or account ID"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              className="font-mono text-sm"
              data-ocid="send-to-input"
            />
          </div>

          {/* Memo */}
          <div className="space-y-1.5">
            <Label htmlFor="send-memo">
              Memo{" "}
              <span className="text-xs text-muted-foreground">(optional)</span>
            </Label>
            <Input
              id="send-memo"
              type="text"
              placeholder="Add a note or memo"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              data-ocid="send-memo-input"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => navigate({ to: "/app/wallet" })}
              data-ocid="send-cancel-btn"
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-violet-600 hover:bg-violet-700 text-white"
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
