// Escrow New Page — v3 with hard balance blocker
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { AlertTriangle, ArrowLeft, Plus, Shield, Wallet } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { useWorkspace } from "../../hooks/useWorkspace";
import type { WalletAccount } from "../../types";

function formatICP(e8s: bigint): string {
  return `${(Number(e8s) / 1e8).toFixed(4)} ICP`;
}

export default function EscrowNewPage() {
  const { workspaceId } = useParams({ strict: false }) as {
    workspaceId: string;
  };
  const { tenantId } = useWorkspace();
  const { actor, isFetching } = useBackend();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [payeeId, setPayeeId] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("ICP");
  const [conditions, setConditions] = useState("");

  const { data: wallet, isLoading: walletLoading } =
    useQuery<WalletAccount | null>({
      queryKey: ["myWallet", tenantId, workspaceId],
      queryFn: async () => {
        if (!actor) return null;
        return actor.getMyWalletAccount(tenantId, workspaceId);
      },
      enabled: !!actor && !isFetching && !!workspaceId,
    });

  const hasBalance = wallet != null && wallet.icpBalance > 0n;

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.createEscrow(tenantId, workspaceId, {
        title: title.trim(),
        description: description.trim(),
        payeeId: payeeId.trim() as unknown as Parameters<
          typeof actor.createEscrow
        >[2]["payeeId"],
        amount: BigInt(Math.round(Number.parseFloat(amount) * 1e8)),
        currency,
        conditions: conditions.trim()
          ? conditions.split("\n").filter(Boolean)
          : [],
        crossLinks: [],
      });
      if (result.__kind__ === "err") {
        // Friendly message for insufficient funds
        const msg = result.err.toLowerCase();
        if (
          msg.includes("insufficient") ||
          msg.includes("funds") ||
          msg.includes("balance")
        ) {
          throw new Error(
            "Please fund your wallet first before creating an escrow.",
          );
        }
        throw new Error(result.err);
      }
      return result.ok;
    },
    onSuccess: (created) => {
      toast.success("Escrow created successfully");
      void queryClient.invalidateQueries({ queryKey: ["escrow"] });
      navigate({ to: `/app/${workspaceId}/escrow/${created.id}` as "/" });
    },
    onError: (err: Error) => {
      const msg = err.message ?? "Failed to create escrow";
      toast.error(msg, {
        description:
          msg.toLowerCase().includes("wallet") ||
          msg.toLowerCase().includes("fund")
            ? "Go to Wallet to add funds."
            : undefined,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!payeeId.trim()) {
      toast.error("Payee principal ID is required");
      return;
    }
    if (!amount || Number.parseFloat(amount) <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }
    createMutation.mutate();
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: `/app/${workspaceId}/escrow` as "/" })}
          data-ocid="escrow-new-back"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground font-display">
              New Escrow
            </h1>
            <p className="text-sm text-muted-foreground">
              Create a secure payment agreement
            </p>
          </div>
        </div>
      </div>

      {/* Wallet balance check */}
      {walletLoading ? (
        <Skeleton className="h-20 w-full rounded-lg" />
      ) : !hasBalance ? (
        /* Hard blocker — form is NOT shown when balance is zero */
        <div
          data-ocid="escrow-balance-blocker"
          className="flex flex-col items-center gap-5 py-12 px-6 rounded-xl border border-destructive/30 bg-destructive/5 text-center"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10">
            <AlertTriangle className="w-7 h-7 text-destructive" />
          </div>
          <div>
            <p className="text-base font-semibold text-destructive">
              Insufficient wallet balance
            </p>
            <p className="text-sm text-muted-foreground mt-1.5 max-w-sm mx-auto">
              Please fund your wallet before creating an escrow agreement. Your
              wallet must have a positive ICP balance to proceed.
            </p>
          </div>
          <Button
            className="gap-1.5"
            onClick={() =>
              navigate({ to: `/app/${workspaceId}/wallet` as "/" })
            }
            data-ocid="escrow-go-to-wallet-btn"
          >
            <Wallet className="w-4 h-4" />
            Go to Wallet
          </Button>
        </div>
      ) : (
        <>
          {/* Balance indicator */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
            <Wallet className="w-4 h-4 text-primary shrink-0" />
            <p className="text-sm text-muted-foreground">
              Available balance:{" "}
              <span className="font-medium text-foreground">
                {formatICP(wallet.icpBalance)}
              </span>
            </p>
          </div>

          {/* Form */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-display">
                Agreement Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="esc-title">Title *</Label>
                  <Input
                    id="esc-title"
                    data-ocid="escrow-title-input"
                    placeholder="e.g. Website Design Agreement"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="esc-desc">Description</Label>
                  <Textarea
                    id="esc-desc"
                    data-ocid="escrow-description-input"
                    placeholder="Describe the work or deliverables..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="esc-payee">Payee Principal ID *</Label>
                  <Input
                    id="esc-payee"
                    data-ocid="escrow-payee-input"
                    placeholder="e.g. xxxxx-xxxxx-xxxxx-xxxxx-xxx"
                    value={payeeId}
                    onChange={(e) => setPayeeId(e.target.value)}
                    required
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    The Internet Identity principal of the recipient
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="esc-amount">Amount *</Label>
                    <Input
                      id="esc-amount"
                      data-ocid="escrow-amount-input"
                      type="number"
                      min="0"
                      step="0.0001"
                      placeholder="0.0000"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="esc-currency">Currency</Label>
                    <select
                      id="esc-currency"
                      data-ocid="escrow-currency-select"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                      <option value="ICP">ICP</option>
                      <option value="ckBTC">ckBTC</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="esc-conditions">
                    Conditions (one per line)
                  </Label>
                  <Textarea
                    id="esc-conditions"
                    data-ocid="escrow-conditions-input"
                    placeholder={
                      "Milestone 1: Initial mockups delivered\nMilestone 2: Revisions complete\nMilestone 3: Final files delivered"
                    }
                    value={conditions}
                    onChange={(e) => setConditions(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      navigate({ to: `/app/${workspaceId}/escrow` as "/" })
                    }
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    data-ocid="escrow-submit-btn"
                    disabled={createMutation.isPending}
                    className="gap-2"
                  >
                    {createMutation.isPending ? (
                      "Creating..."
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Create Escrow
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
