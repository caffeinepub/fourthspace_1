import { f as useWorkspace, r as reactExports, j as jsxRuntimeExports, B as Button, i as Link, z as ChevronLeft } from "./index-CzyNqtbv.js";
import { B as Badge } from "./badge-B6elWcoD.js";
import { C as Card, b as CardHeader, a as CardContent } from "./card-BTCkNtDu.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DOERIIdP.js";
import { A as ArrowLeft } from "./arrow-left-BnDr9sMT.js";
import { C as Clock } from "./clock-DD8HS7VE.js";
import { C as ChevronRight } from "./chevron-right-DXQKKc3K.js";
import "./index-IXOTxK3N.js";
import "./index-DhDScjUU.js";
import "./chevron-up-DASmmm8S.js";
const MOCK_USERS = [
  { id: "u1", name: "Alex Martinez" },
  { id: "u2", name: "Sam Kim" },
  { id: "u3", name: "Jordan Lee" },
  { id: "u4", name: "Morgan Chen" },
  { id: "u5", name: "Riley Okafor" }
];
function generateTimesheetEntries() {
  const entries = [];
  const projects = [
    "Website Redesign",
    "Mobile App MVP",
    "API Integration Suite",
    "Internal Tooling"
  ];
  const descriptions = [
    "Component development",
    "Code review",
    "Sprint planning",
    "Bug fixes",
    "Documentation",
    "Design review",
    "API integration",
    "Testing"
  ];
  const today = /* @__PURE__ */ new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1);
  let id = 1;
  for (let week = -2; week <= 1; week++) {
    for (const user of MOCK_USERS) {
      for (let day = 0; day < 7; day++) {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + week * 7 + day);
        const isWeekend = d.getDay() === 0 || d.getDay() === 6;
        if (isWeekend) continue;
        const numEntries = Math.floor(Math.random() * 3) + 1;
        for (let n = 0; n < numEntries; n++) {
          const hours = Math.round((Math.random() * 3 + 0.5) * 10) / 10;
          entries.push({
            id: `e${id++}`,
            userId: user.id,
            date: d.toISOString().slice(0, 10),
            hours,
            description: descriptions[Math.floor(Math.random() * descriptions.length)],
            project: projects[Math.floor(Math.random() * projects.length)],
            billable: Math.random() > 0.3
          });
        }
      }
    }
  }
  return entries;
}
const ALL_ENTRIES = generateTimesheetEntries();
function getWeekStart(offset) {
  const today = /* @__PURE__ */ new Date();
  const day = today.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const mon = new Date(today);
  mon.setDate(today.getDate() + diff + offset * 7);
  mon.setHours(0, 0, 0, 0);
  return mon;
}
const formatDate = (d) => d.toISOString().slice(0, 10);
const formatDisplay = (d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
const formatH = (h) => `${h.toFixed(1)}h`;
const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
function WeeklyTimesheetPage() {
  var _a;
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const [weekOffset, setWeekOffset] = reactExports.useState(0);
  const [selectedUser, setSelectedUser] = reactExports.useState(MOCK_USERS[0].id);
  const weekStart = reactExports.useMemo(() => getWeekStart(weekOffset), [weekOffset]);
  const weekDays = reactExports.useMemo(
    () => Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      return d;
    }),
    [weekStart]
  );
  const userEntries = reactExports.useMemo(
    () => ALL_ENTRIES.filter((e) => e.userId === selectedUser),
    [selectedUser]
  );
  const dayTotals = reactExports.useMemo(
    () => weekDays.map((d) => {
      const dateStr = formatDate(d);
      const dayEntries = userEntries.filter((e) => e.date === dateStr);
      const total = dayEntries.reduce((a, e) => a + e.hours, 0);
      return { date: dateStr, entries: dayEntries, total };
    }),
    [weekDays, userEntries]
  );
  const weekTotal = dayTotals.reduce((a, d) => a + d.total, 0);
  const weekLabel = (() => {
    const end = new Date(weekStart);
    end.setDate(weekStart.getDate() + 6);
    return `${formatDisplay(weekStart)} – ${formatDisplay(end)}, ${weekStart.getFullYear()}`;
  })();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "p-6 space-y-6 animate-fade-in-up",
      "data-ocid": "weekly-timesheet-page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", asChild: true, className: "hover:bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: `/app/${workspaceId}/admin/time-reports`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-cyan-500" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold tracking-tight text-foreground", children: "Weekly Timesheet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "View time entries by week for each team member" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-4 rounded-xl border border-border/50 bg-muted/20 px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Member" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: selectedUser, onValueChange: setSelectedUser, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  className: "h-8 w-44 text-xs",
                  "data-ocid": "timesheet-user-select",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: MOCK_USERS.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: u.id, children: u.name }, u.id)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 ml-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "h-8 w-8 hover:bg-muted",
                onClick: () => setWeekOffset((v) => v - 1),
                "aria-label": "Previous week",
                "data-ocid": "prev-week-btn",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-foreground min-w-[180px] text-center", children: weekLabel }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "h-8 w-8 hover:bg-muted",
                onClick: () => setWeekOffset((v) => v + 1),
                "aria-label": "Next week",
                "data-ocid": "next-week-btn",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4" })
              }
            ),
            weekOffset !== 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                className: "h-8 text-xs ml-1 active-press",
                onClick: () => setWeekOffset(0),
                "data-ocid": "this-week-btn",
                children: "This Week"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-xl border border-border/50 bg-card px-4 py-3 shadow-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-5 w-5 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display font-bold font-mono text-foreground", children: formatH(weekTotal) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Total this week" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "ml-auto text-xs rounded-full px-2.5 py-0.5 bg-muted text-muted-foreground border-border", children: (_a = MOCK_USERS.find((u) => u.id === selectedUser)) == null ? void 0 : _a.name })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7",
            "data-ocid": "week-grid",
            children: dayTotals.map((day, i) => {
              const d = weekDays[i];
              const isToday = formatDate(/* @__PURE__ */ new Date()) === day.date;
              const isWeekend = d.getDay() === 0 || d.getDay() === 6;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Card,
                {
                  className: `border-border/50 shadow-card transition-all ${isToday ? "border-primary/40 bg-primary/5 dark:bg-primary/10" : "bg-card"} ${isWeekend ? "opacity-50" : ""}`,
                  "data-ocid": `day-col-${day.date}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2 pt-3 px-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: DAY_LABELS[i] }),
                        isToday && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold text-primary uppercase tracking-wide", children: "Today" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: formatDisplay(d) })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "px-3 pb-3 space-y-1.5", children: [
                      day.entries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/50 italic py-2", children: "No entries" }) : day.entries.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: "rounded-lg border border-border/40 bg-muted/20 px-2.5 py-2 space-y-0.5",
                          "data-ocid": `entry-${e.id}`,
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-1", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono font-semibold text-foreground", children: formatH(e.hours) }),
                              e.billable && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-accent font-medium", children: "Bill." })
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground truncate", children: e.description }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground/60 truncate", children: e.project })
                          ]
                        },
                        e.id
                      )),
                      day.total > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-1 border-t border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono font-semibold text-foreground text-right", children: formatH(day.total) }) })
                    ] })
                  ]
                },
                day.date
              );
            })
          }
        )
      ]
    }
  );
}
export {
  WeeklyTimesheetPage as default
};
