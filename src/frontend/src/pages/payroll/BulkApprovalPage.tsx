import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  CheckSquare,
  Clock,
  DollarSign,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId, useWorkspace } from "../../hooks/useWorkspace";
import { PayrollStatus } from "../../types";
import type { Employee, PayrollRecord } from "../../types";

function formatCurrency(amount: bigint | number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(Number(amount) / 100);
}

export default function BulkApprovalPage() {
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const { data: records = [], isLoading: recLoading } = useQuery<
    PayrollRecord[]
  >({
    queryKey: ["payrollRecords", tenantId, workspaceId, null],
    queryFn: async () =>
      actor ? actor.listPayrollRecords(tenantId, workspaceId, null) : [],
    enabled: !!actor && !isFetching && !!workspaceId,
  });

  const { data: employees = [], isLoading: empLoading } = useQuery<Employee[]>({
    queryKey: ["employees", tenantId, workspaceId],
    queryFn: async () =>
      actor ? actor.listEmployees(tenantId, workspaceId) : [],
    enabled: !!actor && !isFetching && !!workspaceId,
  });

  const pending = records.filter(
    (r) => r.status === PayrollStatus.PendingApproval,
  );
  const approved = records.filter((r) => r.status === PayrollStatus.Approved);
  const rejected = records.filter((r) => r.status === PayrollStatus.Rejected);
  const employeeMap = new Map(employees.map((e) => [e.id, e]));

  const bulkApprove = useMutation({
    mutationFn: async (ids: string[]) => {
      if (!actor) throw new Error("Not connected");
      const res = await actor.bulkApprovePayroll(tenantId, workspaceId, ids);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => {
      toast.success("Selected payroll records approved");
      queryClient.invalidateQueries({ queryKey: ["payrollRecords"] });
      setSelected(new Set());
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const rejectRecord = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      if (!actor) throw new Error("Not connected");
      const res = await actor.rejectPayrollRecord(
        tenantId,
        workspaceId,
        id,
        reason,
      );
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => {
      toast.success("Record rejected");
      queryClient.invalidateQueries({ queryKey: ["payrollRecords"] });
      setRejectId(null);
      setRejectReason("");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => setSelected(new Set(pending.map((r) => r.id)));
  const isLoading = recLoading || empLoading;

  // Total for selected records
  const selectedTotal = pending
    .filter((r) => selected.has(r.id))
    .reduce((sum, r) => sum + Number(r.netAmount ?? r.amount), 0);

  return (
    <div className="animate-fade-in-up p-6 space-y-6 max-w-5xl mx-auto">
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
              Bulk Approval
            </h1>
            <p className="text-sm text-muted-foreground">
              {isLoading
                ? "Loading…"
                : `${pending.length} pending · ${approved.length} approved · ${rejected.length} rejected`}
            </p>
          </div>
        </div>
      </div>

      {/* Summary stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Pending Approval",
            count: pending.length,
            icon: Clock,
            color: "text-amber-600 dark:text-amber-400",
            bg: "bg-amber-500/10",
          },
          {
            label: "Approved",
            count: approved.length,
            icon: CheckCircle2,
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-500/10",
          },
          {
            label: "Rejected",
            count: rejected.length,
            icon: XCircle,
            color: "text-red-600 dark:text-red-400",
            bg: "bg-red-500/10",
          },
        ].map(({ label, count, icon: Icon, color, bg }) => (
          <Card
            key={label}
            className="shadow-card rounded-xl border border-border/50 bg-card"
          >
            <CardContent className="p-5 flex items-center gap-4">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bg}`}
              >
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {label}
                </p>
                <p className="text-2xl font-bold font-mono tabular-nums text-foreground">
                  {isLoading ? "—" : count}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending Table */}
      <Card
        className="shadow-card rounded-xl border border-border/50 bg-card"
        data-ocid="bulk-approval-card"
      >
        <CardHeader className="pb-3 flex flex-row items-center justify-between border-b border-border/40">
          <CardTitle className="text-sm font-semibold">
            Pending Approvals
          </CardTitle>
          {pending.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={selectAll}
                disabled={selected.size === pending.length}
                data-ocid="bulk-select-all"
              >
                <CheckSquare className="mr-1.5 h-3.5 w-3.5" />
                Select All
              </Button>
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white active-press"
                disabled={selected.size === 0 || bulkApprove.isPending}
                onClick={() => bulkApprove.mutate(Array.from(selected))}
                data-ocid="bulk-approve-btn"
              >
                {bulkApprove.isPending
                  ? "Approving…"
                  : `Approve ${selected.size > 0 ? `(${selected.size})` : "Selected"}`}
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-3 p-4">
              {[1, 2, 3].map((n) => (
                <Skeleton key={n} className="h-14 rounded-xl" />
              ))}
            </div>
          ) : pending.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-12 text-center"
              data-ocid="bulk-empty"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 mb-3">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-sm font-medium text-foreground">
                All caught up!
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                No payroll records awaiting approval.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/40 bg-muted/30">
                      <th
                        className="px-4 py-2.5 text-left w-8"
                        aria-label="Select"
                      />
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Employee
                      </th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                        Period
                      </th>
                      <th className="px-4 py-2.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Gross
                      </th>
                      <th className="px-4 py-2.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                        Deductions
                      </th>
                      <th className="px-4 py-2.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Net
                      </th>
                      <th className="px-4 py-2.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {pending.map((record) => {
                      const emp = employeeMap.get(record.employeeId);
                      const deductions =
                        Number(record.amount) -
                        Number(record.netAmount ?? record.amount);
                      return (
                        <tr
                          key={record.id}
                          className={`transition-colors ${selected.has(record.id) ? "bg-emerald-500/5" : "hover:bg-muted/50"}`}
                          data-ocid={`approval-row-${record.id}`}
                        >
                          <td className="py-3 px-4">
                            <input
                              type="checkbox"
                              checked={selected.has(record.id)}
                              onChange={() => toggleSelect(record.id)}
                              className="h-4 w-4 rounded border-input"
                              aria-label={`Select record for ${emp?.firstName}`}
                              data-ocid={`approval-check-${record.id}`}
                            />
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-xs font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                                {emp
                                  ? `${emp.firstName[0]}${emp.lastName[0]}`
                                  : "?"}
                              </div>
                              <span className="font-medium text-foreground truncate max-w-[120px]">
                                {emp
                                  ? `${emp.firstName} ${emp.lastName}`
                                  : record.employeeId.slice(0, 8)}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">
                            {record.period}
                          </td>
                          <td className="py-3 px-4 text-right font-mono tabular-nums font-medium text-foreground">
                            {formatCurrency(record.amount, record.currency)}
                          </td>
                          <td className="py-3 px-4 text-right font-mono tabular-nums text-muted-foreground hidden md:table-cell">
                            {deductions !== 0
                              ? `-${formatCurrency(Math.abs(deductions), record.currency)}`
                              : "—"}
                          </td>
                          <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-foreground">
                            {formatCurrency(
                              record.netAmount ?? record.amount,
                              record.currency,
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {rejectId === record.id ? (
                              <div className="flex items-center gap-2 justify-end flex-wrap">
                                <Input
                                  value={rejectReason}
                                  onChange={(e) =>
                                    setRejectReason(e.target.value)
                                  }
                                  placeholder="Rejection reason"
                                  className="h-7 text-xs w-32"
                                  data-ocid={`reject-reason-${record.id}`}
                                />
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="h-7 text-xs px-2"
                                  disabled={rejectRecord.isPending}
                                  onClick={() =>
                                    rejectRecord.mutate({
                                      id: record.id,
                                      reason: rejectReason,
                                    })
                                  }
                                  data-ocid={`confirm-reject-${record.id}`}
                                >
                                  Confirm
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 text-xs px-2"
                                  onClick={() => setRejectId(null)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                                onClick={() => {
                                  setRejectId(record.id);
                                  setRejectReason("");
                                }}
                                data-ocid={`reject-btn-${record.id}`}
                              >
                                <XCircle className="mr-1 h-3 w-3" /> Reject
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {/* Total footer */}
              {selected.size > 0 && (
                <div className="border-t border-border/40 bg-muted/20 px-5 py-3 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {selected.size} record{selected.size !== 1 ? "s" : ""}{" "}
                    selected
                  </span>
                  <span className="text-sm font-semibold font-mono tabular-nums text-foreground">
                    Total net: {formatCurrency(selectedTotal)}
                  </span>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Recent Decisions */}
      {(approved.length > 0 || rejected.length > 0) && (
        <Card className="shadow-card rounded-xl border border-border/50 bg-card">
          <CardHeader className="pb-3 border-b border-border/40">
            <CardTitle className="text-sm font-semibold">
              Recent Decisions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/40 bg-muted/30">
                    <th className="px-5 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-5 py-2.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                      Period
                    </th>
                    <th className="px-5 py-2.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-5 py-2.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Decision
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {[...approved, ...rejected]
                    .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
                    .slice(0, 10)
                    .map((record) => {
                      const emp = employeeMap.get(record.employeeId);
                      return (
                        <tr
                          key={record.id}
                          className="hover:bg-muted/50 transition-colors"
                          data-ocid={`decision-row-${record.id}`}
                        >
                          <td className="px-5 py-3 font-medium text-foreground">
                            {emp ? `${emp.firstName} ${emp.lastName}` : "—"}
                          </td>
                          <td className="px-5 py-3 text-muted-foreground hidden sm:table-cell">
                            {record.period}
                          </td>
                          <td className="px-5 py-3 text-right font-mono tabular-nums font-medium text-foreground">
                            {formatCurrency(record.amount, record.currency)}
                          </td>
                          <td className="px-5 py-3 text-right">
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${record.status === PayrollStatus.Approved ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20" : "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/20"}`}
                            >
                              <DollarSign className="h-3 w-3 mr-1" />
                              {record.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
