import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  BadgeDollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  Edit2,
  Mail,
  Save,
  UserX,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId } from "../../hooks/useWorkspace";
import { PayFrequency, PayrollStatus } from "../../types";
import type { Employee, EmployeeInput, PayrollRecord } from "../../types";

const FREQUENCIES = [
  PayFrequency.Weekly,
  PayFrequency.BiWeekly,
  PayFrequency.Monthly,
  PayFrequency.Quarterly,
];

function formatCurrency(amount: bigint, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(Number(amount) / 100);
}

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

interface EditFormState {
  firstName: string;
  lastName: string;
  email: string;
  salary: string;
  currency: string;
  payFrequency: PayFrequency;
  taxRate: string;
  startDate: string;
}

function employeeToForm(emp: Employee): EditFormState {
  return {
    firstName: emp.firstName,
    lastName: emp.lastName,
    email: emp.email,
    salary: (Number(emp.salary) / 100).toFixed(2),
    currency: emp.currency,
    payFrequency: emp.payFrequency,
    taxRate: String(Number(emp.taxRate)),
    startDate: new Date(Number(emp.startDate) / 1_000_000)
      .toISOString()
      .split("T")[0],
  };
}

export default function EmployeeDetailPage() {
  const { employeeId } = useParams({
    from: "/app/payroll/employees/$employeeId",
  });
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<EditFormState | null>(null);
  const [confirmDeactivate, setConfirmDeactivate] = useState(false);

  const { data: employee, isLoading } = useQuery<Employee | null>({
    queryKey: ["employee", tenantId, employeeId],
    queryFn: async () => {
      if (!actor) return null;
      const r = await actor.getEmployee(tenantId, employeeId);
      return r.__kind__ === "ok" ? r.ok : null;
    },
    enabled: !!actor && !isFetching,
  });

  const { data: payrollHistory = [], isLoading: histLoading } = useQuery<
    PayrollRecord[]
  >({
    queryKey: ["payrollRecords", tenantId, employeeId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listPayrollRecords(tenantId, employeeId);
    },
    enabled: !!actor && !isFetching,
  });

  const updateEmployee = useMutation({
    mutationFn: async (f: EditFormState) => {
      if (!actor || !employee) throw new Error("Not ready");
      const input: EmployeeInput = {
        firstName: f.firstName.trim(),
        lastName: f.lastName.trim(),
        email: f.email.trim(),
        salary: BigInt(Math.round(Number.parseFloat(f.salary) * 100)),
        currency: f.currency,
        payFrequency: f.payFrequency,
        taxRate: BigInt(Number.parseInt(f.taxRate)),
        startDate: BigInt(new Date(f.startDate).getTime() * 1_000_000),
        userId: employee.userId,
      };
      const res = await actor.updateEmployee(tenantId, employeeId, input);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: (updated) => {
      toast.success("Employee updated");
      queryClient.setQueryData(["employee", tenantId, employeeId], updated);
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setEditing(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deactivateEmployee = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const res = await actor.deactivateEmployee(tenantId, employeeId);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: (updated) => {
      toast.success("Employee deactivated");
      queryClient.setQueryData(["employee", tenantId, employeeId], updated);
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setConfirmDeactivate(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const startEdit = () => {
    if (employee) {
      setForm(employeeToForm(employee));
      setEditing(true);
    }
  };

  const set =
    (k: keyof EditFormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => (prev ? { ...prev, [k]: e.target.value } : prev));

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="p-8 flex flex-col items-center justify-center gap-4 text-center">
        <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
          <UserX className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-lg font-semibold text-foreground">
          Employee not found
        </p>
        <Button asChild variant="outline">
          <Link to="/app/payroll/employees">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Employees
          </Link>
        </Button>
      </div>
    );
  }

  const sortedHistory = [...payrollHistory].sort(
    (a, b) => Number(b.createdAt) - Number(a.createdAt),
  );

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      {/* Back + Header */}
      <div className="flex items-start gap-3 flex-wrap justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            asChild
            aria-label="Back to Employees"
          >
            <Link to="/app/payroll/employees">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-500/15 font-bold text-green-600 dark:text-green-400 text-lg">
            {employee.firstName[0]}
            {employee.lastName[0]}
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              {employee.firstName} {employee.lastName}
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {employee.email}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <Badge
            className={
              employee.isActive
                ? "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/20"
                : "bg-muted text-muted-foreground"
            }
          >
            {employee.isActive ? "Active" : "Inactive"}
          </Badge>
          {!editing && employee.isActive && (
            <Button
              variant="outline"
              size="sm"
              onClick={startEdit}
              data-ocid="emp-edit-btn"
            >
              <Edit2 className="mr-1.5 h-3.5 w-3.5" /> Edit
            </Button>
          )}
        </div>
      </div>

      {/* Edit Form */}
      {editing && form ? (
        <Card
          className="border-green-500/20 bg-green-500/[0.02]"
          data-ocid="emp-edit-form"
        >
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">
              Edit Employee Details
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditing(false)}
              aria-label="Cancel editing"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (form) updateEmployee.mutate(form);
              }}
              className="grid gap-4 sm:grid-cols-2"
            >
              <div className="space-y-1.5">
                <Label htmlFor="edit-firstName">First Name</Label>
                <Input
                  id="edit-firstName"
                  value={form.firstName}
                  onChange={set("firstName")}
                  required
                  data-ocid="edit-firstname"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-lastName">Last Name</Label>
                <Input
                  id="edit-lastName"
                  value={form.lastName}
                  onChange={set("lastName")}
                  required
                  data-ocid="edit-lastname"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  required
                  data-ocid="edit-email"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-salary">Annual Salary</Label>
                <Input
                  id="edit-salary"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.salary}
                  onChange={set("salary")}
                  required
                  data-ocid="edit-salary"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-currency">Currency</Label>
                <Input
                  id="edit-currency"
                  value={form.currency}
                  onChange={set("currency")}
                  maxLength={3}
                  data-ocid="edit-currency"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-frequency">Pay Frequency</Label>
                <select
                  id="edit-frequency"
                  value={form.payFrequency}
                  onChange={set("payFrequency")}
                  data-ocid="edit-pay-frequency"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {FREQUENCIES.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-taxRate">Tax Rate (%)</Label>
                <Input
                  id="edit-taxRate"
                  type="number"
                  min="0"
                  max="100"
                  value={form.taxRate}
                  onChange={set("taxRate")}
                  required
                  data-ocid="edit-tax-rate"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="edit-startDate">Start Date</Label>
                <Input
                  id="edit-startDate"
                  type="date"
                  value={form.startDate}
                  onChange={set("startDate")}
                  required
                  data-ocid="edit-start-date"
                />
              </div>
              <div className="sm:col-span-2 flex gap-3 justify-end pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateEmployee.isPending}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  data-ocid="emp-save-btn"
                >
                  {updateEmployee.isPending ? (
                    "Saving…"
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" /> Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        /* Profile Details Card */
        <Card className="border-border" data-ocid="emp-profile-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <BadgeDollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
              Employment Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
              <div>
                <dt className="text-xs text-muted-foreground mb-1">
                  Annual Salary
                </dt>
                <dd className="font-semibold text-foreground tabular-nums">
                  {formatCurrency(employee.salary, employee.currency)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground mb-1">Currency</dt>
                <dd className="font-semibold text-foreground">
                  {employee.currency}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground mb-1">
                  Pay Frequency
                </dt>
                <dd className="font-semibold text-foreground">
                  {employee.payFrequency}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground mb-1">Tax Rate</dt>
                <dd className="font-semibold text-foreground">
                  {Number(employee.taxRate)}%
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground mb-1">
                  Start Date
                </dt>
                <dd className="font-semibold text-foreground flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  {new Date(
                    Number(employee.startDate) / 1_000_000,
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground mb-1">
                  Payroll Records
                </dt>
                <dd className="font-semibold text-foreground">
                  {payrollHistory.length}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground mb-1">
                  Total Paid
                </dt>
                <dd className="font-semibold text-foreground tabular-nums">
                  {formatCurrency(
                    payrollHistory.reduce((s, r) => s + r.amount, 0n),
                    employee.currency,
                  )}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      )}

      {/* Payroll History */}
      <Card className="border-border" data-ocid="emp-payroll-history">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Payroll History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {histLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <Skeleton key={n} className="h-12 rounded-xl" />
              ))}
            </div>
          ) : sortedHistory.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-10 text-center"
              data-ocid="emp-history-empty"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 mb-3">
                <BadgeDollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-sm font-medium text-foreground">
                No payroll records yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Process payroll from the{" "}
                <Link
                  to="/app/payroll"
                  className="text-green-600 hover:underline"
                >
                  Payroll dashboard
                </Link>
                .
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-2 text-left font-medium text-muted-foreground">
                      Period
                    </th>
                    <th className="pb-2 text-right font-medium text-muted-foreground">
                      Amount
                    </th>
                    <th className="pb-2 text-right font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="pb-2 text-right font-medium text-muted-foreground hidden sm:table-cell">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedHistory.map((record) => (
                    <tr
                      key={record.id}
                      className="border-b border-border/60 last:border-0"
                      data-ocid={`emp-record-${record.id}`}
                    >
                      <td className="py-3 pr-4 font-medium text-foreground">
                        {record.period}
                      </td>
                      <td className="py-3 pr-4 text-right font-mono tabular-nums font-semibold text-foreground">
                        {formatCurrency(record.amount, record.currency)}
                      </td>
                      <td className="py-3 pr-4 text-right">
                        <PayrollStatusBadge status={record.status} />
                      </td>
                      <td className="py-3 text-right text-muted-foreground hidden sm:table-cell">
                        {new Date(
                          Number(record.createdAt) / 1_000_000,
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      {employee.isActive && (
        <Card
          className="border-destructive/20 bg-destructive/[0.02]"
          data-ocid="emp-danger-zone"
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-destructive flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent>
            {confirmDeactivate ? (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-destructive/20 bg-destructive/5 p-4">
                <div>
                  <p className="font-medium text-foreground text-sm">
                    Deactivate this employee?
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    This will mark {employee.firstName} as inactive. This action
                    can be reversed by editing the employee record.
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setConfirmDeactivate(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={deactivateEmployee.isPending}
                    onClick={() => deactivateEmployee.mutate()}
                    data-ocid="emp-confirm-deactivate-btn"
                  >
                    {deactivateEmployee.isPending
                      ? "Deactivating…"
                      : "Confirm Deactivate"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-foreground text-sm">
                    Deactivate Employee
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Remove {employee.firstName} from active payroll processing.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive shrink-0"
                  onClick={() => setConfirmDeactivate(true)}
                  data-ocid="emp-deactivate-btn"
                >
                  <UserX className="mr-1.5 h-3.5 w-3.5" />
                  Deactivate Employee
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
