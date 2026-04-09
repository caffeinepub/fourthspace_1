import { f as useWorkspace, r as reactExports, j as jsxRuntimeExports, B as Button, i as Link, D as DollarSign, a as FolderKanban } from "./index-CQ7TXF2a.js";
import { B as Badge } from "./badge-DOwzzuc_.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-DtVZ2GZq.js";
import { I as Input } from "./input-Dkit6sfw.js";
import { L as Label } from "./label-ANHtprqJ.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-C1Xsy-LN.js";
import { S as Switch } from "./switch-BGZRmkVS.js";
import { A as ArrowLeft } from "./arrow-left-D6cz-lXM.js";
import { C as Clock } from "./clock-c3PUUUEP.js";
import { D as Download } from "./download-Kj8sie5G.js";
import { U as Users } from "./users-Dh_2Am6J.js";
import { R as ResponsiveContainer, B as BarChart, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, a as Bar } from "./BarChart-f89JYg8H.js";
import { T as TrendingUp } from "./trending-up-BY9OgvcY.js";
import "./index-IXOTxK3N.js";
import "./index-CkN0xm2T.js";
import "./chevron-up-56u9dcHi.js";
const NOW = Date.now();
const DAY = 864e5;
const MOCK_USERS = [
  { id: "u1", name: "Alex Martinez", totalHours: 142.5, billableHours: 108 },
  { id: "u2", name: "Sam Kim", totalHours: 118, billableHours: 95.5 },
  { id: "u3", name: "Jordan Lee", totalHours: 96, billableHours: 60 },
  { id: "u4", name: "Morgan Chen", totalHours: 80.5, billableHours: 72 },
  { id: "u5", name: "Riley Okafor", totalHours: 64, billableHours: 38 }
];
const MOCK_PROJECTS = [
  {
    id: "p1",
    name: "Website Redesign",
    totalHours: 210,
    billableHours: 176.5
  },
  { id: "p2", name: "Mobile App MVP", totalHours: 185.5, billableHours: 162 },
  {
    id: "p3",
    name: "API Integration Suite",
    totalHours: 104.5,
    billableHours: 80
  },
  { id: "p4", name: "Internal Tooling", totalHours: 61, billableHours: 0 }
];
const MOCK_ENTRIES = [
  {
    id: "e1",
    user: "u1",
    project: "p1",
    date: "Apr 7, 2026",
    hours: 3.5,
    description: "Design system tokens and component scaffolding",
    billable: true
  },
  {
    id: "e2",
    user: "u2",
    project: "p2",
    date: "Apr 7, 2026",
    hours: 2,
    description: "REST endpoint wiring and error handling",
    billable: true
  },
  {
    id: "e3",
    user: "u3",
    project: "p1",
    date: "Apr 6, 2026",
    hours: 4,
    description: "Mobile responsive layout pass",
    billable: true
  },
  {
    id: "e4",
    user: "u1",
    project: "p3",
    date: "Apr 6, 2026",
    hours: 1.5,
    description: "OAuth2 integration research",
    billable: false
  },
  {
    id: "e5",
    user: "u4",
    project: "p2",
    date: "Apr 5, 2026",
    hours: 5,
    description: "Push notifications and deep links",
    billable: true
  },
  {
    id: "e6",
    user: "u2",
    project: "p4",
    date: "Apr 5, 2026",
    hours: 2.5,
    description: "Internal dev tooling improvements",
    billable: false
  },
  {
    id: "e7",
    user: "u5",
    project: "p1",
    date: "Apr 4, 2026",
    hours: 3,
    description: "User research synthesis",
    billable: true
  },
  {
    id: "e8",
    user: "u3",
    project: "p3",
    date: "Apr 4, 2026",
    hours: 2,
    description: "API documentation review",
    billable: false
  }
];
function generateDailyData(days) {
  const result = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(NOW - i * DAY);
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const seed = d.getDate() * 13 + d.getMonth() * 7;
    const baseH = isWeekend ? 0 : seed % 5 + 2.5;
    const hours = Math.round(baseH * 10) / 10;
    const billable = Math.round(hours * (0.5 + seed % 4 * 0.1) * 10) / 10;
    result.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      hours,
      billable
    });
  }
  return result;
}
const ALL_DAILY = generateDailyData(30);
const formatH = (h) => `${h.toFixed(1)}h`;
function ChartTooltip({ active, payload, label }) {
  if (!active || !(payload == null ? void 0 : payload.length)) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card px-3 py-2 shadow-dropdown text-xs space-y-1", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-foreground", children: label }),
    payload.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "inline-block h-2 w-2 rounded-full shrink-0",
          style: { background: p.color }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground capitalize", children: [
        p.name,
        ":"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-semibold text-foreground", children: formatH(p.value) })
    ] }, p.name))
  ] });
}
function TimeReportsPage() {
  const { activeWorkspaceId } = useWorkspace();
  const workspaceId = activeWorkspaceId ?? "";
  const [filterProject, setFilterProject] = reactExports.useState("all");
  const [filterUser, setFilterUser] = reactExports.useState("all");
  const [dateFrom, setDateFrom] = reactExports.useState("");
  const [dateTo, setDateTo] = reactExports.useState("");
  const [billableOnly, setBillableOnly] = reactExports.useState(false);
  const [hasRun, setHasRun] = reactExports.useState(true);
  const filteredEntries = reactExports.useMemo(() => {
    if (!hasRun) return [];
    return MOCK_ENTRIES.filter((e) => {
      if (filterProject !== "all" && e.project !== filterProject) return false;
      if (filterUser !== "all" && e.user !== filterUser) return false;
      if (billableOnly && !e.billable) return false;
      return true;
    });
  }, [hasRun, filterProject, filterUser, billableOnly]);
  const daily = reactExports.useMemo(() => {
    if (!dateFrom && !dateTo) return ALL_DAILY;
    return ALL_DAILY.filter((_d, i) => {
      const dayMs = NOW - (ALL_DAILY.length - 1 - i) * DAY;
      if (dateFrom && dayMs < new Date(dateFrom).getTime()) return false;
      if (dateTo && dayMs > new Date(dateTo).getTime() + DAY) return false;
      return true;
    });
  }, [dateFrom, dateTo]);
  const totalHours = filteredEntries.reduce((a, e) => a + e.hours, 0);
  const billableHours = filteredEntries.filter((e) => e.billable).reduce((a, e) => a + e.hours, 0);
  const nonBillableHours = totalHours - billableHours;
  const billablePct = totalHours > 0 ? Math.round(billableHours / totalHours * 100) : 0;
  const projectBreakdown = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const e of filteredEntries) {
      const proj = MOCK_PROJECTS.find((p) => p.id === e.project);
      const name = (proj == null ? void 0 : proj.name) ?? e.project;
      const existing = map.get(e.project) ?? {
        hours: 0,
        billableHours: 0
      };
      map.set(e.project, {
        name,
        hours: existing.hours + e.hours,
        billableHours: existing.billableHours + (e.billable ? e.hours : 0)
      });
    }
    return Array.from(map.values());
  }, [filteredEntries]);
  const userBreakdown = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const e of filteredEntries) {
      const user = MOCK_USERS.find((u) => u.id === e.user);
      const name = (user == null ? void 0 : user.name) ?? e.user;
      const existing = map.get(e.user) ?? { hours: 0, billableHours: 0 };
      map.set(e.user, {
        name,
        hours: existing.hours + e.hours,
        billableHours: existing.billableHours + (e.billable ? e.hours : 0)
      });
    }
    return Array.from(map.values());
  }, [filteredEntries]);
  function handleExportCSV() {
    const header = "User,Project,Date,Hours,Description,Billable\n";
    const rows = filteredEntries.map((e) => {
      var _a, _b;
      const user = ((_a = MOCK_USERS.find((u) => u.id === e.user)) == null ? void 0 : _a.name) ?? e.user;
      const proj = ((_b = MOCK_PROJECTS.find((p) => p.id === e.project)) == null ? void 0 : _b.name) ?? e.project;
      return `"${user}","${proj}","${e.date}",${e.hours},"${e.description}","${e.billable ? "Yes" : "No"}"`;
    }).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "time-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  }
  const thCls = "text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2.5";
  const tdCls = "px-4 py-3";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "p-6 space-y-6 animate-fade-in-up",
      "data-ocid": "time-reports-page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", asChild: true, className: "hover:bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: `/app/${workspaceId}/admin`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 text-cyan-500" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold tracking-tight text-foreground", children: "Time Reports" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Organization-wide time tracking analytics" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", asChild: true, className: "active-press", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: `/app/${workspaceId}/admin/timesheet`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4 mr-2" }),
            "Timesheet"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: handleExportCSV,
              "data-ocid": "export-report-btn",
              className: "active-press",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 mr-2" }),
                "Export CSV"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 rounded-xl border border-border/50 bg-muted/20 px-4 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground whitespace-nowrap", children: "Project" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: filterProject, onValueChange: setFilterProject, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  className: "h-8 w-40 text-xs",
                  "data-ocid": "report-project-select",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All projects" }),
                MOCK_PROJECTS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: p.id, children: p.name }, p.id))
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground whitespace-nowrap", children: "User" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: filterUser, onValueChange: setFilterUser, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  className: "h-8 w-36 text-xs",
                  "data-ocid": "report-user-select",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All users" }),
                MOCK_USERS.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: u.id, children: u.name }, u.id))
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "From" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "date",
                className: "h-8 text-xs w-36",
                value: dateFrom,
                onChange: (e) => setDateFrom(e.target.value),
                "data-ocid": "report-from-input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "To" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "date",
                className: "h-8 text-xs w-36",
                value: dateTo,
                onChange: (e) => setDateTo(e.target.value),
                "data-ocid": "report-to-input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 ml-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch,
              {
                id: "billable-only",
                checked: billableOnly,
                onCheckedChange: setBillableOnly,
                "data-ocid": "report-billable-toggle"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Label,
              {
                htmlFor: "billable-only",
                className: "text-xs cursor-pointer text-muted-foreground",
                children: "Billable only"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              className: "h-8 active-press",
              onClick: () => setHasRun(true),
              "data-ocid": "run-report-btn",
              children: "Run Report"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-4 sm:grid-cols-3", children: [
          {
            label: "Total Hours",
            value: formatH(totalHours),
            icon: Clock,
            iconCls: "text-primary bg-primary/10"
          },
          {
            label: "Billable Hours",
            value: formatH(billableHours),
            icon: DollarSign,
            iconCls: "text-accent bg-accent/10"
          },
          {
            label: "Non-Billable",
            value: formatH(nonBillableHours),
            icon: Users,
            iconCls: "text-secondary bg-secondary/10"
          }
        ].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border/50 bg-card shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `flex h-8 w-8 items-center justify-center rounded-lg ${s.iconCls} mb-2`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(s.icon, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-display font-bold font-mono text-foreground", children: s.value }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: s.label })
        ] }) }, s.label)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 flex-1 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full rounded-full bg-accent transition-all duration-500",
              style: { width: `${billablePct}%` }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "text-xs shrink-0 rounded-full px-2.5 py-0.5 bg-accent/10 text-accent border-accent/20", children: [
            billablePct,
            "% billable"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Card,
          {
            className: "border-border/50 bg-card shadow-card",
            "data-ocid": "daily-hours-chart",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-semibold", children: "Hours Per Day — Past 30 Days" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-52", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                BarChart,
                {
                  data: daily,
                  margin: { top: 4, right: 4, left: -24, bottom: 0 },
                  barGap: 2,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      CartesianGrid,
                      {
                        strokeDasharray: "3 3",
                        vertical: false,
                        stroke: "oklch(var(--border))"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      XAxis,
                      {
                        dataKey: "date",
                        tick: {
                          fontSize: 10,
                          fill: "oklch(var(--muted-foreground))"
                        },
                        tickLine: false,
                        axisLine: false,
                        interval: 4
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      YAxis,
                      {
                        tick: {
                          fontSize: 10,
                          fill: "oklch(var(--muted-foreground))"
                        },
                        tickLine: false,
                        axisLine: false,
                        tickFormatter: (v) => `${v}h`
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Tooltip,
                      {
                        content: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartTooltip, {}),
                        cursor: { fill: "oklch(var(--muted))" }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Bar,
                      {
                        dataKey: "hours",
                        name: "total",
                        fill: "oklch(var(--primary))",
                        radius: [3, 3, 0, 0],
                        maxBarSize: 24
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Bar,
                      {
                        dataKey: "billable",
                        name: "billable",
                        fill: "oklch(var(--accent))",
                        radius: [3, 3, 0, 0],
                        maxBarSize: 24
                      }
                    )
                  ]
                }
              ) }) }) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-5 lg:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Card,
            {
              className: "border-border/50 bg-card shadow-card",
              "data-ocid": "project-breakdown-table",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FolderKanban, { className: "h-4 w-4 text-secondary" }),
                  " By Project"
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/40 bg-muted/30", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: thCls, children: "Project" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: `${thCls} text-right`, children: "Hours" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: `${thCls} text-right`, children: "Billable" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: `${thCls} text-right`, children: "% Bill." })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/40", children: projectBreakdown.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "td",
                    {
                      colSpan: 4,
                      className: "px-4 py-6 text-center text-sm text-muted-foreground",
                      children: "Run the report to see data"
                    }
                  ) }) : projectBreakdown.map((p) => {
                    const pct = p.hours > 0 ? Math.round(p.billableHours / p.hours * 100) : 0;
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "tr",
                      {
                        className: "hover:bg-muted/30 transition-colors",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "td",
                            {
                              className: `${tdCls} font-medium text-foreground truncate max-w-[140px]`,
                              children: p.name
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "td",
                            {
                              className: `${tdCls} text-right font-mono text-foreground`,
                              children: formatH(p.hours)
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "td",
                            {
                              className: `${tdCls} text-right font-mono text-accent font-semibold`,
                              children: formatH(p.billableHours)
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "td",
                            {
                              className: `${tdCls} text-right text-muted-foreground text-xs`,
                              children: [
                                pct,
                                "%"
                              ]
                            }
                          )
                        ]
                      },
                      p.name
                    );
                  }) })
                ] }) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Card,
            {
              className: "border-border/50 bg-card shadow-card",
              "data-ocid": "user-breakdown-table",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 text-primary" }),
                  " By User"
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/40 bg-muted/30", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: thCls, children: "User" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: `${thCls} text-right`, children: "Hours" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: `${thCls} text-right`, children: "Billable" })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/40", children: userBreakdown.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "td",
                    {
                      colSpan: 3,
                      className: "px-4 py-6 text-center text-sm text-muted-foreground",
                      children: "Run the report to see data"
                    }
                  ) }) : userBreakdown.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "tr",
                    {
                      className: "hover:bg-muted/30 transition-colors",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: `${tdCls} font-medium text-foreground`, children: u.name }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "td",
                          {
                            className: `${tdCls} text-right font-mono text-foreground`,
                            children: formatH(u.hours)
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "td",
                          {
                            className: `${tdCls} text-right font-mono text-accent font-semibold`,
                            children: formatH(u.billableHours)
                          }
                        )
                      ]
                    },
                    u.name
                  )) })
                ] }) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Card,
          {
            className: "border-border/50 bg-card shadow-card",
            "data-ocid": "time-entries-list",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4 text-accent" }),
                "Time Entries",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground font-normal", children: [
                  "(",
                  filteredEntries.length,
                  ")"
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border/40 bg-muted/30", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: thCls, children: "User" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: thCls, children: "Project" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: thCls, children: "Date" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: `${thCls} text-right`, children: "Hours" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: `${thCls} hidden lg:table-cell`, children: "Description" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: `${thCls} text-center`, children: "Billable" })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-border/40", children: filteredEntries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "td",
                  {
                    colSpan: 6,
                    className: "px-4 py-8 text-center text-sm text-muted-foreground",
                    children: "No entries to display. Run the report with your filters."
                  }
                ) }) : filteredEntries.map((e) => {
                  var _a, _b;
                  const user = ((_a = MOCK_USERS.find((u) => u.id === e.user)) == null ? void 0 : _a.name) ?? e.user;
                  const proj = ((_b = MOCK_PROJECTS.find((p) => p.id === e.project)) == null ? void 0 : _b.name) ?? e.project;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "tr",
                    {
                      className: "hover:bg-muted/30 transition-colors",
                      "data-ocid": `entry-row-${e.id}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "td",
                          {
                            className: `${tdCls} font-medium text-foreground whitespace-nowrap`,
                            children: user
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "td",
                          {
                            className: `${tdCls} text-muted-foreground whitespace-nowrap`,
                            children: proj
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "td",
                          {
                            className: `${tdCls} text-muted-foreground whitespace-nowrap`,
                            children: e.date
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "td",
                          {
                            className: `${tdCls} text-right font-mono font-semibold text-foreground`,
                            children: formatH(e.hours)
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "td",
                          {
                            className: `${tdCls} text-muted-foreground truncate max-w-[200px] hidden lg:table-cell`,
                            children: e.description
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: `${tdCls} text-center`, children: e.billable ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "text-xs rounded-full px-2 py-0.5 bg-accent/10 text-accent border-accent/20", children: "Yes" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "No" }) })
                      ]
                    },
                    e.id
                  );
                }) })
              ] }) })
            ]
          }
        )
      ]
    }
  );
}
export {
  TimeReportsPage as default
};
