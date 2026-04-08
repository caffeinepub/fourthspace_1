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
  ChevronRight,
  Mail,
  Plus,
  Search,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId, useWorkspace } from "../../hooks/useWorkspace";
import { PayFrequency } from "../../types";
import type { Employee, EmployeeInput, PaySchedule } from "../../types";

const FREQUENCIES = [
  PayFrequency.Weekly,
  PayFrequency.BiWeekly,
  PayFrequency.SemiMonthly,
  PayFrequency.Monthly,
  PayFrequency.Quarterly,
];

type FilterStatus = "all" | "active" | "inactive";

interface AddEmployeeFormProps {
  onClose: () => void;
  tenantId: string;
  workspaceId: string;
  paySchedules: PaySchedule[];
}

function AddEmployeeForm({
  onClose,
  tenantId,
  workspaceId,
  paySchedules,
}: AddEmployeeFormProps) {
  const { actor } = useBackend();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    salary: "",
    currency: "USD",
    payFrequency: PayFrequency.Monthly,
    taxRate: "20",
    startDate: new Date().toISOString().split("T")[0],
    payScheduleId: "",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    isContractor: false,
  });

  const addEmployee = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const { Principal } = await import("@icp-sdk/core/principal");
      const input: EmployeeInput = {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        salary: BigInt(Math.round(Number.parseFloat(form.salary) * 100)),
        currency: form.currency,
        payFrequency: form.payFrequency,
        taxRate: BigInt(Number.parseInt(form.taxRate)),
        startDate: BigInt(new Date(form.startDate).getTime() * 1_000_000),
        userId: Principal.anonymous(),
        payScheduleId: form.payScheduleId ?? "",
        timeZone: form.timeZone ?? "",
        contractorFlag: form.isContractor,
      };
      const res = await actor.addEmployee(tenantId, workspaceId, input);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => {
      toast.success("Employee added");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      onClose();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [k]: e.target.value }));

  return (
    <Card
      className="shadow-card rounded-xl border border-emerald-500/20 bg-emerald-500/[0.02]"
      data-ocid="add-employee-form"
    >
      <CardHeader className="pb-3 flex flex-row items-center justify-between border-b border-border/40">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Plus className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          Add New Employee
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
            addEmployee.mutate();
          }}
          className="grid gap-4 sm:grid-cols-2"
        >
          <div className="space-y-1.5">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={form.firstName}
              onChange={set("firstName")}
              placeholder="Jane"
              required
              data-ocid="emp-firstname"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={form.lastName}
              onChange={set("lastName")}
              placeholder="Smith"
              required
              data-ocid="emp-lastname"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="jane.smith@company.com"
              required
              data-ocid="emp-email"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="salary">Annual Salary</Label>
            <Input
              id="salary"
              type="number"
              min="0"
              step="0.01"
              value={form.salary}
              onChange={set("salary")}
              placeholder="65000"
              required
              data-ocid="emp-salary"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="taxRate">Tax Rate (%)</Label>
            <Input
              id="taxRate"
              type="number"
              min="0"
              max="100"
              value={form.taxRate}
              onChange={set("taxRate")}
              placeholder="20"
              required
              data-ocid="emp-tax-rate"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="payFrequency">Pay Frequency</Label>
            <select
              id="payFrequency"
              value={form.payFrequency}
              onChange={set("payFrequency")}
              data-ocid="emp-pay-frequency"
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
            <Label htmlFor="currency">Currency</Label>
            <Input
              id="currency"
              value={form.currency}
              onChange={set("currency")}
              placeholder="USD"
              maxLength={3}
              data-ocid="emp-currency"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={form.startDate}
              onChange={set("startDate")}
              required
              data-ocid="emp-start-date"
            />
          </div>
          {paySchedules.length > 0 && (
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="payScheduleId">Pay Schedule</Label>
              <select
                id="payScheduleId"
                value={form.payScheduleId}
                onChange={set("payScheduleId")}
                data-ocid="emp-pay-schedule"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">None (default)</option>
                {paySchedules.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="sm:col-span-2 flex items-center gap-3">
            <input
              type="checkbox"
              id="isContractor"
              checked={form.isContractor}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, isContractor: e.target.checked }))
              }
              className="h-4 w-4 rounded border-input"
              data-ocid="emp-contractor-toggle"
            />
            <Label htmlFor="isContractor" className="cursor-pointer">
              Mark as contractor
            </Label>
          </div>
          <div className="sm:col-span-2 flex gap-3 justify-end pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={addEmployee.isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white active-press"
              data-ocid="emp-submit-btn"
            >
              {addEmployee.isPending ? "Saving…" : "Add Employee"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default function EmployeesPage() {
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterStatus>("all");

  const { data: employees = [], isLoading } = useQuery<Employee[]>({
    queryKey: ["employees", tenantId, workspaceId],
    queryFn: async () =>
      actor ? actor.listEmployees(tenantId, workspaceId) : [],
    enabled: !!actor && !isFetching && !!workspaceId,
  });

  const { data: paySchedules = [] } = useQuery<PaySchedule[]>({
    queryKey: ["paySchedules", tenantId, workspaceId],
    queryFn: async () =>
      actor ? actor.listPaySchedules(tenantId, workspaceId) : [],
    enabled: !!actor && !isFetching && !!workspaceId,
  });

  const filtered = employees.filter((e) => {
    const matchStatus =
      filter === "all" ||
      (filter === "active" && e.isActive) ||
      (filter === "inactive" && !e.isActive);
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const activeCount = employees.filter((e) => e.isActive).length;

  return (
    <div className="animate-fade-in-up p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            asChild
            aria-label="Back to Payroll"
          >
            <Link to={`/app/${workspaceId}/payroll`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Employees
            </h1>
            <p className="text-sm text-muted-foreground">
              {isLoading
                ? "Loading…"
                : `${activeCount} active · ${employees.length} total`}
            </p>
          </div>
        </div>
        <Button
          onClick={() => setShowForm((v) => !v)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white active-press"
          data-ocid="employee-add-btn"
        >
          {showForm ? (
            <>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Add Employee
            </>
          )}
        </Button>
      </div>

      {showForm && (
        <AddEmployeeForm
          onClose={() => setShowForm(false)}
          tenantId={tenantId}
          workspaceId={workspaceId}
          paySchedules={paySchedules}
        />
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-ocid="employees-search"
          />
        </div>
        <div
          className="flex gap-1 p-1 bg-muted rounded-lg"
          data-ocid="employees-filter"
        >
          {(["all", "active", "inactive"] as FilterStatus[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${filter === f ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              data-ocid={`employees-filter-${f}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((n) => (
            <Skeleton key={n} className="h-[68px] rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-20 text-center"
          data-ocid="employees-empty"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 mb-4">
            <Users className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="font-display font-semibold text-foreground">
            {search || filter !== "all"
              ? "No employees match filters"
              : "No employees yet"}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-xs">
            {search || filter !== "all"
              ? "Try adjusting your search or filters."
              : "Add your first employee to start managing payroll."}
          </p>
          {!search && filter === "all" && (
            <Button
              className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white active-press"
              onClick={() => setShowForm(true)}
              data-ocid="employees-empty-cta"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add First Employee
            </Button>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border/50 bg-card shadow-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40 bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                  Pay Schedule
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                  Salary
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3" aria-label="Actions" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filtered.map((emp) => {
                const sched = paySchedules.find(
                  (s) =>
                    s.id ===
                    (emp as Employee & { payScheduleId?: string })
                      .payScheduleId,
                );
                return (
                  <tr
                    key={emp.id}
                    data-ocid={`employee-row-${emp.id}`}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 font-semibold text-emerald-600 dark:text-emerald-400 text-sm">
                          {emp.firstName[0]}
                          {emp.lastName[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate max-w-[120px]">
                            {emp.firstName} {emp.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {emp.payFrequency}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <Mail className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate max-w-[160px]">
                          {emp.email}
                        </span>
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-muted-foreground text-sm">
                      {sched ? (
                        sched.name
                      ) : (
                        <span className="text-muted-foreground/40">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right hidden md:table-cell">
                      <span className="font-mono font-semibold tabular-nums text-foreground">
                        $
                        {(Number(emp.salary) / 100).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                      <span className="ml-1 text-xs text-muted-foreground">
                        {emp.currency}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${emp.isActive ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20" : "bg-muted text-muted-foreground border-border"}`}
                        >
                          {emp.isActive ? "Active" : "Inactive"}
                        </span>
                        {(emp as Employee & { isContractor?: boolean })
                          .isContractor && (
                          <Badge
                            variant="outline"
                            className="text-xs text-muted-foreground"
                          >
                            1099
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/app/${workspaceId}/payroll/employees/${emp.id}`}
                        aria-label={`View ${emp.firstName} ${emp.lastName}`}
                        className="inline-flex items-center justify-center h-7 w-7 rounded-lg hover:bg-muted transition-colors"
                      >
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
