import { f as useWorkspace, r as reactExports, j as jsxRuntimeExports, B as Button, i as Link, am as Target } from "./index-CzyNqtbv.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-BTCkNtDu.js";
import { M as MOCK_GOALS, S as STATUS_LABELS, a as STATUS_COLORS } from "./goalData-BuNPhJNp.js";
import { A as ArrowLeft } from "./arrow-left-BnDr9sMT.js";
import { C as ChartColumn } from "./chart-column-BI6TuY0g.js";
function parsePeriodSort(period) {
  const match = period.match(/Q(\d)\s+(\d{4})/);
  if (match) return Number(match[2]) * 10 + Number(match[1]);
  const hMatch = period.match(/H(\d)\s+(\d{4})/);
  if (hMatch) return Number(hMatch[2]) * 10 + (Number(hMatch[1]) === 1 ? 1 : 3);
  const yMatch = period.match(/(\d{4})/);
  if (yMatch) return Number(yMatch[1]) * 10;
  return 0;
}
function groupByPeriod(goals) {
  const map = /* @__PURE__ */ new Map();
  for (const g of goals) {
    const arr = map.get(g.period) ?? [];
    arr.push(g);
    map.set(g.period, arr);
  }
  return Array.from(map.entries()).sort(([a], [b]) => parsePeriodSort(a) - parsePeriodSort(b)).map(([period, gs]) => ({ period, goals: gs }));
}
function GoalBar({ goal, wsId }) {
  const pct = Math.min(100, Math.max(2, goal.progress));
  const barColor = goal.status === "Completed" ? "bg-muted-foreground/40" : goal.status === "AtRisk" || goal.status === "Behind" ? "bg-destructive/70" : "bg-primary/85";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Link,
    {
      to: `/app/${wsId}/goals/${goal.id}`,
      "data-ocid": `timeline-bar-${goal.id}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 group cursor-pointer py-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-44 shrink-0 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-foreground truncate group-hover:text-primary transition-colors", children: goal.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: goal.owner })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-7 flex-1 rounded-lg bg-muted overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `h-full rounded-lg transition-all duration-500 flex items-center px-2 overflow-hidden ${barColor}`,
                style: { width: `${pct}%` },
                children: pct > 20 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-mono font-semibold text-white/90 whitespace-nowrap", children: [
                  goal.progress,
                  "%"
                ] })
              }
            ),
            pct <= 20 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "absolute top-1/2 -translate-y-1/2 text-[10px] font-mono font-semibold text-muted-foreground",
                style: { left: `calc(${pct}% + 4px)` },
                children: [
                  goal.progress,
                  "%"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium border shrink-0 ${STATUS_COLORS[goal.status]}`,
              children: STATUS_LABELS[goal.status]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground shrink-0 hidden sm:block", children: [
            goal.keyResults,
            " KRs"
          ] })
        ] })
      ] })
    }
  );
}
function GoalTimelinePage() {
  const { activeWorkspaceId } = useWorkspace();
  const wsId = activeWorkspaceId ?? "";
  const grouped = reactExports.useMemo(() => groupByPeriod(MOCK_GOALS), []);
  const periodStats = reactExports.useMemo(() => {
    return grouped.map(({ period, goals: gs }) => ({
      period,
      count: gs.length,
      avgProgress: Math.round(
        gs.reduce((a, g) => a + g.progress, 0) / gs.length
      ),
      completed: gs.filter((g) => g.status === "Completed").length
    }));
  }, [grouped]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "animate-fade-in-up p-6 space-y-6",
      "data-ocid": "goal-timeline-page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: `/app/${wsId}/goals`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold tracking-tight text-foreground", children: "Goals Timeline" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Visual progress overview across all goal periods" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", asChild: true, className: "active-press", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: `/app/${wsId}/goals/new`, "data-ocid": "new-goal-btn", children: "New Goal" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3 sm:grid-cols-4", children: periodStats.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-xl border border-border/50 bg-card shadow-card p-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-3 w-3 text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground", children: p.period })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xl font-display font-bold font-mono tabular-nums text-foreground", children: [
                p.avgProgress,
                "%"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground mt-0.5", children: [
                p.count,
                " goals · ",
                p.completed,
                " complete"
              ] })
            ]
          },
          p.period
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-center gap-4 text-xs text-muted-foreground", children: [
          { color: "bg-primary/85", label: "On Track / Active" },
          { color: "bg-destructive/70", label: "At Risk / Behind" },
          { color: "bg-muted-foreground/40", label: "Completed" }
        ].map((l) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block h-3 w-6 rounded ${l.color}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: l.label })
        ] }, l.label)) }),
        grouped.map(({ period, goals: gs }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Card,
          {
            className: "shadow-card rounded-xl border border-border/50 bg-card",
            "data-ocid": `period-group-${period.replace(/\s/g, "-")}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3 border-b border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm flex items-center gap-2 font-semibold", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "h-4 w-4 text-primary" }),
                  period
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    gs.length,
                    " goal",
                    gs.length !== 1 ? "s" : ""
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "avg",
                    " ",
                    Math.round(
                      gs.reduce((a, g) => a + g.progress, 0) / gs.length
                    ),
                    "% complete"
                  ] })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-5 py-4 divide-y divide-border/40", children: gs.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsx(GoalBar, { goal: g, wsId }, g.id)) })
            ]
          },
          period
        )),
        grouped.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center py-16 gap-4",
            "data-ocid": "timeline-empty",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-16 w-16 items-center justify-center rounded-2xl bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-8 w-8 text-muted-foreground" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-semibold text-foreground", children: "No goals yet" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Create goals to see them visualized on the timeline" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { asChild: true, className: "active-press", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: `/app/${wsId}/goals/new`, children: "Create First Goal" }) })
            ]
          }
        )
      ]
    }
  );
}
export {
  GoalTimelinePage as default
};
