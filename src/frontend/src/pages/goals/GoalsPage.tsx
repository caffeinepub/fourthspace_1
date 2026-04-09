import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  BarChart3,
  ChevronRight,
  Lightbulb,
  Plus,
  Target,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import type { Goal } from "../../backend";
import { GoalStatus } from "../../backend";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId, useWorkspace } from "../../hooks/useWorkspace";
import { OKR_TEMPLATES } from "./goalData";

// ── Status display helpers ────────────────────────────────────────────────

const BACKEND_STATUS_COLORS: Record<GoalStatus, string> = {
  [GoalStatus.Active]:
    "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800 dark:text-blue-400",
  [GoalStatus.OnHold]:
    "bg-yellow-500/10 text-yellow-600 border-yellow-200 dark:border-yellow-800",
  [GoalStatus.Completed]: "bg-muted text-muted-foreground border-border",
  [GoalStatus.Cancelled]:
    "bg-destructive/10 text-destructive border-destructive/20",
};

const BACKEND_STATUS_LABELS: Record<GoalStatus, string> = {
  [GoalStatus.Active]: "Active",
  [GoalStatus.OnHold]: "On Hold",
  [GoalStatus.Completed]: "Completed",
  [GoalStatus.Cancelled]: "Cancelled",
};

type FilterStatus = GoalStatus | "all";
const ALL_FILTER_STATUSES: FilterStatus[] = [
  "all",
  GoalStatus.Active,
  GoalStatus.OnHold,
  GoalStatus.Completed,
  GoalStatus.Cancelled,
];

// ── Progress Ring ────────────────────────────────────────────────────────

function ProgressRing({ value }: { value: number }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <svg
      width="52"
      height="52"
      viewBox="0 0 52 52"
      role="img"
      aria-label={`${value} percent progress`}
    >
      <circle
        cx="26"
        cy="26"
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        className="text-muted/40"
      />
      <circle
        cx="26"
        cy="26"
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        className="text-primary"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 26 26)"
        style={{ transition: "stroke-dasharray 0.5s ease" }}
      />
      <text
        x="26"
        y="30"
        textAnchor="middle"
        fontSize="10"
        fontWeight="700"
        fill="currentColor"
        className="text-foreground font-mono"
      >
        {value}%
      </text>
    </svg>
  );
}

// ── Goal Card ────────────────────────────────────────────────────────────

function GoalCard({ goal, wsId }: { goal: Goal; wsId: string }) {
  const colorClass =
    BACKEND_STATUS_COLORS[goal.status] ??
    BACKEND_STATUS_COLORS[GoalStatus.Active];
  const statusLabel =
    BACKEND_STATUS_LABELS[goal.status] ??
    BACKEND_STATUS_LABELS[GoalStatus.Active];
  const progress = Math.round(Math.min(100, Math.max(0, goal.progress)));
  const endMs = Number(goal.endDate) / 1_000_000;
  const periodLabel = goal.period || new Date(endMs).getFullYear().toString();

  return (
    <Link
      to={`/app/${wsId}/goals/${goal.id}` as "/"}
      data-ocid={`goal-card-${goal.id}`}
    >
      <div className="rounded-xl border border-border/50 bg-card shadow-card hover:shadow-card-hover hover:border-primary/30 transition-all group">
        <div className="p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Target className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                  {goal.title}
                </h3>
                <p className="text-xs text-muted-foreground">{periodLabel}</p>
              </div>
            </div>
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border shrink-0 ${colorClass}`}
            >
              {statusLabel}
            </span>
          </div>

          {goal.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {goal.description}
            </p>
          )}

          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-mono font-semibold tabular-nums text-foreground">
                  {progress}%
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <ProgressRing value={progress} />
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/40">
            <span className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {goal.keyResults.length} key result
              {goal.keyResults.length !== 1 ? "s" : ""}
            </span>
            <span className="font-medium">
              {goal.contributorIds.length} contributor
              {goal.contributorIds.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Template Browse Cards (shown in empty state) ──────────────────────────

function TemplateBrowseCards({ wsId }: { wsId: string }) {
  const display = OKR_TEMPLATES.slice(0, 4);
  return (
    <div className="w-full mt-6">
      <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
        <Lightbulb className="h-4 w-4 text-secondary" />
        Browse Templates
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {display.map((tmpl) => (
          <Link
            key={tmpl.id}
            to={`/app/${wsId}/goals/new?template=${tmpl.id}` as "/"}
            data-ocid={`tmpl-card-${tmpl.id}`}
          >
            <div className="rounded-xl border border-border/50 bg-card hover:border-primary/40 hover:bg-primary/[0.02] transition-all p-4 group">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {tmpl.category}
                </span>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <p className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                {tmpl.name}
              </p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {tmpl.description}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {tmpl.suggestedKRs.length} key result
                {tmpl.suggestedKRs.length !== 1 ? "s" : ""}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ── Template Quick-Start Strip ────────────────────────────────────────────

function TemplateStrip({ wsId }: { wsId: string }) {
  return (
    <div className="rounded-xl border border-border/50 bg-gradient-to-r from-primary/5 via-card to-accent/5 p-4 sm:p-5">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
          <Lightbulb className="h-3.5 w-3.5 text-primary" />
        </div>
        <p className="text-sm font-semibold text-foreground tracking-tight">
          Start from a template
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {OKR_TEMPLATES.map((tmpl) => (
          <Link
            key={tmpl.id}
            to={`/app/${wsId}/goals/new?template=${tmpl.id}` as "/"}
            data-ocid={`tmpl-quick-${tmpl.id}`}
          >
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-full border border-border/60 bg-background hover:border-primary/40 hover:bg-primary/5 px-3 py-1.5 text-xs font-medium text-foreground transition-smooth active-press"
            >
              <Target className="h-3 w-3 text-primary shrink-0" />
              {tmpl.name}
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
            </button>
          </Link>
        ))}
        <Link to={`/app/${wsId}/goals/new` as "/"}>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-full border border-dashed border-primary/40 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary transition-smooth hover:bg-primary/10"
            data-ocid="tmpl-blank-goal-btn"
          >
            <Plus className="h-3 w-3" />
            Blank goal
          </button>
        </Link>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────

export default function GoalsPage() {
  const { activeWorkspaceId } = useWorkspace();
  const wsId = activeWorkspaceId ?? "";
  const tenantId = getTenantId();
  const { actor, isFetching } = useBackend();
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");

  const { data: goals = [], isLoading } = useQuery<Goal[]>({
    queryKey: ["goals", tenantId, wsId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listGoals(tenantId, wsId);
    },
    enabled: !!actor && !isFetching && !!wsId,
  });

  const filtered =
    statusFilter === "all"
      ? goals
      : goals.filter((g) => g.status === statusFilter);

  const stats = {
    total: goals.length,
    active: goals.filter((g) => g.status === GoalStatus.Active).length,
    completed: goals.filter((g) => g.status === GoalStatus.Completed).length,
    avgProgress:
      goals.length > 0
        ? Math.round(goals.reduce((a, g) => a + g.progress, 0) / goals.length)
        : 0,
  };

  return (
    <div
      className="animate-fade-in-up p-4 sm:p-6 space-y-5 pb-20 md:pb-6"
      data-ocid="goals-page"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
            <Target className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-display font-bold tracking-tight text-foreground">
              Goals & OKRs
            </h1>
            <p className="text-sm text-muted-foreground hidden sm:block">
              Track objectives and key results
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild className="min-h-[44px]">
            <Link
              to={`/app/${wsId}/goals/timeline` as "/"}
              data-ocid="view-timeline-btn"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Timeline</span>
            </Link>
          </Button>
          <Button
            asChild
            data-ocid="new-goal-btn"
            className="active-press min-h-[44px] gap-2 font-semibold shadow-sm"
            size="default"
          >
            <Link to={`/app/${wsId}/goals/new` as "/"}>
              <Plus className="h-4 w-4" />
              Create Goal
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats row */}
      {goals.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "Total Goals",
              value: String(stats.total),
              color: "text-primary bg-primary/10 border-primary/20",
            },
            {
              label: "Active",
              value: String(stats.active),
              color: "text-accent bg-accent/10 border-accent/20",
            },
            {
              label: "Completed",
              value: String(stats.completed),
              color: "text-emerald-600 bg-emerald-500/10 border-emerald-200",
            },
            {
              label: "Avg. Progress",
              value: `${stats.avgProgress}%`,
              color: "text-secondary bg-secondary/10 border-secondary/20",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-border/50 bg-card shadow-card p-4"
            >
              <div
                className={`inline-flex h-7 w-7 items-center justify-center rounded-lg border mb-2.5 ${s.color}`}
              >
                <Target className="h-3.5 w-3.5" />
              </div>
              <p className="text-2xl font-display font-bold font-mono tabular-nums text-foreground">
                {s.value}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Template quick-start (only when goals exist) */}
      {goals.length > 0 && <TemplateStrip wsId={wsId} />}

      {/* Filter (only when goals exist) */}
      {goals.length > 0 && (
        <div className="flex items-center gap-2 sm:gap-3 rounded-xl border border-border/50 bg-card shadow-card px-3 sm:px-4 py-3 flex-wrap">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Filter
          </span>
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as FilterStatus)}
          >
            <SelectTrigger
              className="h-8 w-44 text-xs"
              data-ocid="status-filter-select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ALL_FILTER_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s === "all"
                    ? "All statuses"
                    : (BACKEND_STATUS_LABELS[s] ?? s)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="ml-auto text-xs text-muted-foreground">
            {filtered.length} goal{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* Goals grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <Skeleton key={n} className="h-52 rounded-xl" />
          ))}
        </div>
      ) : goals.length === 0 ? (
        /* Empty state with template browse */
        <div
          className="flex flex-col items-center justify-center py-12 gap-4 px-4"
          data-ocid="goals-empty"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <Target className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-base font-semibold text-foreground">
              No goals yet
            </p>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Set your first objective and track progress toward what matters
              most.
            </p>
          </div>
          <Button
            asChild
            className="active-press"
            data-ocid="create-first-goal-btn"
          >
            <Link to={`/app/${wsId}/goals/new` as "/"}>
              <Plus className="h-4 w-4 mr-2" />
              Create Goal
            </Link>
          </Button>
          <TemplateBrowseCards wsId={wsId} />
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-16 gap-4"
          data-ocid="goals-filtered-empty"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
            <Target className="h-7 w-7 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-base font-semibold text-foreground">
              No goals with this status
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Try a different filter or create a new goal
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((g) => (
            <GoalCard key={g.id} goal={g} wsId={wsId} />
          ))}
        </div>
      )}
    </div>
  );
}
