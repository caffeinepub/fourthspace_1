import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, BarChart3, Plus, Target } from "lucide-react";
import { useMemo } from "react";
import type { Goal } from "../../backend";
import { GoalStatus } from "../../backend";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId, useWorkspace } from "../../hooks/useWorkspace";

const STATUS_COLORS: Record<GoalStatus, string> = {
  [GoalStatus.Active]:
    "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800 dark:text-blue-400",
  [GoalStatus.OnHold]:
    "bg-yellow-500/10 text-yellow-600 border-yellow-200 dark:border-yellow-800",
  [GoalStatus.Completed]: "bg-muted text-muted-foreground border-border",
  [GoalStatus.Cancelled]:
    "bg-destructive/10 text-destructive border-destructive/20",
};

const STATUS_LABELS: Record<GoalStatus, string> = {
  [GoalStatus.Active]: "Active",
  [GoalStatus.OnHold]: "On Hold",
  [GoalStatus.Completed]: "Completed",
  [GoalStatus.Cancelled]: "Cancelled",
};

function parsePeriodSort(period: string): number {
  const match = period.match(/Q(\d)\s+(\d{4})/);
  if (match) return Number(match[2]) * 10 + Number(match[1]);
  const hMatch = period.match(/H(\d)\s+(\d{4})/);
  if (hMatch) return Number(hMatch[2]) * 10 + (Number(hMatch[1]) === 1 ? 1 : 3);
  const yMatch = period.match(/(\d{4})/);
  if (yMatch) return Number(yMatch[1]) * 10;
  return 0;
}

function groupByPeriod(
  goals: Goal[],
): Array<{ period: string; goals: Goal[] }> {
  const map = new Map<string, Goal[]>();
  for (const g of goals) {
    const period =
      g.period ||
      new Date(Number(g.endDate) / 1_000_000).getFullYear().toString();
    const arr = map.get(period) ?? [];
    arr.push(g);
    map.set(period, arr);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => parsePeriodSort(a) - parsePeriodSort(b))
    .map(([period, gs]) => ({ period, goals: gs }));
}

function GoalBar({ goal, wsId }: { goal: Goal; wsId: string }) {
  const pct = Math.min(100, Math.max(2, Math.round(goal.progress)));
  const barColor =
    goal.status === GoalStatus.Completed
      ? "bg-muted-foreground/40"
      : goal.status === GoalStatus.Cancelled
        ? "bg-destructive/40"
        : "bg-primary/85";

  const statusColor =
    STATUS_COLORS[goal.status] ?? STATUS_COLORS[GoalStatus.Active];
  const statusLabel = STATUS_LABELS[goal.status] ?? "Active";

  return (
    <Link
      to={`/app/${wsId}/goals/${goal.id}` as "/"}
      data-ocid={`timeline-bar-${goal.id}`}
    >
      <div className="flex items-center gap-3 group cursor-pointer py-1.5">
        <div className="w-44 shrink-0 min-w-0">
          <p className="text-xs font-medium text-foreground truncate group-hover:text-primary transition-colors">
            {goal.title}
          </p>
          <p className="text-[10px] text-muted-foreground">
            {goal.contributorIds.length} contributor
            {goal.contributorIds.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex-1 flex items-center gap-2">
          <div className="relative h-7 flex-1 rounded-lg bg-muted overflow-hidden">
            <div
              className={`h-full rounded-lg transition-all duration-500 flex items-center px-2 overflow-hidden ${barColor}`}
              style={{ width: `${pct}%` }}
            >
              {pct > 20 && (
                <span className="text-[10px] font-mono font-semibold text-white/90 whitespace-nowrap">
                  {Math.round(goal.progress)}%
                </span>
              )}
            </div>
            {pct <= 20 && (
              <span
                className="absolute top-1/2 -translate-y-1/2 text-[10px] font-mono font-semibold text-muted-foreground"
                style={{ left: `calc(${pct}% + 4px)` }}
              >
                {Math.round(goal.progress)}%
              </span>
            )}
          </div>
          <span
            className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium border shrink-0 ${statusColor}`}
          >
            {statusLabel}
          </span>
          <span className="text-[10px] text-muted-foreground shrink-0 hidden sm:block">
            {goal.keyResults.length} KRs
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function GoalTimelinePage() {
  const { activeWorkspaceId } = useWorkspace();
  const wsId = activeWorkspaceId ?? "";
  const tenantId = getTenantId();
  const { actor, isFetching } = useBackend();

  const { data: goals = [], isLoading } = useQuery<Goal[]>({
    queryKey: ["goals", tenantId, wsId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listGoals(tenantId, wsId);
    },
    enabled: !!actor && !isFetching && !!wsId,
  });

  const grouped = useMemo(() => groupByPeriod(goals), [goals]);

  const periodStats = useMemo(() => {
    return grouped.map(({ period, goals: gs }) => ({
      period,
      count: gs.length,
      avgProgress:
        gs.length > 0
          ? Math.round(gs.reduce((a, g) => a + g.progress, 0) / gs.length)
          : 0,
      completed: gs.filter((g) => g.status === GoalStatus.Completed).length,
    }));
  }, [grouped]);

  return (
    <div
      className="animate-fade-in-up p-4 sm:p-6 space-y-6 pb-20 md:pb-6"
      data-ocid="goal-timeline-page"
    >
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/app/${wsId}/goals` as "/"}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-display font-bold tracking-tight text-foreground">
              Goals Timeline
            </h1>
            <p className="text-sm text-muted-foreground">
              Visual progress overview across all goal periods
            </p>
          </div>
        </div>
        <Button size="sm" asChild className="active-press">
          <Link to={`/app/${wsId}/goals/new` as "/"} data-ocid="new-goal-btn">
            <Plus className="h-4 w-4 mr-1.5" />
            New Goal
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[1, 2, 3, 4].map((n) => (
              <Skeleton key={n} className="h-20 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-48 rounded-xl" />
        </div>
      ) : goals.length === 0 ? (
        <div
          className="flex flex-col items-center py-16 gap-4"
          data-ocid="timeline-empty"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <BarChart3 className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-base font-semibold text-foreground">
              No goals yet
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Create goals to see them visualized on the timeline
            </p>
          </div>
          <Button asChild className="active-press">
            <Link to={`/app/${wsId}/goals/new` as "/"}>Create First Goal</Link>
          </Button>
        </div>
      ) : (
        <>
          {/* Period summary cards */}
          {periodStats.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {periodStats.map((p) => (
                <div
                  key={p.period}
                  className="rounded-xl border border-border/50 bg-card shadow-card p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10">
                      <BarChart3 className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-xs font-semibold text-foreground">
                      {p.period}
                    </span>
                  </div>
                  <p className="text-xl font-display font-bold font-mono tabular-nums text-foreground">
                    {p.avgProgress}%
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {p.count} goal{p.count !== 1 ? "s" : ""} · {p.completed}{" "}
                    complete
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            {[
              { color: "bg-primary/85", label: "On Hold / Active" },
              { color: "bg-destructive/40", label: "Cancelled" },
              { color: "bg-muted-foreground/40", label: "Completed" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <span className={`inline-block h-3 w-6 rounded ${l.color}`} />
                <span>{l.label}</span>
              </div>
            ))}
          </div>

          {/* Timeline per period */}
          {grouped.map(({ period, goals: gs }) => (
            <Card
              key={period}
              className="shadow-card rounded-xl border border-border/50 bg-card"
              data-ocid={`period-group-${period.replace(/\s/g, "-")}`}
            >
              <CardHeader className="pb-3 border-b border-border/40">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2 font-semibold">
                    <Target className="h-4 w-4 text-primary" />
                    {period}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>
                      {gs.length} goal{gs.length !== 1 ? "s" : ""}
                    </span>
                    <span>·</span>
                    <span>
                      avg{" "}
                      {gs.length > 0
                        ? Math.round(
                            gs.reduce((a, g) => a + g.progress, 0) / gs.length,
                          )
                        : 0}
                      % complete
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-5 py-4 divide-y divide-border/40">
                {gs.map((g) => (
                  <GoalBar key={g.id} goal={g} wsId={wsId} />
                ))}
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </div>
  );
}
