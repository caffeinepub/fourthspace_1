import { m as useParams, r as reactExports, j as jsxRuntimeExports, x as Target, B as Button, e as useActor, h as useQuery, aq as Sun, ar as Moon, w as ChevronDown, l as createActor } from "./index-1XRv9GHr.js";
import { B as Badge } from "./badge-rX4oLW6l.js";
import { I as Input } from "./input-BOIU-9S_.js";
import { S as Skeleton } from "./index-wZVP6u7e.js";
import { T as TrendingUp } from "./trending-up-rksXqIQ8.js";
import { S as Search } from "./search-CWnD_rod.js";
import { A as ArrowUpDown } from "./arrow-up-down-Cc3_slzz.js";
import { C as CircleAlert } from "./circle-alert-DOsaO_yO.js";
import { C as ChevronUp } from "./chevron-up-BUdvSziG.js";
import { C as Clock } from "./clock-By6uj0s2.js";
function deriveCheckIns(goal) {
  if (!goal.checkInCount || Number(goal.checkInCount) === 0) return [];
  const count = Math.min(Number(goal.checkInCount), 5);
  const checkIns = [];
  const progressStep = goal.progress / count;
  const now = /* @__PURE__ */ new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - (count - i) * 14);
    const change = Math.round(progressStep);
    checkIns.push({
      date: d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      }),
      change: `+${change}%`
    });
  }
  return checkIns;
}
const GOAL_STATUS_STYLES = {
  Active: {
    badge: "bg-emerald-500/10 text-emerald-700 border-emerald-200 dark:text-emerald-400 dark:border-emerald-800",
    bar: "bg-emerald-500",
    dot: "bg-emerald-500"
  },
  Completed: {
    badge: "bg-green-600/10 text-green-700 border-green-200 dark:text-green-400 dark:border-green-800",
    bar: "bg-green-600",
    dot: "bg-green-600"
  },
  OnHold: {
    badge: "bg-amber-500/10 text-amber-700 border-amber-200 dark:text-amber-400 dark:border-amber-800",
    bar: "bg-amber-500",
    dot: "bg-amber-500"
  },
  Cancelled: {
    badge: "bg-muted text-muted-foreground border-border",
    bar: "bg-muted-foreground",
    dot: "bg-muted-foreground"
  }
};
const KR_STATUS_STYLES = {
  OnTrack: {
    badge: "bg-emerald-500/10 text-emerald-700 border-emerald-200 dark:text-emerald-400 dark:border-emerald-800",
    bar: "bg-emerald-500"
  },
  AtRisk: {
    badge: "bg-amber-500/10 text-amber-700 border-amber-200 dark:text-amber-400 dark:border-amber-800",
    bar: "bg-amber-500"
  },
  Behind: {
    badge: "bg-red-500/10 text-red-700 border-red-200 dark:text-red-400 dark:border-red-800",
    bar: "bg-red-500"
  },
  Completed: {
    badge: "bg-muted text-muted-foreground border-border",
    bar: "bg-muted-foreground"
  }
};
const KR_STATUS_LABELS = {
  OnTrack: "On Track",
  AtRisk: "At Risk",
  Behind: "Behind",
  Completed: "Completed"
};
const GOAL_STATUS_LABELS = {
  Active: "Active",
  Completed: "Completed",
  OnHold: "On Hold",
  Cancelled: "Cancelled"
};
function usePublicGoals(shareToken) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: ["public-goals", shareToken],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPublicGoals(shareToken);
    },
    enabled: !!actor && !isFetching && !!shareToken,
    retry: 1
  });
}
function FourthspaceLogo({ size = 32 }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      width: size,
      height: size,
      viewBox: "0 0 32 32",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      "aria-label": "Fourthspace",
      role: "img",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("title", { children: "Fourthspace" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { width: "32", height: "32", rx: "8", fill: "oklch(0.45 0.24 264)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: "M8 10h10v4H12v2h6v4h-6v6H8V10z",
            fill: "white",
            fillOpacity: "0.95"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "rect",
          {
            x: "18",
            y: "10",
            width: "4",
            height: "12",
            rx: "1",
            fill: "white",
            fillOpacity: "0.6"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "rect",
          {
            x: "20",
            y: "22",
            width: "4",
            height: "4",
            rx: "1",
            fill: "white",
            fillOpacity: "0.4"
          }
        )
      ]
    }
  );
}
function ProgressBar({
  value,
  colorClass,
  label
}) {
  const clamped = Math.min(100, Math.max(0, value));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
    label && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono font-semibold text-foreground", children: [
        clamped,
        "%"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-full rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `h-full rounded-full transition-all duration-700 ${colorClass}`,
        style: { width: `${clamped}%` }
      }
    ) })
  ] });
}
function GoalDetail({ goal }) {
  const styles = GOAL_STATUS_STYLES[goal.status];
  const checkIns = deriveCheckIns(goal);
  const [showCheckIns, setShowCheckIns] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 p-1", "data-ocid": `goal-detail-${goal.id}`, children: [
    goal.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: goal.description }),
    goal.keyResults.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground", children: "Key Results" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: goal.keyResults.map((kr) => {
        const krStyle = KR_STATUS_STYLES[kr.status];
        const krProgress = kr.targetValue > 0 ? Math.min(
          100,
          Math.round(kr.currentValue / kr.targetValue * 100)
        ) : 0;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-xl border border-border bg-background p-3.5 space-y-2.5",
            "data-ocid": `kr-row-${kr.id}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground leading-snug flex-1", children: kr.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    className: `${krStyle.badge} text-[10px] shrink-0 font-medium border`,
                    children: KR_STATUS_LABELS[kr.status]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", children: [
                  kr.currentValue,
                  " / ",
                  kr.targetValue,
                  " ",
                  kr.unit
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono font-semibold text-foreground", children: [
                  krProgress,
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-full rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `h-full rounded-full transition-all duration-700 ${krStyle.bar}`,
                  style: { width: `${krProgress}%` }
                }
              ) })
            ]
          },
          kr.id
        );
      }) })
    ] }),
    checkIns.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setShowCheckIns((p) => !p),
          className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors duration-200 w-full text-left",
          "aria-expanded": showCheckIns,
          "data-ocid": "checkin-history-toggle",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5" }),
            "Check-in History",
            showCheckIns ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-3.5 w-3.5 ml-auto" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3.5 w-3.5 ml-auto" })
          ]
        }
      ),
      showCheckIns && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5 pl-1", children: checkIns.map((ci, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center justify-between text-xs text-muted-foreground py-1 border-b border-border last:border-0",
          "data-ocid": `checkin-row-${i}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: ci.date }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-emerald-600 dark:text-emerald-400 font-mono", children: ci.change })
          ]
        },
        `ci-${ci.date}-${i}`
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      ProgressBar,
      {
        value: goal.progress,
        colorClass: styles.bar,
        label: "Overall Progress"
      }
    ) })
  ] });
}
function GoalCard({
  goal,
  expanded,
  onToggle
}) {
  const styles = GOAL_STATUS_STYLES[goal.status];
  const formatDate = (d) => {
    if (!d) return "";
    try {
      return new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    } catch {
      return d;
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-2xl border border-border bg-card shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden",
      "data-ocid": `public-goal-card-${goal.id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: onToggle,
            className: "w-full text-left p-5 space-y-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-t-2xl",
            "aria-expanded": expanded,
            "aria-controls": `goal-detail-${goal.id}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1.5 flex-wrap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Badge,
                  {
                    className: `${styles.badge} text-[10px] font-semibold border px-2 py-0.5`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: `mr-1 h-1.5 w-1.5 rounded-full inline-block ${styles.dot}`
                        }
                      ),
                      GOAL_STATUS_LABELS[goal.status]
                    ]
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-medium shrink-0", children: goal.period }),
                  expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-4 w-4 text-muted-foreground shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 text-muted-foreground shrink-0" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground leading-snug pr-2", children: goal.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  goal.keyResults.length,
                  " Key Result",
                  goal.keyResults.length !== 1 ? "s" : ""
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  formatDate(goal.startDate),
                  " – ",
                  formatDate(goal.endDate)
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Progress" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono font-bold text-foreground", children: [
                    goal.progress,
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-full rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `h-full rounded-full transition-all duration-700 ${styles.bar}`,
                    style: { width: `${Math.min(100, goal.progress)}%` }
                  }
                ) })
              ] })
            ]
          }
        ),
        expanded && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            id: `goal-detail-${goal.id}`,
            className: "border-t border-border bg-background/50 px-5 py-4",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(GoalDetail, { goal })
          }
        )
      ]
    }
  );
}
function EmptyState({ token }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col items-center justify-center py-20 gap-5 text-center",
      "data-ocid": "public-goals-empty",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-20 w-20 items-center justify-center rounded-3xl bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "h-9 w-9 text-muted-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-sm space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-display font-semibold text-foreground", children: "No public goals found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: token ? "This goals page is either empty or the share link may have expired. Contact the workspace admin for a valid link." : "No share token provided." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: "/",
            className: "text-sm text-primary hover:text-primary/80 transition-colors duration-200 underline underline-offset-2",
            children: "Sign in to Fourthspace"
          }
        )
      ]
    }
  );
}
function GoalsSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
      "data-ocid": "public-goals-loading",
      children: ["s1", "s2", "s3", "s4", "s5", "s6"].map((sid) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-2xl border border-border bg-card p-5 space-y-3",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-16 rounded-full" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-12" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-20" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-28" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-1.5 w-full rounded-full" })
          ]
        },
        sid
      ))
    }
  );
}
function ErrorState() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col items-center justify-center py-20 gap-4 text-center",
      "data-ocid": "public-goals-error",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-7 w-7 text-destructive" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold text-foreground", children: "Unable to load goals" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Something went wrong. Please refresh or try again later." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => window.location.reload(),
            children: "Refresh"
          }
        )
      ]
    }
  );
}
function SortButton({
  label,
  field,
  current,
  onSort
}) {
  const active = current.field === field;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick: () => onSort(field),
      className: `flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-colors duration-150 ${active ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"}`,
      "data-ocid": `sort-${field}`,
      children: [
        label,
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpDown, { className: "h-3 w-3" }),
        active && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px]", children: current.direction === "asc" ? "↑" : "↓" })
      ]
    }
  );
}
function FilterChip({
  label,
  active,
  onClick,
  ocid
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      onClick,
      "data-ocid": ocid,
      className: `px-3 py-1.5 rounded-full text-xs font-medium border transition-colors duration-150 whitespace-nowrap ${active ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"}`,
      children: label
    }
  );
}
function ThemeToggle() {
  const [dark, setDark] = reactExports.useState(() => {
    if (typeof window === "undefined") return false;
    const stored = localStorage.getItem("public-goals-theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  reactExports.useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("public-goals-theme", dark ? "dark" : "light");
  }, [dark]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick: () => setDark((p) => !p),
      "aria-label": dark ? "Switch to light mode" : "Switch to dark mode",
      className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors duration-200 text-xs font-medium",
      "data-ocid": "theme-toggle",
      children: [
        dark ? /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { className: "h-3.5 w-3.5" }),
        dark ? "Light" : "Dark"
      ]
    }
  );
}
const STATUS_FILTERS = [
  "All",
  "Active",
  "Completed",
  "OnHold",
  "Cancelled"
];
const PERIOD_FILTERS = [
  "All",
  "Q1",
  "Q2",
  "Q3",
  "Q4",
  "Annual"
];
const SORT_FIELDS = [
  { field: "name", label: "Name" },
  { field: "period", label: "Period" },
  { field: "status", label: "Status" },
  { field: "progress", label: "Progress" }
];
function PublicGoalsPage() {
  const { shareToken } = useParams({ from: "/public/goals/$shareToken" });
  const { data: goals = [], isLoading, isError } = usePublicGoals(shareToken);
  const [search, setSearch] = reactExports.useState("");
  const [statusFilter, setStatusFilter] = reactExports.useState("All");
  const [periodFilter, setPeriodFilter] = reactExports.useState("All");
  const [sort, setSort] = reactExports.useState({
    field: "progress",
    direction: "desc"
  });
  const [expandedId, setExpandedId] = reactExports.useState(null);
  const workspaceName = goals.length > 0 ? "Fourthspace" : "Fourthspace";
  reactExports.useEffect(() => {
    document.title = `${workspaceName} | Fourthspace Goals`;
    const setMeta = (prop, content) => {
      let el = document.querySelector(
        `meta[property="${prop}"]`
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
      "View company objectives and key results — powered by Fourthspace."
    );
    setMeta("og:type", "website");
  }, [workspaceName]);
  const handleSort = reactExports.useCallback((field) => {
    setSort((prev) => ({
      field,
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc"
    }));
  }, []);
  const filtered = reactExports.useMemo(() => {
    let result = [...goals];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (g) => g.title.toLowerCase().includes(q) || g.description.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "All") {
      result = result.filter((g) => g.status === statusFilter);
    }
    if (periodFilter !== "All") {
      if (periodFilter === "Annual") {
        result = result.filter(
          (g) => g.period.toLowerCase().includes("annual") || g.period.toLowerCase().includes("h1") || g.period.toLowerCase().includes("h2") || g.period.toLowerCase().includes("fy")
        );
      } else {
        result = result.filter(
          (g) => g.period.toUpperCase().includes(periodFilter)
        );
      }
    }
    const dir = sort.direction;
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
  const stats = reactExports.useMemo(() => {
    const total = goals.length;
    const active = goals.filter((g) => g.status === "Active").length;
    const completed = goals.filter((g) => g.status === "Completed").length;
    const avgProgress = total > 0 ? Math.round(goals.reduce((a, g) => a + g.progress, 0) / total) : 0;
    return { total, active, completed, avgProgress };
  }, [goals]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen flex flex-col bg-background",
      "data-ocid": "public-goals-page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-10 bg-card/95 backdrop-blur border-b border-border shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              href: "/",
              className: "flex items-center gap-2.5 shrink-0",
              "aria-label": "Fourthspace home",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FourthspaceLogo, { size: 28 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-foreground text-base hidden sm:block", children: "Fourthspace" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:block text-muted-foreground/50", children: "•" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-muted-foreground truncate", children: "Public Goals" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeToggle, {})
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-primary/5 border-b border-border/60", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl sm:text-3xl font-display font-bold text-foreground", children: "Company Goals & OKRs" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Live progress on objectives and key results across the organization" })
          ] }),
          !isLoading && !isError && goals.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-4 shrink-0", children: [
            {
              label: "Total",
              value: stats.total,
              icon: Target,
              color: "text-primary"
            },
            {
              label: "Active",
              value: stats.active,
              icon: TrendingUp,
              color: "text-emerald-600 dark:text-emerald-400"
            },
            {
              label: "Done",
              value: stats.completed,
              icon: Target,
              color: "text-green-600 dark:text-green-400"
            },
            {
              label: "Avg %",
              value: `${stats.avgProgress}%`,
              icon: TrendingUp,
              color: "text-secondary"
            }
          ].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: `text-xl sm:text-2xl font-display font-bold ${s.color}`,
                children: s.value
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wide", children: s.label })
          ] }, s.label)) })
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card/95 backdrop-blur border-b border-border/60 sticky top-14 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-1", children: "Status" }),
            STATUS_FILTERS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              FilterChip,
              {
                label: s === "OnHold" ? "On Hold" : s,
                active: statusFilter === s,
                onClick: () => setStatusFilter(s),
                ocid: `status-filter-${s.toLowerCase()}`
              },
              s
            )),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-1", children: "Period" }),
            PERIOD_FILTERS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              FilterChip,
              {
                label: p,
                active: periodFilter === p,
                onClick: () => setPeriodFilter(p),
                ocid: `period-filter-${p.toLowerCase()}`
              },
              p
            ))
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row items-stretch sm:items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 max-w-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: search,
                  onChange: (e) => setSearch(e.target.value),
                  placeholder: "Search goals...",
                  className: "pl-8 h-8 text-sm",
                  "data-ocid": "goals-search-input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Sort:" }),
              SORT_FIELDS.map(({ field, label }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                SortButton,
                {
                  label,
                  field,
                  current: sort,
                  onSort: handleSort
                },
                field
              )),
              !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto text-xs text-muted-foreground", children: [
                filtered.length,
                " goal",
                filtered.length !== 1 ? "s" : ""
              ] })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(GoalsSkeleton, {}) : isError ? /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorState, {}) : filtered.length === 0 && goals.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { token: shareToken }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center py-16 gap-3 text-center",
            "data-ocid": "public-goals-no-results",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-8 w-8 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "No goals match your filters" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Try adjusting your search, status, or period filters." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: () => {
                    setSearch("");
                    setStatusFilter("All");
                    setPeriodFilter("All");
                  },
                  "data-ocid": "clear-filters-btn",
                  children: "Clear Filters"
                }
              )
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: filtered.map((goal) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          GoalCard,
          {
            goal,
            expanded: expandedId === goal.id,
            onToggle: () => setExpandedId((prev) => prev === goal.id ? null : goal.id)
          },
          goal.id
        )) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "footer",
          {
            className: "bg-card border-t border-border",
            "data-ocid": "public-goals-footer",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FourthspaceLogo, { size: 24 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-display font-semibold text-foreground", children: "Fourthspace" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "All-in-one workspace platform" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "a",
                  {
                    href: "/",
                    className: "text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-200",
                    "data-ocid": "sign-in-link",
                    children: "Sign in to Fourthspace →"
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-xs text-muted-foreground py-3", children: [
                "© ",
                (/* @__PURE__ */ new Date()).getFullYear(),
                " Fourthspace ·",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "a",
                  {
                    href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "hover:text-foreground transition-colors duration-200",
                    children: "Built with caffeine.ai"
                  }
                )
              ] }) })
            ]
          }
        )
      ]
    }
  );
}
export {
  PublicGoalsPage as default
};
