import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight, Mail, Plus, Users, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId } from "../../hooks/useWorkspace";
import { PayFrequency } from "../../types";
import type { Employee, EmployeeInput } from "../../types";

const FREQUENCIES = [
  PayFrequency.Weekly,
  PayFrequency.BiWeekly,
  PayFrequency.Monthly,
  PayFrequency.Quarterly,
];

interface AddEmployeeFormProps {
  onClose: () => void;
  tenantId: string;
}

function AddEmployeeForm({ onClose, tenantId }: AddEmployeeFormProps) {
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
      };
      const res = await actor.addEmployee(tenantId, input);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => {
      toast.success("Employee added successfully");
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
      className="border-green-500/20 bg-green-500/[0.02]"
      data-ocid="add-employee-form"
    >
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Plus className="h-4 w-4 text-green-600 dark:text-green-400" />
          Add New Employee
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Close form"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
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
            <Label htmlFor="salary">Annual Salary (USD)</Label>
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
          <div className="sm:col-span-2 flex gap-3 justify-end pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={addEmployee.isPending}
              className="bg-green-600 hover:bg-green-700 text-white"
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
  const [showForm, setShowForm] = useState(false);

  const { data: employees = [], isLoading } = useQuery<Employee[]>({
    queryKey: ["employees", tenantId],
    queryFn: async () => (actor ? actor.listEmployees(tenantId) : []),
    enabled: !!actor && !isFetching,
  });

  const activeCount = employees.filter((e) => e.isActive).length;

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            asChild
            aria-label="Back to Payroll"
          >
            <Link to="/app/payroll">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
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
          className="bg-green-600 hover:bg-green-700 text-white"
          data-ocid="employee-add-btn"
        >
          {showForm ? (
            <>
              <X className="mr-2 h-4 w-4" /> Cancel
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" /> Add Employee
            </>
          )}
        </Button>
      </div>

      {/* Add Employee Form */}
      {showForm && (
        <AddEmployeeForm
          onClose={() => setShowForm(false)}
          tenantId={tenantId}
        />
      )}

      {/* Employee List */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((n) => (
            <Skeleton key={n} className="h-[72px] rounded-xl" />
          ))}
        </div>
      ) : employees.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-20 text-center"
          data-ocid="employees-empty"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10 mb-4">
            <Users className="h-7 w-7 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="font-display font-semibold text-foreground">
            No employees yet
          </h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-xs">
            Add your first employee to start managing payroll and compensation.
          </p>
          <Button
            className="mt-6 bg-green-600 hover:bg-green-700 text-white"
            onClick={() => setShowForm(true)}
            data-ocid="employees-empty-cta"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add First Employee
          </Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Employee
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden sm:table-cell">
                  Email
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground hidden md:table-cell">
                  Salary
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden lg:table-cell">
                  Frequency
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3" aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr
                  key={emp.id}
                  data-ocid={`employee-row-${emp.id}`}
                  className="border-b border-border/60 last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-500/10 font-semibold text-green-600 dark:text-green-400 text-sm">
                        {emp.firstName[0]}
                        {emp.lastName[0]}
                      </div>
                      <span className="font-medium text-foreground truncate max-w-[120px]">
                        {emp.firstName} {emp.lastName}
                      </span>
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
                  <td className="px-4 py-3 text-right font-mono tabular-nums hidden md:table-cell">
                    <span className="font-semibold text-foreground">
                      $
                      {(Number(emp.salary) / 100).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                    <span className="ml-1 text-xs text-muted-foreground">
                      {emp.currency}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">
                    {emp.payFrequency}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      className={
                        emp.isActive
                          ? "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/20"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {emp.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to="/app/payroll/employees/$employeeId"
                      params={{ employeeId: emp.id }}
                      aria-label={`View ${emp.firstName} ${emp.lastName}`}
                      className="inline-flex items-center justify-center h-7 w-7 rounded-lg hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
