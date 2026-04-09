import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  BadgeDollarSign,
  Loader2,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { useWorkspace } from "../../hooks/useWorkspace";
import type { Employee, WalletAccount } from "../../types";

function formatICP(e8s: bigint): string {
  return `${(Number(e8s) / 1e8).toFixed(4)} ICP`;
}

export default function PayrollNewPage() {
  const { workspaceId } = useParams({ strict: false }) as {
    workspaceId: string;
  };
  const { tenantId } = useWorkspace();
  const { actor, isFetching } = useBackend();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [period, setPeriod] = useState(new Date().toISOString().slice(0, 7));

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

  const hasTreasuryBalance = treasury != null && treasury.icpBalance > 0n;

  const processMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const r = await actor.processPayroll(
        tenantId,
        workspaceId,
        selectedEmployee,
        period,
      );
      if (r.__kind__ === "err") throw new Error(r.err);
      return r.ok;
    },
    onSuccess: () => {
      toast.success("Payroll processed successfully");
      void queryClient.invalidateQueries({ queryKey: ["payroll"] });
      navigate({ to: `/app/${workspaceId}/payroll` as "/" });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedEmployee) {
      toast.error("Please select an employee");
      return;
    }
    if (!hasTreasuryBalance) {
      toast.error("Insufficient treasury balance");
      return;
    }
    processMutation.mutate();
  }

  const selectedEmpData = employees.find((e) => e.id === selectedEmployee);

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: `/app/${workspaceId}/payroll` as "/" })}
          data-ocid="payroll-new-back"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <BadgeDollarSign className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold font-display text-foreground">
              Process Payroll
            </h1>
            <p className="text-sm text-muted-foreground">
              Run payroll for an employee
            </p>
          </div>
        </div>
      </div>

      {/* Treasury balance check */}
      {loadingTreasury ? (
        <Skeleton className="h-16 w-full rounded-lg" />
      ) : !hasTreasuryBalance ? (
        <div
          data-ocid="payroll-new-balance-warning"
          className="flex items-start gap-3 p-4 rounded-lg border border-destructive/30 bg-destructive/5"
        >
          <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
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
            className="shrink-0 gap-1.5"
            onClick={() =>
              navigate({ to: `/app/${workspaceId}/wallet` as "/" })
            }
            data-ocid="payroll-new-fund-treasury-btn"
          >
            <Wallet className="w-3.5 h-3.5" />
            Fund Treasury
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <Wallet className="w-4 h-4 text-primary" />
          <p className="text-sm text-muted-foreground">
            Treasury balance:{" "}
            <span className="font-medium text-foreground">
              {formatICP(treasury.icpBalance)}
            </span>
          </p>
        </div>
      )}

      {/* Form */}
      {hasTreasuryBalance && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-display">
              Payroll Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="payroll-employee">Employee *</Label>
                {loadingEmployees ? (
                  <Skeleton className="h-9 w-full" />
                ) : (
                  <select
                    id="payroll-employee"
                    data-ocid="payroll-employee-select"
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    required
                    className="h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="">Select employee…</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.firstName} {emp.lastName} —{" "}
                        {Number(emp.salary).toLocaleString()} {emp.currency}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {selectedEmpData && (
                <div className="p-3 rounded-lg bg-muted/30 border border-border grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Salary</p>
                    <p className="text-sm font-semibold text-foreground">
                      {Number(selectedEmpData.salary).toLocaleString()}{" "}
                      {selectedEmpData.currency}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Frequency</p>
                    <p className="text-sm font-semibold text-foreground">
                      {selectedEmpData.payFrequency}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Tax Rate</p>
                    <p className="text-sm font-semibold text-foreground">
                      {selectedEmpData.taxRate.toString()}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-semibold text-foreground truncate">
                      {selectedEmpData.email}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="payroll-period">Pay Period *</Label>
                <Input
                  id="payroll-period"
                  data-ocid="payroll-period-input"
                  type="month"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    navigate({ to: `/app/${workspaceId}/payroll` as "/" })
                  }
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  data-ocid="payroll-submit-btn"
                  disabled={
                    processMutation.isPending ||
                    !selectedEmployee ||
                    !hasTreasuryBalance
                  }
                  className="gap-2"
                >
                  {processMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing…
                    </>
                  ) : (
                    <>
                      <BadgeDollarSign className="w-4 h-4" />
                      Process Payroll
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
