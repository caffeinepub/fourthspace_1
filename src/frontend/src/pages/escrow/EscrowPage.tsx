import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  Filter,
  Plus,
  Shield,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId, useWorkspace } from "../../hooks/useWorkspace";
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
      "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20",
    icon: Clock,
  },
  [EscrowStatus.Funded]: {
    label: "Funded",
    className:
      "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
    icon: DollarSign,
  },
  [EscrowStatus.Released]: {
    label: "Released",
    className:
      "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
    icon: CheckCircle2,
  },
  [EscrowStatus.Disputed]: {
    label: "Disputed",
    className: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/20",
    icon: AlertTriangle,
  },
  [EscrowStatus.Cancelled]: {
    label: "Cancelled",
    className: "bg-muted text-muted-foreground border-border",
    icon: XCircle,
  },
};

const STATUS_DOTS: Record<EscrowStatus, string> = {
  [EscrowStatus.Pending]: "bg-amber-500",
  [EscrowStatus.Funded]: "bg-yellow-500",
  [EscrowStatus.Released]: "bg-emerald-500",
  [EscrowStatus.Disputed]: "bg-red-500",
  [EscrowStatus.Cancelled]: "bg-muted-foreground",
};

function formatAmount(amount: bigint, currency: string): string {
  const num = Number(amount) / 100;
  return `${currency} ${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function EscrowCard({
  contract,
  workspaceId,
}: { contract: EscrowContract; workspaceId: string }) {
  const navigate = useNavigate();
  const cfg = STATUS_CONFIG[contract.status];
  const Icon = cfg.icon;

  return (
    <button
      type="button"
      onClick={() =>
        navigate({
          to: `/app/${workspaceId}/escrow/$escrowId`,
          params: { escrowId: contract.id },
        })
      }
      data-ocid={`escrow-card-${contract.id}`}
      className="w-full text-left rounded-xl border border-border/50 bg-card shadow-card hover:shadow-card-hover hover:border-amber-300/60 dark:hover:border-amber-700/60 transition-all duration-200 group p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
            <Shield className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="min-w-0 space-y-1.5">
            <p className="font-semibold text-foreground text-sm truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              {contract.title}
            </p>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {contract.description}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[
                  EscrowStatus.Pending,
                  EscrowStatus.Funded,
                  EscrowStatus.Released,
                ].map((s) => {
                  const statusOrder = [
                    EscrowStatus.Pending,
                    EscrowStatus.Funded,
                    EscrowStatus.Released,
                  ];
                  const currentIdx = statusOrder.indexOf(contract.status);
                  const thisIdx = statusOrder.indexOf(s);
                  const isPast =
                    thisIdx <= currentIdx &&
                    contract.status !== EscrowStatus.Disputed &&
                    contract.status !== EscrowStatus.Cancelled;
                  return (
                    <div
                      key={s}
                      className={`h-1.5 w-4 rounded-full transition-colors ${isPast ? STATUS_DOTS[s] : "bg-border"}`}
                    />
                  );
                })}
              </div>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium border ${cfg.className}`}
              >
                <Icon className="h-3 w-3" />
                {cfg.label}
              </span>
              {contract.dueDate && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(
                    Number(contract.dueDate) / 1_000_000,
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="font-display font-bold text-sm text-amber-600 dark:text-amber-400 font-mono tabular-nums">
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
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterOption>("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { data: contracts, isLoading } = useQuery<EscrowContract[]>({
    queryKey: ["escrows", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listEscrows(tenantId, workspaceId, null);
    },
    enabled: !!actor && !isFetching && !!workspaceId,
  });

  const all = contracts ?? [];

  const filtered = all.filter((c) => {
    const statusMatch =
      filter === "All" ||
      c.status === EscrowStatus[filter as keyof typeof EscrowStatus];
    let dateMatch = true;
    if (dateFrom || dateTo) {
      const ts = Number(c.createdAt) / 1_000_000;
      if (dateFrom) dateMatch = dateMatch && ts >= new Date(dateFrom).getTime();
      if (dateTo)
        dateMatch =
          dateMatch && ts <= new Date(dateTo).getTime() + 86_400_000 - 1;
    }
    return statusMatch && dateMatch;
  });

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
    <div className="animate-fade-in-up p-4 sm:p-6 space-y-5 max-w-5xl mx-auto pb-20 md:pb-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/20">
            <Shield className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Escrow
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage secure on-chain contract agreements
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters((v) => !v)}
            data-ocid="escrow-filters-toggle"
            className={`min-h-[44px] ${showFilters ? "border-amber-400/60 text-amber-600" : ""}`}
          >
            <Filter className="h-4 w-4 mr-1.5" />
            <span className="hidden sm:inline">Filters</span>
          </Button>
          <Button
            onClick={() => navigate({ to: `/app/${workspaceId}/escrow/new` })}
            data-ocid="escrow-new-btn"
            className="bg-amber-500 hover:bg-amber-600 text-white active-press gap-1.5 min-h-[44px]"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Escrow</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
        {[
          {
            label: "Funded",
            amount: totalFunded,
            color: "text-yellow-600 dark:text-yellow-400",
            bg: "bg-yellow-500/10",
            icon: DollarSign,
          },
          {
            label: "Released",
            amount: totalReleased,
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-500/10",
            icon: CheckCircle2,
          },
          {
            label: "Pending",
            amount: totalPending,
            color: "text-amber-600 dark:text-amber-400",
            bg: "bg-amber-500/10",
            icon: Clock,
          },
        ].map(({ label, amount, color, bg, icon: Icon }) => (
          <Card
            key={label}
            className="shadow-card rounded-xl border border-border/50 bg-card"
          >
            <CardContent className="p-4 sm:p-5 flex items-center gap-4">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bg}`}
              >
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {label}
                </p>
                {isLoading ? (
                  <Skeleton className="h-6 w-28 mt-1" />
                ) : (
                  <p
                    className={`font-mono font-bold text-lg tabular-nums ${color}`}
                  >
                    {Number(amount) === 0
                      ? "—"
                      : `$${(Number(amount) / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="rounded-xl border border-amber-200/60 dark:border-amber-800/60 bg-amber-500/5 p-4">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label
                htmlFor="date-from"
                className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5"
              >
                <Calendar className="h-3.5 w-3.5" /> Created From
              </Label>
              <Input
                id="date-from"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                data-ocid="escrow-date-from"
                className="h-10"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="date-to"
                className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5"
              >
                <Calendar className="h-3.5 w-3.5" /> Created To
              </Label>
              <Input
                id="date-to"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                data-ocid="escrow-date-to"
                className="h-10"
              />
            </div>
          </div>
        </div>
      )}

      {/* Status filter tabs — scrollable on mobile */}
      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 scrollbar-none">
        <div
          className="flex gap-1.5 w-max"
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
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors border min-h-[36px] whitespace-nowrap ${filter === f ? "bg-amber-500 text-white border-amber-500 shadow-sm" : "bg-card text-muted-foreground border-border hover:border-amber-400/60 hover:text-foreground"}`}
              >
                {f}
                {count > 0 && (
                  <span
                    className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${filter === f ? "bg-white/20 text-white" : "bg-muted-foreground/20"}`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Contract list */}
      <div className="space-y-2">
        {isLoading ? (
          ["skel-a", "skel-b", "skel-c"].map((k) => (
            <Skeleton key={k} className="h-20 rounded-xl" />
          ))
        ) : filtered.length > 0 ? (
          filtered.map((contract) => (
            <EscrowCard
              key={contract.id}
              contract={contract}
              workspaceId={workspaceId}
            />
          ))
        ) : (
          <div
            className="rounded-2xl border border-dashed border-amber-200 dark:border-amber-800 bg-amber-500/5 py-12 sm:py-16 text-center px-4"
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
                onClick={() =>
                  navigate({ to: `/app/${workspaceId}/escrow/new` })
                }
                className="bg-amber-500 hover:bg-amber-600 text-white active-press min-h-[44px]"
              >
                <Plus className="mr-1.5 h-3.5 w-3.5" /> New Escrow
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
