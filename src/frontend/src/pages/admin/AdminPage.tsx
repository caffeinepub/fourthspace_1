import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ArchiveRestore,
  ArrowRight,
  BarChart2,
  ClipboardList,
  Settings,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useBackend } from "../../hooks/useBackend";
import { getTenantId } from "../../hooks/useWorkspace";
import type { AutomationRule, Backup, UserProfile } from "../../types";

const ADMIN_SECTIONS = [
  {
    label: "Backup & Restore",
    href: "/app/admin/backup",
    icon: ArchiveRestore,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    desc: "Create backups and restore workspace data.",
    dataKey: "backups",
  },
  {
    label: "User Management",
    href: "/app/admin/users",
    icon: Users,
    color: "text-teal-500",
    bg: "bg-teal-500/10",
    desc: "Manage team members, roles, and permissions.",
    dataKey: "profiles",
  },
  {
    label: "Audit Logs",
    href: "/app/admin/audit",
    icon: ClipboardList,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    desc: "Review all system activity and user actions.",
    dataKey: "audit",
  },
  {
    label: "Automation",
    href: "/app/admin/automation",
    icon: Zap,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    desc: "Create triggers and automated workflow actions.",
    dataKey: "automation",
  },
  {
    label: "Analytics",
    href: "/app/admin/analytics",
    icon: BarChart2,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    desc: "View usage statistics and performance metrics.",
    dataKey: "analytics",
  },
];

export default function AdminPage() {
  const { actor, isFetching } = useBackend();
  const tenantId = getTenantId();

  const { data: backups, isLoading: backupsLoading } = useQuery<Backup[]>({
    queryKey: ["backups", tenantId],
    queryFn: async () => (actor ? actor.listBackups(tenantId) : []),
    enabled: !!actor && !isFetching,
  });

  const { data: profiles, isLoading: profilesLoading } = useQuery<
    UserProfile[]
  >({
    queryKey: ["profiles", tenantId],
    queryFn: async () => (actor ? actor.listProfiles(tenantId) : []),
    enabled: !!actor && !isFetching,
  });

  const { data: rules, isLoading: rulesLoading } = useQuery<AutomationRule[]>({
    queryKey: ["automationRules", tenantId],
    queryFn: async () => (actor ? actor.listAutomationRules(tenantId) : []),
    enabled: !!actor && !isFetching,
  });

  const statsLoading = backupsLoading || profilesLoading || rulesLoading;

  const HEALTH_STATS = [
    {
      label: "Team Members",
      value: profiles?.length ?? 0,
      icon: Users,
      color: "text-teal-500",
      bg: "bg-teal-500/10",
    },
    {
      label: "Total Backups",
      value: backups?.length ?? 0,
      icon: ArchiveRestore,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
    {
      label: "Active Rules",
      value: rules?.filter((r) => r.isActive).length ?? 0,
      icon: Zap,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
    },
    {
      label: "System Health",
      value: "100%",
      icon: ShieldCheck,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
  ];

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted border border-border">
            <Settings className="h-6 w-6 text-foreground" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Admin Panel
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Workspace configuration, users, and monitoring
            </p>
          </div>
        </div>
        <Badge
          variant="outline"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-600 border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block" />
          All Systems Operational
        </Badge>
      </motion.div>

      {/* Health Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {HEALTH_STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <Card className="border-border bg-card hover:shadow-md transition-smooth">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${stat.bg}`}
                  >
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </div>
                {statsLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="font-display text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Section Cards */}
      <div>
        <h2 className="font-display text-base font-semibold text-foreground mb-4">
          Admin Areas
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ADMIN_SECTIONS.map((section, i) => (
            <motion.div
              key={section.href}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.07 }}
            >
              <Link
                to={section.href}
                data-ocid={`admin-section-${section.label.toLowerCase().replace(/ /g, "-")}`}
                className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 transition-smooth hover:shadow-md hover:-translate-y-0.5 group h-full"
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${section.bg}`}
                >
                  <section.icon className={`h-5 w-5 ${section.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">
                    {section.label}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    {section.desc}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-smooth">
                  Open <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
