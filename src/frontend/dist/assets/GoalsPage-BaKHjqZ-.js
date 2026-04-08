import { f as useWorkspace, g as getTenantId, r as reactExports, h as useQuery, al as GoalStatus, j as jsxRuntimeExports, am as Target, B as Button, i as Link, P as Plus } from "./index-CzyNqtbv.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DOERIIdP.js";
import { S as Skeleton } from "./skeleton-DMAdSNre.js";
import { u as useBackend } from "./index-CJtF1vtU.js";
import { C as ChartColumn } from "./chart-column-BI6TuY0g.js";
import { T as TrendingUp } from "./trending-up-CqMdsyEa.js";
import "./index-IXOTxK3N.js";
import "./index-DhDScjUU.js";
import "./chevron-up-DASmmm8S.js";
const BACKEND_STATUS_COLORS = {
  [GoalStatus.Active]: "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800 dark:text-blue-400",
  [GoalStatus.OnHold]: "bg-yellow-500/10 text-yellow-600 border-yellow-200 dark:border-yellow-800",
  [GoalStatus.Completed]: "bg-muted text-muted-foreground border-border",
  [GoalStatus.Cancelled]: "bg-destructive/10 text-destructive border-destructive/20"
};
const BACKEND_STATUS_LABELS = {
  [GoalStatus.Active]: "Active",
  [GoalStatus.OnHold]: "On Hold",
  [GoalStatus.Completed]: "Completed",
  [GoalStatus.Cancelled]: "Cancelled"
};
const ALL_FILTER_STATUSES = [
  "all",
  GoalStatus.Active,
  GoalStatus.OnHold,
  GoalStatus.Completed,
  GoalStatus.Cancelled
];
function ProgressRing({ value }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const dash = value / 100 * circ;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      width: "52",
      height: "52",
      viewBox: "0 0 52 52",
      role: "img",
      "aria-label": `${value} percent progress`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: "26",
            cy: "26",
            r,
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "4",
            className: "text-muted/40"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: "26",
            cy: "26",
            r,
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "4",
            className: "text-primary",
            strokeDasharray: `${dash} ${circ}`,
            strokeLinecap: "round",
            transform: "rotate(-90 26 26)",
            style: { transition: "stroke-dasharray 0.5s ease" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "text",
          {
            x: "26",
            y: "30",
            textAnchor: "middle",
            fontSize: "10",
            fontWeight: "700",
            fill: "currentColor",
            className: "text-foreground font-mono",
            children: [
              value,
              "%"
            ]
          }
        )
      ]
    }
  );
}
function GoalCard({ goal, wsId }) {
  const colorClass = BACKEND_STATUS_COLORS[goal.status] ?? BACKEND_STATUS_COLORS[GoalStatus.Active];
  const statusLabel = BACKEND_STATUS_LABELS[goal.status] ?? BACKEND_STATUS_LABELS[GoalStatus.Active];
  const progress = Math.round(Math.min(100, Math.max(0, goal.progress)));
  const endMs = Number(goal.endDate) / 1e6;
  const periodLabel = goal.period || new Date(endMs).getFullYear().toString();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Link,
    {
      to: `/app/${wsId}/goals/${goal.id}`,
      "data-ocid": `goal-card-${goal.id}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border/50 bg-card shadow-card hover:shadow-card-hover hover:border-primary/30 transition-all group", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "h-4 w-4 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors", children: goal.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: periodLabel })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border shrink-0 ${colorClass}`,
              children: statusLabel
            }
          )
        ] }),
        goal.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground line-clamp-2", children: goal.description }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Progress" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono font-semibold tabular-nums text-foreground", children: [
                progress,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-full rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full rounded-full bg-primary transition-all duration-500",
                style: { width: `${progress}%` }
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ProgressRing, { value: progress })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3 w-3" }),
            goal.keyResults.length,
            " key result",
            goal.keyResults.length !== 1 ? "s" : ""
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
            goal.contributorIds.length,
            " contributor",
            goal.contributorIds.length !== 1 ? "s" : ""
          ] })
        ] })
      ] }) })
    }
  );
}
function GoalsPage() {
  const { activeWorkspaceId } = useWorkspace();
  const wsId = activeWorkspaceId ?? "";
  const tenantId = getTenantId();
  const { actor, isFetching } = useBackend();
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const { data: goals = [], isLoading } = useQuery({
    queryKey: ["goals", tenantId, wsId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listGoals(tenantId, wsId);
    },
    enabled: !!actor && !isFetching && !!wsId
  });
  const filtered = statusFilter === "all" ? goals : goals.filter((g) => g.status === statusFilter);
  const stats = {
    total: goals.length,
    active: goals.filter((g) => g.status === GoalStatus.Active).length,
    completed: goals.filter((g) => g.status === GoalStatus.Completed).length,
    avgProgress: goals.length > 0 ? Math.round(goals.reduce((a, g) => a + g.progress, 0) / goals.length) : 0
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "animate-fade-in-up p-4 sm:p-6 space-y-5 pb-20 md:pb-6",
      "data-ocid": "goals-page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "h-5 w-5 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl sm:text-2xl font-display font-bold tracking-tight text-foreground", children: "Goals & OKRs" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground hidden sm:block", children: "Track objectives and key results" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", asChild: true, className: "min-h-[44px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: `/app/${wsId}/goals/timeline`,
                "data-ocid": "view-timeline-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-4 w-4 mr-2" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Timeline" })
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                asChild: true,
                "data-ocid": "new-goal-btn",
                className: "active-press min-h-[44px] gap-2 font-semibold shadow-sm",
                size: "default",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: `/app/${wsId}/goals/new`, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
                  "Create Goal"
                ] })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-4", children: [
          {
            label: "Total Goals",
            value: String(stats.total),
            color: "text-primary bg-primary/10 border-primary/20"
          },
          {
            label: "Active",
            value: String(stats.active),
            color: "text-accent bg-accent/10 border-accent/20"
          },
          {
            label: "Completed",
            value: String(stats.completed),
            color: "text-emerald-600 bg-emerald-500/10 border-emerald-200"
          },
          {
            label: "Avg. Progress",
            value: `${stats.avgProgress}%`,
            color: "text-secondary bg-secondary/10 border-secondary/20"
          }
        ].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-xl border border-border/50 bg-card shadow-card p-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `inline-flex h-7 w-7 items-center justify-center rounded-lg border mb-2.5 ${s.color}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "h-3.5 w-3.5" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display font-bold font-mono tabular-nums text-foreground", children: s.value }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: s.label })
            ]
          },
          s.label
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 sm:gap-3 rounded-xl border border-border/50 bg-card shadow-card px-3 sm:px-4 py-3 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Filter" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Select,
            {
              value: statusFilter,
              onValueChange: (v) => setStatusFilter(v),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    className: "h-8 w-44 text-xs",
                    "data-ocid": "status-filter-select",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: ALL_FILTER_STATUSES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s === "all" ? "All statuses" : BACKEND_STATUS_LABELS[s] ?? s }, s)) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto text-xs text-muted-foreground", children: [
            filtered.length,
            " goal",
            filtered.length !== 1 ? "s" : ""
          ] })
        ] }),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3", children: [1, 2, 3].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-52 rounded-xl" }, n)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center py-16 gap-4",
            "data-ocid": "goals-empty",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-16 w-16 items-center justify-center rounded-2xl bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "h-8 w-8 text-muted-foreground" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-semibold text-foreground", children: statusFilter === "all" ? "No goals yet" : "No goals with this status" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: statusFilter === "all" ? "Create your first goal to start tracking objectives" : "Try a different filter or create a new goal" })
              ] }),
              statusFilter === "all" && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "active-press", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: `/app/${wsId}/goals/new`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-2" }),
                "Create First Goal"
              ] }) })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3", children: filtered.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx(GoalCard, { goal: g, wsId }, g.id)) })
      ]
    }
  );
}
export {
  GoalsPage as default
};
