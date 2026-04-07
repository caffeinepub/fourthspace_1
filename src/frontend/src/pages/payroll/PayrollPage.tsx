import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeDollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  Play,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId } from "../../hooks/useWorkspace";
import { PayrollStatus } from "../../types";
import type { Employee, PayrollRecord } from "../../types";

function PayrollStatusBadge({ status }: { status: PayrollStatus }) {
  if (status === PayrollStatus.Completed)
    return (
      <Badge className="bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/20 gap-1">
        <CheckCircle2 className="h-3 w-3" /> Completed
      </Badge>
    );
  if (status === PayrollStatus.Active)
    return (
      <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20 gap-1">
        <Clock className="h-3 w-3" /> Active
      </Badge>
    );
  return (
    <Badge variant="outline" className="text-muted-foreground gap-1">
      <Clock className="h-3 w-3" /> Paused
    </Badge>
  );
}

function formatCurrency(amount: bigint, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(Number(amount) / 100);
}

function nextPayrollDate() {
  const d = new Date();
  d.setMonth(d.getMonth() + 1, 1);
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function PayrollPage() {
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const queryClient = useQueryClient();

  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [period, setPeriod] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  const { data: employees = [], isLoading: empLoading } = useQuery<Employee[]>({
    queryKey: ["employees", tenantId],
    queryFn: async () => (actor ? actor.listEmployees(tenantId) : []),
    enabled: !!actor && !isFetching,
  });

  const { data: records = [], isLoading: recLoading } = useQuery<
    PayrollRecord[]
  >({
    queryKey: ["payrollRecords", tenantId, null],
    queryFn: async () =>
      actor ? actor.listPayrollRecords(tenantId, null) : [],
    enabled: !!actor && !isFetching,
  });

  const processPayroll = useMutation({
    mutationFn: async () => {
      if (!actor || !selectedEmployeeId) throw new Error("Select an employee");
      const res = await actor.processPayroll(
        tenantId,
        selectedEmployeeId,
        period,
      );
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => {
      toast.success("Payroll processed successfully");
      queryClient.invalidateQueries({ queryKey: ["payrollRecords"] });
      setSelectedEmployeeId("");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const activeEmployees = employees.filter((e) => e.isActive);
  const thisMonth = new Date().toISOString().slice(0, 7);
  const monthRecords = records.filter((r) => r.period.startsWith(thisMonth));
  const totalPayroll = monthRecords.reduce(
    (sum, r) => sum + Number(r.amount),
    0,
  );
  const recentRecords = [...records]
    .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
    .slice(0, 8);
  const employeeMap = new Map(employees.map((e) => [e.id, e]));
  const statsLoading = empLoading || recLoading;

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/15">
            <BadgeDollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Payroll
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage payroll and employee payments
            </p>
          </div>
        </div>
        <Button asChild variant="outline" data-ocid="payroll-employees-link">
          <Link to="/app/payroll/employees">
            <Users className="mr-2 h-4 w-4" />
            Manage Employees
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Active Employees",
            value: statsLoading ? null : String(activeEmployees.length),
            icon: Users,
          },
          {
            label: "Payroll This Month",
            value: statsLoading
              ? null
              : `$${(totalPayroll / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
            icon: DollarSign,
          },
          {
            label: "Next Payroll Date",
            value: nextPayrollDate(),
            icon: Calendar,
          },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label} className="border-border">
            <CardContent className="flex items-center gap-4 pt-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-500/10">
                <Icon className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">{label}</p>
                {value === null ? (
                  <Skeleton className="mt-1 h-6 w-24" />
                ) : (
                  <p className="text-xl font-bold font-display text-foreground truncate">
                    {value}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Run Payroll */}
        <Card
          className="lg:col-span-2 border-green-500/20 bg-green-500/[0.03]"
          data-ocid="run-payroll-card"
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Play className="h-4 w-4 text-green-600 dark:text-green-400" />
              Run Payroll
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="employee-select">Employee</Label>
              <select
                id="employee-select"
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                data-ocid="payroll-employee-select"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Select employee…</option>
                {activeEmployees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="period-input">Pay Period (YYYY-MM)</Label>
              <Input
                id="period-input"
                type="month"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                data-ocid="payroll-period-input"
              />
            </div>

            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              disabled={!selectedEmployeeId || processPayroll.isPending}
              onClick={() => processPayroll.mutate()}
              data-ocid="payroll-process-btn"
            >
              {processPayroll.isPending ? (
                "Processing…"
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Process Payroll
                </>
              )}
            </Button>

            {!selectedEmployeeId && (
              <p className="text-xs text-muted-foreground text-center">
                Select an employee to enable payroll processing
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Records */}
        <Card
          className="lg:col-span-3 border-border"
          data-ocid="recent-payroll-card"
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Recent Payroll Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((n) => (
                  <Skeleton key={n} className="h-12 rounded-xl" />
                ))}
              </div>
            ) : recentRecords.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-12 text-center"
                data-ocid="payroll-records-empty"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/10 mb-3">
                  <BadgeDollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  No payroll records yet
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Process your first payroll using the form.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="pb-2 text-left font-medium text-muted-foreground">
                        Employee
                      </th>
                      <th className="pb-2 text-left font-medium text-muted-foreground">
                        Period
                      </th>
                      <th className="pb-2 text-right font-medium text-muted-foreground">
                        Amount
                      </th>
                      <th className="pb-2 text-right font-medium text-muted-foreground">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRecords.map((record) => {
                      const emp = employeeMap.get(record.employeeId);
                      return (
                        <tr
                          key={record.id}
                          className="border-b border-border/60 last:border-0"
                          data-ocid={`payroll-record-${record.id}`}
                        >
                          <td className="py-3 pr-4">
                            <span className="font-medium text-foreground truncate max-w-[120px] block">
                              {emp ? `${emp.firstName} ${emp.lastName}` : "—"}
                            </span>
                          </td>
                          <td className="py-3 pr-4 text-muted-foreground">
                            {record.period}
                          </td>
                          <td className="py-3 pr-4 text-right font-mono font-medium tabular-nums text-foreground">
                            {formatCurrency(record.amount, record.currency)}
                          </td>
                          <td className="py-3 text-right">
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
