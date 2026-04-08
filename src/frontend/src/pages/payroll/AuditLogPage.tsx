import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, FileSearch, Filter, X } from "lucide-react";
import { useState } from "react";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId, useWorkspace } from "../../hooks/useWorkspace";
import type { AuditLogEntry } from "../../types";

const ACTION_COLORS: Record<string, string> = {
  create:
    "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  update: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20",
  delete: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/20",
  approve:
    "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/20",
  reject:
    "bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/20",
  process: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-500/20",
};

const ACTION_DOT_COLORS: Record<string, string> = {
  create: "bg-emerald-500",
  update: "bg-blue-500",
  delete: "bg-red-500",
  approve: "bg-purple-500",
  reject: "bg-orange-500",
  process: "bg-cyan-500",
};

function actionColor(action: string) {
  const key = Object.keys(ACTION_COLORS).find((k) =>
    action.toLowerCase().includes(k),
  );
  return key
    ? ACTION_COLORS[key]
    : "bg-muted text-muted-foreground border-border";
}

function actionDotColor(action: string) {
  const key = Object.keys(ACTION_DOT_COLORS).find((k) =>
    action.toLowerCase().includes(k),
  );
  return key ? ACTION_DOT_COLORS[key] : "bg-muted-foreground";
}

export default function AuditLogPage() {
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const [filterAction, setFilterAction] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { data: rawEntries = [], isLoading } = useQuery<AuditLogEntry[]>({
    queryKey: ["payrollAuditLog", tenantId, workspaceId],
    queryFn: async () =>
      actor
        ? actor.listPayrollAuditLog(tenantId, workspaceId, BigInt(200))
        : [],
    enabled: !!actor && !isFetching && !!workspaceId,
  });

  // Sort all entries by timestamp descending (most recent first)
  const entries = [...rawEntries].sort(
    (a, b) => Number(b.timestamp) - Number(a.timestamp),
  );

  const filtered = entries.filter((e) => {
    if (
      filterAction &&
      !e.action.toLowerCase().includes(filterAction.toLowerCase())
    )
      return false;
    if (filterFrom) {
      const from = new Date(filterFrom).getTime() * 1_000_000;
      if (Number(e.timestamp) < from) return false;
    }
    if (filterTo) {
      const to =
        new Date(filterTo).getTime() * 1_000_000 + 86400000 * 1_000_000;
      if (Number(e.timestamp) > to) return false;
    }
    return true;
  });

  const hasFilters = !!filterAction || !!filterFrom || !!filterTo;

  return (
    <div className="animate-fade-in-up p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild aria-label="Back">
            <Link to={`/app/${workspaceId}/payroll`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Audit Log
            </h1>
            <p className="text-sm text-muted-foreground">
              {isLoading
                ? "Loading…"
                : `${filtered.length} entries${hasFilters ? " (filtered)" : ""}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFilterAction("");
                setFilterFrom("");
                setFilterTo("");
              }}
              data-ocid="audit-clear-filters"
            >
              <X className="mr-1.5 h-3.5 w-3.5" /> Clear filters
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters((v) => !v)}
            data-ocid="audit-filter-btn"
          >
            <Filter className="mr-1.5 h-3.5 w-3.5" />
            Filter
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="rounded-xl border border-border/50 bg-card shadow-card p-4 grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label
              htmlFor="filter-action"
              className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
            >
              Action type
            </Label>
            <Input
              id="filter-action"
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              placeholder="e.g. create, approve…"
              data-ocid="audit-filter-action"
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="filter-from"
              className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
            >
              From date
            </Label>
            <Input
              id="filter-from"
              type="date"
              value={filterFrom}
              onChange={(e) => setFilterFrom(e.target.value)}
              data-ocid="audit-filter-from"
            />
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="filter-to"
              className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
            >
              To date
            </Label>
            <Input
              id="filter-to"
              type="date"
              value={filterTo}
              onChange={(e) => setFilterTo(e.target.value)}
              data-ocid="audit-filter-to"
            />
          </div>
        </div>
      )}

      {/* Timeline / Table */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <Skeleton key={n} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/20 py-20 text-center"
          data-ocid="audit-empty"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted mb-4">
            <FileSearch className="h-7 w-7 text-muted-foreground/60" />
          </div>
          <h3 className="font-display font-semibold text-foreground">
            {hasFilters
              ? "No entries match your filters"
              : "No audit entries yet"}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-xs">
            {hasFilters
              ? "Try adjusting your filter criteria."
              : "Audit entries are recorded automatically as payroll actions occur."}
          </p>
        </div>
      ) : (
        <div className="space-y-0 relative">
          {/* Timeline line */}
          <div className="absolute left-[18px] top-3 bottom-3 w-px bg-border/60" />
          {filtered.map((entry) => (
            <div
              key={entry.id}
              className="relative pl-10 pb-4 last:pb-0"
              data-ocid={`audit-row-${entry.id}`}
            >
              {/* Dot */}
              <div
                className={`absolute left-[11px] top-[14px] h-4 w-4 rounded-full border-2 border-background ${actionDotColor(entry.action)}`}
              />
              <div className="rounded-xl border border-border/50 bg-card shadow-card hover:bg-muted/30 transition-colors p-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border capitalize shrink-0 ${actionColor(entry.action)}`}
                    >
                      {entry.action}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground capitalize">
                        {entry.entityType}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono truncate max-w-[200px]">
                        {entry.entityId}
                      </p>
                      {entry.details && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                          {entry.details}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(
                        Number(entry.timestamp) / 1_000_000,
                      ).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-[11px] text-muted-foreground/60 font-mono truncate max-w-[120px]">
                      {String(entry.performedBy).slice(0, 16)}…
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
