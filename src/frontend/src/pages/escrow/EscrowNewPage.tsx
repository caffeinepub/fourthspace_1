import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Layers,
  Plus,
  Shield,
  Trash2,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { EscrowMilestoneInput } from "../../backend";
import { CrossLinkPicker } from "../../components/CrossLinkPicker";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId, useWorkspace } from "../../hooks/useWorkspace";
import type {
  CrossLink,
  EscrowInput,
  UserId,
  WalletAccount,
} from "../../types";

const CURRENCIES = ["ICP", "ckBTC", "USD"];

interface ConditionItem {
  id: string;
  text: string;
}

interface MilestoneItem {
  id: string;
  title: string;
  amount: string;
  description: string;
}

let conditionCounter = 0;
function newCondition(): ConditionItem {
  conditionCounter += 1;
  return { id: `cond-${conditionCounter}`, text: "" };
}

let milestoneCounter = 0;
function newMilestone(): MilestoneItem {
  milestoneCounter += 1;
  return {
    id: `ms-${milestoneCounter}`,
    title: "",
    amount: "",
    description: "",
  };
}

function formatIcp(balance: bigint): string {
  return (Number(balance) / 1_000_000_00).toFixed(4);
}

/** Inline banner shown when treasury has no funds. */
function InsufficientFundsBanner({
  onFundWallet,
  balanceText,
}: {
  onFundWallet: () => void;
  balanceText?: string;
}) {
  return (
    <div
      className="flex items-start gap-3 rounded-xl border border-amber-400/40 bg-amber-500/8 px-4 py-3"
      data-ocid="escrow-insufficient-funds-banner"
      role="alert"
    >
      <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">
          {balanceText
            ? `Amount exceeds workspace treasury balance (${balanceText} ICP available)`
            : "Your workspace wallet has no funds. You need to fund it before creating an escrow."}
        </p>
      </div>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={onFundWallet}
        className="shrink-0 gap-1.5 border-amber-400/60 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10"
        data-ocid="escrow-fund-wallet-btn"
      >
        <Wallet className="h-3.5 w-3.5" />
        Fund Wallet
      </Button>
    </div>
  );
}

export default function EscrowNewPage() {
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("ICP");
  const [payeeId, setPayeeId] = useState("");
  const [conditions, setConditions] = useState<ConditionItem[]>([
    newCondition(),
  ]);
  const [dueDate, setDueDate] = useState("");
  const [crossLinks, setCrossLinks] = useState<CrossLink[]>([]);
  const [milestones, setMilestones] = useState<MilestoneItem[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Fetch workspace treasury
  const { data: treasury, isLoading: treasuryLoading } =
    useQuery<WalletAccount | null>({
      queryKey: ["workspaceTreasury", tenantId, workspaceId],
      queryFn: async () => {
        if (!actor) return null;
        return actor.getWorkspaceTreasury(tenantId, workspaceId);
      },
      enabled: !!actor && !isFetching && !!workspaceId,
    });

  const icpBalance = treasury?.icpBalance ?? BigInt(0);
  // icpBalance is in e8s (1 ICP = 100_000_000 e8s)
  const icpBalanceFloat = Number(icpBalance) / 1_000_000_00;
  const hasNoFunds = !treasuryLoading && icpBalance === BigInt(0);

  // Amount-exceeds-balance check (only for ICP escrows)
  const amountFloat = Number.parseFloat(amount) || 0;
  const amountExceedsBalance =
    !treasuryLoading &&
    currency === "ICP" &&
    amountFloat > 0 &&
    icpBalance > BigInt(0) &&
    amountFloat > icpBalanceFloat;

  const createMutation = useMutation({
    mutationFn: async ({
      input,
      milestoneInputs,
    }: {
      input: EscrowInput;
      milestoneInputs: EscrowMilestoneInput[];
    }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.createEscrow(tenantId, workspaceId, input);
      if (result.__kind__ === "err") throw new Error(result.err);
      const contract = result.ok;

      for (const ms of milestoneInputs) {
        const msResult = await actor.addEscrowMilestone(
          tenantId,
          workspaceId,
          contract.id,
          ms,
        );
        if (msResult.__kind__ === "err") throw new Error(msResult.err);
      }

      return contract;
    },
    onSuccess: (contract) => {
      queryClient.invalidateQueries({
        queryKey: ["escrows", tenantId, workspaceId],
      });
      toast.success("Escrow contract created");
      navigate({
        to: `/app/${workspaceId}/escrow/$escrowId`,
        params: { escrowId: contract.id },
      });
    },
    onError: (err: Error) => {
      // Surface backend error inline, not just in a toast
      const msg = err.message;
      setSubmitError(msg);
      toast.error(msg);
    },
  });

  const handleAddCondition = () =>
    setConditions((prev) => [...prev, newCondition()]);
  const handleRemoveCondition = (id: string) =>
    setConditions((prev) => prev.filter((c) => c.id !== id));
  const handleConditionChange = (id: string, value: string) =>
    setConditions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, text: value } : c)),
    );

  const handleAddMilestone = () =>
    setMilestones((prev) => [...prev, newMilestone()]);
  const handleRemoveMilestone = (id: string) =>
    setMilestones((prev) => prev.filter((m) => m.id !== id));
  const handleMilestoneChange = (
    id: string,
    field: keyof Omit<MilestoneItem, "id">,
    value: string,
  ) =>
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    );

  const totalMilestoneAmount = milestones.reduce((sum, m) => {
    const val = Number.parseFloat(m.amount);
    return sum + (Number.isNaN(val) ? 0 : val);
  }, 0);
  const contractAmount = Number.parseFloat(amount) || 0;
  const milestoneAmountMismatch =
    milestones.length > 0 &&
    contractAmount > 0 &&
    Math.abs(totalMilestoneAmount - contractAmount) > 0.01;

  const isSubmitDisabled =
    createMutation.isPending ||
    !title.trim() ||
    !amount ||
    !payeeId.trim() ||
    hasNoFunds ||
    amountExceedsBalance;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!title.trim() || !amount || !payeeId.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    const amountVal = Math.round(Number.parseFloat(amount) * 100);
    if (Number.isNaN(amountVal) || amountVal <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const validMilestones = milestones.filter(
      (m) => m.title.trim().length > 0 && Number.parseFloat(m.amount) > 0,
    );
    if (milestones.length > 0 && validMilestones.length !== milestones.length) {
      toast.error("All milestones must have a title and amount");
      return;
    }

    const { Principal } = await import("@icp-sdk/core/principal");
    let payeePrincipal: UserId;
    try {
      payeePrincipal = Principal.fromText(payeeId.trim());
    } catch {
      toast.error("Invalid principal ID");
      return;
    }

    const input: EscrowInput = {
      title: title.trim(),
      description: description.trim(),
      amount: BigInt(amountVal),
      currency,
      payeeId: payeePrincipal,
      conditions: conditions
        .filter((c) => c.text.trim().length > 0)
        .map((c) => c.text),
      dueDate: dueDate
        ? BigInt(new Date(dueDate).getTime() * 1_000_000)
        : undefined,
      crossLinks,
    };

    const milestoneInputs: EscrowMilestoneInput[] = validMilestones.map(
      (m) => ({
        title: m.title.trim(),
        description: m.description.trim(),
        amount: BigInt(Math.round(Number.parseFloat(m.amount) * 100)),
      }),
    );

    createMutation.mutate({ input, milestoneInputs });
  };

  const goFundWallet = () => navigate({ to: `/app/${workspaceId}/wallet` });

  return (
    <div className="animate-fade-in-up p-6 md:p-8 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate({ to: `/app/${workspaceId}/escrow` })}
          aria-label="Back to escrow"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card hover:bg-muted transition-smooth"
        >
          <ArrowLeft className="h-4 w-4 text-muted-foreground" />
        </button>
        <div>
          <h1 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
            <Shield className="h-5 w-5 text-amber-500" />
            New Escrow Contract
          </h1>
          <p className="text-sm text-muted-foreground">
            Create a secure on-chain agreement between parties
          </p>
        </div>
      </div>

      {/* Treasury balance chip */}
      {!treasuryLoading && treasury && (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 w-fit">
          <Wallet className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            Workspace Treasury:
          </span>
          <span
            className={`text-xs font-semibold tabular-nums ${
              icpBalance === BigInt(0) ? "text-destructive" : "text-foreground"
            }`}
          >
            {formatIcp(icpBalance)} ICP
          </span>
        </div>
      )}

      {/* No-funds banner */}
      {hasNoFunds && <InsufficientFundsBanner onFundWallet={goFundWallet} />}

      {/* Submit error (e.g. backend returns Insufficient treasury balance) */}
      {submitError && !hasNoFunds && (
        <InsufficientFundsBanner
          onFundWallet={goFundWallet}
          balanceText={
            submitError.toLowerCase().includes("insufficient")
              ? formatIcp(icpBalance)
              : undefined
          }
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-foreground">
              Contract Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                data-ocid="escrow-title"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                data-ocid="escrow-description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="amount">
                  Amount <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setSubmitError(null);
                  }}
                  data-ocid="escrow-amount"
                  required
                />
                {/* Amount exceeds balance inline error */}
                {amountExceedsBalance && (
                  <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                    <AlertTriangle className="h-3 w-3" />
                    Amount exceeds workspace treasury balance (
                    {formatIcp(icpBalance)} ICP available)
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="currency">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger id="currency" data-ocid="escrow-currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="payeeId">
                Payee Principal ID <span className="text-destructive">*</span>
              </Label>
              <Input
                id="payeeId"
                placeholder="xxxxx-xxxxx-xxxxx-xxxxx-xxx"
                value={payeeId}
                onChange={(e) => setPayeeId(e.target.value)}
                data-ocid="escrow-payee"
                className="font-mono text-sm"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                data-ocid="escrow-due-date"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
          </CardContent>
        </Card>

        {/* Milestones */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Layers className="h-4 w-4 text-amber-500" />
                Milestones{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  (optional)
                </span>
              </CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddMilestone}
                data-ocid="escrow-add-milestone"
                className="h-7 text-xs gap-1"
              >
                <Plus className="h-3 w-3" />
                Add Milestone
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {milestones.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border py-8 text-center">
                <Layers className="mx-auto h-7 w-7 text-muted-foreground/40 mb-2" />
                <p className="text-xs text-muted-foreground">
                  No milestones — funds release in one payment
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleAddMilestone}
                  className="mt-2 text-xs text-amber-600 hover:text-amber-700 h-7"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add first milestone
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {milestones.map((ms, idx) => (
                  <div
                    key={ms.id}
                    className="rounded-xl border border-border bg-muted/20 p-4 space-y-3"
                    data-ocid={`milestone-item-${ms.id}`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-foreground">
                        Milestone {idx + 1}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleRemoveMilestone(ms.id)}
                        aria-label={`Remove milestone ${idx + 1}`}
                        className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-destructive/10 hover:text-destructive transition-smooth"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label
                          htmlFor={`ms-title-${ms.id}`}
                          className="text-xs"
                        >
                          Title *
                        </Label>
                        <Input
                          id={`ms-title-${ms.id}`}
                          value={ms.title}
                          onChange={(e) =>
                            handleMilestoneChange(
                              ms.id,
                              "title",
                              e.target.value,
                            )
                          }
                          data-ocid={`ms-title-${ms.id}`}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label
                          htmlFor={`ms-amount-${ms.id}`}
                          className="text-xs"
                        >
                          Amount ({currency}) *
                        </Label>
                        <Input
                          id={`ms-amount-${ms.id}`}
                          type="number"
                          min="0.01"
                          step="0.01"
                          placeholder="0.00"
                          value={ms.amount}
                          onChange={(e) =>
                            handleMilestoneChange(
                              ms.id,
                              "amount",
                              e.target.value,
                            )
                          }
                          data-ocid={`ms-amount-${ms.id}`}
                          className="text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`ms-desc-${ms.id}`} className="text-xs">
                        Description
                      </Label>
                      <Input
                        id={`ms-desc-${ms.id}`}
                        value={ms.description}
                        onChange={(e) =>
                          handleMilestoneChange(
                            ms.id,
                            "description",
                            e.target.value,
                          )
                        }
                        data-ocid={`ms-desc-${ms.id}`}
                        className="text-sm"
                      />
                    </div>
                  </div>
                ))}

                {/* Milestone total vs contract amount */}
                <div
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium ${
                    milestoneAmountMismatch
                      ? "bg-destructive/10 border border-destructive/30 text-destructive"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <span>
                    Milestone total:{" "}
                    <strong>
                      {currency} {totalMilestoneAmount.toFixed(2)}
                    </strong>
                  </span>
                  {contractAmount > 0 && (
                    <span className="flex items-center gap-1">
                      {milestoneAmountMismatch ? (
                        "⚠ Doesn't match contract amount"
                      ) : (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                          Matches contract amount
                        </>
                      )}
                    </span>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Conditions */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-foreground">
                Release Conditions
              </CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddCondition}
                data-ocid="escrow-add-condition"
                className="h-7 text-xs gap-1"
              >
                <Plus className="h-3 w-3" />
                Add
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {conditions.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-2">
                No conditions added — funds release manually
              </p>
            ) : (
              conditions.map((cond, idx) => (
                <div key={cond.id} className="flex gap-2">
                  <Input
                    placeholder={`Condition ${idx + 1}`}
                    value={cond.text}
                    onChange={(e) =>
                      handleConditionChange(cond.id, e.target.value)
                    }
                    data-ocid={`escrow-condition-${cond.id}`}
                    className="text-sm"
                  />
                  {conditions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCondition(cond.id)}
                      aria-label={`Remove condition ${idx + 1}`}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md hover:bg-destructive/10 hover:text-destructive transition-smooth"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Cross-links */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-foreground">
              Cross-Links
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CrossLinkPicker
              tenantId={tenantId}
              value={crossLinks}
              onChange={setCrossLinks}
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: `/app/${workspaceId}/escrow` })}
            data-ocid="escrow-cancel-btn"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitDisabled}
            data-ocid="escrow-save-btn"
            className="bg-amber-500 hover:bg-amber-600 text-white min-w-[120px] disabled:opacity-60"
            title={
              hasNoFunds
                ? "Fund your workspace wallet before creating an escrow"
                : amountExceedsBalance
                  ? "Amount exceeds treasury balance"
                  : undefined
            }
          >
            {createMutation.isPending ? "Creating..." : "Create Escrow"}
          </Button>
        </div>
      </form>
    </div>
  );
}
