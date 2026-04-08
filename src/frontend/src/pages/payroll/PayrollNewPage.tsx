import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  BadgeDollarSign,
  CheckCircle2,
  Play,
  Users,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId, useWorkspace } from "../../hooks/useWorkspace";
import type { Employee, WalletAccount } from "../../types";

function formatIcp(balance: bigint): string {
  return (Number(balance) / 1_000_000_00).toFixed(4);
}

function formatCurrency(amount: bigint | number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(Number(amount) / 100);
}

export default function PayrollNewPage() {
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [period, setPeriod] = useState(new Date().toISOString().slice(0, 7));
  const [runError, setRunError] = useState<string | null>(null);

  // Fetch treasury
  const { data: treasury, isLoading: treasuryLoading } =
    useQuery<WalletAccount | null>({
      queryKey: ["workspaceTreasury", tenantId, workspaceId],
      queryFn: async () => {
        if (!actor) return null;
        return actor.getWorkspaceTreasury(tenantId, workspaceId);
      },
      enabled: !!actor && !!workspaceId && !isFetching,
    });

  // Fetch active employees
  const { data: employees = [], isLoading: empLoading } = useQuery<Employee[]>({
    queryKey: ["employees", tenantId, workspaceId],
    queryFn: async () =>
      actor ? actor.listEmployees(tenantId, workspaceId) : [],
    enabled: !!actor && !isFetching && !!workspaceId,
  });

  const icpBalance = treasury?.icpBalance ?? BigInt(0);
  const hasNoFunds = !treasuryLoading && icpBalance === BigInt(0);
  const activeEmployees = employees.filter((e) => e.isActive);
  const selectedEmployees = activeEmployees.filter((e) => selected.has(e.id));
  const totalEstimate = selectedEmployees.reduce(
    (s, e) => s + Number(e.salary),
    0,
  );

  const toggleAll = () => {
    if (selected.size === activeEmployees.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(activeEmployees.map((e) => e.id)));
    }
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const runMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      if (selected.size === 0) throw new Error("Select at least one employee");

      const results = await Promise.allSettled(
        [...selected].map((id) =>
          actor.processPayroll(tenantId, workspaceId, id, period),
        ),
      );

      // Check for insufficient funds error in results
      for (const r of results) {
        if (r.status === "fulfilled" && r.value.__kind__ === "err") {
          if (r.value.err.toLowerCase().includes("insufficient")) {
            throw new Error(r.value.err);
          }
        }
      }

      const succeeded = results.filter(
        (r) => r.status === "fulfilled" && r.value.__kind__ === "ok",
      ).length;
      return succeeded;
    },
    onSuccess: (count) => {
      setRunError(null);
      queryClient.invalidateQueries({ queryKey: ["payrollRecords"] });
      toast.success(`Payroll processed for ${count} employee(s)`);
      navigate({ to: `/app/${workspaceId}/payroll` });
    },
    onError: (e: Error) => {
      setRunError(e.message);
      toast.error(e.message);
    },
  });

  const isRunDisabled =
    runMutation.isPending || hasNoFunds || selected.size === 0;

  return (
    <div className="animate-fade-in-up p-6 md:p-8 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate({ to: `/app/${workspaceId}/payroll` })}
          aria-label="Back to payroll"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card hover:bg-muted transition-smooth"
        >
          <ArrowLeft className="h-4 w-4 text-muted-foreground" />
        </button>
        <div>
          <h1 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
            <BadgeDollarSign className="h-5 w-5 text-emerald-500" />
            Run Payroll
          </h1>
          <p className="text-sm text-muted-foreground">
            Select employees and period to process payroll
          </p>
        </div>
      </div>

      {/* Treasury balance */}
      {!treasuryLoading && treasury && (
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 w-fit">
          <Wallet className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            Workspace Treasury:
          </span>
          <span
            className={`text-xs font-semibold tabular-nums ${
              icpBalance === BigInt(0) ? "text-destructive" : "text-foreground"
            }`}
          >
            {formatIcp(icpBalance)} ICP
          </span>
        </div>
      )}

      {/* No-funds banner */}
      {hasNoFunds && (
        <div
          className="flex items-start gap-3 rounded-xl border border-amber-400/40 bg-amber-500/8 px-4 py-3"
          data-ocid="payroll-run-insufficient-funds-banner"
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
            data-ocid="payroll-run-fund-wallet-btn"
          >
            <Link to={`/app/${workspaceId}/wallet`}>
              <Wallet className="h-3.5 w-3.5" />
              Fund Wallet
            </Link>
          </Button>
        </div>
      )}

      {/* Run error (e.g. backend returns Insufficient treasury balance) */}
      {runError && !hasNoFunds && (
        <div
          className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3"
          data-ocid="payroll-run-error-banner"
          role="alert"
        >
          <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">{runError}</p>
          </div>
          {runError.toLowerCase().includes("insufficient") && (
            <Button
              asChild
              size="sm"
              variant="outline"
              className="shrink-0 gap-1.5 border-amber-400/60 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10"
              data-ocid="payroll-error-fund-wallet-btn"
            >
              <Link to={`/app/${workspaceId}/wallet`}>
                <Wallet className="h-3.5 w-3.5" />
                Fund Wallet
              </Link>
            </Button>
          )}
        </div>
      )}

      {/* Period selector */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-foreground">
            Pay Period
          </CardTitle>
        </CardHeader>
        <CardContent>
          <input
            type="month"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            data-ocid="payroll-run-period"
          />
        </CardContent>
      </Card>

      {/* Employee selection */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Users className="h-4 w-4 text-emerald-500" />
              Select Employees
            </CardTitle>
            <button
              type="button"
              onClick={toggleAll}
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
              data-ocid="payroll-toggle-all"
            >
              {selected.size === activeEmployees.length
                ? "Deselect all"
                : "Select all"}
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {empLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((n) => (
                <Skeleton key={n} className="h-12 rounded-lg" />
              ))}
            </div>
          ) : activeEmployees.length === 0 ? (
            <div className="py-8 text-center">
              <Users className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
              <p className="text-sm text-muted-foreground">
                No active employees
              </p>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="mt-2 text-xs text-emerald-600"
              >
                <Link to={`/app/${workspaceId}/payroll/employees`}>
                  Add Employees
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-1.5">
              {activeEmployees.map((emp) => {
                const isSelected = selected.has(emp.id);
                return (
                  <button
                    key={emp.id}
                    type="button"
                    onClick={() => toggleOne(emp.id)}
                    data-ocid={`payroll-select-emp-${emp.id}`}
                    className={`w-full flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-smooth ${
                      isSelected
                        ? "border-emerald-400/60 bg-emerald-500/8"
                        : "border-border bg-card hover:bg-muted/50"
                    }`}
                  >
                    <div
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-smooth ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-500"
                          : "border-border bg-background"
                      }`}
                    >
                      {isSelected && (
                        <CheckCircle2 className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                      {emp.firstName[0]}
                      {emp.lastName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {emp.firstName} {emp.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {emp.email}
                      </p>
                    </div>
                    <p className="text-xs font-semibold text-foreground tabular-nums shrink-0">
                      {formatCurrency(emp.salary, emp.currency)}
                    </p>
                  </button>
                );
              })}
            </div>
          )}

          {selected.size > 0 && (
            <div className="mt-4 flex items-center justify-between rounded-lg bg-emerald-500/8 border border-emerald-400/30 px-4 py-2.5">
              <span className="text-xs text-muted-foreground">
                {selected.size} employee{selected.size !== 1 ? "s" : ""}{" "}
                selected
              </span>
              <span className="text-sm font-semibold text-foreground tabular-nums">
                Estimated: {formatCurrency(totalEstimate, "USD")}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate({ to: `/app/${workspaceId}/payroll` })}
          data-ocid="payroll-run-cancel-btn"
        >
          Cancel
        </Button>
        <Button
          type="button"
          disabled={isRunDisabled}
          onClick={() => {
            setRunError(null);
            runMutation.mutate();
          }}
          data-ocid="payroll-run-submit-btn"
          className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[140px] disabled:opacity-60 gap-2"
          title={
            hasNoFunds
              ? "Fund your workspace wallet before processing payroll"
              : selected.size === 0
                ? "Select at least one employee"
                : undefined
          }
        >
          {runMutation.isPending ? (
            "Processing..."
          ) : (
            <>
              <Play className="h-3.5 w-3.5" />
              Process Payroll
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
