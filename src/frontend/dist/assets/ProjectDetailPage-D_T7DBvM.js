import { t as createLucideIcon, r as reactExports, T as TaskStatus, j as jsxRuntimeExports, i as Link, as as TaskPriority, ac as ChevronDown, B as Button, m as useParams, d as useNavigate, f as useWorkspace, n as useQueryClient, h as useQuery, a as FolderKanban, F as FileText, P as Plus, w as MilestoneStatus, b2 as LayoutDashboard, s as ProjectStatus } from "./index-CQ7TXF2a.js";
import { S as Skeleton } from "./skeleton-CzZABium.js";
import { u as useMutation } from "./useMutation-fGi-GboX.js";
import { u as ue } from "./index-BGFcG_k-.js";
import { B as Badge } from "./badge-DOwzzuc_.js";
import { I as Input } from "./input-Dkit6sfw.js";
import { S as Search } from "./search-B58SW5UA.js";
import { A as ArrowUpDown } from "./arrow-up-down-CpEKVqOd.js";
import { C as ChevronUp } from "./chevron-up-56u9dcHi.js";
import { C as Card, a as CardContent } from "./card-DtVZ2GZq.js";
import { R as ResponsiveContainer, B as BarChart, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, L as Legend, a as Bar } from "./BarChart-f89JYg8H.js";
import { u as useBackend } from "./index--h8TKSCt.js";
import { A as ArrowLeft } from "./arrow-left-D6cz-lXM.js";
import { U as Users } from "./users-Dh_2Am6J.js";
import { C as CalendarRange } from "./calendar-range-DCUp6cc-.js";
import { F as Flag } from "./flag-DECjwJM9.js";
import { C as ChartColumn } from "./chart-column-D11R5Weh.js";
import { C as Circle } from "./circle-BiZYV3sp.js";
import { C as Clock } from "./clock-c3PUUUEP.js";
import { C as CircleCheck } from "./circle-check-B7zTmrRV.js";
import { C as CircleAlert } from "./circle-alert-BAI5A_4F.js";
import { T as Trash2 } from "./trash-2-CGgRyVAn.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["path", { d: "M8 2v4", key: "1cmpym" }],
  ["path", { d: "M16 2v4", key: "4m81vk" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", key: "1hopcy" }],
  ["path", { d: "M3 10h18", key: "8toen8" }],
  ["path", { d: "m9 16 2 2 4-4", key: "19s6y9" }]
];
const CalendarCheck = createLucideIcon("calendar-check", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  [
    "path",
    {
      d: "M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z",
      key: "1f1r0c"
    }
  ]
];
const Diamond = createLucideIcon("diamond", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["rect", { width: "7", height: "7", x: "3", y: "3", rx: "1", key: "1g98yp" }],
  ["rect", { width: "7", height: "7", x: "3", y: "14", rx: "1", key: "1bb6yr" }],
  ["path", { d: "M14 4h7", key: "3xa0d5" }],
  ["path", { d: "M14 9h7", key: "1icrd9" }],
  ["path", { d: "M14 15h7", key: "1mj8o2" }],
  ["path", { d: "M14 20h7", key: "11slyb" }]
];
const LayoutList = createLucideIcon("layout-list", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M9 8h7", key: "kbo1nt" }],
  ["path", { d: "M8 12h6", key: "ikassy" }],
  ["path", { d: "M11 16h5", key: "oq65wt" }]
];
const SquareChartGantt = createLucideIcon("square-chart-gantt", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18",
      key: "gugj83"
    }
  ]
];
const Table2 = createLucideIcon("table-2", __iconNode);
const STATUS_COLORS = {
  [TaskStatus.Todo]: "bg-muted-foreground/30",
  [TaskStatus.InProgress]: "bg-orange-500",
  [TaskStatus.Done]: "bg-emerald-500",
  [TaskStatus.Blocked]: "bg-destructive"
};
const STATUS_TEXT = {
  [TaskStatus.Todo]: "text-muted-foreground",
  [TaskStatus.InProgress]: "text-orange-500",
  [TaskStatus.Done]: "text-emerald-500",
  [TaskStatus.Blocked]: "text-destructive"
};
function principalToText$3(id) {
  return typeof id === "string" ? id : id.toText();
}
function getInitials$4(id) {
  return principalToText$3(id).slice(0, 2).toUpperCase();
}
function toMs$2(nano) {
  if (nano == null) return null;
  return Number(nano) / 1e6;
}
function GanttView({ tasks }) {
  const today = Date.now();
  const { startMs, endMs, totalDays } = reactExports.useMemo(() => {
    const dates = tasks.flatMap((t) => [toMs$2(t.createdAt), toMs$2(t.dueDate)]).filter((d) => d != null);
    const minDate = Math.min(...dates, today);
    const maxDate = Math.max(...dates, today + 7 * 864e5);
    const s = minDate - 3 * 864e5;
    const e = maxDate + 3 * 864e5;
    return { startMs: s, endMs: e, totalDays: (e - s) / 864e5 };
  }, [tasks, today]);
  const pct = (ms) => Math.max(0, Math.min(100, (ms - startMs) / (endMs - startMs) * 100));
  const todayPct = pct(today);
  const monthLabels = reactExports.useMemo(() => {
    const labels = [];
    const start = new Date(startMs);
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    while (start.getTime() < endMs) {
      const t = start.getTime();
      labels.push({
        label: start.toLocaleDateString("en-US", {
          month: "short",
          year: "2-digit"
        }),
        pct: Math.max(
          0,
          Math.min(100, (t - startMs) / (endMs - startMs) * 100)
        )
      });
      start.setMonth(start.getMonth() + 1);
    }
    return labels;
  }, [startMs, endMs]);
  const grouped = reactExports.useMemo(() => {
    const order = [
      TaskStatus.InProgress,
      TaskStatus.Todo,
      TaskStatus.Blocked,
      TaskStatus.Done
    ];
    return order.map((status) => ({
      status,
      tasks: tasks.filter((t) => t.status === status)
    })).filter((g) => g.tasks.length > 0);
  }, [tasks]);
  if (tasks.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex flex-col items-center justify-center py-20 text-center",
        "data-ocid": "gantt-empty",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "No tasks to display in Gantt view." })
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-x-auto", "data-ocid": "gantt-view", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "relative h-8 bg-muted/30 border-b border-border rounded-t-xl overflow-hidden mb-0",
        style: { minWidth: 600 },
        children: [
          monthLabels.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "absolute top-1.5 text-[10px] font-medium text-muted-foreground",
              style: { left: `${m.pct}%`, transform: "translateX(-50%)" },
              children: m.label
            },
            m.label
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute top-0 bottom-0 w-0.5 bg-orange-500 opacity-60",
              style: { left: `${todayPct}%` }
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "relative rounded-b-xl border border-t-0 border-border bg-card overflow-hidden",
        style: { minWidth: 600 },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute top-0 bottom-0 w-0.5 bg-orange-500/30 z-10 pointer-events-none",
              style: { left: `${todayPct}%` }
            }
          ),
          Array.from({ length: Math.ceil(totalDays / 7) }).map((_, i) => {
            const weekMs = startMs + i * 7 * 864e5;
            const pos = pct(weekMs);
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "absolute top-0 bottom-0 w-px bg-border/40 pointer-events-none",
                style: { left: `${pos}%` }
              },
              weekMs
            );
          }),
          grouped.map((group) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: `px-4 py-1.5 text-xs font-semibold ${STATUS_TEXT[group.status]} bg-muted/20 border-b border-border/40 sticky left-0`,
                children: [
                  group.status,
                  " (",
                  group.tasks.length,
                  ")"
                ]
              }
            ),
            group.tasks.map((task) => {
              const createdMs = toMs$2(task.createdAt) ?? today;
              const dueMs = toMs$2(task.dueDate);
              const barStart = pct(createdMs);
              const barEnd = dueMs ? pct(dueMs) : pct(createdMs + 3 * 864e5);
              const barWidth = Math.max(barEnd - barStart, 1.5);
              const isOverdue = dueMs && dueMs < today && task.status !== TaskStatus.Done;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "relative flex items-center h-11 border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors",
                  "data-ocid": `gantt-row-${task.id}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: `absolute h-6 rounded-full flex items-center px-2 gap-1.5 overflow-hidden z-20 cursor-default transition-all ${STATUS_COLORS[task.status]} ${isOverdue ? "ring-1 ring-destructive" : ""}`,
                        style: {
                          left: `${barStart}%`,
                          width: `${barWidth}%`,
                          minWidth: "2.5rem"
                        },
                        title: task.title,
                        children: [
                          task.assigneeId && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-shrink-0 flex h-4 w-4 items-center justify-center rounded-full bg-white/20 text-white text-[8px] font-bold", children: getInitials$4(task.assigneeId) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-medium text-white truncate leading-none", children: task.title })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-3 flex items-center gap-1.5 z-30 pointer-events-none", children: isOverdue && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        variant: "outline",
                        className: "text-[9px] px-1 py-0 border-destructive/50 text-destructive",
                        children: "Overdue"
                      }
                    ) })
                  ]
                },
                task.id
              );
            })
          ] }, group.status)),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute top-0 z-30 pointer-events-none",
              style: { left: `${todayPct}%`, transform: "translateX(-50%)" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-bold text-orange-500 bg-card px-1 rounded leading-none", children: "Today" })
            }
          )
        ]
      }
    )
  ] });
}
const STATUS_BADGE = {
  [TaskStatus.Todo]: "bg-muted text-muted-foreground border-border",
  [TaskStatus.InProgress]: "bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-800 dark:text-orange-400",
  [TaskStatus.Done]: "bg-emerald-500/10 text-emerald-700 border-emerald-200 dark:border-emerald-800 dark:text-emerald-400",
  [TaskStatus.Blocked]: "bg-destructive/10 text-destructive border-destructive/20"
};
const PRIORITY_BADGE$2 = {
  [TaskPriority.Low]: "bg-muted text-muted-foreground border-border",
  [TaskPriority.Medium]: "bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-800 dark:text-orange-400",
  [TaskPriority.High]: "bg-red-500/10 text-red-600 border-red-200 dark:border-red-800 dark:text-red-400",
  [TaskPriority.Critical]: "bg-red-600/20 text-red-700 border-red-300 dark:border-red-700 dark:text-red-300 font-semibold"
};
const PRIORITY_ORDER = {
  [TaskPriority.Critical]: 0,
  [TaskPriority.High]: 1,
  [TaskPriority.Medium]: 2,
  [TaskPriority.Low]: 3
};
function toMs$1(nano) {
  if (nano == null) return null;
  return Number(nano) / 1e6;
}
function principalToText$2(id) {
  return typeof id === "string" ? id : id.toText();
}
function getInitials$3(id) {
  return principalToText$2(id).slice(0, 2).toUpperCase();
}
function TableView({
  tasks,
  projectId,
  workspaceId = ""
}) {
  const [search, setSearch] = reactExports.useState("");
  const [sortKey, setSortKey] = reactExports.useState("createdAt");
  const [sortDir, setSortDir] = reactExports.useState("desc");
  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => d === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };
  const sorted = reactExports.useMemo(() => {
    const q = search.toLowerCase();
    const filtered = q ? tasks.filter(
      (t) => t.title.toLowerCase().includes(q) || t.status.toLowerCase().includes(q)
    ) : tasks;
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "title") cmp = a.title.localeCompare(b.title);
      else if (sortKey === "status") cmp = a.status.localeCompare(b.status);
      else if (sortKey === "priority")
        cmp = (PRIORITY_ORDER[a.priority] ?? 99) - (PRIORITY_ORDER[b.priority] ?? 99);
      else if (sortKey === "assigneeId") {
        const aText = a.assigneeId != null ? principalToText$2(a.assigneeId) : "";
        const bText = b.assigneeId != null ? principalToText$2(b.assigneeId) : "";
        cmp = aText.localeCompare(bText);
      } else if (sortKey === "dueDate")
        cmp = (toMs$1(a.dueDate) ?? 0) - (toMs$1(b.dueDate) ?? 0);
      else if (sortKey === "createdAt")
        cmp = (toMs$1(a.createdAt) ?? 0) - (toMs$1(b.createdAt) ?? 0);
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [tasks, search, sortKey, sortDir]);
  const SortIcon = ({ col }) => {
    if (sortKey !== col) return /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpDown, { className: "h-3 w-3 opacity-40" });
    return sortDir === "asc" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-3 w-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3 w-3" });
  };
  const Th = ({
    col,
    label,
    align = "left"
  }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "th",
    {
      className: `px-0 py-0 font-medium text-muted-foreground text-xs ${align === "right" ? "text-right" : "text-left"}`,
      "data-ocid": `table-sort-${col}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          className: `w-full px-4 py-3 flex items-center gap-1 hover:text-foreground transition-colors ${align === "right" ? "justify-end" : "justify-start"}`,
          onClick: () => handleSort(col),
          "aria-sort": sortKey === col ? sortDir === "asc" ? "ascending" : "descending" : "none",
          children: [
            label,
            /* @__PURE__ */ jsxRuntimeExports.jsx(SortIcon, { col })
          ]
        }
      )
    }
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "table-view", className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          value: search,
          onChange: (e) => setSearch(e.target.value),
          placeholder: "Search tasks…",
          className: "pl-8 h-8 text-sm",
          "data-ocid": "table-search"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-xl border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm min-w-[600px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "sticky top-0 bg-muted/40 backdrop-blur-sm border-b border-border z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { col: "title", label: "Task Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { col: "status", label: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { col: "priority", label: "Priority" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { col: "assigneeId", label: "Assignee" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { col: "dueDate", label: "Due Date", align: "right" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { col: "createdAt", label: "Created", align: "right" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "bg-card", children: sorted.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "td",
        {
          colSpan: 6,
          className: "text-center py-12 text-muted-foreground text-sm",
          children: search ? "No tasks match your search." : "No tasks yet."
        }
      ) }) : sorted.map((task) => {
        const dueMs = toMs$1(task.dueDate);
        const createdMs = toMs$1(task.createdAt);
        const isOverdue = dueMs && dueMs < Date.now() && task.status !== TaskStatus.Done;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            "data-ocid": `table-row-${task.id}`,
            className: "border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors cursor-pointer",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 max-w-[220px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/app/$workspaceId/projects/$projectId/tasks/$taskId",
                  params: { workspaceId, projectId, taskId: task.id },
                  className: "font-medium text-foreground hover:text-primary truncate block transition-colors",
                  children: task.title
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: `text-[10px] px-1.5 py-0 ${STATUS_BADGE[task.status]}`,
                  children: task.status
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: `text-[10px] px-1.5 py-0 ${PRIORITY_BADGE$2[task.priority]}`,
                  children: task.priority
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: task.assigneeId ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[9px] font-bold text-primary flex-shrink-0", children: getInitials$3(task.assigneeId) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground truncate max-w-[80px]", children: `${principalToText$2(task.assigneeId).slice(0, 8)}…` })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground/50", children: "Unassigned" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "td",
                {
                  className: `px-4 py-3 text-right text-xs tabular-nums ${isOverdue ? "text-destructive font-medium" : "text-muted-foreground"}`,
                  children: dueMs ? new Date(dueMs).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "2-digit"
                  }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40", children: "—" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right text-xs text-muted-foreground tabular-nums", children: createdMs ? new Date(createdMs).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "2-digit"
              }) : "—" })
            ]
          },
          task.id
        );
      }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground text-right", children: [
      sorted.length,
      " of ",
      tasks.length,
      " tasks"
    ] })
  ] });
}
const STATUS_DOT = {
  [TaskStatus.Todo]: "bg-muted-foreground/60",
  [TaskStatus.InProgress]: "bg-orange-500",
  [TaskStatus.Done]: "bg-emerald-500",
  [TaskStatus.Blocked]: "bg-destructive"
};
const PRIORITY_BADGE$1 = {
  [TaskPriority.Low]: "bg-muted text-muted-foreground border-border",
  [TaskPriority.Medium]: "bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-800 dark:text-orange-400",
  [TaskPriority.High]: "bg-red-500/10 text-red-600 border-red-200 dark:border-red-800 dark:text-red-400",
  [TaskPriority.Critical]: "bg-red-600/20 text-red-700 border-red-300 dark:border-red-700 dark:text-red-300 font-semibold"
};
function toMs(nano) {
  if (nano == null) return null;
  return Number(nano) / 1e6;
}
function principalToText$1(id) {
  return typeof id === "string" ? id : id.toText();
}
function getInitials$2(id) {
  return principalToText$1(id).slice(0, 2).toUpperCase();
}
const FILTERS = [
  { key: "all", label: "All" },
  { key: "week", label: "This Week" },
  { key: "month", label: "This Month" },
  { key: "overdue", label: "Overdue" }
];
function TimelineView({
  tasks,
  projectId,
  workspaceId = ""
}) {
  const [filter, setFilter] = reactExports.useState("all");
  const today = Date.now();
  const filtered = tasks.filter((t) => {
    const dueMs = toMs(t.dueDate);
    if (filter === "overdue")
      return dueMs != null && dueMs < today && t.status !== TaskStatus.Done;
    if (filter === "week") {
      const endOfWeek = today + 7 * 864e5;
      return dueMs != null && dueMs >= today && dueMs <= endOfWeek;
    }
    if (filter === "month") {
      const endOfMonth = today + 30 * 864e5;
      return dueMs != null && dueMs >= today && dueMs <= endOfMonth;
    }
    return true;
  }).sort((a, b) => {
    const aMs = toMs(a.dueDate) ?? Number.POSITIVE_INFINITY;
    const bMs = toMs(b.dueDate) ?? Number.POSITIVE_INFINITY;
    return aMs - bMs;
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "timeline-view", className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5", "data-ocid": "timeline-filters", children: [
      FILTERS.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: filter === f.key ? "default" : "outline",
          size: "sm",
          className: `h-7 px-3 text-xs ${filter === f.key ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`,
          onClick: () => setFilter(f.key),
          "data-ocid": `timeline-filter-${f.key}`,
          children: f.label
        },
        f.key
      )),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto text-xs text-muted-foreground self-center", children: [
        filtered.length,
        " task",
        filtered.length !== 1 ? "s" : ""
      ] })
    ] }),
    filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "No tasks match this filter." }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: filtered.map((task) => {
      const dueMs = toMs(task.dueDate);
      const isOverdue = dueMs && dueMs < today && task.status !== TaskStatus.Done;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/app/$workspaceId/projects/$projectId/tasks/$taskId",
          params: { workspaceId, projectId, taskId: task.id },
          "data-ocid": `timeline-task-${task.id}`,
          className: "flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-sm transition-all group",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `flex-shrink-0 h-2.5 w-2.5 rounded-full ${STATUS_DOT[task.status]}`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: task.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: task.status })
            ] }),
            task.assigneeId && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[9px] font-bold text-primary", children: getInitials$2(task.assigneeId) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "outline",
                className: `flex-shrink-0 text-[10px] px-1.5 py-0 ${PRIORITY_BADGE$1[task.priority]}`,
                children: task.priority
              }
            ),
            dueMs ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `flex-shrink-0 text-[11px] font-medium px-2 py-0.5 rounded-md ${isOverdue ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"}`,
                children: new Date(dueMs).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric"
                })
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-shrink-0 text-[11px] text-muted-foreground/50", children: "No date" })
          ]
        },
        task.id
      );
    }) })
  ] });
}
function principalToText(id) {
  return typeof id === "string" ? id : id.toText();
}
function getInitials$1(id) {
  return id.slice(0, 2).toUpperCase();
}
const STATUS_FILL = {
  [TaskStatus.Todo]: "hsl(var(--muted-foreground) / 0.4)",
  [TaskStatus.InProgress]: "#f97316",
  [TaskStatus.Done]: "#10b981",
  [TaskStatus.Blocked]: "hsl(var(--destructive))"
};
function WorkloadView({ tasks }) {
  const { chartData, assigneeList } = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    const getOrCreate = (id) => {
      if (!map.has(id)) {
        map.set(id, {
          id,
          initials: getInitials$1(id),
          [TaskStatus.Todo]: 0,
          [TaskStatus.InProgress]: 0,
          [TaskStatus.Done]: 0,
          [TaskStatus.Blocked]: 0,
          total: 0
        });
      }
      return map.get(id);
    };
    for (const task of tasks) {
      const rawId = task.assigneeId;
      const key = rawId != null ? principalToText(rawId) : "unassigned";
      const entry = getOrCreate(key);
      const s = task.status;
      if (s in entry) entry[s]++;
      entry.total++;
    }
    const list = Array.from(map.values()).sort((a, b) => b.total - a.total);
    const maxTotal = Math.max(...list.map((a) => a.total), 1);
    return {
      chartData: list.map((a) => ({
        ...a,
        name: a.id === "unassigned" ? "Unassigned" : a.initials,
        displayId: a.id === "unassigned" ? "Unassigned" : `${a.id.slice(0, 12)}…`
      })),
      assigneeList: list.map((a) => ({
        ...a,
        utilization: Math.round(a.total / maxTotal * 100)
      }))
    };
  }, [tasks]);
  if (tasks.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex flex-col items-center justify-center py-20 text-center",
        "data-ocid": "workload-empty",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: "No tasks to display workload for." })
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "workload-view", className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground mb-4", children: "Task Distribution by Assignee" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 260, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        BarChart,
        {
          data: chartData,
          margin: { top: 4, right: 8, left: -16, bottom: 0 },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              CartesianGrid,
              {
                strokeDasharray: "3 3",
                className: "stroke-border/50",
                vertical: false
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              XAxis,
              {
                dataKey: "name",
                tick: { fontSize: 11, fill: "hsl(var(--muted-foreground))" },
                axisLine: false,
                tickLine: false
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              YAxis,
              {
                allowDecimals: false,
                tick: { fontSize: 11, fill: "hsl(var(--muted-foreground))" },
                axisLine: false,
                tickLine: false
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Tooltip,
              {
                contentStyle: {
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                  fontSize: 12
                },
                labelStyle: { color: "hsl(var(--foreground))", fontWeight: 600 }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Legend,
              {
                iconType: "circle",
                iconSize: 8,
                wrapperStyle: {
                  fontSize: 11,
                  color: "hsl(var(--muted-foreground))"
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Bar,
              {
                dataKey: TaskStatus.Todo,
                name: "To Do",
                stackId: "a",
                fill: STATUS_FILL[TaskStatus.Todo],
                radius: [0, 0, 0, 0]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Bar,
              {
                dataKey: TaskStatus.InProgress,
                name: "In Progress",
                stackId: "a",
                fill: STATUS_FILL[TaskStatus.InProgress],
                radius: [0, 0, 0, 0]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Bar,
              {
                dataKey: TaskStatus.Blocked,
                name: "Blocked",
                stackId: "a",
                fill: STATUS_FILL[TaskStatus.Blocked],
                radius: [0, 0, 0, 0]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Bar,
              {
                dataKey: TaskStatus.Done,
                name: "Done",
                stackId: "a",
                fill: STATUS_FILL[TaskStatus.Done],
                radius: [4, 4, 0, 0]
              }
            )
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3", children: assigneeList.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        className: "border-border bg-card hover:border-orange-200 dark:hover:border-orange-800 transition-colors",
        "data-ocid": `workload-card-${a.id}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0", children: a.id === "unassigned" ? "?" : getInitials$1(a.id) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate", children: a.id === "unassigned" ? "Unassigned" : `Assignee ${a.initials}` }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: `${a.total} task${a.total !== 1 ? "s" : ""}` })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-foreground tabular-nums", children: [
              a.utilization,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 rounded-full bg-muted overflow-hidden mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full rounded-full bg-gradient-to-r from-primary to-orange-500 transition-all",
              style: { width: `${a.utilization}%` }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5 text-[10px]", children: [
            a[TaskStatus.Todo] > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-1.5 py-0.5 rounded bg-muted text-muted-foreground", children: [
              a[TaskStatus.Todo],
              " todo"
            ] }),
            a[TaskStatus.InProgress] > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-600 dark:text-orange-400", children: [
              a[TaskStatus.InProgress],
              " in progress"
            ] }),
            a[TaskStatus.Blocked] > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-1.5 py-0.5 rounded bg-destructive/10 text-destructive", children: [
              a[TaskStatus.Blocked],
              " blocked"
            ] }),
            a[TaskStatus.Done] > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400", children: [
              a[TaskStatus.Done],
              " done"
            ] })
          ] })
        ] })
      },
      a.id
    )) })
  ] });
}
const VIEW_TABS = [
  {
    mode: "kanban",
    label: "Kanban",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FolderKanban, { className: "h-3.5 w-3.5" })
  },
  {
    mode: "gantt",
    label: "Gantt",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(SquareChartGantt, { className: "h-3.5 w-3.5" })
  },
  {
    mode: "timeline",
    label: "Timeline",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutList, { className: "h-3.5 w-3.5" })
  },
  { mode: "table", label: "Table", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Table2, { className: "h-3.5 w-3.5" }) },
  {
    mode: "workload",
    label: "Workload",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-3.5 w-3.5" })
  }
];
const COLUMNS = [
  {
    status: TaskStatus.Todo,
    label: "To Do",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "h-3.5 w-3.5" }),
    color: "text-muted-foreground",
    bg: "bg-muted/40",
    border: "border-muted"
  },
  {
    status: TaskStatus.InProgress,
    label: "In Progress",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5" }),
    color: "text-orange-500",
    bg: "bg-orange-500/5",
    border: "border-orange-200/60 dark:border-orange-800/40"
  },
  {
    status: TaskStatus.Done,
    label: "Done",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5" }),
    color: "text-emerald-500",
    bg: "bg-emerald-500/5",
    border: "border-emerald-200/60 dark:border-emerald-800/40"
  },
  {
    status: TaskStatus.Blocked,
    label: "Blocked",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-3.5 w-3.5" }),
    color: "text-destructive",
    bg: "bg-destructive/5",
    border: "border-destructive/20"
  }
];
const PRIORITY_BADGE = {
  [TaskPriority.Low]: "bg-muted text-muted-foreground border-border",
  [TaskPriority.Medium]: "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800 dark:text-blue-400",
  [TaskPriority.High]: "bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-800 dark:text-orange-400",
  [TaskPriority.Critical]: "bg-red-600/20 text-red-700 border-red-300 dark:border-red-700 dark:text-red-300 font-semibold"
};
const PROJECT_STATUS_BADGE = {
  [ProjectStatus.Active]: {
    label: "Active",
    className: "bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-800 dark:text-orange-400"
  },
  [ProjectStatus.OnHold]: {
    label: "On Hold",
    className: "bg-yellow-500/10 text-yellow-700 border-yellow-200"
  },
  [ProjectStatus.Completed]: {
    label: "Completed",
    className: "bg-emerald-500/10 text-emerald-700 border-emerald-200"
  },
  [ProjectStatus.Archived]: {
    label: "Archived",
    className: "bg-muted text-muted-foreground border-border"
  }
};
function getInitials(member) {
  if (!(member == null ? void 0 : member.displayName)) return "?";
  return member.displayName.split(" ").map((p) => p[0]).join("").toUpperCase().slice(0, 2);
}
function TaskCard({
  task,
  projectId,
  workspaceId,
  members,
  subtaskCounts,
  onDragStart
}) {
  var _a;
  const dueDateMs = task.dueDate ? Number(task.dueDate) / 1e6 : null;
  const isOverdue = dueDateMs && dueDateMs < Date.now() && task.status !== TaskStatus.Done;
  const assignee = task.assigneeId ? members.find((m) => {
    var _a2;
    return m.userId.toString() === ((_a2 = task.assigneeId) == null ? void 0 : _a2.toString());
  }) : void 0;
  const subCounts = subtaskCounts[task.id];
  const isMilestone = (_a = task.crossLinks) == null ? void 0 : _a.some(
    (cl) => cl.entityType === "milestone"
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      draggable: true,
      onDragStart: (e) => {
        e.dataTransfer.effectAllowed = "move";
        onDragStart(task);
      },
      "data-task-id": task.id,
      "data-ocid": `task-card-${task.id}`,
      className: "group relative rounded-xl border border-border/50 bg-card p-3 cursor-grab active:cursor-grabbing transition-all duration-150 hover:shadow-sm hover:border-primary/30 hover:-translate-y-0.5 select-none",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/app/$workspaceId/projects/$projectId/tasks/$taskId",
            params: { workspaceId, projectId, taskId: task.id },
            className: "absolute inset-0 rounded-xl z-0",
            "aria-hidden": true,
            tabIndex: -1,
            onClick: (e) => e.stopPropagation()
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 pointer-events-none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 mb-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-1.5 min-w-0", children: [
              isMilestone && /* @__PURE__ */ jsxRuntimeExports.jsx(Diamond, { className: "h-3 w-3 text-primary shrink-0 mt-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-foreground leading-snug line-clamp-2 min-w-0", children: task.title })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium border ${PRIORITY_BADGE[task.priority]}`,
                children: task.priority
              }
            )
          ] }),
          task.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground line-clamp-1 mb-1.5", children: task.description }),
          subCounts && subCounts.total > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between mb-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground", children: [
              subCounts.done,
              "/",
              subCounts.total,
              " subtasks"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 w-full bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-full bg-primary rounded-full transition-all",
                style: {
                  width: `${Math.round(subCounts.done / subCounts.total * 100)}%`
                }
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            dueDateMs && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-[11px] text-muted-foreground flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Clock,
                {
                  className: `h-2.5 w-2.5 shrink-0 ${isOverdue ? "text-destructive" : ""}`
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: isOverdue ? "text-destructive font-medium" : "", children: new Date(dueDateMs).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric"
              }) })
            ] }),
            assignee ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[9px] font-bold text-primary ml-auto",
                title: assignee.displayName,
                children: getInitials(assignee)
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/app/$workspaceId/projects/$projectId/tasks/$taskId",
            params: { workspaceId, projectId, taskId: task.id },
            className: "absolute inset-0 rounded-xl z-0",
            tabIndex: 0,
            "data-ocid": `task-card-link-${task.id}`,
            onClick: (e) => e.stopPropagation()
          }
        )
      ]
    }
  );
}
function KanbanColumn({
  status,
  label,
  icon,
  color,
  bg,
  border,
  tasks,
  projectId,
  workspaceId,
  members,
  subtaskCounts,
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragStart
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col w-[260px] sm:w-[280px] shrink-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3 px-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `flex items-center gap-1.5 font-semibold text-sm ${color}`,
          children: [
            icon,
            " ",
            label,
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full font-normal", children: tasks.length })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "h-6 w-6 text-muted-foreground hover:text-foreground",
          asChild: true,
          "aria-label": `Add task to ${label}`,
          "data-ocid": `add-task-col-${status}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/app/$workspaceId/projects/$projectId/tasks/$taskId",
              params: { workspaceId, projectId, taskId: "new" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" })
            }
          )
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `flex flex-col gap-2 rounded-2xl border ${border} ${bg} p-2 flex-1 min-h-[200px] transition-all duration-150 ${isDragOver ? "ring-2 ring-primary/40 bg-primary/5 border-primary/40 scale-[1.01]" : ""}`,
        onDragOver: (e) => onDragOver(e, status),
        onDragLeave,
        onDrop: () => onDrop(status),
        "data-column-status": status,
        "data-ocid": `kanban-col-${status}`,
        children: [
          tasks.length === 0 && !isDragOver && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center justify-center py-10 opacity-40", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: isDragOver ? "Drop here" : "No tasks" }) }),
          isDragOver && tasks.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center justify-center py-6 rounded-xl border-2 border-dashed border-primary/40 bg-primary/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-primary font-medium", children: "Drop here" }) }),
          tasks.map((task) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            TaskCard,
            {
              task,
              projectId,
              workspaceId,
              members,
              subtaskCounts,
              onDragStart
            },
            task.id
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "w-full justify-start gap-1.5 text-muted-foreground text-xs h-8 hover:text-foreground mt-auto",
              asChild: true,
              "data-ocid": `add-task-btn-${status}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Link,
                {
                  to: "/app/$workspaceId/projects/$projectId/tasks/$taskId",
                  params: { workspaceId, projectId, taskId: "new" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
                    " Add Task"
                  ]
                }
              )
            }
          )
        ]
      }
    )
  ] });
}
const WB_COLORS = [
  "from-violet-500/20 to-purple-500/30",
  "from-orange-400/20 to-amber-500/30",
  "from-teal-400/20 to-emerald-500/30",
  "from-pink-400/20 to-rose-500/30",
  "from-blue-400/20 to-cyan-500/30"
];
function WhiteboardCard({
  wb,
  projectId,
  workspaceId,
  onDelete
}) {
  const colorClass = WB_COLORS[wb.id.charCodeAt(0) % WB_COLORS.length];
  const updatedMs = wb.updatedAt ? Number(wb.updatedAt) / 1e6 : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "group relative rounded-2xl border border-border bg-card overflow-hidden transition-smooth hover:shadow-md hover:-translate-y-0.5",
      "data-ocid": `whiteboard-card-${wb.id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/app/$workspaceId/projects/$projectId/whiteboard/$whiteboardId",
            params: { workspaceId, projectId, whiteboardId: wb.id },
            className: "block",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `h-24 sm:h-28 bg-gradient-to-br ${colorClass} flex items-center justify-center`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutDashboard, { className: "h-10 w-10 opacity-30 text-foreground" })
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/app/$workspaceId/projects/$projectId/whiteboard/$whiteboardId",
              params: { workspaceId, projectId, whiteboardId: wb.id },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground truncate hover:text-primary transition-colors", children: wb.title })
            }
          ),
          updatedMs && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground mt-0.5", children: [
            "Updated",
            " ",
            new Date(updatedMs).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric"
            })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => onDelete(wb.id),
            "aria-label": "Delete whiteboard",
            className: "absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-lg bg-card/80 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-destructive",
            "data-ocid": `delete-whiteboard-${wb.id}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
          }
        )
      ]
    }
  );
}
function getViewKey(projectId) {
  return `fourthspace:project-view:${projectId}`;
}
function ProjectDetailPage() {
  const { workspaceId, projectId } = useParams({
    from: "/app/$workspaceId/projects/$projectId"
  });
  const navigate = useNavigate();
  const { actor, isFetching } = useBackend();
  const { tenantId } = useWorkspace();
  const queryClient = useQueryClient();
  const [view, setView] = reactExports.useState(() => {
    try {
      const saved = localStorage.getItem(getViewKey(projectId));
      if (saved && VIEW_TABS.some((t) => t.mode === saved))
        return saved;
    } catch (_) {
    }
    return "kanban";
  });
  const [draggingTask, setDraggingTask] = reactExports.useState(null);
  const [dragOverColumn, setDragOverColumn] = reactExports.useState(null);
  const [localStatuses, setLocalStatuses] = reactExports.useState({});
  const dragLeaveTimer = reactExports.useRef(null);
  reactExports.useEffect(() => {
    try {
      localStorage.setItem(getViewKey(projectId), view);
    } catch (_) {
    }
  }, [view, projectId]);
  const { data: project, isLoading: projectLoading } = useQuery(
    {
      queryKey: ["project", tenantId, workspaceId, projectId],
      queryFn: async () => {
        if (!actor) return null;
        const r = await actor.getProject(tenantId, workspaceId, projectId);
        return r.__kind__ === "ok" ? r.ok : null;
      },
      enabled: !!actor && !isFetching && !!projectId
    }
  );
  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ["tasks", tenantId, workspaceId, projectId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listTasks(tenantId, workspaceId, projectId);
    },
    enabled: !!actor && !isFetching && !!projectId
  });
  const { data: members = [] } = useQuery({
    queryKey: ["members", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listWorkspaceMembers(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching
  });
  const tasksWithStatus = tasks.map((t) => ({
    ...t,
    status: localStatuses[t.id] ?? t.status
  }));
  const subtaskCounts = reactExports.useMemo(() => ({}), []);
  const { data: whiteboards = [], isLoading: wbLoading } = useQuery({
    queryKey: ["whiteboards", tenantId, workspaceId, projectId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listWhiteboards(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching && !!projectId
  });
  const { data: milestones = [] } = useQuery({
    queryKey: ["milestones", tenantId, workspaceId, projectId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listMilestones(tenantId, workspaceId, projectId);
    },
    enabled: !!actor && !isFetching && !!projectId
  });
  const updateTaskStatusMutation = useMutation({
    mutationFn: async ({
      taskId,
      newStatus
    }) => {
      if (!actor) throw new Error("Not connected");
      const result = await actor.updateTaskStatus(
        tenantId,
        workspaceId,
        taskId,
        newStatus
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return { taskId, newStatus };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks", tenantId, workspaceId, projectId]
      });
    },
    onError: (err, { taskId }) => {
      setLocalStatuses((prev) => {
        const next = { ...prev };
        delete next[taskId];
        return next;
      });
      ue.error(err.message || "Failed to update task status");
    }
  });
  const handleDragStart = reactExports.useCallback((task) => {
    setDraggingTask(task);
  }, []);
  const handleDragOver = reactExports.useCallback(
    (e, status) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      if (dragLeaveTimer.current) {
        clearTimeout(dragLeaveTimer.current);
        dragLeaveTimer.current = null;
      }
      setDragOverColumn(status);
    },
    []
  );
  const handleDragLeave = reactExports.useCallback(() => {
    dragLeaveTimer.current = setTimeout(() => {
      setDragOverColumn(null);
    }, 80);
  }, []);
  const handleDrop = reactExports.useCallback(
    (targetStatus) => {
      setDragOverColumn(null);
      if (!draggingTask) return;
      const currentStatus = localStatuses[draggingTask.id] ?? draggingTask.status;
      if (currentStatus === targetStatus) {
        setDraggingTask(null);
        return;
      }
      setLocalStatuses((prev) => ({
        ...prev,
        [draggingTask.id]: targetStatus
      }));
      updateTaskStatusMutation.mutate({
        taskId: draggingTask.id,
        newStatus: targetStatus
      });
      setDraggingTask(null);
    },
    [draggingTask, localStatuses, updateTaskStatusMutation]
  );
  const createWbMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Whiteboards not available");
      const result = await actor.createWhiteboard(tenantId, workspaceId, {
        projectId,
        title: "New Whiteboard"
      });
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (wb) => {
      queryClient.invalidateQueries({
        queryKey: ["whiteboards", tenantId, workspaceId, projectId]
      });
      navigate({
        to: "/app/$workspaceId/projects/$projectId/whiteboard/$whiteboardId",
        params: { workspaceId, projectId, whiteboardId: wb.id }
      });
    }
  });
  const deleteWbMutation = useMutation({
    mutationFn: async (id) => {
      if (!actor) return;
      await actor.deleteWhiteboard(tenantId, workspaceId, id);
    },
    onSuccess: () => queryClient.invalidateQueries({
      queryKey: ["whiteboards", tenantId, workspaceId, projectId]
    })
  });
  if (projectLoading || tasksLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 sm:p-6 md:p-8 space-y-6 pb-20 md:pb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-8 rounded-lg" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-56" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-4 pt-4 overflow-x-auto", children: [1, 2, 3, 4].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 w-64 rounded-2xl shrink-0" }, n)) })
    ] });
  }
  if (!project) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 text-center pb-20 md:pb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Project not found." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "ghost",
          className: "mt-4",
          onClick: () => navigate({
            to: "/app/$workspaceId/projects",
            params: { workspaceId }
          }),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
            " Back to Projects"
          ]
        }
      )
    ] });
  }
  const statusBadge = PROJECT_STATUS_BADGE[project.status];
  const totalTasks = tasksWithStatus.length;
  const doneTasks = tasksWithStatus.filter(
    (t) => t.status === TaskStatus.Done
  ).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full min-h-0 overflow-y-auto pb-20 md:pb-0",
      onDragEnd: () => {
        setDraggingTask(null);
        setDragOverColumn(null);
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 sm:px-6 md:px-8 pt-4 sm:pt-5 pb-0 border-b border-border/60 bg-card/80 sticky top-0 z-10 backdrop-blur-subtle", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2.5 pb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                onClick: () => navigate({
                  to: "/app/$workspaceId/projects",
                  params: { workspaceId }
                }),
                "aria-label": "Back to Projects",
                className: "shrink-0 mt-0.5 h-8 w-8 min-h-[44px] min-w-[44px]",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FolderKanban, { className: "h-3.5 w-3.5 text-orange-500" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-base sm:text-lg font-bold text-foreground truncate tracking-tight", children: project.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `rounded-full px-2 py-0.5 text-xs font-medium border ${statusBadge.className}`,
                    children: statusBadge.label
                  }
                )
              ] }),
              project.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground ml-9 line-clamp-1", children: project.description })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 shrink-0", children: [
              totalTasks > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:flex flex-col items-end gap-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                  doneTasks,
                  "/",
                  totalTasks,
                  " done"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-1.5 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "h-full bg-primary rounded-full transition-all",
                    style: {
                      width: `${totalTasks > 0 ? Math.round(doneTasks / totalTasks * 100) : 0}%`
                    }
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 px-2 py-1.5 rounded-lg", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3 w-3" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "hidden sm:inline", children: [
                  project.memberIds.length,
                  " member",
                  project.memberIds.length !== 1 ? "s" : ""
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sm:hidden", children: project.memberIds.length })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-0 -mb-px overflow-x-auto scrollbar-none",
              "data-ocid": "view-switcher",
              children: [
                VIEW_TABS.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => setView(tab.mode),
                    "data-ocid": `view-tab-${tab.mode}`,
                    className: `inline-flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium rounded-t-lg border-b-2 transition-colors whitespace-nowrap min-h-[44px] ${view === tab.mode ? "border-orange-500 text-orange-600 dark:text-orange-400 bg-orange-500/5" : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40"}`,
                    children: [
                      tab.icon,
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: tab.label })
                    ]
                  },
                  tab.mode
                )),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-5 bg-border mx-1 shrink-0", "aria-hidden": true }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Link,
                  {
                    to: "/app/$workspaceId/projects/$projectId/sprints",
                    params: { workspaceId, projectId },
                    className: "inline-flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium rounded-t-lg border-b-2 border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors whitespace-nowrap min-h-[44px]",
                    "data-ocid": "sprints-tab",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarRange, { className: "h-3.5 w-3.5" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Sprints" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Link,
                  {
                    to: "/app/$workspaceId/projects/$projectId/milestones",
                    params: { workspaceId, projectId },
                    className: "inline-flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium rounded-t-lg border-b-2 border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors whitespace-nowrap min-h-[44px]",
                    "data-ocid": "milestones-tab",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { className: "h-3.5 w-3.5" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Milestones" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Link,
                  {
                    to: "/app/$workspaceId/projects/$projectId/templates",
                    params: { workspaceId, projectId },
                    className: "inline-flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium rounded-t-lg border-b-2 border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors whitespace-nowrap min-h-[44px]",
                    "data-ocid": "templates-tab",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-3.5 w-3.5" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Templates" })
                    ]
                  }
                )
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `px-4 sm:px-6 md:px-8 pt-5 pb-5 ${view === "kanban" ? "md:overflow-x-auto" : ""}`,
            children: [
              view === "kanban" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:hidden space-y-4 pb-4", children: [
                  COLUMNS.map((col) => {
                    const colTasks = tasksWithStatus.filter(
                      (t) => t.status === col.status
                    );
                    if (colTasks.length === 0) return null;
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: `flex items-center gap-1.5 font-semibold text-sm mb-2 ${col.color}`,
                          children: [
                            col.icon,
                            " ",
                            col.label,
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full font-normal", children: colTasks.length })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: colTasks.map((task) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                        TaskCard,
                        {
                          task,
                          projectId,
                          workspaceId,
                          members,
                          subtaskCounts,
                          onDragStart: handleDragStart
                        },
                        task.id
                      )) })
                    ] }, col.status);
                  }),
                  tasksWithStatus.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-16 gap-3 rounded-2xl border border-dashed border-border", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No tasks yet" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Link,
                      {
                        to: "/app/$workspaceId/projects/$projectId/tasks/$taskId",
                        params: { workspaceId, projectId, taskId: "new" },
                        className: "text-xs text-primary hover:underline flex items-center gap-1",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
                          " Add first task"
                        ]
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "hidden md:flex gap-3 sm:gap-4 pb-4",
                    style: { minWidth: "max-content" },
                    children: COLUMNS.map((col) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      KanbanColumn,
                      {
                        status: col.status,
                        label: col.label,
                        icon: col.icon,
                        color: col.color,
                        bg: col.bg,
                        border: col.border,
                        tasks: tasksWithStatus.filter((t) => t.status === col.status),
                        projectId,
                        workspaceId,
                        members,
                        subtaskCounts,
                        isDragOver: dragOverColumn === col.status,
                        onDragOver: handleDragOver,
                        onDragLeave: handleDragLeave,
                        onDrop: handleDrop,
                        onDragStart: handleDragStart
                      },
                      col.status
                    ))
                  }
                )
              ] }),
              view === "gantt" && /* @__PURE__ */ jsxRuntimeExports.jsx(GanttView, { tasks: tasksWithStatus, projectId }),
              view === "timeline" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                TimelineView,
                {
                  tasks: tasksWithStatus,
                  projectId,
                  workspaceId
                }
              ),
              view === "table" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                TableView,
                {
                  tasks: tasksWithStatus,
                  projectId,
                  workspaceId
                }
              ),
              view === "workload" && /* @__PURE__ */ jsxRuntimeExports.jsx(WorkloadView, { tasks: tasksWithStatus, projectId })
            ]
          }
        ),
        milestones.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 sm:px-6 md:px-8 pb-5 border-t border-border bg-muted/10 pt-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { className: "h-4 w-4 text-orange-500" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-bold text-foreground", children: "Milestones" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full", children: milestones.length })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/app/$workspaceId/projects/$projectId/milestones",
                params: { workspaceId, projectId },
                className: "text-xs text-primary hover:underline font-medium",
                "data-ocid": "view-all-milestones",
                children: "View all"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3", children: milestones.slice(0, 6).map((ms) => {
            const dueMs = Number(ms.dueDate) / 1e6;
            const isOverdue = dueMs < Date.now() && ms.status !== MilestoneStatus.reached;
            const linkedDone = tasksWithStatus.filter(
              (t) => ms.linkedTaskIds.includes(t.id) && t.status === TaskStatus.Done
            ).length;
            const linkedTotal = ms.linkedTaskIds.length;
            const pct = linkedTotal > 0 ? Math.round(linkedDone / linkedTotal * 100) : 0;
            const statusColors = {
              [MilestoneStatus.reached]: "text-emerald-500 bg-emerald-500/10 border-emerald-200",
              [MilestoneStatus.upcoming]: "text-blue-500 bg-blue-500/10 border-blue-200",
              [MilestoneStatus.missed]: "text-destructive bg-destructive/10 border-destructive/20"
            };
            const statusLabels = {
              [MilestoneStatus.reached]: "Reached",
              [MilestoneStatus.upcoming]: "Upcoming",
              [MilestoneStatus.missed]: "Missed"
            };
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "rounded-xl border border-border/50 bg-card p-4 space-y-3 hover:border-primary/30 transition-colors",
                "data-ocid": `milestone-card-${ms.id}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Diamond, { className: "h-3.5 w-3.5 text-orange-500 shrink-0 mt-0.5" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground line-clamp-2", children: ms.title })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: `shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium border ${statusColors[ms.status] ?? statusColors[MilestoneStatus.upcoming]}`,
                        children: statusLabels[ms.status] ?? "Upcoming"
                      }
                    )
                  ] }),
                  linkedTotal > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-[11px] text-muted-foreground", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                        linkedDone,
                        "/",
                        linkedTotal,
                        " tasks"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono font-semibold text-foreground", children: [
                        pct,
                        "%"
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 w-full rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "h-full bg-primary rounded-full transition-all",
                        style: { width: `${pct}%` }
                      }
                    ) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: `flex items-center gap-1 text-[11px] ${isOverdue ? "text-destructive" : "text-muted-foreground"}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarCheck, { className: "h-3 w-3 shrink-0" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: new Date(dueMs).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        }) }),
                        isOverdue && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "· Overdue" })
                      ]
                    }
                  )
                ]
              },
              ms.id
            );
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 sm:px-6 md:px-8 pb-8 border-t border-border bg-muted/20 pt-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutDashboard, { className: "h-4 w-4 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-bold text-foreground", children: "Whiteboards" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full", children: whiteboards.length })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                className: "gap-1.5 h-8 text-xs min-h-[44px]",
                onClick: () => createWbMutation.mutate(),
                disabled: createWbMutation.isPending,
                "data-ocid": "new-whiteboard-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "New Whiteboard" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sm:hidden", children: "New" })
                ]
              }
            )
          ] }),
          wbLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3", children: [1, 2, 3].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-44 rounded-2xl" }, n)) }) : whiteboards.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card py-10 sm:py-12 gap-3",
              "data-ocid": "whiteboards-empty-state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutDashboard, { className: "h-10 w-10 text-muted-foreground/40" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground font-medium", children: "No whiteboards yet" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    size: "sm",
                    variant: "outline",
                    className: "gap-1.5 h-8 text-xs min-h-[44px]",
                    onClick: () => createWbMutation.mutate(),
                    disabled: createWbMutation.isPending,
                    "data-ocid": "new-whiteboard-empty-btn",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
                      " Create First Whiteboard"
                    ]
                  }
                )
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3", children: whiteboards.map((wb) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            WhiteboardCard,
            {
              wb,
              projectId,
              workspaceId,
              onDelete: (id) => deleteWbMutation.mutate(id)
            },
            wb.id
          )) })
        ] })
      ]
    }
  );
}
export {
  ProjectDetailPage as default
};
