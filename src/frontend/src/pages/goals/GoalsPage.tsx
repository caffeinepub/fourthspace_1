import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "@tanstack/react-router";
import { BarChart3, Plus, Target, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useWorkspace } from "../../hooks/useWorkspace";
import type { GoalStatus, MockGoal } from "./goalData";
import { MOCK_GOALS, STATUS_COLORS, STATUS_LABELS } from "./goalData";

const ALL_STATUSES: Array<GoalStatus | "all"> = [
  "all",
  "Active",
  "OnTrack",
  "AtRisk",
  "Behind",
  "Completed",
];

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

function GoalCard({ goal, wsId }: { goal: MockGoal; wsId: string }) {
  return (
    <Link
      to={`/app/${wsId}/goals/${goal.id}` as "/"}
      data-ocid={`goal-card-${goal.id}`}
    >
      <div className="rounded-xl border border-border/50 bg-card shadow-card hover:shadow-card-hover hover:border-primary/30 transition-all group">
        <div className="p-5 space-y-4">
          {/* Top row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Target className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                  {goal.title}
                </h3>
                <p className="text-xs text-muted-foreground">{goal.period}</p>
              </div>
            </div>
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border shrink-0 ${STATUS_COLORS[goal.status]}`}
            >
              {STATUS_LABELS[goal.status]}
            </span>
          </div>
          {goal.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {goal.description}
            </p>
          )}
          {/* Progress row */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-mono font-semibold tabular-nums text-foreground">
                  {goal.progress}%
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${Math.min(100, goal.progress)}%` }}
                />
              </div>
            </div>
            <ProgressRing value={goal.progress} />
          </div>
          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/40">
            <span className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {goal.owner}
            </span>
            <span className="font-medium">{goal.keyResults} key results</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function GoalsPage() {
  const { activeWorkspaceId } = useWorkspace();
  const wsId = activeWorkspaceId ?? "";
  const [statusFilter, setStatusFilter] = useState<GoalStatus | "all">("all");

  const filtered = MOCK_GOALS.filter(
    (g) => statusFilter === "all" || g.status === statusFilter,
  );

  const stats = {
    total: MOCK_GOALS.length,
    onTrack: MOCK_GOALS.filter((g) => g.status === "OnTrack").length,
    atRisk: MOCK_GOALS.filter(
      (g) => g.status === "AtRisk" || g.status === "Behind",
    ).length,
    avgProgress: Math.round(
      MOCK_GOALS.reduce((a, g) => a + g.progress, 0) / (MOCK_GOALS.length || 1),
    ),
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
            size="sm"
            asChild
            data-ocid="new-goal-btn"
            className="active-press min-h-[44px]"
          >
            <Link to={`/app/${wsId}/goals/new` as "/"}>
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">New Goal</span>
              <span className="sm:hidden">New</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          {
            label: "Total Goals",
            value: String(stats.total),
            color: "text-primary bg-primary/10 border-primary/20",
          },
          {
            label: "On Track",
            value: String(stats.onTrack),
            color: "text-accent bg-accent/10 border-accent/20",
          },
          {
            label: "At Risk / Behind",
            value: String(stats.atRisk),
            color: "text-destructive bg-destructive/10 border-destructive/20",
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

      {/* Filter */}
      <div className="flex items-center gap-2 sm:gap-3 rounded-xl border border-border/50 bg-card shadow-card px-3 sm:px-4 py-3 flex-wrap">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Filter
        </span>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as GoalStatus | "all")}
        >
          <SelectTrigger
            className="h-8 w-44 text-xs"
            data-ocid="status-filter-select"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ALL_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s === "all" ? "All statuses" : STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="ml-auto text-xs text-muted-foreground">
          {filtered.length} goal{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Goals grid */}
      {filtered.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-16 gap-4"
          data-ocid="goals-empty"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <Target className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-base font-semibold text-foreground">
              No goals yet
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Create your first goal to start tracking objectives
            </p>
          </div>
          <Button asChild className="active-press">
            <Link to={`/app/${wsId}/goals/new` as "/"}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Goal
            </Link>
          </Button>
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
