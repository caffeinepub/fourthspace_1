import { h as getTenantId, e as useQuery, j as jsxRuntimeExports, o as Settings, f as Link } from "./index-D7inqmxR.js";
import { B as Badge } from "./index-BJuRsRYe.js";
import { C as Card, c as CardContent } from "./card-wy6FYjGT.js";
import { S as Skeleton } from "./skeleton-sexCBv2H.js";
import { u as useBackend } from "./useBackend-BH6dl3yo.js";
import { U as Users } from "./users-0z2gux4W.js";
import { A as ArchiveRestore } from "./archive-restore-DbP-zIzg.js";
import { Z as Zap } from "./zap-Czf8pMIS.js";
import { S as ShieldCheck } from "./shield-check-D0m_kNM_.js";
import { m as motion } from "./proxy-XUMZAs9G.js";
import { C as ClipboardList } from "./clipboard-list-DGTq_dhF.js";
import { C as ChartNoAxesColumn } from "./chart-no-axes-column-kR5QIJg_.js";
import { A as ArrowRight } from "./arrow-right-D7-RcTtv.js";
const ADMIN_SECTIONS = [
  {
    label: "Backup & Restore",
    href: "/app/admin/backup",
    icon: ArchiveRestore,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    desc: "Create backups and restore workspace data.",
    dataKey: "backups"
  },
  {
    label: "User Management",
    href: "/app/admin/users",
    icon: Users,
    color: "text-teal-500",
    bg: "bg-teal-500/10",
    desc: "Manage team members, roles, and permissions.",
    dataKey: "profiles"
  },
  {
    label: "Audit Logs",
    href: "/app/admin/audit",
    icon: ClipboardList,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    desc: "Review all system activity and user actions.",
    dataKey: "audit"
  },
  {
    label: "Automation",
    href: "/app/admin/automation",
    icon: Zap,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    desc: "Create triggers and automated workflow actions.",
    dataKey: "automation"
  },
  {
    label: "Analytics",
    href: "/app/admin/analytics",
    icon: ChartNoAxesColumn,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    desc: "View usage statistics and performance metrics.",
    dataKey: "analytics"
  }
];
function AdminPage() {
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();
  const { data: backups, isLoading: backupsLoading } = useQuery({
    queryKey: ["backups", tenantId],
    queryFn: async () => actor ? actor.listBackups(tenantId) : [],
    enabled: !!actor && !isFetching
  });
  const { data: profiles, isLoading: profilesLoading } = useQuery({
    queryKey: ["profiles", tenantId],
    queryFn: async () => actor ? actor.listProfiles(tenantId) : [],
    enabled: !!actor && !isFetching
  });
  const { data: rules, isLoading: rulesLoading } = useQuery({
    queryKey: ["automationRules", tenantId],
    queryFn: async () => actor ? actor.listAutomationRules(tenantId) : [],
    enabled: !!actor && !isFetching
  });
  const statsLoading = backupsLoading || profilesLoading || rulesLoading;
  const HEALTH_STATS = [
    {
      label: "Team Members",
      value: (profiles == null ? void 0 : profiles.length) ?? 0,
      icon: Users,
      color: "text-teal-500",
      bg: "bg-teal-500/10"
    },
    {
      label: "Total Backups",
      value: (backups == null ? void 0 : backups.length) ?? 0,
      icon: ArchiveRestore,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10"
    },
    {
      label: "Active Rules",
      value: (rules == null ? void 0 : rules.filter((r) => r.isActive).length) ?? 0,
      icon: Zap,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10"
    },
    {
      label: "System Health",
      value: "100%",
      icon: ShieldCheck,
      color: "text-green-500",
      bg: "bg-green-500/10"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 max-w-5xl mx-auto space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -8 },
        animate: { opacity: 1, y: 0 },
        className: "flex items-start justify-between",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-muted border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-6 w-6 text-foreground" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold text-foreground", children: "Admin Panel" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Workspace configuration, users, and monitoring" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              variant: "outline",
              className: "hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-600 border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-green-500 inline-block" }),
                "All Systems Operational"
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: HEALTH_STATS.map((stat, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: i * 0.07 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border bg-card hover:shadow-md transition-smooth", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `flex h-9 w-9 items-center justify-center rounded-xl ${stat.bg}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(stat.icon, { className: `h-4 w-4 ${stat.color}` })
            }
          ) }),
          statsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-16" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl font-bold text-foreground", children: stat.value }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: stat.label })
        ] }) })
      },
      stat.label
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-base font-semibold text-foreground mb-4", children: "Admin Areas" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3", children: ADMIN_SECTIONS.map((section, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.15 + i * 0.07 },
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: section.href,
              "data-ocid": `admin-section-${section.label.toLowerCase().replace(/ /g, "-")}`,
              className: "flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 transition-smooth hover:shadow-md hover:-translate-y-0.5 group h-full",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `flex h-11 w-11 items-center justify-center rounded-xl ${section.bg}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(section.icon, { className: `h-5 w-5 ${section.color}` })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground", children: section.label }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground leading-relaxed", children: section.desc })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-smooth", children: [
                  "Open ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3 w-3" })
                ] })
              ]
            }
          )
        },
        section.href
      )) })
    ] })
  ] });
}
export {
  AdminPage as default
};
