import { f as useWorkspace, g as getTenantId, h as useQuery, j as jsxRuntimeExports, y as Settings, i as Link } from "./index-CQ7TXF2a.js";
import { B as Badge } from "./badge-DOwzzuc_.js";
import { C as Card, a as CardContent } from "./card-DtVZ2GZq.js";
import { S as Skeleton } from "./skeleton-CzZABium.js";
import { u as useBackend } from "./index--h8TKSCt.js";
import { U as Users } from "./users-Dh_2Am6J.js";
import { A as ArchiveRestore } from "./archive-restore-DC1hOenS.js";
import { Z as Zap } from "./zap-Bi3i3wDK.js";
import { S as ShieldCheck } from "./shield-check-BDPpGxS7.js";
import { m as motion } from "./proxy-Dv1CLJBo.js";
import { C as ClipboardList } from "./clipboard-list-DUR-P1Qy.js";
import { C as ChartNoAxesColumn } from "./chart-no-axes-column-BCgawTbx.js";
import { F as FileInput } from "./file-input-F40-XSu0.js";
import { C as Clock } from "./clock-c3PUUUEP.js";
import { A as ArrowRight } from "./arrow-right-BQVQG0b_.js";
function AdminPage() {
  const { actor, isFetching } = useBackend();
  const { activeWorkspaceId } = useWorkspace();
  const tenantId = getTenantId();
  const workspaceId = activeWorkspaceId ?? "";
  const ADMIN_SECTIONS = [
    {
      label: "Backup & Restore",
      href: `/app/${workspaceId}/admin/backup`,
      icon: ArchiveRestore,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
      desc: "Create backups and restore workspace data."
    },
    {
      label: "User Management",
      href: `/app/${workspaceId}/admin/users`,
      icon: Users,
      color: "text-teal-500",
      bg: "bg-teal-500/10",
      desc: "Manage team members, roles, and permissions."
    },
    {
      label: "Audit Logs",
      href: `/app/${workspaceId}/admin/audit`,
      icon: ClipboardList,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      desc: "Review all system activity and user actions."
    },
    {
      label: "Automation",
      href: `/app/${workspaceId}/admin/automation`,
      icon: Zap,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      desc: "Create triggers and automated workflow actions."
    },
    {
      label: "Analytics",
      href: `/app/${workspaceId}/admin/analytics`,
      icon: ChartNoAxesColumn,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      desc: "View usage statistics and performance metrics."
    },
    {
      label: "Integrations",
      href: `/app/${workspaceId}/admin/integrations`,
      icon: Zap,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      desc: "Connect Slack, GitHub, Google Drive, and more."
    },
    {
      label: "Forms",
      href: `/app/${workspaceId}/admin/forms`,
      icon: FileInput,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      desc: "Build public intake forms and collect responses."
    },
    {
      label: "Time Reports",
      href: `/app/${workspaceId}/admin/time-reports`,
      icon: Clock,
      color: "text-cyan-500",
      bg: "bg-cyan-500/10",
      desc: "Track billable hours and generate time reports."
    }
  ];
  const { data: backups, isLoading: backupsLoading } = useQuery({
    queryKey: ["backups", tenantId, workspaceId],
    queryFn: async () => actor ? actor.listBackups(tenantId, workspaceId) : [],
    enabled: !!actor && !isFetching && !!workspaceId
  });
  const { data: profiles, isLoading: profilesLoading } = useQuery({
    queryKey: ["profiles", tenantId],
    queryFn: async () => actor ? actor.listProfiles(tenantId) : [],
    enabled: !!actor && !isFetching
  });
  const { data: rules, isLoading: rulesLoading } = useQuery({
    queryKey: ["automationRules", tenantId, workspaceId],
    queryFn: async () => actor ? actor.listAutomationRules(tenantId, workspaceId) : [],
    enabled: !!actor && !isFetching && !!workspaceId
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
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    },
    {
      label: "System Health",
      value: "100%",
      icon: ShieldCheck,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 max-w-5xl mx-auto space-y-8 animate-fade-in-up", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-6 w-6 text-amber-500" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold tracking-tight text-foreground", children: "Admin Panel" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "hidden sm:flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20", children: "Admin only" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Workspace configuration, users, and monitoring" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "hidden sm:flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" }),
        "All Systems Operational"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4", children: HEALTH_STATS.map((stat, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: i * 0.07 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-border/50 bg-card shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `flex h-9 w-9 items-center justify-center rounded-xl ${stat.bg} mb-3`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(stat.icon, { className: `h-4 w-4 ${stat.color}` })
            }
          ),
          statsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-16 mb-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-2xl font-bold text-foreground", children: stat.value }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: stat.label })
        ] }) })
      },
      stat.label
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4", children: "Admin Areas" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4", children: ADMIN_SECTIONS.map((section, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.15 + i * 0.06 },
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: section.href,
              "data-ocid": `admin-section-${section.label.toLowerCase().replace(/ /g, "-")}`,
              className: "flex flex-col gap-3 rounded-xl border border-border/50 bg-card p-5 transition-all duration-200 hover:shadow-card-hover hover:border-border hover:-translate-y-0.5 group h-full",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `flex h-10 w-10 items-center justify-center rounded-xl ${section.bg}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(section.icon, { className: `h-4.5 w-4.5 ${section.color}` })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground text-sm leading-snug", children: section.label }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground leading-relaxed", children: section.desc })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-all duration-200", children: [
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
