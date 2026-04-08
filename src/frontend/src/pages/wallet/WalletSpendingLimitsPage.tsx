import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Info,
  Save,
  Shield,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId, useWorkspace } from "../../hooks/useWorkspace";
import { Role } from "../../types";
import type { WorkspaceSpendingLimit } from "../../types";

interface LimitState {
  maxAmount: string;
  currency: string;
}

const CURRENCIES = ["USD", "ICP", "BTC"];

const ROLE_META: Record<
  Role.Admin | Role.Manager | Role.TeamMember,
  {
    label: string;
    description: string;
    icon: React.ElementType;
    color: string;
    bg: string;
  }
> = {
  [Role.Admin]: {
    label: "Admin",
    description: "Full access — can approve all transactions",
    icon: ShieldCheck,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-500/10",
  },
  [Role.Manager]: {
    label: "Manager",
    description: "Can send up to the defined limit without approval",
    icon: Shield,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
  },
  [Role.TeamMember]: {
    label: "Team Member",
    description: "Transactions above limit require Admin approval",
    icon: ShieldAlert,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
  },
};

const SCOPED_ROLES = [Role.Admin, Role.Manager, Role.TeamMember] as const;

function limitFromData(
  data: WorkspaceSpendingLimit | null | undefined,
): LimitState {
  return {
    maxAmount: data ? data.maxAmount.toString() : "1000",
    currency: data?.currency ?? "USD",
  };
}

export default function WalletSpendingLimitsPage() {
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const adminQuery = useQuery<WorkspaceSpendingLimit | null>({
    queryKey: ["spendingLimit", tenantId, workspaceId, Role.Admin],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSpendingLimit(tenantId, workspaceId, Role.Admin);
    },
    enabled: !!actor && !isFetching && !!workspaceId,
  });
  const managerQuery = useQuery<WorkspaceSpendingLimit | null>({
    queryKey: ["spendingLimit", tenantId, workspaceId, Role.Manager],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSpendingLimit(tenantId, workspaceId, Role.Manager);
    },
    enabled: !!actor && !isFetching && !!workspaceId,
  });
  const memberQuery = useQuery<WorkspaceSpendingLimit | null>({
    queryKey: ["spendingLimit", tenantId, workspaceId, Role.TeamMember],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSpendingLimit(tenantId, workspaceId, Role.TeamMember);
    },
    enabled: !!actor && !isFetching && !!workspaceId,
  });

  const isLoading =
    adminQuery.isLoading || managerQuery.isLoading || memberQuery.isLoading;

  const [adminLimit, setAdminLimit] = useState<LimitState>({
    maxAmount: "1000",
    currency: "USD",
  });
  const [managerLimit, setManagerLimit] = useState<LimitState>({
    maxAmount: "1000",
    currency: "USD",
  });
  const [memberLimit, setMemberLimit] = useState<LimitState>({
    maxAmount: "500",
    currency: "USD",
  });

  useEffect(() => {
    if (adminQuery.data !== undefined)
      setAdminLimit(limitFromData(adminQuery.data));
  }, [adminQuery.data]);
  useEffect(() => {
    if (managerQuery.data !== undefined)
      setManagerLimit(limitFromData(managerQuery.data));
  }, [managerQuery.data]);
  useEffect(() => {
    if (memberQuery.data !== undefined)
      setMemberLimit(limitFromData(memberQuery.data));
  }, [memberQuery.data]);

  const stateByRole: Record<
    Role.Admin | Role.Manager | Role.TeamMember,
    {
      state: LimitState;
      setState: React.Dispatch<React.SetStateAction<LimitState>>;
    }
  > = {
    [Role.Admin]: { state: adminLimit, setState: setAdminLimit },
    [Role.Manager]: { state: managerLimit, setState: setManagerLimit },
    [Role.TeamMember]: { state: memberLimit, setState: setMemberLimit },
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const rows: [Role, LimitState][] = [
        [Role.Admin, adminLimit],
        [Role.Manager, managerLimit],
        [Role.TeamMember, memberLimit],
      ];
      for (const [role, ls] of rows) {
        const amount = Number.parseFloat(ls.maxAmount);
        if (Number.isNaN(amount) || amount < 0)
          throw new Error(`Invalid amount for ${role}`);
        const res = await actor.setSpendingLimit(
          tenantId,
          workspaceId,
          role,
          amount,
          ls.currency,
        );
        if (res.__kind__ === "err") throw new Error(res.err);
      }
    },
    onSuccess: () => {
      for (const role of SCOPED_ROLES)
        queryClient.invalidateQueries({
          queryKey: ["spendingLimit", tenantId, workspaceId, role],
        });
      toast.success("Spending limits saved");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="animate-fade-in-up p-6 space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: `/app/${workspaceId}/wallet` })}
          aria-label="Back to wallet"
          data-ocid="limits-back-btn"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Shield className="h-6 w-6 text-violet-500" />
            Spending Limits
          </h1>
          <p className="text-sm text-muted-foreground">
            Admin only — set maximum send amounts per role
          </p>
        </div>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-500/5 px-4 py-3">
        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
        <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
          Transactions that exceed a role's spending limit require Admin
          approval before processing. Set to 0 to require approval on all
          transactions.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <Skeleton key={n} className="h-36 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {SCOPED_ROLES.map((role) => {
            const meta = ROLE_META[role];
            const { state, setState } = stateByRole[role];
            const Icon = meta.icon;
            return (
              <Card
                key={role}
                className="shadow-card rounded-xl border border-border/50 bg-card"
              >
                <CardHeader className="pb-3 border-b border-border/40">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg ${meta.bg}`}
                    >
                      <Icon className={`h-4 w-4 ${meta.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold text-foreground">
                        {meta.label}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {meta.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2 space-y-1.5">
                      <Label
                        htmlFor={`limit-amount-${role}`}
                        className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                      >
                        Max Amount
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-mono">
                          $
                        </span>
                        <Input
                          id={`limit-amount-${role}`}
                          type="number"
                          min="0"
                          step="1"
                          placeholder="e.g. 1000"
                          value={state.maxAmount}
                          onChange={(e) =>
                            setState((prev) => ({
                              ...prev,
                              maxAmount: e.target.value,
                            }))
                          }
                          className="pl-7 font-mono tabular-nums"
                          data-ocid={`limit-amount-${role.toLowerCase()}`}
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor={`limit-currency-${role}`}
                        className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                      >
                        Currency
                      </Label>
                      <select
                        id={`limit-currency-${role}`}
                        value={state.currency}
                        onChange={(e) =>
                          setState((prev) => ({
                            ...prev,
                            currency: e.target.value,
                          }))
                        }
                        className="w-full h-9 rounded-md border border-input bg-background px-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                        data-ocid={`limit-currency-${role.toLowerCase()}`}
                      >
                        {CURRENCIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {state.maxAmount === "0" && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-1.5">
                      <Info className="h-3.5 w-3.5" />
                      All transactions for this role will require approval.
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}

          <div className="flex justify-end pt-2">
            <Button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
              className="bg-violet-600 hover:bg-violet-700 text-white gap-2 min-w-[140px] active-press"
              data-ocid="limits-save-btn"
            >
              <Save className="h-4 w-4" />
              {saveMutation.isPending ? "Saving…" : "Save Limits"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
