import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  DollarSign,
  Plus,
  Shield,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId } from "../../hooks/useWorkspace";
import { type EscrowContract, EscrowStatus } from "../../types";

type FilterOption =
  | "All"
  | "Pending"
  | "Funded"
  | "Released"
  | "Disputed"
  | "Cancelled";

interface StatusCfg {
  label: string;
  className: string;
  icon: React.ElementType;
}

const STATUS_CONFIG: Record<EscrowStatus, StatusCfg> = {
  [EscrowStatus.Pending]: {
    label: "Pending",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    icon: Clock,
  },
  [EscrowStatus.Funded]: {
    label: "Funded",
    className:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    icon: DollarSign,
  },
  [EscrowStatus.Released]: {
    label: "Released",
    className:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    icon: CheckCircle2,
  },
  [EscrowStatus.Disputed]: {
    label: "Disputed",
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    icon: AlertTriangle,
  },
  [EscrowStatus.Cancelled]: {
    label: "Cancelled",
    className: "bg-muted text-muted-foreground",
    icon: XCircle,
  },
};

function formatAmount(amount: bigint, currency: string): string {
  const num = Number(amount) / 100;
  return `${currency} ${num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function EscrowCard({ contract }: { contract: EscrowContract }) {
  const navigate = useNavigate();
  const cfg = STATUS_CONFIG[contract.status];
  const Icon = cfg.icon;

  return (
    <button
      type="button"
      onClick={() =>
        navigate({
          to: "/app/escrow/$contractId",
          params: { contractId: contract.id },
        })
      }
      data-ocid={`escrow-card-${contract.id}`}
      className="w-full text-left rounded-xl border border-border bg-card p-4 transition-smooth hover:shadow-md hover:border-amber-300 dark:hover:border-amber-700 group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
            <Shield className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-foreground text-sm truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              {contract.title}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
              {contract.description}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${cfg.className}`}
              >
                <Icon className="h-3 w-3" />
                {cfg.label}
              </span>
              {contract.dueDate && (
                <span className="text-xs text-muted-foreground">
                  Due{" "}
                  {new Date(
                    Number(contract.dueDate) / 1_000_000,
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="font-display font-bold text-sm text-amber-600 dark:text-amber-400">
            {formatAmount(contract.amount, contract.currency)}
          </p>
          <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground ml-auto mt-1 group-hover:text-amber-500 transition-colors" />
        </div>
      </div>
    </button>
  );
}

const FILTERS: FilterOption[] = [
  "All",
  "Pending",
  "Funded",
  "Released",
  "Disputed",
  "Cancelled",
];

export default function EscrowPage() {
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterOption>("All");

  const { data: contracts, isLoading } = useQuery<EscrowContract[]>({
    queryKey: ["escrows", tenantId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listEscrows(tenantId);
    },
    enabled: !!actor && !isFetching,
  });

  const all = contracts ?? [];

  const filtered = all.filter(
    (c) =>
      filter === "All" ||
      c.status === EscrowStatus[filter as keyof typeof EscrowStatus],
  );

  const totalFunded = all
    .filter((c) => c.status === EscrowStatus.Funded)
    .reduce((sum, c) => sum + c.amount, BigInt(0));
  const totalReleased = all
    .filter((c) => c.status === EscrowStatus.Released)
    .reduce((sum, c) => sum + c.amount, BigInt(0));
  const totalPending = all
    .filter((c) => c.status === EscrowStatus.Pending)
    .reduce((sum, c) => sum + c.amount, BigInt(0));

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <Shield className="h-6 w-6 text-amber-500" />
            Escrow
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage secure contract agreements and fund releases
          </p>
        </div>
        <Button
          onClick={() => navigate({ to: "/app/escrow/new" })}
          data-ocid="escrow-new-btn"
          className="bg-amber-500 hover:bg-amber-600 text-white gap-2 shrink-0"
        >
          <Plus className="h-4 w-4" />
          New Escrow
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Total Funded",
            amount: totalFunded,
            color: "text-yellow-600 dark:text-yellow-400",
            bg: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
          },
          {
            label: "Total Released",
            amount: totalReleased,
            color: "text-green-600 dark:text-green-400",
            bg: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
          },
          {
            label: "Pending",
            amount: totalPending,
            color: "text-amber-600 dark:text-amber-400",
            bg: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
          },
        ].map(({ label, amount, color, bg }) => (
          <Card key={label} className={bg}>
            <CardHeader className="pb-1 pt-4">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {label}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              {isLoading ? (
                <Skeleton className="h-7 w-28" />
              ) : (
                <p className={`font-display text-xl font-bold ${color}`}>
                  {Number(amount) === 0
                    ? "—"
                    : `$${(Number(amount) / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter tabs */}
      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label="Filter escrow contracts"
      >
        {FILTERS.map((f) => {
          const count =
            f === "All"
              ? all.length
              : all.filter(
                  (c) =>
                    c.status === EscrowStatus[f as keyof typeof EscrowStatus],
                ).length;
          return (
            <button
              key={f}
              role="tab"
              type="button"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              data-ocid={`escrow-filter-${f.toLowerCase()}`}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-smooth ${
                filter === f
                  ? "bg-amber-500 text-white shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-amber-100 hover:text-amber-700 dark:hover:bg-amber-900/30 dark:hover:text-amber-400"
              }`}
            >
              {f}
              {count > 0 && (
                <span
                  className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                    filter === f
                      ? "bg-white/20 text-white"
                      : "bg-muted-foreground/20"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Contract list */}
      <div className="space-y-2">
        {isLoading ? (
          ["skel-a", "skel-b", "skel-c"].map((k) => (
            <Skeleton key={k} className="h-20 rounded-xl" />
          ))
        ) : filtered.length > 0 ? (
          filtered.map((contract) => (
            <EscrowCard key={contract.id} contract={contract} />
          ))
        ) : (
          <div
            className="rounded-2xl border border-dashed border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10 py-16 text-center"
            data-ocid="escrow-empty"
          >
            <Shield className="mx-auto h-10 w-10 text-amber-300 dark:text-amber-700 mb-3" />
            <p className="text-sm font-semibold text-foreground">
              {filter === "All"
                ? "No escrow contracts yet"
                : `No ${filter.toLowerCase()} contracts`}
            </p>
            <p className="text-xs text-muted-foreground mt-1 mb-4">
              {filter === "All"
                ? "Create a secure escrow agreement to get started."
                : `No contracts with status "${filter}" found.`}
            </p>
            {filter === "All" && (
              <Button
                size="sm"
                onClick={() => navigate({ to: "/app/escrow/new" })}
                className="bg-amber-500 hover:bg-amber-600 text-white"
              >
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                New Escrow
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
