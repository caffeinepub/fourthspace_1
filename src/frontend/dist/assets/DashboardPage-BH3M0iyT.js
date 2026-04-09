import { t as createLucideIcon, r as reactExports, j as jsxRuntimeExports, au as Primitive, aZ as createContextScope, x as cn, f as useWorkspace, g as getTenantId, h as useQuery, F as FileText, a as FolderKanban, am as Target, i as Link, B as Button, P as Plus, W as Wallet, p as Shield, c as CalendarDays, S as Sparkles, b as MessageSquare } from "./index-CQ7TXF2a.js";
import { B as Badge } from "./badge-DOwzzuc_.js";
import { C as Card, a as CardContent, b as CardHeader, c as CardTitle } from "./card-DtVZ2GZq.js";
import { S as Skeleton } from "./skeleton-CzZABium.js";
import { u as useBackend } from "./index--h8TKSCt.js";
import { U as Users } from "./users-Dh_2Am6J.js";
import { m as motion } from "./proxy-Dv1CLJBo.js";
import { A as ArrowRight } from "./arrow-right-BQVQG0b_.js";
import { A as ArrowUpRight } from "./arrow-up-right-Bpi5p9pK.js";
import { T as TrendingUp } from "./trending-up-BY9OgvcY.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8", key: "1h4pet" }],
  ["path", { d: "M12 18V6", key: "zqpxq5" }]
];
const CircleDollarSign = createLucideIcon("circle-dollar-sign", __iconNode);
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
function getQuickActions(wid) {
  return [
    {
      label: "New Note",
      href: `/app/${wid}/notes/new`,
      icon: FileText,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/20 hover:border-indigo-500/40"
    },
    {
      label: "New Project",
      href: `/app/${wid}/projects/new`,
      icon: FolderKanban,
      color: "text-orange-500",
      bg: "bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/20 hover:border-orange-500/40"
    },
    {
      label: "New Chat",
      href: `/app/${wid}/chat`,
      icon: MessageSquare,
      color: "text-teal-500",
      bg: "bg-teal-500/10 hover:bg-teal-500/20 border-teal-500/20 hover:border-teal-500/40"
    },
    {
      label: "View Goals",
      href: `/app/${wid}/goals`,
      icon: Target,
      color: "text-primary",
      bg: "bg-primary/10 hover:bg-primary/20 border-primary/20 hover:border-primary/40"
    }
  ];
}
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
    day: "numeric"
  });
}
function relativeTime(nanoTimestamp) {
  const ms = Number(nanoTimestamp) / 1e6;
  const diff = Date.now() - ms;
  const minutes = Math.floor(diff / 6e4);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}
function shortPrincipal(id) {
  if (!id || id.length < 10) return id;
  return `${id.slice(0, 5)}…${id.slice(-4)}`;
}
function activityIcon(entityType) {
  switch (entityType.toLowerCase()) {
    case "note":
      return {
        icon: FileText,
        color: "text-indigo-500",
        bg: "bg-indigo-500/10",
        category: "Notes"
      };
    case "project":
      return {
        icon: FolderKanban,
        color: "text-orange-500",
        bg: "bg-orange-500/10",
        category: "Projects"
      };
    case "task":
      return {
        icon: Target,
        color: "text-teal-500",
        bg: "bg-teal-500/10",
        category: "Tasks"
      };
    case "message":
      return {
        icon: MessageSquare,
        color: "text-indigo-500",
        bg: "bg-indigo-500/10",
        category: "Chat"
      };
    case "wallet":
      return {
        icon: Wallet,
        color: "text-pink-500",
        bg: "bg-pink-500/10",
        category: "Wallet"
      };
    case "escrow":
      return {
        icon: Shield,
        color: "text-yellow-500",
        bg: "bg-yellow-500/10",
        category: "Escrow"
      };
    case "goal":
      return {
        icon: Target,
        color: "text-primary",
        bg: "bg-primary/10",
        category: "Goals"
      };
    default:
      return {
        icon: Sparkles,
        color: "text-muted-foreground",
        bg: "bg-muted",
        category: entityType
      };
  }
}
const AVATAR_COLORS = [
  "bg-indigo-500",
  "bg-orange-500",
  "bg-teal-500",
  "bg-green-500",
  "bg-pink-500",
  "bg-primary"
];
function getAvatarColor(str) {
  const idx = (str.charCodeAt(0) ?? 0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}
function categoryBadgeClass(category) {
  switch (category) {
    case "Projects":
      return "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20";
    case "Chat":
      return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20";
    case "Payroll":
      return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
    case "Wallet":
      return "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20";
    case "Escrow":
      return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20";
    case "Goals":
      return "bg-primary/10 text-primary border-primary/20";
    default:
      return "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20";
  }
}
function DashboardPage() {
  var _a, _b, _c, _d;
  const { userProfile, activeWorkspace, activeWorkspaceId, isLoading } = useWorkspace();
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const workspaceId = activeWorkspaceId ?? "";
  const firstName = ((_a = userProfile == null ? void 0 : userProfile.displayName) == null ? void 0 : _a.split(" ")[0]) ?? "there";
  const workspaceName = (activeWorkspace == null ? void 0 : activeWorkspace.name) ?? "Fourthspace Workspace";
  const QUICK_ACTIONS = getQuickActions(workspaceId);
  const statsQuery = useQuery({
    queryKey: ["dashboard-stats", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) throw new Error("no actor");
      return actor.getWorkspaceDashboardStats(workspaceId, tenantId);
    },
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const activityQuery = useQuery({
    queryKey: ["dashboard-activity", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getWorkspaceRecentActivity(
        workspaceId,
        tenantId,
        BigInt(10)
      );
    },
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const notesQuery = useQuery({
    queryKey: ["dashboard-notes", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listNotes(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const projectsQuery = useQuery({
    queryKey: ["dashboard-projects", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listProjects(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const eventsQuery = useQuery({
    queryKey: ["dashboard-events", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listMyEvents(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const treasuryQuery = useQuery({
    queryKey: ["dashboard-treasury", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getWorkspaceTreasury(tenantId, workspaceId);
    },
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const escrowQuery = useQuery({
    queryKey: ["dashboard-escrow", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listEscrows(tenantId, workspaceId, null);
    },
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const payrollQuery = useQuery({
    queryKey: ["dashboard-payroll", tenantId, workspaceId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listPayrollRecords(tenantId, workspaceId, null);
    },
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const stats = statsQuery.data;
  const statsLoading = isLoading || statsQuery.isLoading;
  const recentNotes = ((_b = notesQuery.data) == null ? void 0 : _b.slice(0, 3)) ?? [];
  const activeProjects = ((_c = projectsQuery.data) == null ? void 0 : _c.slice(0, 3)) ?? [];
  const upcomingEvents = ((_d = eventsQuery.data) == null ? void 0 : _d.slice(0, 3)) ?? [];
  const treasury = treasuryQuery.data ?? null;
  const icpBalance = treasury ? (Number(treasury.icpBalance) / 1e8).toFixed(4) : null;
  const escrowList = escrowQuery.data ?? [];
  const pendingEscrow = escrowList.filter(
    (e) => e.status !== "Released" && e.status !== "Cancelled"
  ).length;
  const payrollList = payrollQuery.data ?? [];
  const latestPayroll = payrollList[payrollList.length - 1] ?? null;
  function pl(n, singular, plural) {
    const num = typeof n === "bigint" ? Number(n) : n;
    return num === 1 ? `1 ${singular}` : `${num} ${plural}`;
  }
  const statCards = [
    {
      label: "Total Notes",
      value: stats ? String(stats.noteCount) : "0",
      sub: stats && stats.noteCount > 0 ? pl(stats.noteCount, "note", "notes") : "No notes yet",
      icon: FileText,
      iconBg: "bg-indigo-500/10",
      iconColor: "text-indigo-500"
    },
    {
      label: "Active Projects",
      value: stats ? String(stats.projectCount) : "0",
      sub: stats && stats.projectCount > 0 ? pl(stats.projectCount, "active project", "active projects") : "No active projects",
      icon: FolderKanban,
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-500"
    },
    {
      label: "Team Members",
      value: stats ? String(stats.memberCount) : "0",
      sub: stats && stats.memberCount > 0 ? pl(stats.memberCount, "team member", "team members") : "No members yet",
      icon: Users,
      iconBg: "bg-teal-500/10",
      iconColor: "text-teal-500"
    },
    {
      label: "Active Goals",
      value: stats ? String(stats.goalCount) : "0",
      sub: stats && stats.goalCount > 0 ? pl(stats.goalCount, "goal tracked", "goals tracked") : "No goals set",
      icon: Target,
      iconBg: "bg-primary/10",
      iconColor: "text-primary"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 sm:p-5 md:p-6 max-w-7xl mx-auto space-y-5 sm:space-y-6 pb-20 md:pb-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-end sm:justify-between gap-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-56 mt-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.h1,
        {
          initial: { opacity: 0, y: 5 },
          animate: { opacity: 1, y: 0 },
          className: "font-display text-xl sm:text-2xl font-bold text-foreground tracking-tight",
          children: [
            getGreeting(),
            ", ",
            firstName
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground shrink-0", children: formatDate() })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3 },
        "data-ocid": "workspace-hero-card",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-primary via-primary/80 to-purple-700/70 p-5 sm:p-7", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/5 blur-2xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-purple-400/10 blur-2xl" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 min-w-0", children: [
              isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-48 bg-white/20" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl sm:text-3xl font-bold text-white tracking-tight truncate", children: workspaceName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-white/70 font-medium", children: stats ? pl(stats.memberCount, "Member", "Members") : "Workspace" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-center gap-2 pt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-white/15 text-white border-white/20 hover:bg-white/20 text-[11px] h-5 px-2 font-medium", children: (userProfile == null ? void 0 : userProfile.role) ?? "Member" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 shrink-0 self-start", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 rounded-full bg-emerald-400/20 border border-emerald-400/30 px-2.5 py-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-semibold text-emerald-300", children: "Active" })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4", children: statsLoading ? [1, 2, 3, 4].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-lg bg-white/10 border border-white/10 p-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-2 w-12 mb-2 bg-white/20" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-8 bg-white/20" })
              ]
            },
            k
          )) : statCards.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-lg bg-white/10 border border-white/10 p-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-white/60 mb-1", children: s.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-lg font-bold text-white tracking-tight", children: s.value })
              ]
            },
            s.label
          )) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 6 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.1 },
        className: "flex flex-wrap gap-2",
        "data-ocid": "quick-actions",
        children: QUICK_ACTIONS.map((action, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: action.href,
            "data-ocid": `quick-action-${action.label.toLowerCase().replace(/\s+/g, "-")}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { opacity: 0, scale: 0.95 },
                animate: { opacity: 1, scale: 1 },
                transition: { delay: 0.12 + i * 0.04 },
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    variant: "outline",
                    size: "sm",
                    className: `gap-1.5 rounded-full border text-xs h-8 font-medium transition-smooth active-press ${action.bg}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: `h-3 w-3 ${action.color}` }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(action.icon, { className: `h-3 w-3 ${action.color}` }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: action.color, children: action.label })
                    ]
                  }
                )
              }
            )
          },
          action.href
        ))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-sm font-semibold text-foreground tracking-tight", children: "Financial Summary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: `/app/${workspaceId}/wallet`,
            "data-ocid": "financial-see-all",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground hover:text-primary transition-smooth flex items-center gap-0.5", children: [
              "See all ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-2.5 w-2.5" })
            ] })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "grid gap-3 grid-cols-1 sm:grid-cols-3",
          "data-ocid": "financial-grid",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { opacity: 0, y: 10 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true },
                transition: { delay: 0, duration: 0.25 },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link,
                  {
                    to: `/app/${workspaceId}/wallet`,
                    "data-ocid": "financial-card-0",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border bg-gradient-to-br from-pink-500/5 via-card to-primary/5 transition-smooth card-interactive h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 sm:p-5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-7 w-7 items-center justify-center rounded-lg bg-pink-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-3.5 w-3.5 text-pink-500" }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground", children: "Wallet Balance" })
                      ] }),
                      treasuryQuery.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-24" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl font-bold text-foreground tracking-tight leading-none mb-1", children: icpBalance !== null ? `${icpBalance} ICP` : "—" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: treasury ? "On-chain balance" : "No wallet found" })
                    ] }) })
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { opacity: 0, y: 10 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true },
                transition: { delay: 0.06, duration: 0.25 },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link,
                  {
                    to: `/app/${workspaceId}/payroll`,
                    "data-ocid": "financial-card-1",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border bg-card transition-smooth card-interactive h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 sm:p-5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-7 w-7 items-center justify-center rounded-lg bg-green-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleDollarSign, { className: "h-3.5 w-3.5 text-green-500" }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground", children: "Payroll This Month" })
                      ] }),
                      payrollQuery.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-24" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl font-bold text-foreground tracking-tight leading-none mb-1", children: latestPayroll ? new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD"
                      }).format(latestPayroll.grossAmount ?? 0) : "—" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: payrollList.length > 0 ? `${payrollList.length} record${payrollList.length !== 1 ? "s" : ""}` : "No payroll records" })
                    ] }) })
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { opacity: 0, y: 10 },
                whileInView: { opacity: 1, y: 0 },
                viewport: { once: true },
                transition: { delay: 0.12, duration: 0.25 },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link,
                  {
                    to: `/app/${workspaceId}/escrow`,
                    "data-ocid": "financial-card-2",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border bg-card transition-smooth card-interactive h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4 sm:p-5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-7 w-7 items-center justify-center rounded-lg bg-yellow-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-3.5 w-3.5 text-yellow-500" }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-muted-foreground", children: "Active Escrow" })
                      ] }),
                      escrowQuery.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-24" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl font-bold text-foreground tracking-tight leading-none mb-1", children: pendingEscrow > 0 ? `${pendingEscrow} pending` : "None active" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: escrowList.length > 0 ? `${escrowList.length} total agreements` : "No escrow agreements" })
                    ] }) })
                  }
                )
              }
            )
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-5 xl:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "xl:col-span-2 space-y-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, x: -10 },
            whileInView: { opacity: 1, x: 0 },
            viewport: { once: true },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card h-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2 flex flex-row items-center justify-between pt-4 px-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-xs font-semibold flex items-center gap-1.5 tracking-tight", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-5 w-5 items-center justify-center rounded bg-indigo-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-3 w-3 text-indigo-500" }) }),
                  "Recent Notes"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link,
                  {
                    to: `/app/${workspaceId}/notes`,
                    "data-ocid": "notes-panel-link",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-smooth" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-1 px-2 pb-3", children: notesQuery.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 p-2", children: [1, 2, 3].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-full rounded-lg" }, k)) }) : recentNotes.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-6 text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-6 w-6 text-muted-foreground/30 mb-2" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No notes yet" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: `/app/${workspaceId}/notes/new`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "sm",
                    className: "mt-2 text-xs h-7 px-2",
                    children: "Create one"
                  }
                ) })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-0.5", children: recentNotes.map((note) => {
                var _a2;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Link,
                  {
                    to: `/app/${workspaceId}/notes/${note.id}`,
                    "data-ocid": `note-panel-item-${note.id}`,
                    className: "block rounded-lg p-2 hover:bg-muted/40 transition-smooth group",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-foreground truncate group-hover:text-primary transition-smooth", children: note.title }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-[10px] text-muted-foreground line-clamp-1", children: ((_a2 = note.content) == null ? void 0 : _a2.slice(
                        0,
                        70
                      )) ?? "" })
                    ]
                  },
                  note.id
                );
              }) }) })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, x: 10 },
            whileInView: { opacity: 1, x: 0 },
            viewport: { once: true },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card h-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2 flex flex-row items-center justify-between pt-4 px-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-xs font-semibold flex items-center gap-1.5 tracking-tight", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-5 w-5 items-center justify-center rounded bg-orange-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FolderKanban, { className: "h-3 w-3 text-orange-500" }) }),
                  "Active Projects"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link,
                  {
                    to: `/app/${workspaceId}/projects`,
                    "data-ocid": "projects-panel-link",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-smooth" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-1 px-4 pb-4", children: projectsQuery.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-full rounded" }, k)) }) : activeProjects.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-6 text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FolderKanban, { className: "h-6 w-6 text-muted-foreground/30 mb-2" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No active projects" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: `/app/${workspaceId}/projects/new`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "sm",
                    className: "mt-2 text-xs h-7 px-2",
                    children: "Create one"
                  }
                ) })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: activeProjects.map((proj) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Link,
                {
                  to: `/app/${workspaceId}/projects/${proj.id}`,
                  "data-ocid": `project-panel-item-${proj.id}`,
                  className: "block group",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between mb-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-foreground truncate group-hover:text-primary transition-smooth max-w-[80%]", children: proj.name }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: 0, className: "h-1" })
                  ]
                },
                proj.id
              )) }) })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, x: -10 },
            whileInView: { opacity: 1, x: 0 },
            viewport: { once: true },
            transition: { delay: 0.08 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card h-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2 flex flex-row items-center justify-between pt-4 px-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-xs font-semibold flex items-center gap-1.5 tracking-tight", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-5 w-5 items-center justify-center rounded bg-red-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-3 w-3 text-red-500" }) }),
                  "Upcoming Events"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link,
                  {
                    to: `/app/${workspaceId}/calendar`,
                    "data-ocid": "calendar-panel-link",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-smooth" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-1 px-2 pb-3", children: eventsQuery.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 p-2", children: [1, 2, 3].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-full rounded-lg" }, k)) }) : upcomingEvents.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-6 text-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-6 w-6 text-muted-foreground/30 mb-2" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No upcoming events" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: `/app/${workspaceId}/calendar`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "sm",
                    className: "mt-2 text-xs h-7 px-2",
                    children: "Schedule one"
                  }
                ) })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-0.5", children: upcomingEvents.map((event) => {
                const timeStr = new Date(
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
                    className: "flex items-center gap-2.5 rounded-lg p-2 hover:bg-muted/40 transition-smooth",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-3 w-3 text-red-500" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-foreground truncate", children: event.title }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: timeStr })
                      ] })
                    ]
                  },
                  event.id
                );
              }) }) })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, x: 10 },
            whileInView: { opacity: 1, x: 0 },
            viewport: { once: true },
            transition: { delay: 0.08 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-gradient-to-br from-primary/10 via-card to-secondary/10 border border-primary/15 p-5 h-full flex flex-col", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 mb-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4.5 w-4.5 text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground text-sm tracking-tight", children: "AI-Powered Tools" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Create, translate & automate" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mb-4 flex-1 leading-relaxed", children: "Use AI to summarize notes, generate tasks from descriptions, or get workspace insights — powered by your data." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: `/app/${workspaceId}/ai`,
                  "data-ocid": "dashboard-ai-cta",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      size: "sm",
                      className: "w-full gap-1.5 h-8 text-xs font-semibold active-press",
                      children: [
                        "Explore AI Tools ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3 w-3" })
                      ]
                    }
                  )
                }
              )
            ] })
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, x: 14 },
            whileInView: { opacity: 1, x: 0 },
            viewport: { once: true },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border bg-card", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2 pt-4 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "font-display text-sm font-semibold tracking-tight", children: "Recent Activity" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link,
                  {
                    to: `/app/${workspaceId}/projects`,
                    "data-ocid": "activity-see-all",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground hover:text-primary transition-smooth", children: "See all" })
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", "data-ocid": "recent-activity", children: activityQuery.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-0", children: [1, 2, 3, 4].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-start gap-3 px-4 py-3 border-b border-border/50 last:border-0",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-7 w-7 rounded-full shrink-0 mt-0.5" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-full" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-2.5 w-3/4" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-16 mt-1" })
                    ] })
                  ]
                },
                k
              )) }) : !activityQuery.data || activityQuery.data.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex flex-col items-center justify-center py-10 px-4 text-center",
                  "data-ocid": "activity-empty",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-8 w-8 text-muted-foreground/30 mb-2" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-foreground mb-1", children: "No recent activity" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground leading-relaxed", children: "Start by creating a note or project to see activity here." }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-3", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: `/app/${workspaceId}/notes/new`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          variant: "outline",
                          size: "sm",
                          className: "h-7 text-xs",
                          children: "New Note"
                        }
                      ) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: `/app/${workspaceId}/projects/new`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          variant: "outline",
                          size: "sm",
                          className: "h-7 text-xs",
                          children: "New Project"
                        }
                      ) })
                    ] })
                  ]
                }
              ) : activityQuery.data.map((item, idx) => {
                const meta = activityIcon(item.entityType);
                const initials = shortPrincipal(item.actorId).slice(0, 2).toUpperCase();
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0, x: 10 },
                    whileInView: { opacity: 1, x: 0 },
                    viewport: { once: true },
                    transition: { delay: idx * 0.05 },
                    className: "flex items-start gap-3 border-b border-border/50 px-4 py-3 last:border-0 hover:bg-muted/20 transition-smooth",
                    "data-ocid": `activity-item-${idx}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: `mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${getAvatarColor(initials)}`,
                          children: initials
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground leading-snug truncate", children: item.entityTitle }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground line-clamp-1 mb-1", children: item.action }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Badge,
                            {
                              variant: "secondary",
                              className: `text-[9px] px-1.5 py-0 h-4 font-medium ${categoryBadgeClass(meta.category)}`,
                              children: meta.category
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground shrink-0", children: relativeTime(item.timestamp) })
                        ] })
                      ] })
                    ]
                  },
                  `${item.actorId}-${item.timestamp}-${idx}`
                );
              }) })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 10 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { delay: 0.1 },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border bg-muted/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2", children: "Quick Links" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-0.5", children: [
                {
                  label: "Admin Panel",
                  href: `/app/${workspaceId}/admin`,
                  icon: Shield
                },
                {
                  label: "Automation Rules",
                  href: `/app/${workspaceId}/admin/automation`,
                  icon: Sparkles
                },
                {
                  label: "Analytics",
                  href: `/app/${workspaceId}/admin/analytics`,
                  icon: TrendingUp
                }
              ].map((link) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Link,
                {
                  to: link.href,
                  "data-ocid": `quick-nav-${link.label.toLowerCase().replace(/\s+/g, "-")}`,
                  className: "flex items-center gap-2 rounded px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-background transition-smooth",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(link.icon, { className: "h-3 w-3 shrink-0" }),
                    link.label,
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-auto h-3 w-3 opacity-50" })
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
