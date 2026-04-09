import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { useWorkspace } from "../../hooks/useWorkspace";
import type { PayrollRecord, WalletAccount } from "../../types";
import { PayrollStatus } from "../../types";

function formatICP(e8s: bigint): string {
  return `${(Number(e8s) / 1e8).toFixed(4)} ICP`;
}

export default function BulkApprovalPage() {
  const { workspaceId } = useParams({ strict: false }) as {
    workspaceId: string;
  };
  const { tenantId } = useWorkspace();
  const { actor, isFetching } = useBackend();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const { data: treasury, isLoading: loadingTreasury } =
    useQuery<WalletAccount | null>({
      queryKey: ["treasury", tenantId, workspaceId],
      queryFn: async () => {
        if (!actor) return null;
        return actor.getWorkspaceTreasury(tenantId, workspaceId);
      },
      enabled: !!actor && !isFetching && !!workspaceId,
    });

  const { data: records = [], isLoading: loadingRecords } = useQuery<
    PayrollRecord[]
  >({
    queryKey: ["payroll", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listPayrollRecords(tenantId, workspaceId, null);
    },
    enabled: !!actor && !isFetching && !!workspaceId,
  });

  const pending = records.filter(
    (r) => r.status === PayrollStatus.PendingApproval,
  );
  const hasTreasuryBalance = treasury != null && treasury.icpBalance > 0n;

  const selectedTotal = pending
    .filter((r) => selected.has(r.id))
    .reduce((sum, r) => sum + (r.amount ?? 0n), 0n);

  function toggleAll() {
    if (selected.size === pending.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(pending.map((r) => r.id)));
    }
  }

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const bulkApproveMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const ids = Array.from(selected);
      const r = await actor.bulkApprovePayroll(tenantId, workspaceId, ids);
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      toast.success(`Approved ${selected.size} payroll records`);
      setSelected(new Set());
      void queryClient.invalidateQueries({ queryKey: ["payroll"] });
      void queryClient.invalidateQueries({ queryKey: ["treasury"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.rejectPayrollRecord(
        tenantId,
        workspaceId,
        id,
        reason,
      );
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      toast.success("Payroll record rejected");
      void queryClient.invalidateQueries({ queryKey: ["payroll"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const canApprove =
    selected.size > 0 && hasTreasuryBalance && !bulkApproveMutation.isPending;

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: `/app/${workspaceId}/payroll` as "/" })}
          data-ocid="bulk-approval-back"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold font-display text-foreground">
              Bulk Approval
            </h1>
            <p className="text-sm text-muted-foreground">
              {pending.length} record{pending.length !== 1 ? "s" : ""} pending
              approval
            </p>
          </div>
        </div>
      </div>

      {/* Treasury balance */}
      {loadingTreasury ? (
        <Skeleton className="h-14 w-full rounded-lg" />
      ) : !hasTreasuryBalance ? (
        <div
          data-ocid="bulk-approval-balance-warning"
          className="flex items-start gap-3 p-4 rounded-lg border border-destructive/30 bg-destructive/5"
        >
          <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-destructive">
              Insufficient treasury balance
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Insufficient treasury balance. Please fund the workspace treasury
              before processing payroll.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              navigate({ to: `/app/${workspaceId}/wallet` as "/" })
            }
            data-ocid="bulk-fund-treasury-btn"
            className="shrink-0 gap-1.5"
          >
            <Wallet className="w-3.5 h-3.5" />
            Fund Treasury
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Wallet className="w-4 h-4 text-primary" />
            Treasury:{" "}
            <span className="font-medium text-foreground">
              {formatICP(treasury.icpBalance)}
            </span>
          </p>
          {selected.size > 0 && (
            <p className="text-sm text-muted-foreground">
              Selected total:{" "}
              <span className="font-medium text-foreground">
                {formatICP(selectedTotal)}
              </span>
            </p>
          )}
        </div>
      )}

      {/* Action bar */}
      {pending.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Checkbox
              id="select-all"
              data-ocid="bulk-select-all"
              checked={selected.size === pending.length && pending.length > 0}
              onCheckedChange={toggleAll}
            />
            <label
              htmlFor="select-all"
              className="text-sm text-muted-foreground cursor-pointer"
            >
              Select all ({pending.length})
            </label>
          </div>
          <div className="flex gap-2 ml-auto">
            <Button
              data-ocid="bulk-approve-btn"
              disabled={!canApprove}
              onClick={() => bulkApproveMutation.mutate()}
              className="gap-1.5"
              size="sm"
            >
              {bulkApproveMutation.isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Approving…
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Approve ({selected.size})
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Records list */}
      {loadingRecords ? (
        <div className="flex flex-col gap-2">
          {(["a", "b", "c"] as const).map((k) => (
            <Skeleton key={k} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      ) : pending.length === 0 ? (
        <div
          data-ocid="bulk-empty-state"
          className="flex flex-col items-center justify-center py-16 gap-3 text-center rounded-lg border border-dashed border-border"
        >
          <CheckCircle2 className="w-10 h-10 text-muted-foreground" />
          <div>
            <p className="font-medium text-foreground font-display">
              All caught up
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              No payroll records pending approval.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {pending.map((record) => (
            <Card
              key={record.id}
              data-ocid={`bulk-record-${record.id}`}
              className={`transition-colors ${selected.has(record.id) ? "border-primary/40 bg-primary/2" : ""}`}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <Checkbox
                  data-ocid={`bulk-checkbox-${record.id}`}
                  checked={selected.has(record.id)}
                  onCheckedChange={() => toggle(record.id)}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    Period: {record.period}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Employee #{record.employeeId.slice(0, 8)} ·{" "}
                    {record.currency}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-foreground">
                    {record.grossAmount.toLocaleString()} gross
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Net: {record.netAmount.toLocaleString()}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="text-xs shrink-0 bg-secondary/10 text-secondary-foreground"
                >
                  {record.status}
                </Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs text-destructive hover:text-destructive h-7 px-2 shrink-0"
                  data-ocid={`bulk-reject-${record.id}`}
                  onClick={() =>
                    rejectMutation.mutate({
                      id: record.id,
                      reason: "Rejected by admin",
                    })
                  }
                  disabled={rejectMutation.isPending}
                >
                  Reject
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
