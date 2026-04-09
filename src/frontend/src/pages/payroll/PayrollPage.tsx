import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { format } from "date-fns";
import {
  AlertTriangle,
  BadgeDollarSign,
  Building2,
  CheckCircle2,
  Clock,
  Loader2,
  Plus,
  Users,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { useWorkspace } from "../../hooks/useWorkspace";
import type { Employee, PayrollRecord, WalletAccount } from "../../types";
import { PayrollStatus } from "../../types";

function formatICP(e8s: bigint): string {
  return `${(Number(e8s) / 1e8).toFixed(4)} ICP`;
}

const PAYROLL_STATUS_COLORS: Record<string, string> = {
  [PayrollStatus.Active]: "bg-primary/10 text-primary",
  [PayrollStatus.Approved]: "bg-accent/10 text-accent-foreground",
  [PayrollStatus.Processed]: "bg-accent/10 text-accent-foreground",
  [PayrollStatus.Completed]: "bg-muted text-muted-foreground",
  [PayrollStatus.PendingApproval]: "bg-secondary/10 text-secondary-foreground",
  [PayrollStatus.Rejected]: "bg-destructive/10 text-destructive",
  [PayrollStatus.Paused]: "bg-muted text-muted-foreground",
};

export default function PayrollPage() {
  const { workspaceId } = useParams({ strict: false }) as {
    workspaceId: string;
  };
  const { tenantId } = useWorkspace();
  const { actor, isFetching } = useBackend();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Check treasury balance FIRST
  const { data: treasury, isLoading: loadingTreasury } =
    useQuery<WalletAccount | null>({
      queryKey: ["treasury", tenantId, workspaceId],
      queryFn: async () => {
        if (!actor) return null;
        return actor.getWorkspaceTreasury(tenantId, workspaceId);
      },
      enabled: !!actor && !isFetching && !!workspaceId,
    });

  const { data: employees = [], isLoading: loadingEmployees } = useQuery<
    Employee[]
  >({
    queryKey: ["employees", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listEmployees(tenantId, workspaceId);
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

  const processMutation = useMutation({
    mutationFn: async ({
      employeeId,
      period,
    }: { employeeId: string; period: string }) => {
      if (!actor) throw new Error("Not connected");
      // Block if no treasury balance
      if (!hasTreasuryBalance) {
        throw new Error(
          "The workspace treasury has no funds. Please fund the treasury before processing payroll.",
        );
      }
      const r = await actor.processPayroll(
        tenantId,
        workspaceId,
        employeeId,
        period,
      );
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      toast.success("Payroll processed");
      void queryClient.invalidateQueries({ queryKey: ["payroll"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const hasTreasuryBalance = treasury != null && treasury.icpBalance > 0n;
  const isLoading = loadingTreasury || loadingEmployees || loadingRecords;
  const currentPeriod = format(new Date(), "yyyy-MM");

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <BadgeDollarSign className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold font-display text-foreground">
              Payroll
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage employee pay and approvals
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              navigate({
                to: `/app/${workspaceId}/payroll/bulk-approval` as "/",
              })
            }
            data-ocid="payroll-bulk-approval-btn"
            className="gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Bulk Approval
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              navigate({ to: `/app/${workspaceId}/payroll/employees` as "/" })
            }
            data-ocid="payroll-employees-btn"
            className="gap-1.5"
          >
            <Users className="w-3.5 h-3.5" />
            Employees
          </Button>
          <Button
            size="sm"
            onClick={() =>
              navigate({ to: `/app/${workspaceId}/payroll/audit-log` as "/" })
            }
            data-ocid="payroll-audit-btn"
            className="gap-1.5"
          >
            Audit Log
          </Button>
        </div>
      </div>

      {/* Treasury balance check */}
      {loadingTreasury ? (
        <Skeleton className="h-16 w-full rounded-lg" />
      ) : !hasTreasuryBalance ? (
        <div
          data-ocid="payroll-balance-warning"
          className="flex items-start gap-3 p-4 rounded-lg border border-destructive/30 bg-destructive/5"
        >
          <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-destructive">
              Treasury balance is empty
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              The workspace treasury has no funds. Please fund the treasury
              wallet before processing payroll.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="shrink-0 gap-1.5"
            onClick={() =>
              navigate({ to: `/app/${workspaceId}/wallet` as "/" })
            }
            data-ocid="payroll-fund-treasury-btn"
          >
            <Wallet className="w-3.5 h-3.5" />
            Fund Treasury
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <Building2 className="w-4 h-4 text-primary" />
          <p className="text-sm text-muted-foreground">
            Treasury balance:{" "}
            <span className="font-medium text-foreground">
              {formatICP(treasury.icpBalance)}
            </span>
          </p>
        </div>
      )}

      {/* Quick process section — only when treasury has funds */}
      {hasTreasuryBalance && employees.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-display flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Process Payroll — {currentPeriod}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-0">
            <div className="flex flex-col gap-2">
              {employees.slice(0, 8).map((emp) => (
                <div
                  key={emp.id}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {emp.firstName} {emp.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {emp.email}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-foreground">
                      {Number(emp.salary).toLocaleString()} {emp.currency}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {emp.payFrequency}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    data-ocid={`payroll-process-${emp.id}`}
                    disabled={processMutation.isPending || !hasTreasuryBalance}
                    onClick={() =>
                      processMutation.mutate({
                        employeeId: emp.id,
                        period: currentPeriod,
                      })
                    }
                    className="text-xs h-7 px-2 shrink-0"
                  >
                    {processMutation.isPending ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      "Process"
                    )}
                  </Button>
                </div>
              ))}
            </div>
            {employees.length > 8 && (
              <p className="text-xs text-muted-foreground mt-3 text-center">
                +{employees.length - 8} more employees — use Bulk Approval to
                process all.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Navigation cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {
            href: `/app/${workspaceId}/payroll/employees`,
            icon: <Users className="w-5 h-5 text-primary" />,
            label: "Employees",
            desc: `${employees.length} active`,
            ocid: "payroll-nav-employees",
          },
          {
            href: `/app/${workspaceId}/payroll/bulk-approval`,
            icon: <CheckCircle2 className="w-5 h-5 text-primary" />,
            label: "Bulk Approval",
            desc: `${records.filter((r) => r.status === PayrollStatus.PendingApproval).length} pending`,
            ocid: "payroll-nav-bulk",
          },
          {
            href: `/app/${workspaceId}/payroll/audit-log`,
            icon: <BadgeDollarSign className="w-5 h-5 text-primary" />,
            label: "Audit Log",
            desc: "Full history",
            ocid: "payroll-nav-audit",
          },
        ].map((item) => (
          <Card
            key={item.label}
            className="cursor-pointer hover:border-primary/40 transition-colors"
            onClick={() => navigate({ to: item.href as "/" })}
            data-ocid={item.ocid}
          >
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground font-display">
                  {item.label}
                </p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent records */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground font-display">
            Recent Payroll Records
          </h2>
          <Button
            size="sm"
            variant="ghost"
            onClick={() =>
              navigate({
                to: `/app/${workspaceId}/payroll/bulk-approval` as "/",
              })
            }
            className="text-xs gap-1"
          >
            <Plus className="w-3 h-3" />
            View All
          </Button>
        </div>
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {(["a", "b", "c"] as const).map((k) => (
              <Skeleton key={k} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : records.length === 0 ? (
          <div
            data-ocid="payroll-records-empty"
            className="flex flex-col items-center justify-center py-12 gap-3 text-center rounded-lg border border-dashed border-border"
          >
            <BadgeDollarSign className="w-8 h-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No payroll records yet
            </p>
            {employees.length === 0 && (
              <Button
                size="sm"
                onClick={() =>
                  navigate({
                    to: `/app/${workspaceId}/payroll/employees` as "/",
                  })
                }
                className="gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Employees
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {records.slice(0, 10).map((rec) => (
              <PayrollRecordRow key={rec.id} record={rec} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PayrollRecordRow({ record }: { record: PayrollRecord }) {
  return (
    <div
      data-ocid={`payroll-record-${record.id}`}
      className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background hover:bg-muted/20 transition-colors"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{record.period}</p>
        <p className="text-xs text-muted-foreground">
          Employee #{record.employeeId.slice(0, 8)}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-semibold text-foreground">
          {record.grossAmount.toLocaleString()} {record.currency}
        </p>
        <p className="text-xs text-muted-foreground">
          Net: {record.netAmount.toLocaleString()}
        </p>
      </div>
      <Badge
        variant="outline"
        className={`text-xs shrink-0 ${PAYROLL_STATUS_COLORS[record.status] ?? "bg-muted text-muted-foreground"}`}
      >
        {record.status}
      </Badge>
    </div>
  );
}
