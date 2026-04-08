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
  Download,
  Edit2,
  Gift,
  Mail,
  MinusCircle,
  Plus,
  Receipt,
  Save,
  UserX,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId, useWorkspace } from "../../hooks/useWorkspace";
import {
  DeductionFrequency,
  DeductionType,
  PayFrequency,
  PayrollStatus,
} from "../../types";
import type {
  Benefit,
  BenefitInput,
  Deduction,
  DeductionInput,
  Employee,
  EmployeeInput,
  PayStub,
  PayrollRecord,
} from "../../types";

const FREQUENCIES = [
  PayFrequency.Weekly,
  PayFrequency.BiWeekly,
  PayFrequency.SemiMonthly,
  PayFrequency.Monthly,
  PayFrequency.Quarterly,
];

function fmtCurrency(amount: bigint | number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(typeof amount === "bigint" ? Number(amount) / 100 : amount / 100);
}

function StatusBadge({ status }: { status: PayrollStatus }) {
  const cfg: Record<string, string> = {
    [PayrollStatus.Completed]:
      "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/20",
    [PayrollStatus.Approved]:
      "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
    [PayrollStatus.Active]:
      "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20",
    [PayrollStatus.PendingApproval]:
      "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20",
    [PayrollStatus.Rejected]:
      "bg-destructive/15 text-destructive border-destructive/20",
    [PayrollStatus.Processed]:
      "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/20",
  };
  return (
    <Badge
      className={`${cfg[status] ?? "bg-muted text-muted-foreground"} text-xs`}
    >
      {status}
    </Badge>
  );
}

type DetailTab = "details" | "deductions" | "benefits" | "paystubs";

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

function openPayStub(stub: PayStub, emp: Employee) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Pay Stub — ${emp.firstName} ${emp.lastName}</title>
<style>
  body { font-family: system-ui, sans-serif; max-width: 600px; margin: 40px auto; padding: 0 24px; color: #111; }
  h1 { font-size: 22px; margin-bottom: 4px; } 
  .company { color: #555; font-size: 14px; margin-bottom: 24px; }
  .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; font-size: 14px; }
  .row.total { font-weight: 700; font-size: 16px; border-bottom: 2px solid #111; }
  .section { margin-top: 24px; } .section h2 { font-size: 13px; text-transform: uppercase; color: #888; letter-spacing: .06em; margin-bottom: 8px; }
  @media print { body { margin: 0; } }
</style></head>
<body>
  <h1>Pay Stub</h1>
  <p class="company">Fourthspace · Period: ${stub.period}</p>
  <div class="section"><h2>Employee</h2>
    <div class="row"><span>Name</span><span>${emp.firstName} ${emp.lastName}</span></div>
    <div class="row"><span>Email</span><span>${emp.email}</span></div>
    <div class="row"><span>Generated</span><span>${new Date(Number(stub.generatedAt) / 1_000_000).toLocaleDateString("en-US", { dateStyle: "long" })}</span></div>
  </div>
  <div class="section"><h2>Earnings</h2>
    <div class="row"><span>Gross Pay</span><span>$${(stub.grossPay / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span></div>
  </div>
  <div class="section"><h2>Deductions</h2>
    <div class="row"><span>Tax Deductions</span><span>$${(stub.taxDeductions / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span></div>
    <div class="row"><span>Other Deductions</span><span>$${(stub.otherDeductions / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span></div>
  </div>
  <div class="section">
    <div class="row total"><span>Net Pay</span><span>$${(stub.netPay / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span></div>
  </div>
  <p style="margin-top:40px;font-size:12px;color:#aaa">This is an auto-generated pay stub from Fourthspace. Print or save as PDF using your browser.</p>
  <script>window.onload = function() { window.print(); }</script>
</body></html>`;
  const w = window.open("", "_blank");
  if (w) {
    w.document.write(html);
    w.document.close();
  }
}

export default function EmployeeDetailPage() {
  const { employeeId } = useParams({
    from: "/app/$workspaceId/payroll/employees/$employeeId",
  });
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<DetailTab>("details");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<EditFormState | null>(null);
  const [confirmDeactivate, setConfirmDeactivate] = useState(false);
  const [showAddDeduction, setShowAddDeduction] = useState(false);
  const [showAddBenefit, setShowAddBenefit] = useState(false);
  const [dedForm, setDedForm] = useState({
    name: "",
    amount: "",
    frequency: DeductionFrequency.perRun,
    deductionType: DeductionType.preTax,
  });
  const [benForm, setBenForm] = useState({
    name: "",
    monthlyCost: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
  });

  const { data: employee, isLoading } = useQuery<Employee | null>({
    queryKey: ["employee", tenantId, workspaceId, employeeId],
    queryFn: async () => {
      if (!actor) return null;
      const r = await actor.getEmployee(tenantId, workspaceId, employeeId);
      return r.__kind__ === "ok" ? r.ok : null;
    },
    enabled: !!actor && !isFetching && !!workspaceId,
  });

  const { data: payrollHistory = [], isLoading: histLoading } = useQuery<
    PayrollRecord[]
  >({
    queryKey: ["payrollRecords", tenantId, workspaceId, employeeId],
    queryFn: async () =>
      actor ? actor.listPayrollRecords(tenantId, workspaceId, employeeId) : [],
    enabled: !!actor && !isFetching && !!workspaceId,
  });

  const { data: deductions = [], isLoading: dedLoading } = useQuery<
    Deduction[]
  >({
    queryKey: ["deductions", tenantId, workspaceId, employeeId],
    queryFn: async () =>
      actor ? actor.listDeductions(tenantId, workspaceId, employeeId) : [],
    enabled: !!actor && !isFetching && !!workspaceId,
  });

  const { data: benefits = [], isLoading: benLoading } = useQuery<Benefit[]>({
    queryKey: ["benefits", tenantId, workspaceId, employeeId],
    queryFn: async () =>
      actor ? actor.listBenefits(tenantId, workspaceId, employeeId) : [],
    enabled: !!actor && !isFetching && !!workspaceId,
  });

  const { data: payStubs = [], isLoading: stubLoading } = useQuery<PayStub[]>({
    queryKey: ["payStubs", tenantId, workspaceId, employeeId],
    queryFn: async () =>
      actor ? actor.listPayStubs(tenantId, workspaceId, employeeId) : [],
    enabled: !!actor && !isFetching && !!workspaceId,
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
        payScheduleId: employee.payScheduleId ?? "",
        contractorFlag: employee.contractorFlag ?? false,
        timeZone: employee.timeZone ?? "",
      };
      const res = await actor.updateEmployee(
        tenantId,
        workspaceId,
        employeeId,
        input,
      );
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: (updated) => {
      toast.success("Employee updated");
      queryClient.setQueryData(
        ["employee", tenantId, workspaceId, employeeId],
        updated,
      );
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setEditing(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deactivateEmployee = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const res = await actor.deactivateEmployee(
        tenantId,
        workspaceId,
        employeeId,
      );
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: (updated) => {
      toast.success("Employee deactivated");
      queryClient.setQueryData(
        ["employee", tenantId, workspaceId, employeeId],
        updated,
      );
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setConfirmDeactivate(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const addDeduction = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const input: DeductionInput = {
        name: dedForm.name.trim(),
        employeeId,
        frequency: dedForm.frequency,
        amount: Math.round(Number.parseFloat(dedForm.amount) * 100),
        deductionType: dedForm.deductionType,
      };
      const res = await actor.addDeduction(tenantId, workspaceId, input);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => {
      toast.success("Deduction added");
      queryClient.invalidateQueries({ queryKey: ["deductions"] });
      setShowAddDeduction(false);
      setDedForm({
        name: "",
        amount: "",
        frequency: DeductionFrequency.perRun,
        deductionType: DeductionType.preTax,
      });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const addBenefit = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const input: BenefitInput = {
        name: benForm.name.trim(),
        employeeId,
        monthlyCost: Math.round(Number.parseFloat(benForm.monthlyCost) * 100),
        startDate: benForm.startDate,
        endDate: benForm.endDate || undefined,
      };
      const res = await actor.addBenefit(tenantId, workspaceId, input);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => {
      toast.success("Benefit added");
      queryClient.invalidateQueries({ queryKey: ["benefits"] });
      setShowAddBenefit(false);
      setBenForm({
        name: "",
        monthlyCost: "",
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
      });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const startEdit = () => {
    if (employee) {
      setForm(employeeToForm(employee));
      setEditing(true);
    }
  };
  const setField =
    (k: keyof EditFormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => (prev ? { ...prev, [k]: e.target.value } : prev));

  if (isLoading)
    return (
      <div className="animate-fade-in-up p-6 md:p-8 max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    );

  if (!employee)
    return (
      <div className="p-8 flex flex-col items-center justify-center gap-4 text-center">
        <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
          <UserX className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-lg font-semibold text-foreground">
          Employee not found
        </p>
        <Button asChild variant="outline">
          <Link to={`/app/${workspaceId}/payroll/employees`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Employees
          </Link>
        </Button>
      </div>
    );

  const TABS: {
    id: DetailTab;
    label: string;
    icon: React.FC<{ className?: string }>;
  }[] = [
    { id: "details", label: "Details", icon: BadgeDollarSign },
    { id: "deductions", label: "Deductions", icon: MinusCircle },
    { id: "benefits", label: "Benefits", icon: Gift },
    { id: "paystubs", label: "Pay Stubs", icon: Receipt },
  ];

  return (
    <div className="animate-fade-in-up p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3 flex-wrap justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            asChild
            aria-label="Back to Employees"
          >
            <Link to={`/app/${workspaceId}/payroll/employees`}>
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
              <Edit2 className="mr-1.5 h-3.5 w-3.5" />
              Edit
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-0.5 border-b border-border"
        data-ocid="employee-detail-tabs"
      >
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            data-ocid={`emp-tab-${id}`}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === id
                ? "border-green-600 text-green-700 dark:text-green-400"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Details Tab */}
      {tab === "details" && (
        <>
          {editing && form ? (
            <Card
              className="border-green-500/20 bg-green-500/[0.02]"
              data-ocid="emp-edit-form"
            >
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-semibold">
                  Edit Employee
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEditing(false)}
                  aria-label="Cancel"
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
                    <Label>First Name</Label>
                    <Input
                      value={form.firstName}
                      onChange={setField("firstName")}
                      required
                      data-ocid="edit-firstname"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Last Name</Label>
                    <Input
                      value={form.lastName}
                      onChange={setField("lastName")}
                      required
                      data-ocid="edit-lastname"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={setField("email")}
                      required
                      data-ocid="edit-email"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Annual Salary</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.salary}
                      onChange={setField("salary")}
                      required
                      data-ocid="edit-salary"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Currency</Label>
                    <Input
                      value={form.currency}
                      onChange={setField("currency")}
                      maxLength={3}
                      data-ocid="edit-currency"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Pay Frequency</Label>
                    <select
                      value={form.payFrequency}
                      onChange={setField("payFrequency")}
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
                    <Label>Tax Rate (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={form.taxRate}
                      onChange={setField("taxRate")}
                      required
                      data-ocid="edit-tax-rate"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={form.startDate}
                      onChange={setField("startDate")}
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
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
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
                      {fmtCurrency(employee.salary, employee.currency)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground mb-1">
                      Currency
                    </dt>
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
                    <dt className="text-xs text-muted-foreground mb-1">
                      Tax Rate
                    </dt>
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
                      {fmtCurrency(
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
              ) : payrollHistory.length === 0 ? (
                <div
                  className="py-10 text-center text-sm text-muted-foreground"
                  data-ocid="emp-history-empty"
                >
                  No payroll records yet.
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
                          Gross
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
                      {[...payrollHistory]
                        .sort(
                          (a, b) => Number(b.createdAt) - Number(a.createdAt),
                        )
                        .map((record) => (
                          <tr
                            key={record.id}
                            className="border-b border-border/60 last:border-0"
                            data-ocid={`emp-record-${record.id}`}
                          >
                            <td className="py-3 pr-4 font-medium text-foreground">
                              {record.period}
                            </td>
                            <td className="py-3 pr-4 text-right font-mono tabular-nums font-semibold text-foreground">
                              {fmtCurrency(record.amount, record.currency)}
                            </td>
                            <td className="py-3 pr-4 text-right">
                              <StatusBadge status={record.status} />
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
                        This removes {employee.firstName} from active payroll.
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
                        Remove {employee.firstName} from active payroll.
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
        </>
      )}

      {/* Deductions Tab */}
      {tab === "deductions" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {deductions.length} deduction{deductions.length !== 1 ? "s" : ""}{" "}
              configured
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowAddDeduction((v) => !v)}
              data-ocid="add-deduction-btn"
            >
              {showAddDeduction ? (
                <>
                  <X className="mr-1.5 h-3.5 w-3.5" />
                  Cancel
                </>
              ) : (
                <>
                  <Plus className="mr-1.5 h-3.5 w-3.5" />
                  Add Deduction
                </>
              )}
            </Button>
          </div>

          {showAddDeduction && (
            <Card
              className="border-border bg-muted/10"
              data-ocid="add-deduction-form"
            >
              <CardContent className="pt-5">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    addDeduction.mutate();
                  }}
                  className="grid gap-4 sm:grid-cols-2"
                >
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>Deduction Name</Label>
                    <Input
                      value={dedForm.name}
                      onChange={(e) =>
                        setDedForm((p) => ({ ...p, name: e.target.value }))
                      }
                      placeholder="Health Insurance"
                      required
                      data-ocid="ded-name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Amount (USD)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={dedForm.amount}
                      onChange={(e) =>
                        setDedForm((p) => ({ ...p, amount: e.target.value }))
                      }
                      placeholder="50.00"
                      required
                      data-ocid="ded-amount"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Frequency</Label>
                    <select
                      value={dedForm.frequency}
                      onChange={(e) =>
                        setDedForm((p) => ({
                          ...p,
                          frequency: e.target.value as DeductionFrequency,
                        }))
                      }
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      data-ocid="ded-frequency"
                    >
                      <option value={DeductionFrequency.perRun}>Per Run</option>
                      <option value={DeductionFrequency.annual}>Annual</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Type</Label>
                    <select
                      value={dedForm.deductionType}
                      onChange={(e) =>
                        setDedForm((p) => ({
                          ...p,
                          deductionType: e.target.value as DeductionType,
                        }))
                      }
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      data-ocid="ded-type"
                    >
                      <option value={DeductionType.preTax}>Pre-Tax</option>
                      <option value={DeductionType.postTax}>Post-Tax</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2 flex gap-3 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAddDeduction(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={addDeduction.isPending}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      data-ocid="ded-submit"
                    >
                      {addDeduction.isPending ? "Adding…" : "Add Deduction"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {dedLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((n) => (
                <Skeleton key={n} className="h-14 rounded-xl" />
              ))}
            </div>
          ) : deductions.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/10 py-14 text-center"
              data-ocid="deductions-empty"
            >
              <MinusCircle className="h-8 w-8 text-muted-foreground/30 mb-3" />
              <p className="text-sm font-medium text-foreground">
                No deductions yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Add deductions like health insurance or pension contributions.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Name
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden sm:table-cell">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden sm:table-cell">
                      Frequency
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {deductions.map((d) => (
                    <tr
                      key={d.id}
                      className="border-b border-border/60 last:border-0"
                      data-ocid={`deduction-row-${d.id}`}
                    >
                      <td className="px-4 py-3 font-medium text-foreground">
                        {d.name}
                      </td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums text-foreground">
                        $
                        {(d.amount / 100).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground capitalize">
                        {d.deductionType === DeductionType.preTax
                          ? "Pre-Tax"
                          : "Post-Tax"}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground capitalize">
                        {d.frequency === DeductionFrequency.perRun
                          ? "Per Run"
                          : "Annual"}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          className={
                            d.isActive
                              ? "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/20 text-xs"
                              : "bg-muted text-muted-foreground text-xs"
                          }
                        >
                          {d.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Benefits Tab */}
      {tab === "benefits" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {benefits.length} benefit{benefits.length !== 1 ? "s" : ""}{" "}
              enrolled
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowAddBenefit((v) => !v)}
              data-ocid="add-benefit-btn"
            >
              {showAddBenefit ? (
                <>
                  <X className="mr-1.5 h-3.5 w-3.5" />
                  Cancel
                </>
              ) : (
                <>
                  <Plus className="mr-1.5 h-3.5 w-3.5" />
                  Add Benefit
                </>
              )}
            </Button>
          </div>

          {showAddBenefit && (
            <Card
              className="border-border bg-muted/10"
              data-ocid="add-benefit-form"
            >
              <CardContent className="pt-5">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    addBenefit.mutate();
                  }}
                  className="grid gap-4 sm:grid-cols-2"
                >
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>Benefit Name</Label>
                    <Input
                      value={benForm.name}
                      onChange={(e) =>
                        setBenForm((p) => ({ ...p, name: e.target.value }))
                      }
                      placeholder="Health Insurance Plan A"
                      required
                      data-ocid="ben-name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Monthly Cost (USD)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={benForm.monthlyCost}
                      onChange={(e) =>
                        setBenForm((p) => ({
                          ...p,
                          monthlyCost: e.target.value,
                        }))
                      }
                      placeholder="150.00"
                      required
                      data-ocid="ben-cost"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={benForm.startDate}
                      onChange={(e) =>
                        setBenForm((p) => ({ ...p, startDate: e.target.value }))
                      }
                      required
                      data-ocid="ben-start"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label>End Date (optional)</Label>
                    <Input
                      type="date"
                      value={benForm.endDate}
                      onChange={(e) =>
                        setBenForm((p) => ({ ...p, endDate: e.target.value }))
                      }
                      data-ocid="ben-end"
                    />
                  </div>
                  <div className="sm:col-span-2 flex gap-3 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAddBenefit(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={addBenefit.isPending}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      data-ocid="ben-submit"
                    >
                      {addBenefit.isPending ? "Adding…" : "Add Benefit"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {benLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((n) => (
                <Skeleton key={n} className="h-14 rounded-xl" />
              ))}
            </div>
          ) : benefits.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/10 py-14 text-center"
              data-ocid="benefits-empty"
            >
              <Gift className="h-8 w-8 text-muted-foreground/30 mb-3" />
              <p className="text-sm font-medium text-foreground">
                No benefits enrolled
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Add health insurance, retirement plans, and more.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Benefit
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                      Monthly Cost
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden sm:table-cell">
                      Start
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden sm:table-cell">
                      End
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {benefits.map((b) => (
                    <tr
                      key={b.id}
                      className="border-b border-border/60 last:border-0"
                      data-ocid={`benefit-row-${b.id}`}
                    >
                      <td className="px-4 py-3 font-medium text-foreground">
                        {b.name}
                      </td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums text-foreground">
                        $
                        {(b.monthlyCost / 100).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">
                        {b.startDate}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">
                        {b.endDate ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          className={
                            b.isActive
                              ? "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/20 text-xs"
                              : "bg-muted text-muted-foreground text-xs"
                          }
                        >
                          {b.isActive ? "Active" : "Ended"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Pay Stubs Tab */}
      {tab === "paystubs" && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {payStubs.length} pay stub{payStubs.length !== 1 ? "s" : ""}{" "}
            generated
          </p>
          {stubLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((n) => (
                <Skeleton key={n} className="h-14 rounded-xl" />
              ))}
            </div>
          ) : payStubs.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/10 py-14 text-center"
              data-ocid="paystubs-empty"
            >
              <Receipt className="h-8 w-8 text-muted-foreground/30 mb-3" />
              <p className="text-sm font-medium text-foreground">
                No pay stubs yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Pay stubs are generated automatically when payroll is processed.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Period
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                      Gross Pay
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground hidden sm:table-cell">
                      Tax
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                      Net Pay
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                      Download
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[...payStubs]
                    .sort(
                      (a, b) => Number(b.generatedAt) - Number(a.generatedAt),
                    )
                    .map((stub) => (
                      <tr
                        key={stub.id}
                        className="border-b border-border/60 last:border-0"
                        data-ocid={`paystub-row-${stub.id}`}
                      >
                        <td className="px-4 py-3 font-medium text-foreground">
                          {stub.period}
                        </td>
                        <td className="px-4 py-3 text-right font-mono tabular-nums text-foreground">
                          $
                          {(stub.grossPay / 100).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-4 py-3 text-right font-mono tabular-nums text-muted-foreground hidden sm:table-cell">
                          $
                          {(stub.taxDeductions / 100).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-4 py-3 text-right font-mono tabular-nums font-semibold text-foreground">
                          $
                          {(stub.netPay / 100).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openPayStub(stub, employee)}
                            aria-label="Download pay stub"
                            data-ocid={`paystub-download-${stub.id}`}
                          >
                            <Download className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
