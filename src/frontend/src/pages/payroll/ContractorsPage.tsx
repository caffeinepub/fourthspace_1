import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  DollarSign,
  FileText,
  Plus,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId, useWorkspace } from "../../hooks/useWorkspace";
import type {
  Contractor,
  ContractorInput,
  ContractorPayment,
  ContractorPaymentInput,
} from "../../types";
import { ContractorPaymentReason, ContractorPaymentStatus } from "../../types";

const PAYMENT_REASON_LABELS: Record<ContractorPaymentReason, string> = {
  [ContractorPaymentReason.freelanceInvoice]: "Freelance Invoice",
  [ContractorPaymentReason.projectMilestone]: "Project Milestone",
  [ContractorPaymentReason.reimbursement]: "Reimbursement",
  [ContractorPaymentReason.other]: "Other",
};

function AddContractorForm({
  onClose,
  tenantId,
  workspaceId,
}: { onClose: () => void; tenantId: string; workspaceId: string }) {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    name: "",
    email: "",
    taxId: "",
    rate: "",
    currency: "USD",
  });

  const add = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const input: ContractorInput = {
        name: form.name.trim(),
        email: form.email.trim(),
        taxId: form.taxId.trim(),
        rate: Number.parseFloat(form.rate) * 100,
        currency: form.currency,
      };
      const res = await actor.addContractor(tenantId, workspaceId, input);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => {
      toast.success("Contractor added");
      queryClient.invalidateQueries({ queryKey: ["contractors"] });
      onClose();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const set =
    (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <Card
      className="shadow-card rounded-xl border border-emerald-500/20 bg-emerald-500/[0.02]"
      data-ocid="add-contractor-form"
    >
      <CardHeader className="pb-3 flex flex-row items-center justify-between border-b border-border/40">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Plus className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          Add Contractor
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="pt-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            add.mutate();
          }}
          className="grid gap-4 sm:grid-cols-2"
        >
          <div className="space-y-1.5">
            <Label htmlFor="con-name">Full Name</Label>
            <Input
              id="con-name"
              value={form.name}
              onChange={set("name")}
              placeholder="Alex Johnson"
              required
              data-ocid="con-name"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="con-email">Email</Label>
            <Input
              id="con-email"
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="alex@example.com"
              required
              data-ocid="con-email"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="con-taxId">Tax ID</Label>
            <Input
              id="con-taxId"
              value={form.taxId}
              onChange={set("taxId")}
              placeholder="EIN or SSN"
              data-ocid="con-taxid"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="con-currency">Currency</Label>
            <Input
              id="con-currency"
              value={form.currency}
              onChange={set("currency")}
              placeholder="USD"
              maxLength={3}
              data-ocid="con-currency"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="con-rate">Hourly Rate (USD)</Label>
            <Input
              id="con-rate"
              type="number"
              min="0"
              step="0.01"
              value={form.rate}
              onChange={set("rate")}
              placeholder="150.00"
              required
              data-ocid="con-rate"
            />
          </div>
          <div className="sm:col-span-2 flex gap-3 justify-end pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={add.isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white active-press"
              data-ocid="con-submit-btn"
            >
              {add.isPending ? "Saving…" : "Add Contractor"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function AddPaymentForm({
  contractorId,
  tenantId,
  workspaceId,
  onClose,
}: {
  contractorId: string;
  tenantId: string;
  workspaceId: string;
  onClose: () => void;
}) {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    amount: "",
    reason: ContractorPaymentReason.freelanceInvoice as string,
    paymentDate: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const add = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const input: ContractorPaymentInput = {
        contractorId,
        amount: Number.parseFloat(form.amount) * 100,
        reason: form.reason as ContractorPaymentReason,
        paymentDate: form.paymentDate,
        notes: form.notes.trim(),
      };
      const res = await actor.addContractorPayment(
        tenantId,
        workspaceId,
        input,
      );
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => {
      toast.success("Payment added");
      queryClient.invalidateQueries({
        queryKey: ["contractorPayments", contractorId],
      });
      onClose();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        add.mutate();
      }}
      className="grid gap-3 sm:grid-cols-2 pt-3 border-t border-border mt-3"
    >
      <div className="space-y-1.5">
        <Label htmlFor={`pay-amount-${contractorId}`}>Amount</Label>
        <Input
          id={`pay-amount-${contractorId}`}
          type="number"
          min="0"
          step="0.01"
          value={form.amount}
          onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
          placeholder="500.00"
          required
          data-ocid="cpay-amount"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`pay-reason-${contractorId}`}>Reason</Label>
        <select
          id={`pay-reason-${contractorId}`}
          value={form.reason}
          onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))}
          data-ocid="cpay-reason"
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {Object.entries(PAYMENT_REASON_LABELS).map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`pay-date-${contractorId}`}>Payment Date</Label>
        <Input
          id={`pay-date-${contractorId}`}
          type="date"
          value={form.paymentDate}
          onChange={(e) =>
            setForm((p) => ({ ...p, paymentDate: e.target.value }))
          }
          required
          data-ocid="cpay-date"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor={`pay-notes-${contractorId}`}>Notes</Label>
        <Input
          id={`pay-notes-${contractorId}`}
          value={form.notes}
          onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
          placeholder="Invoice #123"
          data-ocid="cpay-notes"
        />
      </div>
      <div className="sm:col-span-2 flex gap-2 justify-end">
        <Button type="button" variant="outline" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={add.isPending}
          className="bg-emerald-600 hover:bg-emerald-700 text-white active-press"
          data-ocid="cpay-submit-btn"
        >
          {add.isPending ? "Saving…" : "Add Payment"}
        </Button>
      </div>
    </form>
  );
}

function ContractorCard({
  contractor,
  tenantId,
  workspaceId,
}: { contractor: Contractor; tenantId: string; workspaceId: string }) {
  const { actor, isFetching } = useBackend();
  const [expanded, setExpanded] = useState(false);
  const [showPayForm, setShowPayForm] = useState(false);

  const { data: payments = [], isLoading } = useQuery<ContractorPayment[]>({
    queryKey: ["contractorPayments", contractor.id],
    queryFn: async () =>
      actor
        ? actor.listContractorPayments(tenantId, workspaceId, contractor.id)
        : [],
    enabled: !!actor && !isFetching && expanded,
  });

  const totalPaid = payments
    .filter((p) => p.status === ContractorPaymentStatus.processed)
    .reduce((s, p) => s + p.amount, 0);

  return (
    <div
      className="rounded-xl border border-border/50 bg-card shadow-card hover:border-emerald-400/30 transition-all"
      data-ocid={`contractor-card-${contractor.id}`}
    >
      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 font-bold text-emerald-600 dark:text-emerald-400">
              {contractor.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-foreground truncate">
                  {contractor.name}
                </p>
                <span className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold border bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20">
                  1099
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {contractor.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-muted-foreground">Rate</p>
              <p className="text-sm font-semibold font-mono tabular-nums text-foreground">
                $
                {(contractor.rate / 100).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
                /hr
              </p>
            </div>
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${contractor.isActive ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20" : "bg-muted text-muted-foreground border-border"}`}
            >
              {contractor.isActive ? "Active" : "Inactive"}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setExpanded((v) => !v)}
              aria-label="Toggle payments"
              data-ocid={`contractor-expand-${contractor.id}`}
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 border-t border-border/40 pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                Invoice History
                {totalPaid > 0 && (
                  <span className="text-xs text-muted-foreground font-normal ml-1">
                    ($
                    {(totalPaid / 100).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    total)
                  </span>
                )}
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowPayForm((v) => !v)}
                data-ocid={`add-payment-${contractor.id}`}
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Payment
              </Button>
            </div>

            {showPayForm && (
              <AddPaymentForm
                contractorId={contractor.id}
                tenantId={tenantId}
                workspaceId={workspaceId}
                onClose={() => setShowPayForm(false)}
              />
            )}

            {isLoading ? (
              <div className="space-y-2">
                {[1, 2].map((n) => (
                  <Skeleton key={n} className="h-10 rounded-lg" />
                ))}
              </div>
            ) : payments.length === 0 ? (
              <p
                className="text-xs text-muted-foreground text-center py-4"
                data-ocid={`contractor-payments-empty-${contractor.id}`}
              >
                No payments yet
              </p>
            ) : (
              <div className="space-y-1.5">
                {[...payments]
                  .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
                  .map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between text-sm py-2 border-b border-border/40 last:border-0"
                      data-ocid={`contractor-payment-${p.id}`}
                    >
                      <div>
                        <p className="font-medium text-foreground">
                          {PAYMENT_REASON_LABELS[p.reason] ?? p.reason}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {p.paymentDate}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold tabular-nums text-foreground">
                          $
                          {(p.amount / 100).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium border ${p.status === ContractorPaymentStatus.processed ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20" : "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20"}`}
                        >
                          {p.status}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ContractorsPage() {
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const [showForm, setShowForm] = useState(false);

  const { data: contractors = [], isLoading } = useQuery<Contractor[]>({
    queryKey: ["contractors", tenantId, workspaceId],
    queryFn: async () =>
      actor ? actor.listContractors(tenantId, workspaceId) : [],
    enabled: !!actor && !isFetching && !!workspaceId,
  });

  return (
    <div className="animate-fade-in-up p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 flex-wrap justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild aria-label="Back">
            <Link to={`/app/${workspaceId}/payroll`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Contractors
            </h1>
            <p className="text-sm text-muted-foreground">
              {isLoading
                ? "Loading…"
                : `${contractors.length} contractor${contractors.length !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>
        <Button
          onClick={() => setShowForm((v) => !v)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white active-press"
          data-ocid="add-contractor-btn"
        >
          {showForm ? (
            <>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Add Contractor
            </>
          )}
        </Button>
      </div>

      {showForm && (
        <AddContractorForm
          onClose={() => setShowForm(false)}
          tenantId={tenantId}
          workspaceId={workspaceId}
        />
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <Skeleton key={n} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : contractors.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-20 text-center"
          data-ocid="contractors-empty"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 mb-4">
            <FileText className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="font-display font-semibold text-foreground">
            No contractors yet
          </h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-xs">
            Add contractors to manage freelancer and consultant payments
            separately from employees.
          </p>
          <Button
            className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white active-press"
            onClick={() => setShowForm(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add First Contractor
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {contractors.map((c) => (
            <ContractorCard
              key={c.id}
              contractor={c}
              tenantId={tenantId}
              workspaceId={workspaceId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
