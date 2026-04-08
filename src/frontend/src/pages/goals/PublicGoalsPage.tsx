import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Clock,
  Moon,
  Search,
  Sun,
  Target,
  TrendingUp,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createActor } from "../../backend";
import type {
  PeriodFilter,
  PublicGoal,
  PublicGoalStatus,
  PublicKRStatus,
  SortConfig,
  SortDirection,
  SortField,
  StatusFilter,
} from "./publicGoalsTypes";

// ─── Simulated check-in history (derived from progress) ───────────────────────
function deriveCheckIns(
  goal: PublicGoal,
): Array<{ date: string; change: string }> {
  if (!goal.checkInCount || Number(goal.checkInCount) === 0) return [];
  const count = Math.min(Number(goal.checkInCount), 5);
  const checkIns: Array<{ date: string; change: string }> = [];
  const progressStep = goal.progress / count;
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - (count - i) * 14);
    const change = Math.round(progressStep);
    checkIns.push({
      date: d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      change: `+${change}%`,
    });
  }
  return checkIns;
}

// ─── Color maps ─────────────────────────────────────────────────────────────────
const GOAL_STATUS_STYLES: Record<
  PublicGoalStatus,
  { badge: string; bar: string; dot: string }
> = {
  Active: {
    badge:
      "bg-emerald-500/10 text-emerald-700 border-emerald-200 dark:text-emerald-400 dark:border-emerald-800",
    bar: "bg-emerald-500",
    dot: "bg-emerald-500",
  },
  Completed: {
    badge:
      "bg-green-600/10 text-green-700 border-green-200 dark:text-green-400 dark:border-green-800",
    bar: "bg-green-600",
    dot: "bg-green-600",
  },
  OnHold: {
    badge:
      "bg-amber-500/10 text-amber-700 border-amber-200 dark:text-amber-400 dark:border-amber-800",
    bar: "bg-amber-500",
    dot: "bg-amber-500",
  },
  Cancelled: {
    badge: "bg-muted text-muted-foreground border-border",
    bar: "bg-muted-foreground",
    dot: "bg-muted-foreground",
  },
};

const KR_STATUS_STYLES: Record<PublicKRStatus, { badge: string; bar: string }> =
  {
    OnTrack: {
      badge:
        "bg-emerald-500/10 text-emerald-700 border-emerald-200 dark:text-emerald-400 dark:border-emerald-800",
      bar: "bg-emerald-500",
    },
    AtRisk: {
      badge:
        "bg-amber-500/10 text-amber-700 border-amber-200 dark:text-amber-400 dark:border-amber-800",
      bar: "bg-amber-500",
    },
    Behind: {
      badge:
        "bg-red-500/10 text-red-700 border-red-200 dark:text-red-400 dark:border-red-800",
      bar: "bg-red-500",
    },
    Completed: {
      badge: "bg-muted text-muted-foreground border-border",
      bar: "bg-muted-foreground",
    },
  };

const KR_STATUS_LABELS: Record<PublicKRStatus, string> = {
  OnTrack: "On Track",
  AtRisk: "At Risk",
  Behind: "Behind",
  Completed: "Completed",
};

const GOAL_STATUS_LABELS: Record<PublicGoalStatus, string> = {
  Active: "Active",
  Completed: "Completed",
  OnHold: "On Hold",
  Cancelled: "Cancelled",
};

// ─── Backend hook ────────────────────────────────────────────────────────────────
function usePublicGoals(shareToken: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<PublicGoal[]>({
    queryKey: ["public-goals", shareToken],
    queryFn: async () => {
      if (!actor) return [];
      return (
        actor as unknown as {
          getPublicGoals: (token: string) => Promise<PublicGoal[]>;
        }
      ).getPublicGoals(shareToken);
    },
    enabled: !!actor && !isFetching && !!shareToken,
    retry: 1,
  });
}

// ─── Fourthspace SVG Logo Mark ────────────────────────────────────────────────
function FourthspaceLogo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Fourthspace"
      role="img"
    >
      <title>Fourthspace</title>
      <rect width="32" height="32" rx="8" fill="oklch(0.45 0.24 264)" />
      <path
        d="M8 10h10v4H12v2h6v4h-6v6H8V10z"
        fill="white"
        fillOpacity="0.95"
      />
      <rect
        x="18"
        y="10"
        width="4"
        height="12"
        rx="1"
        fill="white"
        fillOpacity="0.6"
      />
      <rect
        x="20"
        y="22"
        width="4"
        height="4"
        rx="1"
        fill="white"
        fillOpacity="0.4"
      />
    </svg>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({
  value,
  colorClass,
  label,
}: {
  value: number;
  colorClass: string;
  label?: string;
}) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className="space-y-1">
      {label && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{label}</span>
          <span className="font-mono font-semibold text-foreground">
            {clamped}%
          </span>
        </div>
      )}
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${colorClass}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

// ─── Goal Detail Panel ────────────────────────────────────────────────────────
function GoalDetail({ goal }: { goal: PublicGoal }) {
  const styles = GOAL_STATUS_STYLES[goal.status];
  const checkIns = deriveCheckIns(goal);
  const [showCheckIns, setShowCheckIns] = useState(false);

  return (
    <div className="space-y-5 p-1" data-ocid={`goal-detail-${goal.id}`}>
      {/* Description */}
      {goal.description && (
        <p className="text-sm text-muted-foreground leading-relaxed">
          {goal.description}
        </p>
      )}

      {/* Key Results */}
      {goal.keyResults.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Key Results
          </h4>
          <div className="space-y-3">
            {goal.keyResults.map((kr) => {
              const krStyle = KR_STATUS_STYLES[kr.status];
              const krProgress =
                kr.targetValue > 0
                  ? Math.min(
                      100,
                      Math.round((kr.currentValue / kr.targetValue) * 100),
                    )
                  : 0;
              return (
                <div
                  key={kr.id}
                  className="rounded-xl border border-border bg-background p-3.5 space-y-2.5"
                  data-ocid={`kr-row-${kr.id}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium text-foreground leading-snug flex-1">
                      {kr.title}
                    </p>
                    <Badge
                      className={`${krStyle.badge} text-[10px] shrink-0 font-medium border`}
                    >
                      {KR_STATUS_LABELS[kr.status]}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-mono">
                      {kr.currentValue} / {kr.targetValue} {kr.unit}
                    </span>
                    <span className="font-mono font-semibold text-foreground">
                      {krProgress}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${krStyle.bar}`}
                      style={{ width: `${krProgress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Check-in History */}
      {checkIns.length > 0 && (
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setShowCheckIns((p) => !p)}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors duration-200 w-full text-left"
            aria-expanded={showCheckIns}
            data-ocid="checkin-history-toggle"
          >
            <Clock className="h-3.5 w-3.5" />
            Check-in History
            {showCheckIns ? (
              <ChevronUp className="h-3.5 w-3.5 ml-auto" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 ml-auto" />
            )}
          </button>
          {showCheckIns && (
            <div className="space-y-1.5 pl-1">
              {checkIns.map((ci, i) => (
                <div
                  key={`ci-${ci.date}-${i}`}
                  className="flex items-center justify-between text-xs text-muted-foreground py-1 border-b border-border last:border-0"
                  data-ocid={`checkin-row-${i}`}
                >
                  <span>{ci.date}</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                    {ci.change}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Progress summary */}
      <div className="pt-1">
        <ProgressBar
          value={goal.progress}
          colorClass={styles.bar}
          label="Overall Progress"
        />
      </div>
    </div>
  );
}

// ─── Goal Card ─────────────────────────────────────────────────────────────────
function GoalCard({
  goal,
  expanded,
  onToggle,
}: {
  goal: PublicGoal;
  expanded: boolean;
  onToggle: () => void;
}) {
  const styles = GOAL_STATUS_STYLES[goal.status];

  const formatDate = (d: string) => {
    if (!d) return "";
    try {
      return new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return d;
    }
  };

  return (
    <div
      className="rounded-2xl border border-border bg-card shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden"
      data-ocid={`public-goal-card-${goal.id}`}
    >
      {/* Card header — always visible */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left p-5 space-y-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-t-2xl"
        aria-expanded={expanded}
        aria-controls={`goal-detail-${goal.id}`}
      >
        {/* Top row: badges + period */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge
              className={`${styles.badge} text-[10px] font-semibold border px-2 py-0.5`}
            >
              <span
                className={`mr-1 h-1.5 w-1.5 rounded-full inline-block ${styles.dot}`}
              />
              {GOAL_STATUS_LABELS[goal.status]}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium shrink-0">
              {goal.period}
            </span>
            {expanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-foreground leading-snug pr-2">
          {goal.title}
        </h3>

        {/* Meta row */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {goal.keyResults.length} Key Result
            {goal.keyResults.length !== 1 ? "s" : ""}
          </span>
          <span>
            {formatDate(goal.startDate)} – {formatDate(goal.endDate)}
          </span>
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-mono font-bold text-foreground">
              {goal.progress}%
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${styles.bar}`}
              style={{ width: `${Math.min(100, goal.progress)}%` }}
            />
          </div>
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div
          id={`goal-detail-${goal.id}`}
          className="border-t border-border bg-background/50 px-5 py-4"
        >
          <GoalDetail goal={goal} />
        </div>
      )}
    </div>
  );
}

// ─── Empty State ───────────────────────────────────────────────────────────────
function EmptyState({ token }: { token: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-20 gap-5 text-center"
      data-ocid="public-goals-empty"
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-muted">
        <Target className="h-9 w-9 text-muted-foreground" />
      </div>
      <div className="max-w-sm space-y-2">
        <h3 className="text-lg font-display font-semibold text-foreground">
          No public goals found
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {token
            ? "This goals page is either empty or the share link may have expired. Contact the workspace admin for a valid link."
            : "No share token provided."}
        </p>
      </div>
      <a
        href="/"
        className="text-sm text-primary hover:text-primary/80 transition-colors duration-200 underline underline-offset-2"
      >
        Sign in to Fourthspace
      </a>
    </div>
  );
}

// ─── Loading Skeleton ──────────────────────────────────────────────────────────
function GoalsSkeleton() {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      data-ocid="public-goals-loading"
    >
      {["s1", "s2", "s3", "s4", "s5", "s6"].map((sid) => (
        <div
          key={sid}
          className="rounded-2xl border border-border bg-card p-5 space-y-3"
        >
          <div className="flex justify-between">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <div className="flex justify-between">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-28" />
          </div>
          <Skeleton className="h-1.5 w-full rounded-full" />
        </div>
      ))}
    </div>
  );
}

// ─── Error State ───────────────────────────────────────────────────────────────
function ErrorState() {
  return (
    <div
      className="flex flex-col items-center justify-center py-20 gap-4 text-center"
      data-ocid="public-goals-error"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10">
        <AlertCircle className="h-7 w-7 text-destructive" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-foreground">
          Unable to load goals
        </h3>
        <p className="text-sm text-muted-foreground">
          Something went wrong. Please refresh or try again later.
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => window.location.reload()}
      >
        Refresh
      </Button>
    </div>
  );
}

// ─── Sort Button ───────────────────────────────────────────────────────────────
function SortButton({
  label,
  field,
  current,
  onSort,
}: {
  label: string;
  field: SortField;
  current: SortConfig;
  onSort: (f: SortField) => void;
}) {
  const active = current.field === field;
  return (
    <button
      type="button"
      onClick={() => onSort(field)}
      className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-colors duration-150 ${
        active
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
      }`}
      data-ocid={`sort-${field}`}
    >
      {label}
      <ArrowUpDown className="h-3 w-3" />
      {active && (
        <span className="text-[10px]">
          {current.direction === "asc" ? "↑" : "↓"}
        </span>
      )}
    </button>
  );
}

// ─── Filter Chip ───────────────────────────────────────────────────────────────
function FilterChip({
  label,
  active,
  onClick,
  ocid,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  ocid: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-ocid={ocid}
      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors duration-150 whitespace-nowrap ${
        active
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}

// ─── Theme Toggle ──────────────────────────────────────────────────────────────
function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const stored = localStorage.getItem("public-goals-theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("public-goals-theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <button
      type="button"
      onClick={() => setDark((p) => !p)}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors duration-200 text-xs font-medium"
      data-ocid="theme-toggle"
    >
      {dark ? (
        <Sun className="h-3.5 w-3.5" />
      ) : (
        <Moon className="h-3.5 w-3.5" />
      )}
      {dark ? "Light" : "Dark"}
    </button>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
const STATUS_FILTERS: StatusFilter[] = [
  "All",
  "Active",
  "Completed",
  "OnHold",
  "Cancelled",
];
const PERIOD_FILTERS: PeriodFilter[] = [
  "All",
  "Q1",
  "Q2",
  "Q3",
  "Q4",
  "Annual",
];
const SORT_FIELDS: Array<{ field: SortField; label: string }> = [
  { field: "name", label: "Name" },
  { field: "period", label: "Period" },
  { field: "status", label: "Status" },
  { field: "progress", label: "Progress" },
];

export default function PublicGoalsPage() {
  const { shareToken } = useParams({ from: "/public/goals/$shareToken" });
  const { data: goals = [], isLoading, isError } = usePublicGoals(shareToken);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("All");
  const [sort, setSort] = useState<SortConfig>({
    field: "progress",
    direction: "desc",
  });
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Derive workspace name from first goal's data (best-effort)
  const workspaceName = goals.length > 0 ? "Fourthspace" : "Fourthspace";

  // SEO
  useEffect(() => {
    document.title = `${workspaceName} | Fourthspace Goals`;
    // OG tags
    const setMeta = (prop: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(
        `meta[property="${prop}"]`,
      );
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", prop);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };
    setMeta("og:title", `${workspaceName} | Fourthspace Goals`);
    setMeta(
      "og:description",
      "View company objectives and key results — powered by Fourthspace.",
    );
    setMeta("og:type", "website");
  }, [workspaceName]);

  const handleSort = useCallback((field: SortField) => {
    setSort((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  const filtered = useMemo(() => {
    let result = [...goals];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q),
      );
    }

    // Status
    if (statusFilter !== "All") {
      result = result.filter((g) => g.status === statusFilter);
    }

    // Period
    if (periodFilter !== "All") {
      if (periodFilter === "Annual") {
        result = result.filter(
          (g) =>
            g.period.toLowerCase().includes("annual") ||
            g.period.toLowerCase().includes("h1") ||
            g.period.toLowerCase().includes("h2") ||
            g.period.toLowerCase().includes("fy"),
        );
      } else {
        result = result.filter((g) =>
          g.period.toUpperCase().includes(periodFilter),
        );
      }
    }

    // Sort
    const dir: SortDirection = sort.direction;
    result.sort((a, b) => {
      let cmp = 0;
      switch (sort.field) {
        case "name":
          cmp = a.title.localeCompare(b.title);
          break;
        case "period":
          cmp = a.period.localeCompare(b.period);
          break;
        case "status":
          cmp = a.status.localeCompare(b.status);
          break;
        case "progress":
          cmp = a.progress - b.progress;
          break;
      }
      return dir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [goals, search, statusFilter, periodFilter, sort]);

  // Stats from ALL goals (not filtered)
  const stats = useMemo(() => {
    const total = goals.length;
    const active = goals.filter((g) => g.status === "Active").length;
    const completed = goals.filter((g) => g.status === "Completed").length;
    const avgProgress =
      total > 0
        ? Math.round(goals.reduce((a, g) => a + g.progress, 0) / total)
        : 0;
    return { total, active, completed, avgProgress };
  }, [goals]);

  return (
    <div
      className="min-h-screen flex flex-col bg-background"
      data-ocid="public-goals-page"
    >
      {/* ── Header ── */}
      <header className="sticky top-0 z-10 bg-card/95 backdrop-blur border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-3">
          <a
            href="/"
            className="flex items-center gap-2.5 shrink-0"
            aria-label="Fourthspace home"
          >
            <FourthspaceLogo size={28} />
            <span className="font-display font-bold text-foreground text-base hidden sm:block">
              Fourthspace
            </span>
          </a>
          <span className="hidden sm:block text-muted-foreground/50">•</span>
          <div className="flex-1 min-w-0">
            <span className="text-sm font-medium text-muted-foreground truncate">
              Public Goals
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* ── Hero band ── */}
      <div className="bg-primary/5 border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                Company Goals & OKRs
              </h1>
              <p className="text-sm text-muted-foreground">
                Live progress on objectives and key results across the
                organization
              </p>
            </div>

            {/* Summary stats */}
            {!isLoading && !isError && goals.length > 0 && (
              <div className="flex items-center gap-4 shrink-0">
                {[
                  {
                    label: "Total",
                    value: stats.total,
                    icon: Target,
                    color: "text-primary",
                  },
                  {
                    label: "Active",
                    value: stats.active,
                    icon: TrendingUp,
                    color: "text-emerald-600 dark:text-emerald-400",
                  },
                  {
                    label: "Done",
                    value: stats.completed,
                    icon: Target,
                    color: "text-green-600 dark:text-green-400",
                  },
                  {
                    label: "Avg %",
                    value: `${stats.avgProgress}%`,
                    icon: TrendingUp,
                    color: "text-secondary",
                  },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <p
                      className={`text-xl sm:text-2xl font-display font-bold ${s.color}`}
                    >
                      {s.value}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Filters + Search ── */}
      <div className="bg-card/95 backdrop-blur border-b border-border/60 sticky top-14 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-2">
          {/* Row 1: Status + Period filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-1">
              Status
            </span>
            {STATUS_FILTERS.map((s) => (
              <FilterChip
                key={s}
                label={s === "OnHold" ? "On Hold" : s}
                active={statusFilter === s}
                onClick={() => setStatusFilter(s)}
                ocid={`status-filter-${s.toLowerCase()}`}
              />
            ))}
            <span className="ml-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-1">
              Period
            </span>
            {PERIOD_FILTERS.map((p) => (
              <FilterChip
                key={p}
                label={p}
                active={periodFilter === p}
                onClick={() => setPeriodFilter(p)}
                ocid={`period-filter-${p.toLowerCase()}`}
              />
            ))}
          </div>

          {/* Row 2: Search + Sort */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search goals..."
                className="pl-8 h-8 text-sm"
                data-ocid="goals-search-input"
              />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-muted-foreground">Sort:</span>
              {SORT_FIELDS.map(({ field, label }) => (
                <SortButton
                  key={field}
                  label={label}
                  field={field}
                  current={sort}
                  onSort={handleSort}
                />
              ))}
              {!isLoading && (
                <span className="ml-auto text-xs text-muted-foreground">
                  {filtered.length} goal{filtered.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {isLoading ? (
          <GoalsSkeleton />
        ) : isError ? (
          <ErrorState />
        ) : filtered.length === 0 && goals.length === 0 ? (
          <EmptyState token={shareToken} />
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16 gap-3 text-center"
            data-ocid="public-goals-no-results"
          >
            <Search className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">
              No goals match your filters
            </p>
            <p className="text-xs text-muted-foreground">
              Try adjusting your search, status, or period filters.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch("");
                setStatusFilter("All");
                setPeriodFilter("All");
              }}
              data-ocid="clear-filters-btn"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                expanded={expandedId === goal.id}
                onToggle={() =>
                  setExpandedId((prev) => (prev === goal.id ? null : goal.id))
                }
              />
            ))}
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer
        className="bg-card border-t border-border"
        data-ocid="public-goals-footer"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <FourthspaceLogo size={24} />
            <div>
              <p className="text-sm font-display font-semibold text-foreground">
                Fourthspace
              </p>
              <p className="text-xs text-muted-foreground">
                All-in-one workspace platform
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-200"
              data-ocid="sign-in-link"
            >
              Sign in to Fourthspace →
            </a>
          </div>
        </div>
        <div className="border-t border-border">
          <p className="text-center text-xs text-muted-foreground py-3">
            © {new Date().getFullYear()} Fourthspace ·{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors duration-200"
            >
              Built with caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
