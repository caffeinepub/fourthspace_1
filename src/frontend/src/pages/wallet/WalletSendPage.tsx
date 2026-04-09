import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Loader2, Wallet } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { useWorkspace } from "../../hooks/useWorkspace";
import type { WalletAccount } from "../../types";
import { AssetType } from "../../types";

function formatICP(e8s: bigint): string {
  return `${(Number(e8s) / 1e8).toFixed(4)} ICP`;
}

export default function WalletSendPage() {
  const { workspaceId } = useParams({ strict: false }) as {
    workspaceId: string;
  };
  const { tenantId } = useWorkspace();
  const { actor, isFetching } = useBackend();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [asset, setAsset] = useState<AssetType>(AssetType.ICP);
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [addressError, setAddressError] = useState("");

  const { data: wallet, isLoading } = useQuery<WalletAccount | null>({
    queryKey: ["myWallet", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyWalletAccount(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching && !!workspaceId,
  });

  function validateAddress(addr: string): boolean {
    const trimmed = addr.trim();
    if (asset === AssetType.ICP) {
      // ICP account ID: exactly 64 hex chars
      if (/^[0-9a-fA-F]{64}$/.test(trimmed)) return true;
      // Or a principal (textual)
      if (/^[a-z0-9]+-[a-z0-9-]+-cai$/.test(trimmed) || trimmed.includes("-"))
        return true;
      return false;
    }
    // ckBTC: principal format
    return trimmed.length > 5;
  }

  const sendMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !wallet) throw new Error("Wallet not loaded");
      const parsedAmount = BigInt(Math.round(Number.parseFloat(amount) * 1e8));
      const r = await actor.sendAsset(
        tenantId,
        workspaceId,
        wallet.id,
        asset,
        parsedAmount,
        toAddress.trim(),
        memo.trim() || null,
        1n,
      );
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      toast.success("Transfer initiated successfully");
      void queryClient.invalidateQueries({ queryKey: ["myWallet"] });
      void queryClient.invalidateQueries({ queryKey: ["walletTx"] });
      navigate({ to: `/app/${workspaceId}/wallet` as "/" });
    },
    onError: (e: Error) => toast.error(e.message ?? "Transfer failed"),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateAddress(toAddress)) {
      setAddressError(
        asset === AssetType.ICP
          ? "Enter a valid 64-character hex account ID or principal"
          : "Enter a valid principal ID",
      );
      return;
    }
    setAddressError("");
    if (!amount || Number.parseFloat(amount) <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }
    if (!wallet) {
      toast.error("Wallet not found");
      return;
    }
    sendMutation.mutate();
  }

  const maxBalance = wallet
    ? asset === AssetType.ICP
      ? wallet.icpBalance
      : wallet.btcBalance
    : 0n;

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-lg mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: `/app/${workspaceId}/wallet` as "/" })}
          data-ocid="send-back-btn"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold font-display text-foreground">
              Send Tokens
            </h1>
            <p className="text-sm text-muted-foreground">
              Transfer ICP or ckBTC on-chain
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="h-80 w-full rounded-xl" />
      ) : !wallet ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center py-12 gap-3 text-center">
            <Wallet className="w-10 h-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No wallet found. Create one first.
            </p>
            <Button
              onClick={() =>
                navigate({ to: `/app/${workspaceId}/wallet` as "/" })
              }
            >
              Go to Wallet
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-display">
              Transfer Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Asset type */}
              <div className="flex flex-col gap-1.5">
                <Label>Asset</Label>
                <div className="flex gap-2">
                  {([AssetType.ICP, AssetType.BTC] as const).map((a) => (
                    <button
                      type="button"
                      key={a}
                      data-ocid={`send-asset-${a}`}
                      onClick={() => setAsset(a)}
                      className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        asset === a
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {a === AssetType.BTC ? "ckBTC" : "ICP"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Balance */}
              <div className="p-3 rounded-lg bg-muted/30 border border-border flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Available balance
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {formatICP(maxBalance)}
                </p>
              </div>

              {/* To address */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="send-to">
                  {asset === AssetType.ICP
                    ? "Recipient Account ID"
                    : "Recipient Principal"}
                </Label>
                <Input
                  id="send-to"
                  data-ocid="send-address-input"
                  placeholder={
                    asset === AssetType.ICP
                      ? "64-character hex account ID or principal"
                      : "Principal ID"
                  }
                  value={toAddress}
                  onChange={(e) => {
                    setToAddress(e.target.value);
                    setAddressError("");
                  }}
                  className="font-mono text-xs"
                  required
                />
                {addressError && (
                  <p className="text-xs text-destructive">{addressError}</p>
                )}
              </div>

              {/* Amount */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="send-amount">Amount</Label>
                  <button
                    type="button"
                    onClick={() =>
                      setAmount((Number(maxBalance) / 1e8).toFixed(8))
                    }
                    className="text-xs text-primary hover:underline"
                  >
                    Max
                  </button>
                </div>
                <Input
                  id="send-amount"
                  data-ocid="send-amount-input"
                  type="number"
                  min="0"
                  step="0.0001"
                  placeholder="0.0000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              {/* Memo */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="send-memo">Memo (optional)</Label>
                <Input
                  id="send-memo"
                  data-ocid="send-memo-input"
                  placeholder="e.g. Payment for invoice #1234"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                />
              </div>

              {/* Network fee notice */}
              <div className="p-3 rounded-lg bg-muted/30 border border-border">
                <p className="text-xs text-muted-foreground">
                  ICP network fee:{" "}
                  <span className="font-medium text-foreground">
                    0.0001 ICP
                  </span>{" "}
                  per transfer. The actual fee is deducted by the ledger.
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    navigate({ to: `/app/${workspaceId}/wallet` as "/" })
                  }
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  data-ocid="send-submit-btn"
                  disabled={sendMutation.isPending}
                  className="gap-2"
                >
                  {sendMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <ArrowUpRight className="w-4 h-4" />
                      Send {asset === AssetType.BTC ? "ckBTC" : "ICP"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
