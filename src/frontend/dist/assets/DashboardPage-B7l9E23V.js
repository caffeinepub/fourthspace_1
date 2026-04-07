import { g as createLucideIcon, r as reactExports, j as jsxRuntimeExports, a9 as Primitive, ar as createContextScope, n as cn, c as useWorkspace, h as getTenantId, e as useQuery, m as FileText, F as FolderKanban, a4 as CalendarDays, a5 as Wallet, f as Link, B as Button, D as DollarSign, l as Shield, S as Sparkles } from "./index-D7inqmxR.js";
import { B as Badge } from "./index-BJuRsRYe.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-wy6FYjGT.js";
import { S as Skeleton } from "./skeleton-sexCBv2H.js";
import { u as useBackend } from "./useBackend-BH6dl3yo.js";
import { m as motion } from "./proxy-XUMZAs9G.js";
import { P as Plus } from "./plus-DNap1HPx.js";
import { T as TrendingUp, R as ResponsiveContainer, B as BarChart, X as XAxis, Y as YAxis, a as Tooltip, b as Bar, C as Cell } from "./BarChart-DmfGE74E.js";
import { A as ArrowUpRight } from "./arrow-up-right-D6juibhc.js";
import { C as Clock } from "./clock-xD41YETq.js";
import { A as ArrowRight } from "./arrow-right-D7-RcTtv.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 17h6v-6", key: "t6n2it" }],
  ["path", { d: "m22 17-8.5-8.5-5 5L2 7", key: "x473p" }]
];
const TrendingDown = createLucideIcon("trending-down", __iconNode);
var PROGRESS_NAME = "Progress";
var DEFAULT_MAX = 100;
var [createProgressContext] = createContextScope(PROGRESS_NAME);
var [ProgressProvider, useProgressContext] = createProgressContext(PROGRESS_NAME);
var Progress$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeProgress,
      value: valueProp = null,
      max: maxProp,
      getValueLabel = defaultGetValueLabel,
      ...progressProps
    } = props;
    if ((maxProp || maxProp === 0) && !isValidMaxNumber(maxProp)) {
      console.error(getInvalidMaxError(`${maxProp}`, "Progress"));
    }
    const max = isValidMaxNumber(maxProp) ? maxProp : DEFAULT_MAX;
    if (valueProp !== null && !isValidValueNumber(valueProp, max)) {
      console.error(getInvalidValueError(`${valueProp}`, "Progress"));
    }
    const value = isValidValueNumber(valueProp, max) ? valueProp : null;
    const valueLabel = isNumber(value) ? getValueLabel(value, max) : void 0;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ProgressProvider, { scope: __scopeProgress, value, max, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "aria-valuemax": max,
        "aria-valuemin": 0,
        "aria-valuenow": isNumber(value) ? value : void 0,
        "aria-valuetext": valueLabel,
        role: "progressbar",
        "data-state": getProgressState(value, max),
        "data-value": value ?? void 0,
        "data-max": max,
        ...progressProps,
        ref: forwardedRef
      }
    ) });
  }
);
Progress$1.displayName = PROGRESS_NAME;
var INDICATOR_NAME = "ProgressIndicator";
var ProgressIndicator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeProgress, ...indicatorProps } = props;
    const context = useProgressContext(INDICATOR_NAME, __scopeProgress);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "data-state": getProgressState(context.value, context.max),
        "data-value": context.value ?? void 0,
        "data-max": context.max,
        ...indicatorProps,
        ref: forwardedRef
      }
    );
  }
);
ProgressIndicator.displayName = INDICATOR_NAME;
function defaultGetValueLabel(value, max) {
  return `${Math.round(value / max * 100)}%`;
}
function getProgressState(value, maxValue) {
  return value == null ? "indeterminate" : value === maxValue ? "complete" : "loading";
}
function isNumber(value) {
  return typeof value === "number";
}
function isValidMaxNumber(max) {
  return isNumber(max) && !isNaN(max) && max > 0;
}
function isValidValueNumber(value, max) {
  return isNumber(value) && !isNaN(value) && value <= max && value >= 0;
}
function getInvalidMaxError(propValue, componentName) {
  return `Invalid prop \`max\` of value \`${propValue}\` supplied to \`${componentName}\`. Only numbers greater than 0 are valid max values. Defaulting to \`${DEFAULT_MAX}\`.`;
}
function getInvalidValueError(propValue, componentName) {
  return `Invalid prop \`value\` of value \`${propValue}\` supplied to \`${componentName}\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or ${DEFAULT_MAX} if no \`max\` prop is set)
  - \`null\` or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`;
}
var Root = Progress$1;
var Indicator = ProgressIndicator;
function Progress({
  className,
  value,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "progress",
      className: cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Indicator,
        {
          "data-slot": "progress-indicator",
          className: "bg-primary h-full w-full flex-1 transition-all",
          style: { transform: `translateX(-${100 - (value || 0)}%)` }
        }
      )
    }
  );
}
const QUICK_ACTIONS = [
  {
    label: "New Note",
    href: "/app/notes/new",
    icon: FileText,
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-500/10 hover:bg-indigo-500/20"
  },
  {
    label: "New Project",
    href: "/app/projects/new",
    icon: FolderKanban,
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-500/10 hover:bg-orange-500/20"
  },
  {
    label: "New Event",
    href: "/app/calendar/new",
    icon: CalendarDays,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-500/10 hover:bg-red-500/20"
  },
  {
    label: "Send Payment",
    href: "/app/wallet/send",
    icon: Wallet,
    color: "text-pink-600 dark:text-pink-400",
    bg: "bg-pink-500/10 hover:bg-pink-500/20"
  }
];
const MOCK_STATS = [
  {
    label: "Total Notes",
    value: "24",
    trend: "+3 this week",
    trendUp: true,
    icon: FileText,
    iconBg: "bg-indigo-500/10",
    iconColor: "text-indigo-500"
  },
  {
    label: "Active Projects",
    value: "7",
    trend: "+1 this month",
    trendUp: true,
    icon: FolderKanban,
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-500"
  },
  {
    label: "Pending Tasks",
    value: "18",
    trend: "5 due today",
    trendUp: false,
    icon: TrendingUp,
    iconBg: "bg-teal-500/10",
    iconColor: "text-teal-500"
  },
  {
    label: "Upcoming Events",
    value: "6",
    trend: "Next: 2pm today",
    trendUp: true,
    icon: CalendarDays,
    iconBg: "bg-red-500/10",
    iconColor: "text-red-500"
  },
  {
    label: "Active Employees",
    value: "12",
    trend: "All active",
    trendUp: true,
    icon: DollarSign,
    iconBg: "bg-green-500/10",
    iconColor: "text-green-500"
  },
  {
    label: "Active Escrows",
    value: "3",
    trend: "1 awaiting release",
    trendUp: true,
    icon: Shield,
    iconBg: "bg-yellow-500/10",
    iconColor: "text-yellow-500"
  },
  {
    label: "Wallet Balance",
    value: "142.50 ICP",
    trend: "+2.4 ICP today",
    trendUp: true,
    icon: Wallet,
    iconBg: "bg-pink-500/10",
    iconColor: "text-pink-500"
  }
];
const MOCK_ACTIVITY = [
  {
    id: "1",
    icon: FolderKanban,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    title: "Q3 Roadmap project updated",
    time: "2 hours ago",
    category: "Projects"
  },
  {
    id: "2",
    icon: FileText,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    title: "Product spec draft created",
    time: "4 hours ago",
    category: "Notes"
  },
  {
    id: "3",
    icon: Shield,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    title: "Contract funded: Dev Sprint",
    time: "Yesterday",
    category: "Escrow"
  },
  {
    id: "4",
    icon: DollarSign,
    color: "text-green-500",
    bg: "bg-green-500/10",
    title: "Payroll processed for April",
    time: "2 days ago",
    category: "Payroll"
  },
  {
    id: "5",
    icon: Wallet,
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    title: "Received 10 ICP to main wallet",
    time: "3 days ago",
    category: "Wallet"
  }
];
const MOCK_NOTES = [
  {
    id: "1",
    title: "Q3 Planning Notes",
    preview: "Key objectives for Q3 include expanding the partner network and launching the mobile app beta..."
  },
  {
    id: "2",
    title: "Team Retrospective",
    preview: "What went well: shipping on time, cross-team collaboration. Areas to improve: documentation..."
  },
  {
    id: "3",
    title: "API Design Decisions",
    preview: "RESTful design with optional GraphQL layer for complex queries. Authentication via JWT..."
  }
];
const MOCK_PROJECTS = [
  { id: "1", name: "Mobile App Beta", progress: 78, status: "Active" },
  { id: "2", name: "Partner API Integration", progress: 45, status: "Active" },
  { id: "3", name: "Design System v2", progress: 92, status: "Active" }
];
const MOCK_EVENTS = [
  { id: "1", title: "Design Review", time: "Today, 2:00 PM", attendees: 4 },
  {
    id: "2",
    title: "Engineering Standup",
    time: "Tomorrow, 9:30 AM",
    attendees: 8
  },
  { id: "3", title: "Product Demo", time: "Apr 10, 3:00 PM", attendees: 12 }
];
const CHART_DATA = [
  { name: "Notes", value: 24, color: "#6366f1" },
  { name: "Projects", value: 7, color: "#f97316" },
  { name: "Tasks", value: 18, color: "#14b8a6" },
  { name: "Events", value: 6, color: "#ef4444" },
  { name: "Payroll", value: 12, color: "#22c55e" },
  { name: "Escrow", value: 3, color: "#eab308" },
  { name: "Wallet", value: 9, color: "#ec4899" }
];
function getGreeting() {
  const h = (/* @__PURE__ */ new Date()).getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}
function formatDate() {
  return (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}
function StatCardSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24 mb-3" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-16 mb-2" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-28" })
  ] }) });
}
function StatCardItem({ stat, index }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: index * 0.06 },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border bg-card hover:shadow-md transition-smooth group cursor-default", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: stat.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `flex h-9 w-9 items-center justify-center rounded-xl ${stat.iconBg}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(stat.icon, { className: `h-4.5 w-4.5 ${stat.iconColor}` })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 font-display text-2xl font-bold text-foreground leading-tight", children: stat.value }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1.5 flex items-center gap-1", children: [
          stat.trendUp ? /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3 w-3 text-green-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "h-3 w-3 text-orange-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: `text-xs ${stat.trendUp ? "text-green-600 dark:text-green-400" : "text-orange-600 dark:text-orange-400"}`,
              children: stat.trend
            }
          )
        ] })
      ] }) })
    }
  );
}
function DashboardPage() {
  var _a, _b, _c, _d;
  const { userProfile, workspace, isLoading } = useWorkspace();
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const firstName = ((_a = userProfile == null ? void 0 : userProfile.displayName) == null ? void 0 : _a.split(" ")[0]) ?? "there";
  const workspaceName = (workspace == null ? void 0 : workspace.name) ?? "Fourthspace Workspace";
  const notesQuery = useQuery({
    queryKey: ["dashboard-notes", tenantId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.listNotes(tenantId);
    },
    enabled: !!actor && !isFetching
  });
  const projectsQuery = useQuery({
    queryKey: ["dashboard-projects", tenantId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.listProjects(tenantId);
    },
    enabled: !!actor && !isFetching
  });
  const eventsQuery = useQuery({
    queryKey: ["dashboard-events", tenantId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.listMyEvents(tenantId);
    },
    enabled: !!actor && !isFetching
  });
  const walletQuery = useQuery({
    queryKey: ["dashboard-wallet", tenantId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getMyWalletAccount(tenantId);
    },
    enabled: !!actor && !isFetching
  });
  const recentNotes = ((_b = notesQuery.data) == null ? void 0 : _b.slice(0, 3)) ?? null;
  const activeProjects = ((_c = projectsQuery.data) == null ? void 0 : _c.slice(0, 3)) ?? null;
  const upcomingEvents = ((_d = eventsQuery.data) == null ? void 0 : _d.slice(0, 3)) ?? null;
  const walletAccount = walletQuery.data ?? null;
  const icpBalance = walletAccount ? (Number(walletAccount.icpBalance) / 1e8).toFixed(4) : "142.5000";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 md:p-8 max-w-7xl mx-auto space-y-7", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold uppercase tracking-widest text-muted-foreground", children: [
          "Workspace Overview · ",
          workspaceName
        ] }),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "mt-2 h-10 w-72" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.h1,
          {
            initial: { opacity: 0, y: 8 },
            animate: { opacity: 1, y: 0 },
            className: "font-display text-3xl font-bold text-foreground md:text-4xl mt-1",
            children: [
              getGreeting(),
              ", ",
              firstName,
              "!"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground shrink-0", children: formatDate() })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.05 },
        className: "flex flex-wrap gap-2",
        "data-ocid": "quick-actions",
        children: QUICK_ACTIONS.map((action) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: action.href,
            "data-ocid": `quick-action-${action.label.toLowerCase().replace(/\s+/g, "-")}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                className: `gap-2 border-border font-medium transition-smooth ${action.bg}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: `h-3.5 w-3.5 ${action.color}` }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: action.color, children: action.label })
                ]
              }
            )
          },
          action.href
        ))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-3 font-display text-base font-semibold text-foreground", children: "Key Performance Stats" }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4", children: [
        "notes",
        "projects",
        "tasks",
        "events",
        "employees",
        "escrows",
        "wallet"
      ].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatCardSkeleton, {}, k)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4",
          "data-ocid": "stats-grid",
          children: MOCK_STATS.map((stat, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(StatCardItem, { stat, index: i }, stat.label))
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 xl:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "xl:col-span-2 space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, x: -12 },
              whileInView: { opacity: 1, x: 0 },
              viewport: { once: true },
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card h-full", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3 flex flex-row items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-6 w-6 items-center justify-center rounded-md bg-indigo-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-3.5 w-3.5 text-indigo-500" }) }),
                    "Recent Notes"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/notes", "data-ocid": "notes-panel-link", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-4 w-4 text-muted-foreground hover:text-foreground transition-smooth" }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-2 pt-0", children: (recentNotes ?? MOCK_NOTES).map((note) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Link,
                  {
                    to: "/app/notes/$noteId",
                    params: { noteId: note.id },
                    "data-ocid": `note-panel-item-${note.id}`,
                    className: "block rounded-lg p-2.5 hover:bg-muted/50 transition-smooth group",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate group-hover:text-primary transition-smooth", children: "title" in note ? note.title : note.title }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-xs text-muted-foreground line-clamp-2", children: "content" in note ? note.content.slice(0, 80) : note.preview })
                    ]
                  },
                  note.id
                )) })
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, x: 12 },
              whileInView: { opacity: 1, x: 0 },
              viewport: { once: true },
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card h-full", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3 flex flex-row items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-6 w-6 items-center justify-center rounded-md bg-orange-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FolderKanban, { className: "h-3.5 w-3.5 text-orange-500" }) }),
                    "Active Projects"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/projects", "data-ocid": "projects-panel-link", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-4 w-4 text-muted-foreground hover:text-foreground transition-smooth" }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-4 pt-0", children: (activeProjects ?? MOCK_PROJECTS).map((proj) => {
                  const name = "name" in proj ? proj.name : proj.name;
                  const progress = "progress" in proj ? proj.progress : Math.floor(Math.random() * 80) + 20;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Link,
                    {
                      to: "/app/projects/$projectId",
                      params: { projectId: proj.id },
                      "data-ocid": `project-panel-item-${proj.id}`,
                      className: "block group",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate group-hover:text-primary transition-smooth max-w-[75%]", children: name }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                            progress,
                            "%"
                          ] })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: progress, className: "h-1.5" })
                      ]
                    },
                    proj.id
                  );
                }) })
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, x: -12 },
              whileInView: { opacity: 1, x: 0 },
              viewport: { once: true },
              transition: { delay: 0.1 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card h-full", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3 flex flex-row items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-6 w-6 items-center justify-center rounded-md bg-red-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-3.5 w-3.5 text-red-500" }) }),
                    "Upcoming Events"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/calendar", "data-ocid": "calendar-panel-link", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-4 w-4 text-muted-foreground hover:text-foreground transition-smooth" }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-2 pt-0", children: (upcomingEvents ?? MOCK_EVENTS).map((event) => {
                  const title = "title" in event ? event.title : event.title;
                  const timeStr = "time" in event ? event.time : new Date(
                    Number(event.startTime) / 1e6
                  ).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit"
                  });
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "flex items-start gap-3 rounded-lg p-2.5 hover:bg-muted/50 transition-smooth",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 flex h-8 w-8 shrink-0 flex-col items-center justify-center rounded-lg bg-red-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5 text-red-500" }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: title }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: timeStr })
                        ] })
                      ]
                    },
                    event.id
                  );
                }) })
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, x: 12 },
              whileInView: { opacity: 1, x: 0 },
              viewport: { once: true },
              transition: { delay: 0.1 },
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-gradient-to-br from-pink-500/5 via-card to-purple-500/5 h-full", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3 flex flex-row items-center justify-between", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-semibold flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-6 w-6 items-center justify-center rounded-md bg-pink-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-3.5 w-3.5 text-pink-500" }) }),
                    "Wallet"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/wallet", "data-ocid": "wallet-panel-link", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-4 w-4 text-muted-foreground hover:text-foreground transition-smooth" }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-gradient-to-r from-primary/10 to-pink-500/10 border border-primary/10 p-4 mb-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "ICP Balance" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-3xl font-bold text-foreground", children: [
                      icpBalance,
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg text-muted-foreground ml-1.5", children: "ICP" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3.5 w-3.5 text-green-500" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-green-600 dark:text-green-400", children: "+2.4 ICP today" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Link,
                      {
                        to: "/app/wallet/send",
                        className: "flex-1",
                        "data-ocid": "wallet-send-btn",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          Button,
                          {
                            size: "sm",
                            variant: "outline",
                            className: "w-full gap-1.5 text-xs border-border hover:border-primary/40 transition-smooth",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3.5 w-3.5" }),
                              "Send"
                            ]
                          }
                        )
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Link,
                      {
                        to: "/app/wallet",
                        className: "flex-1",
                        "data-ocid": "wallet-receive-btn",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          Button,
                          {
                            size: "sm",
                            variant: "outline",
                            className: "w-full gap-1.5 text-xs border-border hover:border-pink-400/40 transition-smooth",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
                              "Receive"
                            ]
                          }
                        )
                      }
                    )
                  ] })
                ] })
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 16 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { delay: 0.15 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display text-base font-semibold", children: "Workspace Activity Distribution" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: "text-xs font-normal border-border text-muted-foreground",
                    children: "All categories"
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { "data-ocid": "workspace-chart", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 200, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                BarChart,
                {
                  data: CHART_DATA,
                  margin: { top: 4, right: 8, left: -16, bottom: 0 },
                  barSize: 28,
                  barCategoryGap: "30%",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      XAxis,
                      {
                        dataKey: "name",
                        tick: { fontSize: 11, fill: "var(--muted-foreground)" },
                        axisLine: false,
                        tickLine: false
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      YAxis,
                      {
                        tick: { fontSize: 11, fill: "var(--muted-foreground)" },
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
                          borderRadius: "8px",
                          fontSize: "12px",
                          color: "hsl(var(--foreground))"
                        },
                        cursor: { fill: "hsl(var(--muted))", opacity: 0.4 }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "value", radius: [4, 4, 0, 0], children: CHART_DATA.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Cell,
                      {
                        fill: entry.color,
                        fillOpacity: 0.85
                      },
                      entry.name
                    )) })
                  ]
                }
              ) }) })
            ] })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, x: 16 },
            whileInView: { opacity: 1, x: 0 },
            viewport: { once: true },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display text-base font-semibold", children: "Recent Activity" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", "data-ocid": "recent-activity", children: MOCK_ACTIVITY.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-start gap-3 border-b border-border px-5 py-3 last:border-0 hover:bg-muted/30 transition-smooth",
                  "data-ocid": `activity-item-${item.id}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: `mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.bg}`,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { className: `h-4 w-4 ${item.color}` })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground leading-snug truncate", children: item.title }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-0.5 flex items-center justify-between gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Badge,
                          {
                            variant: "secondary",
                            className: "text-[10px] px-1.5 py-0 h-4 font-normal",
                            children: item.category
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground shrink-0", children: item.time })
                      ] })
                    ] })
                  ]
                },
                item.id
              )) })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 12 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { delay: 0.1 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-gradient-to-br from-primary/10 via-accent/8 to-secondary/10 border border-primary/15 p-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-5 w-5 text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground text-sm", children: "AI-Powered Tools" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Create, translate & automate" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/app/ai", "data-ocid": "dashboard-ai-cta", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  className: "w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground transition-smooth",
                  children: [
                    "Explore AI Tools",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3.5 w-3.5" })
                  ]
                }
              ) })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 12 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { delay: 0.15 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border bg-muted/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3", children: "Quick Links" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: [
                {
                  label: "Admin Panel",
                  href: "/app/admin",
                  icon: Shield,
                  color: "text-muted-foreground"
                },
                {
                  label: "Automation Rules",
                  href: "/app/admin/automation",
                  icon: Sparkles,
                  color: "text-muted-foreground"
                },
                {
                  label: "Analytics",
                  href: "/app/admin/analytics",
                  icon: TrendingUp,
                  color: "text-muted-foreground"
                }
              ].map((link) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Link,
                {
                  to: link.href,
                  "data-ocid": `quick-nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`,
                  className: "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-background transition-smooth",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(link.icon, { className: "h-4 w-4 shrink-0" }),
                    link.label,
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-auto h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-smooth" })
                  ]
                },
                link.href
              )) })
            ] }) })
          }
        )
      ] })
    ] })
  ] });
}
export {
  DashboardPage as default
};
