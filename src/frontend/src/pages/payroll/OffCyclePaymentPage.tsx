import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  CalendarClock,
  DollarSign,
  Plus,
  RefreshCw,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId, useWorkspace } from "../../hooks/useWorkspace";
import { OffCycleReason } from "../../types";
import type {
  Employee,
  OffCyclePayment,
  OffCyclePaymentInput,
} from "../../types";

function formatCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(amount / 100);
}

const REASON_LABELS: Record<OffCycleReason, string> = {
  [OffCycleReason.bonus]: "Bonus",
  [OffCycleReason.reimbursement]: "Reimbursement",
  [OffCycleReason.adjustment]: "Adjustment",
};

const REASON_COLORS: Record<OffCycleReason, string> = {
  [OffCycleReason.bonus]:
    "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20",
  [OffCycleReason.reimbursement]:
    "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20",
  [OffCycleReason.adjustment]:
    "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/20",
};

export default function OffCyclePaymentPage() {
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    employeeId: "",
    amount: "",
    reason: OffCycleReason.bonus as string,
    processImmediately: false,
    notes: "",
  });

  const { data: employees = [], isLoading: empLoading } = useQuery<Employee[]>({
    queryKey: ["employees", tenantId, workspaceId],
    queryFn: async () =>
      actor ? actor.listEmployees(tenantId, workspaceId) : [],
    enabled: !!actor && !isFetching && !!workspaceId,
  });

  const { data: payments = [], isLoading: payLoading } = useQuery<
    OffCyclePayment[]
  >({
    queryKey: ["offCyclePayments", tenantId, workspaceId],
    queryFn: async () =>
      actor ? actor.listOffCyclePayments(tenantId, workspaceId, null) : [],
    enabled: !!actor && !isFetching && !!workspaceId,
  });

  const activeEmployees = employees.filter((e) => e.isActive);

  const addPayment = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const input: OffCyclePaymentInput = {
        employeeId: form.employeeId,
        amount: Number.parseFloat(form.amount) * 100,
        reason: form.reason as OffCycleReason,
        processImmediately: form.processImmediately,
        notes: form.notes.trim(),
      };
      const res = await actor.addOffCyclePayment(tenantId, workspaceId, input);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => {
      toast.success("Off-cycle payment added");
      queryClient.invalidateQueries({ queryKey: ["offCyclePayments"] });
      setShowForm(false);
      setForm({
        employeeId: "",
        amount: "",
        reason: OffCycleReason.bonus,
        processImmediately: false,
        notes: "",
      });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const employeeMap = new Map(employees.map((e) => [e.id, e]));

  return (
    <div className="animate-fade-in-up p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild aria-label="Back">
            <Link to={`/app/${workspaceId}/payroll`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Off-Cycle Payments
            </h1>
            <p className="text-sm text-muted-foreground">
              Bonuses, reimbursements, and manual adjustments
            </p>
          </div>
        </div>
        <Button
          onClick={() => setShowForm((v) => !v)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white active-press"
          data-ocid="add-off-cycle-btn"
        >
          {showForm ? (
            <>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              New Payment
            </>
          )}
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card
          className="shadow-card rounded-xl border border-emerald-500/20 bg-emerald-500/[0.02]"
          data-ocid="off-cycle-form"
        >
          <CardHeader className="pb-3 flex flex-row items-center justify-between border-b border-border/40">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              New Off-Cycle Payment
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowForm(false)}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="pt-5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addPayment.mutate();
              }}
              className="space-y-5"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="oc-employee">Employee</Label>
                  <select
                    id="oc-employee"
                    value={form.employeeId}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, employeeId: e.target.value }))
                    }
                    required
                    data-ocid="oc-employee"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Select employee…</option>
                    {activeEmployees.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.firstName} {e.lastName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="oc-amount">Amount (USD)</Label>
                  {/* Large mono display for amount */}
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      $
                    </span>
                    <Input
                      id="oc-amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.amount}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, amount: e.target.value }))
                      }
                      placeholder="0.00"
                      required
                      data-ocid="oc-amount"
                      className="pl-7 font-mono text-xl font-bold tabular-nums h-12"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="oc-reason">Reason</Label>
                  <select
                    id="oc-reason"
                    value={form.reason}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, reason: e.target.value }))
                    }
                    data-ocid="oc-reason"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring h-12"
                  >
                    {Object.entries(REASON_LABELS).map(([v, l]) => (
                      <option key={v} value={v}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="oc-notes">Notes</Label>
                  <Textarea
                    id="oc-notes"
                    value={form.notes}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, notes: e.target.value }))
                    }
                    placeholder="e.g. Q4 performance bonus"
                    rows={2}
                    data-ocid="oc-notes"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  id="oc-immediate"
                  checked={form.processImmediately}
                  onCheckedChange={(v) =>
                    setForm((p) => ({ ...p, processImmediately: v }))
                  }
                  data-ocid="oc-immediate-toggle"
                />
                <Label htmlFor="oc-immediate" className="cursor-pointer">
                  Process immediately (instead of next scheduled run)
                </Label>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={addPayment.isPending || !form.employeeId}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white active-press"
                  data-ocid="oc-submit-btn"
                >
                  {addPayment.isPending ? "Submitting…" : "Submit Payment"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Payment List */}
      <Card
        className="shadow-card rounded-xl border border-border/50 bg-card"
        data-ocid="off-cycle-list"
      >
        <CardHeader className="pb-3 border-b border-border/40">
          <CardTitle className="text-sm font-semibold">
            Pending Off-Cycle Payments
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {payLoading || empLoading ? (
            <div className="space-y-3 p-4">
              {[1, 2, 3].map((n) => (
                <Skeleton key={n} className="h-14 rounded-xl" />
              ))}
            </div>
          ) : payments.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-12 text-center"
              data-ocid="off-cycle-empty"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 mb-3">
                <CalendarClock className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-sm font-medium text-foreground">
                No off-cycle payments yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Click "New Payment" to add a bonus or reimbursement.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/40 bg-muted/30">
                    <th className="px-5 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-5 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                      Reason
                    </th>
                    <th className="px-5 py-2.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-5 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                      Timing
                    </th>
                    <th className="px-5 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {[...payments]
                    .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
                    .map((p) => {
                      const emp = employeeMap.get(p.employeeId);
                      return (
                        <tr
                          key={p.id}
                          className="hover:bg-muted/50 transition-colors"
                          data-ocid={`off-cycle-row-${p.id}`}
                        >
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-xs font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                                {emp
                                  ? `${emp.firstName[0]}${emp.lastName[0]}`
                                  : "?"}
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-foreground truncate max-w-[120px]">
                                  {emp
                                    ? `${emp.firstName} ${emp.lastName}`
                                    : "—"}
                                </p>
                                {p.notes && (
                                  <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                                    {p.notes}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3 hidden sm:table-cell">
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${REASON_COLORS[p.reason] ?? "bg-muted text-muted-foreground border-border"}`}
                            >
                              {REASON_LABELS[p.reason] ?? p.reason}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-right">
                            <span className="font-mono tabular-nums font-bold text-xl text-foreground flex items-center justify-end gap-1">
                              <DollarSign className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                              {formatCurrency(p.amount)}
                            </span>
                          </td>
                          <td className="px-5 py-3 hidden md:table-cell">
                            <span className="text-xs text-muted-foreground">
                              {p.processImmediately ? "Immediate" : "Next run"}
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border bg-muted text-muted-foreground border-border capitalize">
                              {p.status ?? "pending"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
