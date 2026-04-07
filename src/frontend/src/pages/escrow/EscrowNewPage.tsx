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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Plus, Shield, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { CrossLinkPicker } from "../../components/CrossLinkPicker";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId } from "../../hooks/useWorkspace";
import type { CrossLink, EscrowInput, UserId } from "../../types";

const CURRENCIES = ["USD", "ICP", "BTC"];

interface ConditionItem {
  id: string;
  text: string;
}

let conditionCounter = 0;
function newCondition(text = ""): ConditionItem {
  conditionCounter += 1;
  return { id: `cond-${conditionCounter}`, text };
}

export default function EscrowNewPage() {
  const { actor } = useBackend();
  const tenantId = getTenantId();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [payeeId, setPayeeId] = useState("");
  const [conditions, setConditions] = useState<ConditionItem[]>([
    newCondition(),
  ]);
  const [dueDate, setDueDate] = useState("");
  const [crossLinks, setCrossLinks] = useState<CrossLink[]>([]);

  const createMutation = useMutation({
    mutationFn: async (input: EscrowInput) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.createEscrow(tenantId, input);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (contract) => {
      queryClient.invalidateQueries({ queryKey: ["escrows", tenantId] });
      toast.success("Escrow contract created");
      navigate({
        to: "/app/escrow/$contractId",
        params: { contractId: contract.id },
      });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleAddCondition = () =>
    setConditions((prev) => [...prev, newCondition()]);
  const handleRemoveCondition = (id: string) =>
    setConditions((prev) => prev.filter((c) => c.id !== id));
  const handleConditionChange = (id: string, value: string) =>
    setConditions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, text: value } : c)),
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount || !payeeId.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    const amountVal = Math.round(Number.parseFloat(amount) * 100);
    if (Number.isNaN(amountVal) || amountVal <= 0) {
      toast.error("Please enter a valid amount");
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
    createMutation.mutate(input);
  };

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate({ to: "/app/escrow" })}
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
            Create a secure agreement between parties
          </p>
        </div>
      </div>

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
                placeholder="e.g. Website Development Contract"
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
                placeholder="Describe the contract terms and deliverables..."
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
                  onChange={(e) => setAmount(e.target.value)}
                  data-ocid="escrow-amount"
                  required
                />
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
                    placeholder={`Condition ${idx + 1}: e.g. Milestone delivered and approved`}
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
            onClick={() => navigate({ to: "/app/escrow" })}
            data-ocid="escrow-cancel-btn"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              createMutation.isPending ||
              !title.trim() ||
              !amount ||
              !payeeId.trim()
            }
            data-ocid="escrow-save-btn"
            className="bg-amber-500 hover:bg-amber-600 text-white min-w-[120px]"
          >
            {createMutation.isPending ? "Creating..." : "Create Escrow"}
          </Button>
        </div>
      </form>
    </div>
  );
}
