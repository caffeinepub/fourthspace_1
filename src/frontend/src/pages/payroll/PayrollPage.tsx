import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  BadgeDollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  Play,
  Plus,
  RefreshCw,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId, useWorkspace } from "../../hooks/useWorkspace";
import { PayrollStatus } from "../../types";
import type { Employee, PayrollRecord, WalletAccount } from "../../types";

function formatCurrency(amount: number | bigint, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(Number(amount) / 100);
}

function formatIcp(balance: bigint): string {
  return (Number(balance) / 1_000_000_00).toFixed(4);
}

function PayrollStatusBadge({ status }: { status: PayrollStatus }) {
  const map: Record<string, { label: string; className: string }> = {
    [PayrollStatus.Completed]: {
      label: "Completed",
      className:
        "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
    },
    [PayrollStatus.Approved]: {
      label: "Approved",
      className:
        "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20",
    },
    [PayrollStatus.PendingApproval]: {
      label: "Pending",
      className:
        "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20",
    },
    [PayrollStatus.Rejected]: {
      label: "Rejected",
      className:
        "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/20",
    },
    [PayrollStatus.Processed]: {
      label: "Processed",
      className:
        "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/20",
    },
    [PayrollStatus.Active]: {
      label: "Active",
      className:
        "bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-500/20",
    },
    [PayrollStatus.Paused]: {
      label: "Paused",
      className: "bg-muted text-muted-foreground",
    },
  };
  const s = map[status] ?? {
    label: status,
    className: "bg-muted text-muted-foreground",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${s.className}`}
    >
      {s.label}
    </span>
  );
}

export default function PayrollPage() {
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const queryClient = useQueryClient();

  const navLinks = [
    {
      to: `/app/${workspaceId}/payroll/employees` as const,
      label: "Employees",
      icon: Users,
      desc: "Manage employee profiles",
    },
    {
      to: `/app/${workspaceId}/payroll/schedules` as const,
      label: "Pay Schedules",
      icon: Calendar,
      desc: "Weekly, bi-weekly, monthly",
    },
    {
      to: `/app/${workspaceId}/payroll/contractors` as const,
      label: "Contractors",
      icon: FileText,
      desc: "Freelancer & contractor payments",
    },
    {
      to: `/app/${workspaceId}/payroll/bulk-approval` as const,
      label: "Bulk Approval",
      icon: CheckCircle2,
      desc: "Review & approve payroll runs",
    },
    {
      to: `/app/${workspaceId}/payroll/off-cycle` as const,
      label: "Off-Cycle Payments",
      icon: RefreshCw,
      desc: "Bonuses & reimbursements",
    },
    {
      to: `/app/${workspaceId}/payroll/audit-log` as const,
      label: "Audit Log",
      icon: AlertCircle,
      desc: "Full payroll history log",
    },
  ];

  // Fetch workspace treasury balance
  const { data: treasury, isLoading: treasuryLoading } =
    useQuery<WalletAccount | null>({
      queryKey: ["workspaceTreasury", tenantId, workspaceId],
      queryFn: async () => {
        if (!actor) return null;
        return actor.getWorkspaceTreasury(tenantId, workspaceId);
      },
      enabled: !!actor && !isFetching && !!workspaceId,
    });

  const { data: employees = [], isLoading: empLoading } = useQuery<Employee[]>({
    queryKey: ["employees", tenantId, workspaceId],
    queryFn: async () =>
      actor ? actor.listEmployees(tenantId, workspaceId) : [],
    enabled: !!actor && !isFetching && !!workspaceId,
  });

  const { data: records = [], isLoading: recLoading } = useQuery<
    PayrollRecord[]
  >({
    queryKey: ["payrollRecords", tenantId, workspaceId, null],
    queryFn: async () =>
      actor ? actor.listPayrollRecords(tenantId, workspaceId, null) : [],
    enabled: !!actor && !isFetching && !!workspaceId,
  });

  const icpBalance = treasury?.icpBalance ?? BigInt(0);
  const hasNoFunds = !treasuryLoading && icpBalance === BigInt(0);

  const runPayroll = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const activeEmps = employees.filter((e) => e.isActive);
      if (activeEmps.length === 0) throw new Error("No active employees");
      const period = new Date().toISOString().slice(0, 7);
      const results = await Promise.allSettled(
        activeEmps.map((e) =>
          actor.processPayroll(tenantId, workspaceId, e.id, period),
        ),
      );

      // Collect errors — if any is "insufficient funds", surface it prominently
      for (const r of results) {
        if (r.status === "fulfilled" && r.value.__kind__ === "err") {
          if (r.value.err.toLowerCase().includes("insufficient")) {
            throw new Error(r.value.err);
          }
        }
      }

      return results.filter((r) => r.status === "fulfilled").length;
    },
    onSuccess: (count) => {
      toast.success(`Payroll processed for ${count} employee(s)`);
      queryClient.invalidateQueries({ queryKey: ["payrollRecords"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const activeEmployees = employees.filter((e) => e.isActive);
  const pendingApproval = records.filter(
    (r) => r.status === PayrollStatus.PendingApproval,
  );
  const thisMonth = new Date().toISOString().slice(0, 7);
  const monthRecords = records.filter((r) => r.period.startsWith(thisMonth));
  const totalPayroll = monthRecords.reduce(
    (sum, r) => sum + Number(r.amount),
    0,
  );
  const recentRecords = [...records]
    .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
    .slice(0, 6);
  const employeeMap = new Map(employees.map((e) => [e.id, e]));
  const statsLoading = empLoading || recLoading;

  const stats = [
    {
      label: "Active Employees",
      value: statsLoading ? null : String(activeEmployees.length),
      icon: Users,
      trend: null,
    },
    {
      label: "Payroll This Month",
      value: statsLoading
        ? null
        : `$${(totalPayroll / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      trend: "Current period",
    },
    {
      label: "Pending Approval",
      value: statsLoading ? null : String(pendingApproval.length),
      icon: Clock,
      link: `/app/${workspaceId}/payroll/bulk-approval`,
      urgent: pendingApproval.length > 0,
    },
    {
      label: "Total Payroll Runs",
      value: statsLoading ? null : String(records.length),
      icon: TrendingUp,
      trend: "All time",
    },
  ];

  const isRunDisabled =
    runPayroll.isPending || activeEmployees.length === 0 || hasNoFunds;

  return (
    <div className="animate-fade-in-up p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/20">
            <BadgeDollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Payroll
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage employee payments and compensation
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Treasury balance chip */}
          {!treasuryLoading && treasury && (
            <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5">
              <Wallet className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Treasury:</span>
              <span
                className={`text-xs font-semibold tabular-nums ${
                  icpBalance === BigInt(0)
                    ? "text-destructive"
                    : "text-foreground"
                }`}
                data-ocid="payroll-treasury-balance"
              >
                {formatIcp(icpBalance)} ICP
              </span>
            </div>
          )}
          <Button asChild variant="outline" size="sm" className="active-press">
            <Link to={`/app/${workspaceId}/payroll/employees`}>
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add Employee
            </Link>
          </Button>
          <Button
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-white active-press disabled:opacity-60"
            onClick={() => runPayroll.mutate()}
            disabled={isRunDisabled}
            data-ocid="payroll-run-all-btn"
            title={
              hasNoFunds
                ? "Fund your workspace wallet before processing payroll"
                : activeEmployees.length === 0
                  ? "No active employees"
                  : undefined
            }
          >
            {runPayroll.isPending ? (
              "Running…"
            ) : (
              <>
                <Play className="mr-1.5 h-3.5 w-3.5" />
                Run Payroll
              </>
            )}
          </Button>
        </div>
      </div>

      {/* No-funds warning banner */}
      {hasNoFunds && (
        <div
          className="flex items-start gap-3 rounded-xl border border-amber-400/40 bg-amber-500/8 px-4 py-3"
          data-ocid="payroll-no-funds-banner"
          role="alert"
        >
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">
              Your workspace wallet has no funds. Fund it to process payroll.
            </p>
          </div>
          <Button
            asChild
            size="sm"
            variant="outline"
            className="shrink-0 gap-1.5 border-amber-400/60 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10"
            data-ocid="payroll-fund-wallet-btn"
          >
            <Link to={`/app/${workspaceId}/wallet`}>
              <Wallet className="h-3.5 w-3.5" />
              Fund Wallet
            </Link>
          </Button>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, trend, link, urgent }) => {
          const card = (
            <Card
              key={label}
              className={`shadow-card rounded-xl border border-border/50 bg-card transition-colors ${link ? "card-interactive" : ""} ${urgent ? "border-amber-500/40" : ""}`}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {label}
                    </p>
                    {value === null ? (
                      <Skeleton className="h-7 w-24 mt-1" />
                    ) : (
                      <p
                        className={`text-2xl font-bold font-mono tabular-nums ${urgent ? "text-amber-600 dark:text-amber-400" : "text-foreground"}`}
                      >
                        {value}
                      </p>
                    )}
                    {trend && (
                      <p className="text-[11px] text-muted-foreground/70">
                        {trend}
                      </p>
                    )}
                  </div>
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${urgent ? "bg-amber-500/10" : "bg-emerald-500/10"}`}
                  >
                    <Icon
                      className={`h-4 w-4 ${urgent ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
          return link ? (
            <Link key={label} to={link}>
              {card}
            </Link>
          ) : (
            <div key={label}>{card}</div>
          );
        })}
      </div>

      {/* Pending Approval Banner */}
      {pendingApproval.length > 0 && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <p className="text-sm font-medium text-foreground">
              <span className="text-amber-700 dark:text-amber-400 font-semibold">
                {pendingApproval.length} payroll record
                {pendingApproval.length !== 1 ? "s" : ""}
              </span>{" "}
              awaiting approval
            </p>
          </div>
          <Button
            asChild
            size="sm"
            className="bg-amber-600 hover:bg-amber-700 text-white shrink-0 active-press"
            data-ocid="payroll-approval-banner-btn"
          >
            <Link to={`/app/${workspaceId}/payroll/bulk-approval`}>
              Review Now <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Quick Navigation */}
        <div className="lg:col-span-2 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
            Quick Access
          </p>
          <div className="space-y-1.5">
            {navLinks.map(({ to, label, icon: Icon, desc }) => (
              <Link
                key={to}
                to={to}
                data-ocid={`payroll-nav-${label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-card px-4 py-3 hover:border-emerald-400/50 hover:bg-emerald-500/5 transition-colors group">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                    <Icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {label}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {desc}
                    </p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-emerald-600 transition-colors shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Records */}
        <Card
          className="lg:col-span-3 shadow-card rounded-xl border border-border/50 bg-card"
          data-ocid="recent-payroll-card"
        >
          <CardHeader className="pb-3 flex flex-row items-center justify-between border-b border-border/40">
            <CardTitle className="text-sm font-semibold text-foreground">
              Recent Payroll Records
            </CardTitle>
            {records.length > 6 && (
              <Button asChild variant="ghost" size="sm" className="text-xs">
                <Link to={`/app/${workspaceId}/payroll/bulk-approval`}>
                  View all
                </Link>
              </Button>
            )}
          </CardHeader>
          <CardContent className="p-0">
            {recLoading ? (
              <div className="space-y-2 p-4">
                {[1, 2, 3, 4].map((n) => (
                  <Skeleton key={n} className="h-12 rounded-lg" />
                ))}
              </div>
            ) : recentRecords.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-12 text-center"
                data-ocid="payroll-records-empty"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 mb-3">
                  <BadgeDollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  No payroll records yet
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Click "Run Payroll" to process the current pay period.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/40 bg-muted/30">
                      <th className="px-5 py-2.5 text-left text-xs font-medium text-muted-foreground">
                        Employee
                      </th>
                      <th className="px-5 py-2.5 text-left text-xs font-medium text-muted-foreground hidden sm:table-cell">
                        Period
                      </th>
                      <th className="px-5 py-2.5 text-right text-xs font-medium text-muted-foreground">
                        Amount
                      </th>
                      <th className="px-5 py-2.5 text-right text-xs font-medium text-muted-foreground">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {recentRecords.map((record) => {
                      const emp = employeeMap.get(record.employeeId);
                      return (
                        <tr
                          key={record.id}
                          className="hover:bg-muted/50 transition-colors"
                          data-ocid={`payroll-record-${record.id}`}
                        >
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                                {emp
                                  ? `${emp.firstName[0]}${emp.lastName[0]}`
                                  : "?"}
                              </div>
                              <span className="font-medium text-foreground truncate max-w-[140px]">
                                {emp ? `${emp.firstName} ${emp.lastName}` : "—"}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-muted-foreground hidden sm:table-cell">
                            {record.period}
                          </td>
                          <td className="px-5 py-3 text-right font-mono font-semibold tabular-nums text-foreground">
                            {formatCurrency(record.amount, record.currency)}
                          </td>
                          <td className="px-5 py-3 text-right">
                            <PayrollStatusBadge status={record.status} />
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
    </div>
  );
}
